person = {
  name: "viraj",
  calss: "9",
  greet: () => {
    console.log(this.name);
  },
};

person2 = {
  name: "viraj",
  calss: "9",
  greet: function () {
    console.log(this.name);
  },
};

person.greet();
person2.greet();

// arrrow funcitonexp2
// arrow funciton uses lexical this

name = "viraj";

person3 = {
  name: "viraj",
  calss: "9",
  greet: {
    add: () => {
      console.log(this.name);
    },
  },
};

person3.greet.add();

function test() {
  console.log(arguments);
}

const test2 = () => {
  console.log(arguments); // ❌ error
};
