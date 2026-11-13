// Imagine you're building a WhatsApp bot that processes incoming messages.

// Messages can arrive at any time:
// 10:00:00 → "Hello"
// 10:00:02 → "How are you?"
// 10:00:05 → "Help me"

// Our application needs to process these messages one by one, in the order they arrive (FIFO).

// start thinking first in normal
// we have to run the p.next for evry time because msg can arrive at any time and we want to recive it live

function createAsyncQueue() {
  // Your logic goes here
  let msg = [];
  let waiting = [];

  return {
    push(item) {
      msg.push(item);
      if (waiting.length > 0) {
        let ref = waiting.shift();
        ref(msg.shift());
      }
      // Store or deliver the message
    },

    next() {
      // if the msg array is not empty then we can retunr the msg directly      --- we are assume alway the queue is never empty
      if (msg.length > 0) {
        return new Promise((resolve) => {
          resolve(msg.shift());
        });
      }

      // but if msg is empty
      else {
        return new Promise((resolve) => {
          waiting.push(resolve);
        });
      }
    },
  };
}

const queue = createAsyncQueue();

//  start making the bots                    -- always listen to the msgs

async function startbot() {
  while (true) {
    let p1 = await queue.next();
    console.log(p1);
  }
}

let p2 = startbot();
queue.push("A");
queue.push("B");
queue.push("C");

// noraml behaviour
// queue.push("A");
// queue.push("B");

// console.log(await queue.next()); // A
// console.log(await queue.next()); // B

// abnormal behaciour
// let p1 = queue.next();
// queue.push("Hello");
// console.log(await p1);
