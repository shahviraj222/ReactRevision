// debounce function is used in search bar and others also

function debounce(func, delay) {
  let timer;
  return function (...arg) {
    clearTimeout(timer); // ❌ cancel previous timer
    timer = setTimeout(() => {
      func.apply(this, arg); // ✅ schedule new one
    }, delay);
  };
}

// debouncedFunction("h")
// debouncedFunction("he")
// debouncedFunction("hel")
// ...

// setTimeout
console.log("Start");

// this create a function call that wait for 2 second and then runs
setTimeout(() => {
  console.log("Hello after 2 seconds");
}, 2000);

console.log("End");

// output:
// start
// end
// Hello after 2 seconds

// debounce important in applications
