// Debounce Function
// setTimeout() remembers the function that was passed when the timer was created If you changed then it will not work

// Step 1: A function inside another function (Trace what creasearch return and that is stored in the searched)

function createsearch(callback) {
  return function (text) {
    callback(text);
  };
}

let searched = createsearch((text) => {
  console.log("Hello", text);
});

searched("Viraj");

// Solving the debounce problem

// Q1) why we need the search = debounce((text)=>{},delay)??     why making complex

// concept of clouser
// Q2) Does the timer is static vaible declare once when debounce called (stored in heap)
// Q3) Timer is in debounce and delay is also in the debounce so here the bag theory is appleid right?s
// Q4) How we will know when to use the clouser or function inside fucntion (here you said that's why i know)

// still we have limitation we are only calling the api not storing the results
// one more thing is there that is settimeout return statement

const timer = setTimeout(() => {
  return 100;
}, 1000);

console.log(timer);

// setTimeout() immediately returns a timer ID (browser) or Timeout object (Node.js).
// The callback returns 100 after approximately one second, but that value is discarded.

// even if you want the settimout return somehting then the below is the method
function wait() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(100);
    }, 1000);
  });
}

const result = await wait();

console.log(result); // 100 after ~1 second

function debounce(callback, delay) {
  let timer;
  // Your code here
  return function (text) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      return callback(text);
    }, delay);
  };
}

const search = debounce((text) => {
  console.log("API Call:", text);
}, 500);

search("V");
search("Vi");
search("Vir");
search("Vira");
search("Viraj");
