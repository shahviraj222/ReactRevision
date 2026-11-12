// Least Recently Used Cache

// Imagine your AI application caches responses to avoid making repeated expensive API calls.
// But memory is limited. Your cache can hold only 3 items.
// When a fourth item arrives, you must remove the least recently used (LRU) item.

// how to handle the array of object and we want to find weather the object has our key?

const users = [
  { name: "Viraj", age: 24 },
  { name: "Rahul", city: "Mumbai" },
  { name: "Amit", age: 26 },
];

// some
const exists = users.some((user) => "city" in user);
console.log(exists); // true

//find index
const index = users.findIndex((user) => "city" in user);
console.log(index); // 1

//javascript concept if we have the key as vaible so dont write {key:value} if you then object created as key:100\
// so always write {[key]:value} now your object is {"A":100}

objArray.push({ [key]: value });

// LRU Cache Start Here
function createLRUCache(capacity) {
  // Your code

  let objArray = [{ A: 100 }];

  // Reorder the Array
  function reoderArray(key) {
    // make the rightshift fucntion using your dsa knowledge and shift the array till the left side of the array till index
    // and as the first index is empty so copy that index value to the 0th index
  }

  return {
    get(key) {
      // Return value, or -1 if missing
      let index = objArray.findIndex((user) => key in user);
      if (index == -1) {
        return -1;
      }
      let value = objArray[index][key];
      reoderArray(key);
      return value;
    },

    // two edge cases possible
    // 1  user want to update the value basically calling api with different data
    // 2 capacity is full so delte the leasst used api call result

    put(key, value) {
      // check weather the key is exist in the registry or not
      let keyfind = objArray.findIndex((user) => key in user);
      if (!(keyfind == -1)) {
        objArray[keyfind][key] = value;
        reoderArray(key);
        return;
      }
      // Add or update an entry
      if (objArray.length < capacity) {
        objArray.push({ [key]: value });
        reoderArray(key);
        return true;
      }

      // Evict least recently used if full
      else {
        object = objArray.pop();
        objArray.push({ [key]: value });
        reoderArray();
        return Object.keys(object);
      }
    },
  };
}

const cache = createLRUCache(3);

cache.put("A", 100);
cache.put("B", 200);
cache.put("C", 300);

cache.get("A"); // 100

cache.put("D", 400); // Evicts B
