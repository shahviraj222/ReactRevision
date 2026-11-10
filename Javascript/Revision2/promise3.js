// 2 Every aync function return the promise

// await help to resolve the promise

// https://chatgpt.com/share/6af33bc1-85a4-83e8-ab83-90d8b86df164

async function greet() {
  return 45;
}

async function main() {
  let a = greet();
  console.log(a);

  let b = await greet();
  console.log(b);
}

main();
