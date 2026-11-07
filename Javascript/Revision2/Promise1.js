// normal promise

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
