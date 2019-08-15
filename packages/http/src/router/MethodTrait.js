const methods = require('../map/methods');

module.exports = {};

const addMethod = (method) => {
  //make it lowercase
  method = method.toLowerCase();
  //bind the method to the instance
  module.exports[method] = function(path, ...callbacks) {
    if (Array.isArray(path)) {
      path
        .filter((value, index) => path.indexOf(value) === index)
        .forEach(path => {
          this.route(path)[method](...callbacks);
        });

      return this;
    }

    this.route(path)[method](...callbacks);
    return this;
  };
};

//add the verbs
methods.map(addMethod);
