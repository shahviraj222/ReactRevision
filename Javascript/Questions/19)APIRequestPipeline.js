/*
Challenge 19: API request pipeline with timeout, retry and cancellation

Problem:
Build an API request system that handles slow requests, temporary failures and user cancellation.

Requirements:
1. Set a timeout for each API attempt.
2. Abort the actual API request when it times out.
3. Retry failed requests up to 3 times.
4. Use exponential backoff between retries.
5. Stop immediately when the user cancels.
6. Cancel pending retry delays when the user aborts.
7. Clean up timers and event listeners.
8. Return the API result on success or throw the final error.
*/

// Creates an error for user cancellation.
function createAbortError() {
  const error = new Error("Request cancelled by user");
  error.name = "AbortError";
  return error;
}

// Waits for a delay and supports cancellation while waiting.
function delay(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(createAbortError());
      return;
    }

    const timer = setTimeout(() => {
      cleanup();
      resolve();
    }, ms);

    function cleanup() {
      signal?.removeEventListener("abort", onAbort);
    }

    function onAbort() {
      clearTimeout(timer);
      cleanup();
      reject(createAbortError());
    }

    signal?.addEventListener("abort", onAbort, {
      once: true,
    });

    if (signal?.aborted) {
      onAbort();
    }
  });
}

// Simulates an API that takes 3 seconds and supports cancellation.
function fakeAIRequest(prompt, { signal }) {
  return new Promise((resolve, reject) => {
    console.log("API request started:", prompt);

    if (signal.aborted) {
      reject(new Error("Request aborted"));
      return;
    }

    const timer = setTimeout(() => {
      cleanup();
      resolve(`AI response for: ${prompt}`);
    }, 3000);

    function onAbort() {
      clearTimeout(timer);
      cleanup();
      reject(new Error("Request aborted"));
    }

    function cleanup() {
      signal.removeEventListener("abort", onAbort);
    }

    signal.addEventListener("abort", onAbort, {
      once: true,
    });
  });
}

// Runs an API request with per-attempt timeout, retries and user cancellation.
async function requestWithRetry(apiFunction, input, options = {}) {
  const { timeout = 2000, maxRetries = 3, baseDelay = 1000, signal } = options;

  if (
    !Number.isFinite(timeout) ||
    timeout < 0 ||
    !Number.isFinite(baseDelay) ||
    baseDelay < 0 ||
    !Number.isInteger(maxRetries) ||
    maxRetries < 0
  ) {
    throw new Error("Invalid retry configuration");
  }

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    if (signal?.aborted) {
      throw createAbortError();
    }

    // Each API attempt gets its own AbortController.
    const controller = new AbortController();

    let timeoutId;
    let onUserAbort;

    // Rejects when the user cancels and aborts the active API.
    const abortPromise = new Promise((_, reject) => {
      onUserAbort = () => {
        controller.abort();
        reject(createAbortError());
      };

      if (signal?.aborted) {
        onUserAbort();
        return;
      }

      signal?.addEventListener("abort", onUserAbort, {
        once: true,
      });
    });

    try {
      console.log(`Starting attempt ${attempt + 1}`);

      // Starts the API and passes the attempt's abort signal.
      const apiCall = Promise.resolve().then(() => {
        return apiFunction(input, {
          signal: controller.signal,
        });
      });

      // Creates a timeout Promise that identifies itself when it wins.
      const timeoutPromise = new Promise((resolve) => {
        timeoutId = setTimeout(() => {
          resolve({
            source: "timeout",
          });
        }, timeout);
      });

      // Waits for API completion, timeout or user cancellation.
      const result = await Promise.race([
        apiCall.then((data) => {
          return {
            source: "api",
            value: data,
          };
        }),

        timeoutPromise,

        abortPromise,
      ]);

      if (signal?.aborted) {
        throw createAbortError();
      }

      // Abort the underlying API when the timeout wins.
      if (result.source === "timeout") {
        controller.abort();

        const error = new Error(`Request timed out after ${timeout}ms`);

        error.name = "TimeoutError";
        throw error;
      }

      // Return the API response when the request succeeds.
      console.log(`Attempt ${attempt + 1} succeeded`);

      return result.value;
    } catch (error) {
      // User cancellation stops the entire retry process.
      if (signal?.aborted) {
        throw createAbortError();
      }

      console.log(`Attempt ${attempt + 1} failed:`, error.message);

      // Throw the final error when no retries remain.
      if (attempt === maxRetries) {
        throw error;
      }
    } finally {
      // Remove the timeout and abort listener after every attempt.
      clearTimeout(timeoutId);

      signal?.removeEventListener("abort", onUserAbort);
    }

    // Calculate exponential backoff before the next attempt.
    const retryDelay = baseDelay * 2 ** attempt;

    console.log(`Retrying after ${retryDelay}ms`);

    // Wait for the next retry while still allowing user cancellation.
    await delay(retryDelay, signal);
  }
}

// Tests timeout, successful completion and user cancellation.
async function main() {
  console.log("Test 1: API timeout and retries");

  try {
    const result = await requestWithRetry(
      fakeAIRequest,
      "Explain JavaScript Promises",
      {
        timeout: 2000,
        maxRetries: 3,
        baseDelay: 1000,
      },
    );

    console.log("Result:", result);
  } catch (error) {
    console.log("Final error:", error.message);
  }

  console.log("\nTest 2: Successful API request");

  try {
    const result = await requestWithRetry(
      fakeAIRequest,
      "Explain async/await",
      {
        timeout: 4000,
        maxRetries: 3,
        baseDelay: 1000,
      },
    );

    console.log("Result:", result);
  } catch (error) {
    console.log("Final error:", error.message);
  }

  console.log("\nTest 3: User cancellation");

  const controller = new AbortController();

  setTimeout(() => {
    console.log("User cancelled the request");
    controller.abort();
  }, 1000);

  try {
    const result = await requestWithRetry(
      fakeAIRequest,
      "Explain AbortController",
      {
        timeout: 2000,
        maxRetries: 3,
        baseDelay: 1000,
        signal: controller.signal,
      },
    );

    console.log("Result:", result);
  } catch (error) {
    console.log("Final error:", error.message);
  }
}

// Starts the test and catches unexpected errors.
main().catch(console.error);
