const methods = require('../methods');
module.exports = {};

const addMethod = (method) => {
  //make it lowercase
  method = method.toLowerCase();
  //bind the method to the instance
  module.exports[method] = function(path, ...callbacks) {
    this.route(path).method(method, ...callbacks);
  };
};

//add the verbs
methods.map(addMethod);
