// 1 what is the event emitter ?

// it is the same as we have in the browser event lisnner
// but eventlisnner not help to run the event that send by the coding, for that we use dispatch event
// emitter list the for all event sent by your code

// 2 how the emitter works

// .on() registered the callback.
// .emit() announced that the "message" event occurred.
// The EventEmitter found the callbacks registered for "message" and executed them
// we can trigger this event directly from our own code.

let registry = {};
let oncesfunc = {};

// registring function on the register
function on(name, callback) {
  if (name in registry) {
    registry[name].push(callback);
  } else {
    registry[name] = [callback];
  }
}

//emit funciton run the all listed callbacks
//all the callbacks
function emit(name, data) {
  let funcArr = registry[name];

  if (!funcArr) return; // No listeners? Exit safely.

  for (let i = 0; i < funcArr.length; i++) {
    funcArr[i](data);
  }
}

// off deleting the event
// we only has to delete the callback that is passed not all
function off(name, callback) {
  let funcArr = registry[name];
  if (funcArr.includes(callback)) {
    return;
  }
  registry[name] = registry[name].filter((a) => a != callback);
}

// this is doing nothing but simple thingsjust register the funciton only to run for one time then atuomatically we have to delte it also
// approach 1 : change the registry with flag and then change the emit funciton
// approach 2 : If you dont want to cbange then just do one thing wrap your funciton

function once(name, callback) {
  function warpper(data) {
    off(name, warpper);
    callback(data);
  }

  on(name, warpper);
}
