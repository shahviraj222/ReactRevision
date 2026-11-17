// Async Producer–Consumer Pipeline
// Multi-stage asynchronous processing

// Imagine you're building an AI document-processing backend like OpenClaw.

// A user uploads a PDF. Your server must perform three operations:
// 1. Extract text from the PDF.
// 2. Generate an AI summary from the extracted text.
// 3. Save the summary to a database.
// These operations depend on each other.

// Previously, you built a queue with multiple workers performing one type of task.
// Now we have three processing stages, each with its own concurrency limit.
// A document can move to Stage 2 while another document is still in Stage 1.

// This is called an asynchronous pipeline.

// Requirements:
// - Each stage has its own queue.
// - Extraction supports 2 concurrent workers.
// - AI summarization supports 1 concurrent worker.
// - Database saving supports 2 concurrent workers.
// - A document moves to the next stage only when its current stage succeeds.
// - Multiple documents can be at different stages simultaneously.
// - Handle failures without bringing down the entire pipeline.
import { randomUUID } from ("node:crypto");

function createAsyncQueue() {
  let msg = [];
  let waiting = [];

  return {
    push(item) {
      msg.push(item);

      if (waiting.length > 0) {
        let ref = waiting.shift();
        ref(msg.shift());
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

function createDocumentPipeline() {
  const extractionQueue = createAsyncQueue();
  const summaryQueue = createAsyncQueue();
  const databaseQueue = createAsyncQueue();

  const jobs = new Map();

  function generateId() {
    return randomUUID();
  }

  function getStatus(id) {
    const job = jobs.get(id);

    if (!job) {
      return null;
    }

    return {
      id: job.id,
      pdfUrl: job.pdfUrl,
      status: job.status,
      stage: job.stage,
      error: job.error,
    };
  }

  function markFailed(job, error) {
    job.status = "failed";
    job.error = error.message;

    console.error(`Document ${job.id} failed:`, error.message);

    job.resolveDone(getStatus(job.id));
  }

  async function extractionWorker() {
    while (true) {
      const job = await extractionQueue.next();

      try {
        job.status = "processing";
        job.stage = "extraction";

        const text = await extractText(job.pdfUrl);

        job.extractedText = text;

        summaryQueue.push(job);
      } catch (error) {
        markFailed(job, error);
      }
    }
  }

  async function summaryWorker() {
    while (true) {
      const job = await summaryQueue.next();

      try {
        job.stage = "summarization";

        const summary = await summariseText(job.extractedText);

        job.summary = summary;

        databaseQueue.push(job);
      } catch (error) {
        markFailed(job, error);
      }
    }
  }

  async function databaseWorker() {
    while (true) {
      const job = await databaseQueue.next();

      try {
        job.stage = "database";

        const result = await dataSaveText(job);

        job.status = "completed";
        job.stage = "finished";

        console.log("Document saved:", job.id, result);

        job.resolveDone(getStatus(job.id));
      } catch (error) {
        markFailed(job, error);
      }
    }
  }

  extractionWorker();
  extractionWorker();

  summaryWorker();

  databaseWorker();
  databaseWorker();

  return {
    push(pdfUrl) {
      const id = generateId();

      let resolveDone;

      const done = new Promise((resolve) => {
        resolveDone = resolve;
      });

      const job = {
        id,
        pdfUrl,
        extractedText: null,
        summary: null,
        status: "pending",
        stage: "queued",
        error: null,
        resolveDone,
      };

      jobs.set(id, job);

      extractionQueue.push(job);

      return { id, done };
    },

    getStatus,
  };
}

async function extractText(pdfUrl) {
  await new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });

  console.log("Extracted text from:", pdfUrl);

  return `Extracted content from ${pdfUrl}`;
}

async function summariseText(text) {
  await new Promise((resolve) => {
    setTimeout(resolve, 1500);
  });

  if (text.includes("bad-document")) {
    throw new Error("AI summarization failed");
  }

  console.log("AI summary generated");

  return `AI summary of: ${text}`;
}

const database = new Map();

async function dataSaveText(job) {
  await new Promise((resolve) => {
    setTimeout(resolve, 800);
  });

  const record = {
    id: job.id,
    pdfUrl: job.pdfUrl,
    extractedText: job.extractedText,
    summary: job.summary,
  };

  database.set(job.id, record);

  return { saved: true, id: job.id };
}

async function main() {
  const pipeline = createDocumentPipeline();

  const jobA = pipeline.push("https://storage.example.com/document-A.pdf");

  const jobB = pipeline.push("https://storage.example.com/document-B.pdf");

  const jobC = pipeline.push("https://storage.example.com/bad-document.pdf");

  console.log("Document IDs:");

  console.log("A:", jobA.id);
  console.log("B:", jobB.id);
  console.log("C:", jobC.id);

  console.log("Initial status:", pipeline.getStatus(jobA.id));

  const results = await Promise.all([jobA.done, jobB.done, jobC.done]);

  console.log("Final job results:", results);

  console.log("Database records:", [...database.values()]);
}

main().catch(console.error);
