// Api Timeout System

//Q1 A native Promise does not expose a .status property or a built-in method to synchronously check its state.
// Q2 A Promise cannot be cancelled directly. We can detect a timeout and reject a separate timeout Promise, but this does not stop the underlying operation. To cancel the actual operation, it must support cancellation, such as AbortController with fetch().

//Solution how to solve this ??
// Promise.race() will help us to do this

// always in promise your first parameter is alway success regardless of name in delay function          not for --- .then .catch

async function withTimeout(fn, timeoutMs) {
  // Your code

  async function delay(delay) {
    return new Promise((resolve, reject) => {
      // first parameter is alway success regardless of name
      setTimeout(() => {
        reject(new Error("API timeout"));
      }, delay);
    });
  }

  // wrong approach i took here
  //   let result = fn()
  //     .then((text) => {
  //       return text;
  //     })
  //     .catch((error) => {
  //       throw error;
  //     });

  let timeoutPromise = delay(timeoutMs);
  let apiPromise = fn();

  let result = Promise.race([timeoutPromise, apiPromise]);
  return result;
}

async function fetchData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("API Success");
    }, 3000);
  });
}

const result = await withTimeout(fetchData, 5000);

console.log(result); // "API Success"
