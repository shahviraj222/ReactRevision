/*
Challenge 18: Retry queue with exponential backoff

Problem:
Build a backend job processor that handles multiple jobs concurrently.
Some jobs may fail because of temporary API or network errors.
Failed jobs should be retried without blocking other workers.

Requirements:
1. Process a maximum of 2 jobs concurrently.
2. Accept new jobs dynamically using an asynchronous queue.
3. Allow 3 retries after the initial attempt.
4. Use exponential backoff delays of 1s, 2s, and 4s.
5. Use setTimeout to schedule retries without blocking workers.
6. Track retry attempts separately for each job.
7. Stop retrying once a job succeeds.
8. Move jobs to a dead-letter queue after all retries fail.
9. Keep workers running even when individual jobs fail.
10. Allow inspection of permanently failed jobs.

Expected results:
Job A fails twice and succeeds on attempt 3.
Job B fails all 4 attempts and moves to the dead-letter queue.
Job C succeeds on its first attempt.
*/

function createAsyncQueue() {
  // Creates a FIFO queue where workers can wait for new jobs.
  const msg = [];
  const waiting = [];

  return {
    push(item) {
      // Adds a job and wakes a waiting worker if available.
      msg.push(item);

      if (waiting.length > 0) {
        const resolve = waiting.shift();
        resolve(msg.shift());
      }
    },

    next() {
      // Returns the oldest job or waits until a new job arrives.
      if (msg.length > 0) {
        return Promise.resolve(msg.shift());
      }

      return new Promise((resolve) => {
        waiting.push(resolve);
      });
    },
  };
}

function delay(ms) {
  // Returns a Promise that fulfills after the specified delay.
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function createRetryQueue(processJob, options) {
  // Creates a concurrency-limited job processor with automatic retries.
  const { concurrency = 2, maxRetries = 3, baseDelay = 1000 } = options;

  const queue = createAsyncQueue();
  const deadLetterQueue = [];

  function retry(job) {
    // Schedules a failed job using exponential backoff without blocking workers.
    const expTime = baseDelay * 2 ** (job.retries - 1);

    console.log(`Retrying ${job.id} after ${expTime}ms`);

    setTimeout(() => {
      queue.push(job);
    }, expTime);
  }

  async function worker() {
    // Continuously processes jobs and handles failures independently.
    while (true) {
      const job = await queue.next();

      try {
        await processJob(job);

        console.log(`Job ${job.id} succeeded`);
      } catch (error) {
        job.retries += 1;

        if (job.retries <= maxRetries) {
          retry(job);
        } else {
          deadLetterQueue.push({
            ...job,
            error: error.message,
          });

          console.log(`Job ${job.id} moved to dead-letter queue`);
        }
      }
    }
  }

  // Starts the configured number of concurrent workers.
  for (let i = 0; i < concurrency; i++) {
    worker();
  }

  return {
    push(data) {
      // Creates a new job with zero retries and adds it to the queue.
      const job = {
        ...data,
        retries: 0,
      };

      queue.push(job);
    },

    getDeadLetterQueue() {
      // Returns a shallow copy of permanently failed jobs.
      return [...deadLetterQueue];
    },
  };
}

const attempts = new Map();

async function processJob(job) {
  // Simulates an API where A fails twice, B always fails, and C succeeds.
  const count = (attempts.get(job.id) || 0) + 1;
  attempts.set(job.id, count);

  console.log(`Processing ${job.id}, attempt ${count}`);

  await delay(300);

  if (job.id === "A" && count <= 2) {
    throw new Error("Temporary API failure");
  }

  if (job.id === "B") {
    throw new Error("Permanent API failure");
  }

  console.log(`Completed ${job.id}`);
  return `Result for ${job.id}`;
}

async function main() {
  // Creates the processor, submits test jobs, and inspects failures after 9 seconds.
  const processor = createRetryQueue(processJob, {
    concurrency: 2,
    maxRetries: 3,
    baseDelay: 1000,
  });

  processor.push({
    id: "A",
    message: "Send notification",
  });

  processor.push({
    id: "B",
    message: "Generate report",
  });

  processor.push({
    id: "C",
    message: "Save analytics",
  });

  await delay(9000);

  console.log("Dead-letter queue:", processor.getDeadLetterQueue());
}

main().catch(console.error);
