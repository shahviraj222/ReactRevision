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

function test() {
  console.log(arguments);
}

const test = () => {
  console.log(arguments); // ❌ error
};
