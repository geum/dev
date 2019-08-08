const methods = require('../methods');

module.exports = {};

const addMethod = (method) => {
  //make it lowercase
  method = method.toLowerCase();
  //bind the method to the instance
  module.exports[method] = function(...callbacks) {
    //loop through callbacks
    callbacks.forEach((callback, index) => {
      //if a callback is not a function
      if (typeof callback !== 'function') {
        return;
      }

      //determine the priority
      let priority = 0;
      if (typeof callbacks[index + 1] === 'number') {
        priority = callbacks[index + 1];
      }

      this.method(method, callback, priority);
    });
  };
};

//add the verbs
methods.map(addMethod);
