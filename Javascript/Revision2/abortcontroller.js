function runTool(signal) {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(new Error("Cancelled"));
      return;
    }

    const timer = setTimeout(() => {
      signal.removeEventListener("abort", onAbort);
      resolve("Tool completed");
    }, 5000);

    function onAbort() {
      clearTimeout(timer);
      reject(new Error("Cancelled"));
    }

    signal.addEventListener("abort", onAbort, {
      once: true,
    });
  });
}

const controller = new AbortController();

runTool(controller.signal)
  .then((result) => console.log(result))
  .catch((error) => console.log(error.message));

setTimeout(() => {
  controller.abort();
}, 2000);

// Also, addEventListener() doesn't continuously run a loop checking for cancellation. It registers the callback with the event system.

// removeEventListener() Remove the previously registered onAbort function from this signal., removing the event listener.

// our event can end by two way : user delete or the task is complted
// so to handle the user delteing thing we need the once:true meaning once it is aborted remove the listner
