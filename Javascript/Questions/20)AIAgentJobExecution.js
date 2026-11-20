/* 
Mini AI Agent Job Execution Engine
New concept: Job orchestration and lifecycle management
This is our final challenge in the original 12–20 series.

1. Real-world problem
Imagine you're building an AI agent like OpenClaw.

A user sends:
"Search for the latest AI news, summarize the top 5 articles, and save the report."

2. Requirements
Your AI agent execution engine must:
1. Accept multiple jobs dynamically.
2. Generate a unique ID for every job.
3. Run a maximum of 2 jobs concurrently.
4. Execute each job's steps in the correct order.
5. Track the status and current step of every job.
6. Retry temporary failures using exponential backoff.
7. Support timeout and user cancellation.
8. Keep other jobs running when one job fails.
9. Store the final result or failure reason.
10. Publish a job.completed or job.failed event.

*/

const { randomUUID } = require("node:crypto");

function abortError() {
  // Creates a recognizable error for user cancellation.
  const error = new Error("Job cancelled by user");
  error.name = "AbortError";
  return error;
}

function createAsyncQueue() {
  // Creates a FIFO queue that supports continuously arriving jobs.
  const messages = [];
  const waiting = [];

  return {
    push(item) {
      if (waiting.length > 0) {
        waiting.shift()(item);
      } else {
        messages.push(item);
      }
    },

    next() {
      if (messages.length > 0) {
        return Promise.resolve(messages.shift());
      }

      return new Promise((resolve) => {
        waiting.push(resolve);
      });
    },
  };
}

function sleep(ms, signal) {
  // Waits asynchronously and rejects if the operation is cancelled.
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(abortError());
      return;
    }

    let settled = false;

    const timer = setTimeout(() => {
      if (settled) return;

      settled = true;
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, ms);

    function onAbort() {
      if (settled) return;

      settled = true;
      clearTimeout(timer);
      signal?.removeEventListener("abort", onAbort);
      reject(abortError());
    }

    signal?.addEventListener("abort", onAbort, {
      once: true,
    });

    if (signal?.aborted) {
      onAbort();
    }
  });
}

async function runWithTimeout(operation, timeout, jobSignal) {
  // Combines job cancellation and per-attempt timeout without aborting the whole job on timeout.
  if (jobSignal.aborted) {
    throw abortError();
  }

  const attemptController = new AbortController();

  let timer;
  let onCancel;

  const interrupt = new Promise((_, reject) => {
    onCancel = () => {
      reject(abortError());
      attemptController.abort();
    };

    jobSignal.addEventListener("abort", onCancel, {
      once: true,
    });
  });

  const timeoutPromise = new Promise((_, reject) => {
    timer = setTimeout(() => {
      const error = new Error(`Step timed out after ${timeout}ms`);

      error.name = "TimeoutError";

      reject(error);
      attemptController.abort();
    }, timeout);
  });

  const operationPromise = Promise.resolve().then(() => {
    if (attemptController.signal.aborted) {
      throw abortError();
    }

    return operation(attemptController.signal);
  });

  try {
    return await Promise.race([operationPromise, timeoutPromise, interrupt]);
  } catch (error) {
    if (jobSignal.aborted) {
      throw abortError();
    }

    throw error;
  } finally {
    clearTimeout(timer);
    jobSignal.removeEventListener("abort", onCancel);
  }
}

const reportDatabase = new Map();

async function searchNews(job, signal) {
  // Simulates retrieving articles from an external search API.
  await sleep(job.task === "slow search" ? 1200 : 200, signal);

  return [`Article 1 about ${job.task}`, `Article 2 about ${job.task}`];
}

async function summarizeNews(job, signal) {
  // Simulates an LLM summary with one temporary failure for testing.
  await sleep(300, signal);

  if (job.task === "AI news" && job.retries === 0) {
    const error = new Error("Temporary LLM service failure");

    error.retryable = true;

    throw error;
  }

  return `Summary: ${job.context.articles.join("; ")}`;
}

