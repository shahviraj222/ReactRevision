// Imagine you're building an AI API.
// You want to prevent users from sending too many requests.
// Rule: Each user can make a maximum of 3 API requests within any 10-second window.

// how to serach in the object for some name

// 1 Object.hasown(object varible, key to search)
// 2 key in object varible

function createRateLimiter(maxRequests, windowMs) {
  // Your code
  let userslotRegistry = {};

  function updateUserAvailbleSlot(user, operation) {
    if (operation == "+") {
      userslotRegistry[user] = userslotRegistry[user] + 1;
    } else if (operation == "-") {
      userslotRegistry[user] = userslotRegistry[user] - 1;
    }
  }

  function releaseSlot(user, windowMs) {
    // settimeout just registring the callback in reference to register (not the copy all variable and then give this is bag used from here so the varible is live trackable)
    setTimeout(() => {
      let availableSlots = userslotRegistry[user];
      if (availableSlots < maxRequests) {
        updateUserAvailbleSlot(user, "+");
      }
    }, windowMs);
  }
  return function runRequest(user) {
    // already in the registry means second call
    if (Object.hasOwn(userslotRegistry, user)) {
      let availableSlots = userslotRegistry[user];
      if (availableSlots > 0) {
        updateUserAvailbleSlot(user, "-");
        // run the request because it is api but in this example request is simple text

        releaseSlot(user, windowMs);
        return true;
      } else {
        return false;
      }
    }

    // First Time User
    else {
      userslotRegistry[user] = maxRequests;
      updateUserAvailbleSlot(user, "-");
      // run the request because it is api but in this example request is simple text
      releaseSlot(user, windowMs);
      return true;
    }
  };
}

const allowRequest = createRateLimiter(3, 10000);

console.log(allowRequest("user101")); // true
console.log(allowRequest("user101")); // true
console.log(allowRequest("user101")); // true
console.log(allowRequest("user101")); // false

console.log(allowRequest("user202")); // true
