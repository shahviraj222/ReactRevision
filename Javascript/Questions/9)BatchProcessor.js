// Send the Api in Batch

// Q1 how tpo track the settimout wheather it is runned or not and if runned the how to reset the timer variable
// setTimeout() does not automatically set timer to null.
// we have to explicitly tell that you have to become null

function createBatcher(batchSize, maxWaitMs) {
  // Your implementation

  let currentCount = 0;
  let apis = [];
  let timer;
  //   async function delay(time) {
  //     // let timerChecker = false;   //not need here but if you then you can use
  //     return new Promise((resolve, reject) => {
  //       timer = setTimeout(() => {
  //         timerChecker = true;
  //         sendBatch(apis);
  //         apis = [];
  //         currentCount = 0;
  //       }, time);
  //     //   if (timerChecker) {
  //     //     timer = null;
  //     //   }
  //     });
  //   }

  function delay(time) {
    timer = setTimeout(() => {
      timer = null;
      sendBatch(apis);
      apis = [];
      currentCount = 0;
    }, timer);
  }

  return {
    add(event) {
      if (currentCount < batchSize) {
        apis.push(event);
        currentCount += 1;

        if (currentCount == batchSize) {
          clearTimeout(timer);
          timer = null;
          sendBatch(apis);
          apis = [];
          currentCount = 0;
        } else if (!timer) {
          delay(maxWaitMs);
        }
      } else {
        clearTimeout(timer);
        timer = null;
        sendBatch(apis);
        apis = [];
        currentCount = 0;
      }
    },
  };
}

const batcher = createBatcher(3, 2000);

batcher.add("A");
batcher.add("B");
batcher.add("C"); // Immediately sends [A, B, C]

batcher.add("D"); // Starts a 2-second timer
batcher.add("E"); // Still waiting

// After 2 seconds: sends [D, E]

async function sendBatch(events) {
  console.log("Sending:", events);
}
