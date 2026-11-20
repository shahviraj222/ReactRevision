function createAsyncQueue() {
  const msg = [];
  const waiting = [];

  return {
    push(item) {
      msg.push(item);

      if (waiting.length > 0) {
        const resolve = waiting.shift();
        resolve(msg.shift());
      }
    },

    next() {
      if (msg.length > 0) {
        return Promise.resolve(msg.shift());
      }

      return new Promise((resolve) => {
        waiting.push(resolve);
      });
    },
  };
}

function createMessageProcessor(limit, processMessage) {
  const queue = createAsyncQueue();
  const jobs = new Map();

  let nextId = 1;

  // Runs one job while allowing its wait to be cancelled.
  async function runJob(job) {
    const signal = job.controller.signal;

    if (signal.aborted) {
      throw new Error("Job cancelled");
    }

    let onAbort;

    // This Promise rejects when the user cancels the job.
    const cancelPromise = new Promise((_, reject) => {
      onAbort = () => {
        reject(new Error("Job cancelled"));
      };

      signal.addEventListener("abort", onAbort, {
        once: true,
      });

      if (signal.aborted) {
        onAbort();
      }
    });

    // This Promise represents the actual API operation.
    const apiPromise = Promise.resolve().then(() => {
      if (signal.aborted) {
        throw new Error("Job cancelled");
      }

      return processMessage(job.message, { signal });
    });

    try {
      // The worker waits until the API settles or cancellation occurs.
      return await Promise.race([apiPromise, cancelPromise]);
    } finally {
      // Remove the cancellation listener after the race settles.
      signal.removeEventListener("abort", onAbort);
    }
  }

  // Continuously processes jobs without stopping on cancellation.
  async function statTask() {
    while (true) {
      const job = await queue.next();

      // Ignore queued jobs that were cancelled before execution.
      if (job.status === "cancelled") {
        continue;
      }

      job.status = "running";

      try {
        const result = await runJob(job);

        if (job.controller.signal.aborted) {
          continue;
        }

        job.result = result;
        job.status = "completed";
      } catch (error) {
        if (job.controller.signal.aborted) {
          job.status = "cancelled";
          job.error = "Cancelled by user";
        } else {
          job.status = "failed";
          job.error = error.message;
        }
      }
    }
  }

  // Start the configured number of workers.
  for (let i = 0; i < limit; i++) {
    statTask();
  }

  return {
    push(message) {
      // Every job receives its own AbortController.
      const job = {
        id: nextId++,
        message,
        status: "queued",
        result: null,
        error: null,
        controller: new AbortController(),
      };

      jobs.set(job.id, job);
      queue.push(job);

      return job.id;
    },

    cancel(id) {
      const job = jobs.get(id);

      if (!job) return false;

      if (
        job.status === "completed" ||
        job.status === "failed" ||
        job.status === "cancelled"
      ) {
        return false;
      }

      // Cancel this job without stopping its worker.
      job.status = "cancelled";
      job.error = "Cancelled by user";
      job.controller.abort();

      return true;
    },

    getStatus(id) {
      const job = jobs.get(id);

      if (!job) return null;

      return {
        id: job.id,
        status: job.status,
        result: job.result,
        error: job.error,
      };
    },
  };
}

// Simulates an API that does not support AbortSignal.
async function processAIMessage(message) {
  console.log("API started:", message);

  await new Promise((resolve) => {
    setTimeout(resolve, 5000);
  });

  console.log("Underlying API finished:", message);

  return `Response for ${message}`;
}

const processor = createMessageProcessor(1, processAIMessage);

const jobA = processor.push("A");
const jobB = processor.push("B");

setTimeout(() => {
  console.log("Cancelling A:", processor.cancel(jobA));
  console.log("A status:", processor.getStatus(jobA));
}, 1000);
