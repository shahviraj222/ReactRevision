// Imagine you're building an AI agent that calls an external API.
// Sometimes the API fails because of a temporary network problem.
// Instead of immediately giving up, we want to retry the API request automatically.

// when you are retruning the promise by creating new Promise then ask your self do oyu need the fucntion to be async???
// whne you sai the Promise is it a constructor you are calling from the class so new keyword is needed

let attempt = 0;

function waitDelay(delay) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, delay);
  });
}

async function retry(fn, maxAttempts, delay) {
  // Write your code

  let attempts = 0;
  let err;

  while (attempts < maxAttempts) {
    attempts += 1;
    try {
      let result = await fn();
      return result;
    } catch (error) {
      err = new Error(error);
    }
    if (attempts + 1 < maxAttempts) {
      await waitDelay(delay);
    }
  }

  throw err;
}

async function unstableAPI() {
  attempt++;

  if (attempt < 3) {
    throw new Error("Network error");
  }

  return "API Success";
}

const result = await retry(unstableAPI, 3, 1000);

console.log(result);
