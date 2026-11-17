// variation 1:: Request Coalescing & In-Flight Deduplication Under Load
// this is the same as challenge 2 // here we are also taking care if the different user is request same api then also we are not calling again (understand if the data changed according user then you have to call two reqß)
// but the difference is that we are only redirecting the pending request because (not returning the successfull or faileure requedst)
// if we return the successfull request then it will be old data
// how to do
// so write the .then() insiden the function where you make the call and delete the result from registry

// const registry = new Map();

// function request(key) {
//   if (registry.has(key)) {
//     return registry.get(key);
//   }

//   const promise = apiFunction(key);

//   registry.set(key, promise);

// new thing
//   promise.then(
//     () => registry.delete(key),
//     () => registry.delete(key)
//   );

//   return promise;
// }

// variation 2: Request Coalescing With Per-Caller Cancellation
// what if 3 user call same request and one user dont want and cancle the request ; so we dont have to give the request for that user but other 2  user wants

/*
==================================================
CHALLENGE 15: REQUEST COALESCING + CANCELLATION
==================================================

PROBLEM:
3 users request the same flight information.

Instead of making 3 API calls, we make only 1.

But what happens if User A cancels?

GOALS:
1. Same flight search = one shared API request.
2. Each user can cancel independently.
3. Cancelling A must not affect B and C.
4. If ALL users cancel, abort the actual API.
5. Remove settled requests from the registry.

==================================================
*/

// SIMULATED FLIGHT API
// Supports cancellation using AbortController.

function fetchFlights(route, { signal }) {
  return new Promise((resolve, reject) => {
    console.log("API CALLED:", route);

    if (signal.aborted) {
      reject(new Error("API request aborted"));
      return;
    }

    const timer = setTimeout(() => {
      signal.removeEventListener("abort", onAbort);

      resolve(`Flights found for ${route}`);
    }, 3000);

    function onAbort() {
      clearTimeout(timer);
      reject(new Error("API request aborted"));
    }

    signal.addEventListener("abort", onAbort, {
      once: true,
    });
  });
}

// ==================================================
// PART 2: YOUR REQUEST COALESCER
// ==================================================

function createRequestCoalescer(apiFunction) {
  const registry = new Map();

  function request(key, callerSignal) {
    // STEP 1: Check if this user already cancelled.

    if (callerSignal?.aborted) {
      return Promise.reject(new Error("User cancelled"));
    }

    // STEP 2: Look for an existing shared request.

    let entry = registry.get(key);

    if (!entry) {
      // One shared controller for THIS route.
      const controller = new AbortController();

      entry = {
        controller,
        sharedPromise: null,
        users: new Set(),
      };

      registry.set(key, entry);

      // Keep reference for safe registry cleanup.
      const currentEntry = entry;

      // Start the API operation.
      // Promise.resolve().then() also catches
      // synchronous errors from apiFunction.
      entry.sharedPromise = Promise.resolve().then(() => {
        if (controller.signal.aborted) {
          throw new Error("API request aborted");
        }

        return apiFunction(key, {
          signal: controller.signal,
        });
      });

      // Remove the entry after success OR failure.
      // Do not accidentally delete a newer request.
      entry.sharedPromise.then(
        () => {
          if (registry.get(key) === currentEntry) {
            registry.delete(key);
          }
        },
        () => {
          if (registry.get(key) === currentEntry) {
            registry.delete(key);
          }
        },
      );
    }

    // STEP 3: Create an individual Promise for each user.

    return new Promise((resolve, reject) => {
      // Track this caller separately.
      const user = {};

      entry.users.add(user);

      let settled = false;

      // Common cleanup when this caller finishes.
      function finish(success, value) {
        if (settled) return;

        settled = true;

        // Caller no longer needs the shared request.
        entry.users.delete(user);

        // Remove listener to prevent memory leaks.
        callerSignal?.removeEventListener("abort", onAbort);

        if (success) {
          resolve(value);
        } else {
          reject(value);
        }
      }

      // STEP 4: Handle an individual user's cancellation.

      function onAbort() {
        // Reject ONLY this user's Promise.
        finish(false, new Error("User cancelled"));

        // If no callers remain, abort the shared API.
        if (entry.users.size === 0 && registry.get(key) === entry) {
          registry.delete(key);

          entry.controller.abort();
        }
      }

      // Listen for this user's abort signal.
      callerSignal?.addEventListener("abort", onAbort, { once: true });

      // Handle cancellation before listener setup.
      if (callerSignal?.aborted) {
        onAbort();
        return;
      }

      // STEP 5: Connect this user to the shared Promise.

      entry.sharedPromise.then(
        (result) => {
          finish(true, result);
        },
        (error) => {
          finish(false, error);
        },
      );
    });
  }

  return { request };
}

// ==================================================
// PART 3: TEST — ONE USER CANCELS
// ==================================================

async function main() {
  const coalescer = createRequestCoalescer(fetchFlights);

  const controllerA = new AbortController();
  const controllerB = new AbortController();
  const controllerC = new AbortController();

  // All three users request identical flight data.

  const p1 = coalescer.request("Mumbai-LA", controllerA.signal);

  const p2 = coalescer.request("Mumbai-LA", controllerB.signal);

  const p3 = coalescer.request("Mumbai-LA", controllerC.signal);

  // User A cancels after 1 second.
  setTimeout(() => {
    console.log("User A cancelled");
    controllerA.abort();
  }, 1000);

  // Wait for all individual caller Promises.
  const results = await Promise.allSettled([p1, p2, p3]);

  console.log("\nFIRST TEST RESULTS:");

  results.forEach((result, index) => {
    console.log(
      `User ${index + 1}:`,
      result.status === "fulfilled" ? result.value : result.reason.message,
    );
  });

  // ==================================================
  // PART 4: TEST — ALL USERS CANCEL
  // ==================================================

  console.log("\nSECOND TEST: All users cancel");

  const controllerD = new AbortController();
  const controllerE = new AbortController();

  const p4 = coalescer.request("Mumbai-Goa", controllerD.signal);

  const p5 = coalescer.request("Mumbai-Goa", controllerE.signal);

  // Both callers cancel before the API completes.
  setTimeout(() => {
    controllerD.abort();
    controllerE.abort();
  }, 500);

  const results2 = await Promise.allSettled([p4, p5]);

  console.log(
    results2.map((result) =>
      result.status === "rejected" ? result.reason.message : result.value,
    ),
  );
}

main().catch(console.error);

/*
==================================================
EXPECTED RESULTS
==================================================

FIRST TEST:

API CALLED: Mumbai-LA
User A cancelled

User 1: User cancelled
User 2: Flights found for Mumbai-LA
User 3: Flights found for Mumbai-LA

Only ONE API call was made for Mumbai-LA.


SECOND TEST:

API CALLED: Mumbai-Goa

User D cancels.
User E cancels.

Both individual Promises reject.

No users remain, so the shared AbortController
aborts the Mumbai-Goa API operation.


==================================================
WHAT WE ACHIEVED
==================================================

1. One shared API call per unique route.

2. Independent Promises for every caller.

3. Independent cancellation through callerSignal.

4. Shared cancellation through entry.controller.

5. If the final caller cancels, abort the API.

6. Remove completed or failed requests from Map.

7. Prevent old cleanup from deleting new requests.

8. Avoid unnecessary API calls for identical searches.

==================================================
*/
