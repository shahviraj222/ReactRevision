// 1 reverser a string

let str = "viraj";

let reversed = str.split("").reverse().join("");

console.log(reversed); // "jariv"

// 2 reverse array
let a = [23, 123, 123, 12, 2312, 12];

console.log(a.reverse());

// 3 falt array
let arr = [1, [2, 3], 4];

let result = arr.flat();

console.log(result); // [1,2,3,4]

// 4 function inside object
let person = {
  name: "Viraj",
  age: 22,
  greet: function () {
    console.log("Hello");
  },
};

console.log(person.greet());

//5 destructuring of array

let [a1, b1, c1, d1, e1] = [1, 2, 23, 3, 34];
console.log(a1);
console.log(b1);
console.log(e1);

// 6 destructring of objects
let em = {
  name: "viraj",
  age: 23,
  gender: "male",
};
let { name, age, gender } = em;

console.log(name, age, gender);
