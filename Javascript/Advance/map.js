let a = [1, 23, 34, 45, 123, 12];
a = a.map(function (a) {
  if (a > 0) {
    console.log(a);
    return a + 1;
  }
}, a);

console.log(a);

a = [1, 23, 34, 45, 123, 12];
