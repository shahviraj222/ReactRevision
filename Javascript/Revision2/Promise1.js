// 1 normal promise
// once the promise is fullfilled ethier (success/ fail) it will never run again

promise1 = new Promise(function (resolve, reject) {
  setTimeout(() => {
    let event = false;
    if (!event) {
      console.log("Hello mr how are you ???");
      let a = { name: "viraj", age: "23" };
      resolve(a);
    } else {
      console.log("Error 404");
      reject("Error");
    }
  }, 1000);
});

let username = promise1
  .then((data) => {
    console.log(data);
    return data.name;
  })
  .catch(() => {
    console.log("Contact the Developer: 534543543");
  })
  .then((name) => {
    console.log(name);
  });

//Different ways of calling the promise
// Also the same promise return like this

promise
  .then((value) => {
    throw new Error("Problem inside then");
  })
  .catch((error) => {
    console.log("Caught:", error.message);
  });

// here .then run for both reject and resolve but see the call back fucntion they only run once accoriding to the results
promise.then(
  (value) => {
    throw new Error("Problem inside then");
  },
  (error) => {
    console.log("Caught:", error.message);
  },
);
