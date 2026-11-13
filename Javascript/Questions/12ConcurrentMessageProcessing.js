// Concurrent Message Processing

// Imagine your WhatsApp AI bot receives messages continuously.

// Your requirements:
// 1. New messages can arrive at any time.
// 2. Only limit messages can be processed simultaneously.
// 3. Extra messages must wait in a FIFO queue.
// 4. When one processing operation finishes, the next waiting message starts.
// 5. The system remains ready for future messages, even when the queue becomes empty.

function createAsyncQueue() {
  let msg = [];
  let waiting = [];

  return {
    push(item) {
      msg.push(item);

      if (waiting.length > 0) {
        let ref = waiting.shift();
        ref(msg.shift());
      }
    },

    next() {
      if (msg.length > 0) {
        return Promise.resolve(msg.shift());
      } else {
        return new Promise((resolve) => {
          waiting.push(resolve);
        });
      }
    },
  };
}

function createMessageProcessor(limit, processMessage) {
  const queue = createAsyncQueue();

  // This is your old statTask(), modified.
  async function statTask() {
    while (true) {
      // Instead of msg[index], wait for a live message.
      const message = await queue.next();

      try {
        await processMessage(message);
      } catch (error) {
        console.log("Message failed:", error.message);
      }
    }
  }

  // This is your old worker-pool logic.
  for (let i = 0; i < limit; i++) {
    statTask();
  }

  // Allow new messages to enter at any time.
  return {
    push(message) {
      queue.push(message);
    },
  };
}

// Simulate processing an AI message.
function processAIMessage(message) {
  return new Promise((resolve) => {
    console.log("Started:", message);

    setTimeout(() => {
      console.log("Completed:", message);
      resolve(message);
    }, 3000);
  });
}

const processor = createMessageProcessor(2, processAIMessage);

processor.push("A");
processor.push("B");
processor.push("C");

// A new message arrives 5 seconds later.
setTimeout(() => {
  processor.push("D");
}, 5000);
