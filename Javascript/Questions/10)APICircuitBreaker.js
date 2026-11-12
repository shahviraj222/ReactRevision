// Imagine your application calls a payment API.
// Sometimes that API goes down. Rather than repeatedly calling a failing service, we want to temporarily stop sending requests.

// Normally, API calls are allowed.
// After 3 consecutive failures, block further requests.
// Keep requests blocked for 5 seconds.
// After 5 seconds, allow one test request.
// If that request succeeds, resume normal operations. If it fails, block requests again.

// M1) if fucntion is async then it automatically going to return the promise so you onlyn has to write the return data
// not the return resolve(data)
// same follow for the reject as well

// API Circuit Breaker

function createCircuitBreaker(fn, maxFailures, cooldownMs) {
  let failureCount = 0;
  let state = "CLOSED";
  let timer = null;
  let testInProgress = false;

  function openCircuit() {
    state = "OPEN";

    clearTimeout(timer);

    timer = setTimeout(() => {
      state = "HALF_OPEN";
      timer = null;
    }, cooldownMs);
  }

  return async function (...args) {
    // 1. BLOCKED MODE
    if (state === "OPEN") {
      throw new Error("Circuit is OPEN. Request blocked.");
    }

    // 2. TEST MODE (after cooldown)
    if (state === "HALF_OPEN") {
      // Allow only ONE test request
      if (testInProgress) {
        throw new Error("Test request already running.");
      }

      testInProgress = true;

      try {
        const data = await fn(...args);

        // Test succeeded: resume normal mode
        state = "CLOSED";
        failureCount = 0;

        return data;
      } catch (error) {
        // Test failed: block for another cooldown
        openCircuit();
        throw error;
      } finally {
        testInProgress = false;
      }
    }

    // 3. NORMAL MODE
    try {
      const data = await fn(...args);

      // Success resets consecutive failures
      if (state === "CLOSED") {
        failureCount = 0;
      }

      return data;
    } catch (error) {
      if (state === "CLOSED") {
        failureCount++;

        if (failureCount >= maxFailures) {
          openCircuit();
        }
      }

      throw error;
    }
  };
}
