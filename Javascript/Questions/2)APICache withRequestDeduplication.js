// 2)APICache withRequestDeduplication
// Currently, your application makes three separate API calls to fetch the same information.
// We want to build a function that recognizes when an identical request is already running and shares its Promise instead of starting another request.

function fetchUser(id) {
  console.log("API request started:", id);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id, name: "Viraj" });
    }, 3000);
  });
}

// Your challenge
let presolve = {};
let preid = [];
let solve;

async function getUser(id) {
  // Implement this
  if (preid.includes(id)) {
    return presolve[id]; //here the concept of the object assigning value we can write varible name dot (.)
  }

  try {
    solve = fetchUser(id);
    presolve[id] = solve;
    preid.push(id);
  } catch (error) {
    presolve.delete(id);
    preid.pop(id);
    throw error;
  }

  return presolve[id];
}

const p1 = getUser(101);
const p2 = getUser(101);
const p3 = getUser(101);

const results = await Promise.all([p1, p2, p3]);

console.log(results);

// still in the above solution one problem is reaming that is race condition
// what if we deleted the old promise if it fails but same time the newer one is running
