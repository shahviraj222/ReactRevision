// Build a Task Scheduler
// You have 5 API requests to execute, but your server allows only 2 requests to run simultaneously.

// api function
function fetchData(name, delay) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`${name} completed`);
      resolve(name);
    }, delay);
  });
}

// task to perform
const tasks = [
  () => fetchData("User 1", 3000),
  () => fetchData("User 2", 1000),
  () => fetchData("User 3", 2000),
  () => fetchData("User 4", 1000),
  () => fetchData("User 5", 2000),
];

// runTask takes the array of task to perform and the allowed task concurrentt
async function runTasks(tasks, limit) {
  // Write your code here

  let results = new Array(tasks.length);
  let nextIndex = 0;

  async function statTask() {
    while (nextIndex < tasks.length) {
      const index = nextIndex;
      nextIndex += 1;
      try {
        let result = await tasks[index]();
        results[index] = result;
      } catch (error) {
        console.log("Task:", index, "fails");
        results[index] = {
          success: false,
          msg: error.message,
        };
      }
    }
  }

  // so the as you know all async are the promise so we need to wait for resolve
  // if we write await startTask() then the function not work as the concurrent it become one after other
  // for (let i = 0; i < limit; i++) {
  //   statTask();
  // }

  // solution

  let promises = [];

  for (let i = 0; i < limit; i++) {
    if (i > tasks.length) {
      break;
    }
    promises.push(statTask());
  }

  await Promise.all(promises);

  return results;
}

const results = await runTasks(tasks, 2);

console.log(results);
