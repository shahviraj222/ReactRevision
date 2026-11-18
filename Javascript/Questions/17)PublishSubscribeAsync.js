// Pub/Sub Message Broker with Async Subscribers
// New concept: Event-driven architecture and asynchronous message broadcasting

// Let's move forward. Challenge 16 is complete, and Challenge 15 remains partially understood for later revision.
// 1. Real-world problem
// Imagine you're building an AI agent system like OpenClaw.

// Whenever an AI agent completes a task, several independent services need to know:
// - Notification service: Send a notification to the user.
// - Analytics service: Record the completed task.
// - Logging service: Store the event details.
// Instead of the AI agent calling all three services directly, it publishes an event.

function createMessageBroker() {
  const subscribers = new Map();

  function subscribe(topic, handler) {
    if (!subscribers.has(topic)) {
      subscribers.set(topic, []);
    }

    subscribers.get(topic).push(handler);
  }

  async function publish(topic, data) {
    const handlers = subscribers.get(topic) || [];

    const promises = handlers.map((fn) => {
      return Promise.resolve().then(() => fn(data));
    });

    return await Promise.allSettled(promises);
  }

  function unsubscribe(topic, handler) {
    if (!subscribers.has(topic)) {
      return;
    }

    const handlers = subscribers.get(topic);

    const updatedHandlers = handlers.filter((fn) => {
      return fn !== handler;
    });

    if (updatedHandlers.length === 0) {
      subscribers.delete(topic);
    } else {
      subscribers.set(topic, updatedHandlers);
    }
  }

  return {
    subscribe,
    publish,
    unsubscribe,
  };
}

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function notificationHandler(data) {
  await delay(2000);
  console.log("Notification sent:", data.taskId);
  return "Notification successful";
}

async function analyticsHandler(data) {
  await delay(1000);
  throw new Error("Analytics service failed");
}

async function loggingHandler(data) {
  await delay(3000);
  console.log("Log saved:", data.taskId);
  return "Logging successful";
}

async function main() {
  const broker = createMessageBroker();

  broker.subscribe("agent.completed", notificationHandler);
  broker.subscribe("agent.completed", analyticsHandler);
  broker.subscribe("agent.completed", loggingHandler);

  const results = await broker.publish("agent.completed", {
    taskId: 101,
    result: "AI task completed",
  });

  console.log("First publish results:", results);

  broker.unsubscribe("agent.completed", analyticsHandler);

  const results2 = await broker.publish("agent.completed", {
    taskId: 102,
    result: "Another AI task completed",
  });

  console.log("Second publish results:", results2);
}

main().catch(console.error);
