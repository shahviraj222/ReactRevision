/*
====================================================
CHALLENGE 13: ASYNC QUEUE WITH GRACEFUL SHUTDOWN
====================================================

JavaScript Learning:
1. Returning the function after passing the specialised value
      
Public methods.
  return {
    push(message) {
      queue.push(message);
    },


PROBLEM:
Our AI bot continuously receives and processes messages.

But what if the server needs to shut down?

We must not lose messages that were already accepted,
and we must not leave workers waiting forever.

GOAL:
1. Stop accepting new messages after shutdown.
2. Finish all messages already in the queue.
3. Let currently running messages finish.
4. Reject waiting workers with a shutdown Error.
5. Stop all workers safely.
6. Wait until every worker has finished.

====================================================
*/

// ==================================================
// PART 1: YOUR ASYNCHRONOUS QUEUE
// ==================================================

function createAsyncQueue() {
  let msg = [];
  let waiting = [];
  let closed = false;

  return {
    push(item) {
      // Do not allow new messages after shutdown.
      if (closed) {
        throw new Error("Server is under maintenance");
      }

      // Your original queue logic.
      msg.push(item);

      if (waiting.length > 0) {
        let ref = waiting.shift();

        // Fulfill the waiting worker's Promise.
        ref.resolve(msg.shift());
      }
    },

    next() {
      // First process already accepted messages.
      // Even if closed === true, these must finish.
      if (msg.length > 0) {
        return Promise.resolve(msg.shift());
      }

      // No messages remain and queue is closed.
      if (closed) {
        return Promise.reject(new Error("Server is shutting down"));
      }

      // Queue is empty but still open.
      // Store callbacks until a message arrives.
      return new Promise((resolve, reject) => {
        waiting.push({ resolve, reject });
      });
    },

    close() {
      // Prevent repeated shutdown.
      if (closed) {
        return;
      }

      closed = true;

      // Reject all workers currently waiting
      // for messages that will never arrive.
      while (waiting.length > 0) {
        let ref = waiting.shift();

        ref.reject(new Error("Server is shutting down"));
      }
    },
  };
}

// ==================================================
// PART 2: TASK SCHEDULER + MESSAGE PROCESSOR
// ==================================================

function createMessageProcessor(limit, processMessage) {
  if (!Number.isInteger(limit) || limit < 1) {
    throw new Error("Limit must be a positive integer");
  }

  // Your Challenge 11 queue.
  const queue = createAsyncQueue();

  // Your Challenge 1 scheduler worker,
  // modified to receive live messages.
  async function statTask() {
    while (true) {
      let message;

      try {
        // AWAIT 1:
        // Wait for a new message.
        message = await queue.next();
      } catch (error) {
        // Queue closed and empty.
        console.log("Worker stopped:", error.message);

        break;
      }

      try {
        // AWAIT 2:
        // Process the current message.
        await processMessage(message);
      } catch (error) {
        // A failed message should not kill the worker.
        console.log("Message processing failed:", error.message);
      }
    }
  }

  // Start workers according to concurrency limit.
  let workers = [];

  for (let i = 0; i < limit; i++) {
    workers.push(statTask());
  }

  // Public methods.
  return {
    push(message) {
      queue.push(message);
    },

    async shutdown() {
      console.log("Shutdown requested");

      // Stop accepting new messages.
      queue.close();

      // Wait until all workers finish.
      await Promise.all(workers);

      console.log("Graceful shutdown completed");
    },
  };
}

// ==================================================
// PART 3: SIMULATED AI MESSAGE PROCESSING
// ==================================================

function processAIMessage(message) {
  return new Promise((resolve) => {
    console.log("Started:", message);

    setTimeout(() => {
      console.log("Completed:", message);

      resolve(message);
    }, 2000);
  });
}

// ==================================================
// PART 4: TEST CASE
// ==================================================

async function main() {
  // Maximum 2 concurrent messages.
  const processor = createMessageProcessor(2, processAIMessage);

  // Incoming messages.
  processor.push("A");
  processor.push("B");
  processor.push("C");
  processor.push("D");

  // Simulate a shutdown request after 1 second.
  await new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });

  console.log("\nServer maintenance started\n");

  // Wait for all accepted work to finish.
  await processor.shutdown();

  // Try submitting another message after shutdown.
  try {
    processor.push("E");
  } catch (error) {
    console.log("New message rejected:", error.message);
  }
}

main().catch(console.error);

/*
====================================================
EXPECTED OUTPUT (APPROXIMATELY)
====================================================

Started: A
Started: B

Server maintenance started

Shutdown requested

Completed: A
Started: C

Completed: B
Started: D

Completed: C
Worker stopped: Server is shutting down

Completed: D
Worker stopped: Server is shutting down

Graceful shutdown completed

New message rejected: Server is under maintenance


====================================================
WHAT WE ACHIEVED
====================================================

1. Created a live asynchronous FIFO queue.

2. Used stored Promise resolve functions to
   deliver messages to waiting workers.

3. Introduced reject(error) for shutdown.

4. Started multiple workers using concurrency limit.

5. Every worker independently waits for messages.

6. Workers finish existing messages before exiting.

7. New messages are rejected after shutdown.

8. Promise.all(workers) waits for every worker
   to finish before shutdown completes.

IMPORTANT PROMISE CONCEPTS:

resolve(value)
  -> Promise fulfills with a value.

reject(error)
  -> Promise rejects with an error.

await queue.next()
  -> Worker waits for the next message.

await processMessage(message)
  -> Worker waits for processing to complete.

await Promise.all(workers)
  -> Shutdown waits for all workers to finish.

====================================================
CHALLENGE 13 COMPLETE
====================================================
*/