async function saveReport(job, signal) {
  // Saves the final report using the job ID as a unique database key.
  await sleep(150, signal);

  if (signal.aborted) {
    throw abortError();
  }

  const report = {
    id: job.id,
    topic: job.task,
    articles: job.context.articles,
    summary: job.context.summary,
  };

  reportDatabase.set(job.id, report);

  return report;
}

function createAgentEngine(options = {}) {
  // Creates an execution engine with concurrency, retries, timeout, and cancellation.
  const {
    concurrency = 2,
    maxRetries = 3,
    baseDelay = 1000,
    timeout = 5000,
  } = options;

  if (
    !Number.isInteger(concurrency) ||
    concurrency < 1 ||
    !Number.isInteger(maxRetries) ||
    maxRetries < 0 ||
    !Number.isFinite(baseDelay) ||
    baseDelay < 0 ||
    !Number.isFinite(timeout) ||
    timeout <= 0
  ) {
    throw new Error("Invalid engine options");
  }

  const queue = createAsyncQueue();
  const jobs = new Map();
  const subscribers = new Map();

  const finished = new Set(["completed", "failed", "cancelled"]);

  // Defines the fixed execution pipeline for every job.
  const steps = [
    {
      name: "search",
      run: searchNews,
      output: "articles",
    },
    {
      name: "summarize",
      run: summarizeNews,
      output: "summary",
    },
    {
      name: "save",
      run: saveReport,
      output: "report",
    },
  ];

  function getStatus(id) {
    // Returns a snapshot of the job without exposing its internal controller.
    const job = jobs.get(id);

    if (!job) return null;

    return {
      id: job.id,
      task: job.task,
      status: job.status,
      currentStep: steps[job.stepIndex]?.name ?? null,
      completedSteps: steps.slice(0, job.stepIndex).map((step) => step.name),
      retries: job.retries,
      attempts: job.attempts,
      result: job.result,
      error: job.error,
    };
  }

  function subscribe(event, handler) {
    // Registers an event subscriber and returns an unsubscribe function.
    if (!subscribers.has(event)) {
      subscribers.set(event, new Set());
    }

    subscribers.get(event).add(handler);

    return () => {
      subscribers.get(event)?.delete(handler);
    };
  }

  function publish(event, data) {
    // Runs subscribers concurrently and isolates their failures.
    const handlers = [...(subscribers.get(event) ?? [])];

    const promises = handlers.map((fn) => {
      return Promise.resolve().then(() => fn(data));
    });

    return Promise.allSettled(promises);
  }

  function finishJob(job, status, error = null) {
    // Finalizes a job once, clears pending retries, and publishes its result.
    if (finished.has(job.status)) {
      return;
    }

    if (job.retryTimer !== null) {
      clearTimeout(job.retryTimer);
    }

    job.retryTimer = null;

    if (job.retryAbortListener) {
      job.controller.signal.removeEventListener(
        "abort",
        job.retryAbortListener,
      );

      job.retryAbortListener = null;
    }

    job.status = status;
    job.error = error ? error.message : null;

    if (status === "completed") {
      job.result = job.context.report;
    }

    const snapshot = getStatus(job.id);

    job.resolveDone(snapshot);

    void publish(`job.${status}`, snapshot);
  }

  function scheduleRetry(job) {
    // Schedules a failed step for retry without blocking a worker.
    const ms = baseDelay * 2 ** (job.retries - 1);

    job.status = "retry_wait";

    function onAbort() {
      if (job.retryTimer !== null) {
        clearTimeout(job.retryTimer);
      }

      job.retryTimer = null;

      job.controller.signal.removeEventListener("abort", onAbort);

      job.retryAbortListener = null;
    }

    job.retryAbortListener = onAbort;

    job.controller.signal.addEventListener("abort", onAbort, { once: true });

    job.retryTimer = setTimeout(() => {
      onAbort();

      if (job.controller.signal.aborted || finished.has(job.status)) {
        return;
      }

      job.status = "queued";
      queue.push(job);
    }, ms);

    if (job.controller.signal.aborted) {
      onAbort();
    }
  }

  async function worker() {
    // Continuously processes one pipeline step at a time for available jobs.
    while (true) {
      const job = await queue.next();

      if (finished.has(job.status) || job.controller.signal.aborted) {
        continue;
      }

      const step = steps[job.stepIndex];

      job.status = "running";
      job.attempts++;

      try {
        const value = await runWithTimeout(
          (signal) => step.run(job, signal),
          timeout,
          job.controller.signal,
        );

        if (job.controller.signal.aborted || finished.has(job.status)) {
          continue;
        }

        // Preserve the completed step's result for subsequent steps.
        job.context[step.output] = value;

        job.stepIndex++;
        job.retries = 0;

        if (job.stepIndex === steps.length) {
          finishJob(job, "completed");
        } else {
          job.status = "queued";
          queue.push(job);
        }
      } catch (error) {
        if (job.controller.signal.aborted) {
          finishJob(job, "cancelled", abortError());
          continue;
        }

        const retryable =
          error.name === "TimeoutError" || error.retryable === true;

        if (retryable && job.retries < maxRetries) {
          job.retries++;
          scheduleRetry(job);
        } else {
          finishJob(job, "failed", error);
        }
      }
    }
  }

  // Starts the configured number of workers without waiting for their infinite loops.
  for (let i = 0; i < concurrency; i++) {
    void worker();
  }

  return {
    submit({ task }) {
      // Creates a job with its own AbortController and completion Promise.
      if (typeof task !== "string" || !task.trim()) {
        throw new Error("Task must be a non-empty string");
      }

      let resolveDone;

      const done = new Promise((resolve) => {
        resolveDone = resolve;
      });

      const job = {
        id: randomUUID(),
        task: task.trim(),
        controller: new AbortController(),
        status: "queued",
        stepIndex: 0,
        retries: 0,
        attempts: 0,
        context: {},
        result: null,
        error: null,
        retryTimer: null,
        retryAbortListener: null,
        resolveDone,
        done,
      };

      jobs.set(job.id, job);
      queue.push(job);

      return job.id;
    },

    getStatus,

    cancel(id) {
      // Cancels only the selected job while keeping workers available.
      const job = jobs.get(id);

      if (!job || finished.has(job.status)) {
        return false;
      }

      job.controller.abort();

      finishJob(job, "cancelled", abortError());

      return true;
    },

    waitFor(id) {
      // Returns the Promise that fulfills when the selected job reaches a final state.
      const job = jobs.get(id);

      if (!job) {
        return Promise.reject(new Error("Unknown job ID"));
      }

      return job.done;
    },

    subscribe,
  };
}

async function main() {
  // Tests successful processing, retries, timeout failure, and active-job cancellation.
  const engine = createAgentEngine({
    concurrency: 2,
    maxRetries: 2,
    baseDelay: 250,
    timeout: 700,
  });

  engine.subscribe("job.completed", (job) => {
    console.log("Completed:", job.task);
  });

  engine.subscribe("job.failed", (job) => {
    console.log("Failed:", job.task, job.error);
  });

  engine.subscribe("job.cancelled", (job) => {
    console.log("Cancelled:", job.task);
  });

  const d = engine.submit({
    task: "cancel this task",
  });

  const a = engine.submit({
    task: "AI news",
  });

  const b = engine.submit({
    task: "slow search",
  });

  const c = engine.submit({
    task: "JavaScript news",
  });

  // Cancels job D while its search operation is running.
  setTimeout(() => {
    engine.cancel(d);
  }, 100);

  const results = await Promise.all(
    [a, b, c, d].map((id) => engine.waitFor(id)),
  );

  console.log(
    "Final statuses:",
    results.map((job) => ({
      task: job.task,
      status: job.status,
      attempts: job.attempts,
    })),
  );

  console.log("Saved reports:", [...reportDatabase.values()]);
}

main().catch(console.error);
