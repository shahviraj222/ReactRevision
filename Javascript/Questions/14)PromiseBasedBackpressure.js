// Promise-based backpressure

// Imagine you're building an AI agent backend like OpenClaw.
// Your server can process 2 messages concurrently, and each message takes 3 seconds.
// But suddenly, 10,000 messages arrive.
// Your Challenge 12 implementation will accept every message and store the extra messages in an array.

// What's the problem?

// Even though only 2 messages are processing, the queue might keep growing until your server runs out of memory.
// This is where backpressure becomes important.
// Backpressure means controlling how quickly producers can submit new work when consumers cannot process it fast enough

// Option 1: reject the new process
// Option 2: put in the waiting room with promise and then when some one goes out put in msg

// Q1) still we are sotring events in the prewaiting so that also used the resources so how. we can omit that
// answer it at end

// ==================================================
// PART 1: ASYNCHRONOUS QUEUE WITH BACKPRESSURE
// ==================================================

function createAsyncQueue(msglimit) {
  if (!Number.isInteger(msglimit) || msglimit < 1) {
    throw new Error("Queue limit must be positive");
  }

  let msg = [];

  // Consumers waiting for messages.
  let waiting = [];

  // Producers waiting for available queue space.
  let prewaiting = [];

  return {
    push(item) {
      // CASE 1:
      // A worker is waiting for a message.
      // Send the message directly to that worker.
      if (waiting.length > 0) {
        let ref = waiting.shift();

        ref.resolve(item);

        return Promise.resolve();
      }

      // CASE 2:
      // Queue is full.
      // Store the producer's message and resolver.
      if (msg.length >= msglimit) {
        return new Promise((resolve) => {
          prewaiting.push({
            item,
            resolve,
          });
        });
      }

      // CASE 3:
      // Queue has available space.
      msg.push(item);

      return Promise.resolve();
    },

    next() {
      // CASE 1:
      // Queue already contains messages.
      if (msg.length > 0) {
        let item = msg.shift();

        // One queue slot is now available.
        if (prewaiting.length > 0) {
          // Take oldest waiting producer.
          let ref = prewaiting.shift();

          // Put its message at the END of the queue.
          msg.push(ref.item);

          // Notify producer: message accepted.
          // This does NOT process the message.
          ref.resolve();
        }

        return Promise.resolve(item);
      }

      // CASE 2:
      // No messages available.
      // Wait for a future producer.
      return new Promise((resolve, reject) => {
        waiting.push({ resolve, reject });
      });
    },
  };
}

// ==================================================
// PART 2: YOUR MESSAGE PROCESSOR / TASK SCHEDULER
// ==================================================

function createMessageProcessor(limit, msglimit, processMessage) {
  if (!Number.isInteger(limit) || limit < 1) {
    throw new Error("Worker limit must be positive");
  }

  // Create the queue with a maximum waiting capacity.
  let queue = createAsyncQueue(msglimit);

  // Your original startTask function.
  async function startTask() {
    while (true) {
      // AWAIT 1:
      // Wait for an available message.
      let item = await queue.next();

      try {
        // AWAIT 2:
        // Process the message before taking another.
        await processMessage(item);
      } catch (error) {
        console.log("Message processing failed:", error.message);
      }
    }
  }

  // Start workers according to concurrency limit.
  for (let i = 0; i < limit; i++) {
    startTask();
  }

  // Public method to submit messages.
  return {
    push(item) {
      // Return the queue's Promise.
      // The caller can await admission.
      return queue.push(item);
    },
  };
}

// ==================================================
// PART 3: SIMULATE AI API PROCESSING
// ==================================================

function processAIMessage(message) {
  return new Promise((resolve) => {
    console.log("Started processing:", message);

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
  // 2 workers.
  // Maximum 3 messages waiting in queue.
  const processor = createMessageProcessor(2, 3, processAIMessage);

  const messages = ["A", "B", "C", "D", "E", "F"];

  // Simulate multiple producers submitting messages.
  const producers = messages.map(async (message) => {
    console.log("Submitting:", message);

    // If the queue is full, this await pauses
    // until the message can enter the queue.
    await processor.push(message);

    console.log("Accepted into system:", message);
  });

  // Wait for all six messages to be accepted.
  // This does NOT mean they have all finished processing.
  await Promise.all(producers);

  console.log("All messages accepted!");
}

main().catch(console.error);

// The most important code in Challenge 14
// Producer waits
return new Promise((resolve) => {
  prewaiting.push({ item, resolve });
});

// ANSWER OF THE Q1

// Excellent observation! You've identified a real limitation in our implementation.

// You're absolutely right: prewaiting[] also consumes server memory. If 1 million messages arrive, we could end up storing nearly 1 million pending producers.

// So our current implementation doesn't provide complete memory protection. It only limits the main queue.
// How production systems solve this
// 1. Limit prewaiting[] too: Once it reaches capacity, reject additional requests (e.g., HTTP 429 Too Many Requests).
// 2. Apply backpressure upstream: Make the sender stop or slow down sending messages instead of storing them all on our server.
// 3. Use an external message broker: Systems like RabbitMQ or Kafka can buffer messages outside the application process, with their own capacity and retention policies.
// The key distinction
// - Concurrency limit → Controls how many messages are processing.
// - Queue limit → Controls how many messages are waiting in the main queue.
// - True backpressure → Controls how quickly new messages enter the system, including how many producers can wait.
