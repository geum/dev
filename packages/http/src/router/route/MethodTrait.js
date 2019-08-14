const methods = require('../../map/methods');

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

      const router = this.data.router;
      const path = this.data.event;

      route(router, method, path, callback, priority);
    });
  };
};

/**
 * Adds routing middleware
 *
 * @param {Router} router
 * @param {String} method The request method
 * @param {String} path
 * @param {Function} callback The middleware handler
 * @param {Integer} [priority = 0] if true will be prepended in order
 */
function route(router, method, path, callback, priority = 0) {
  //if callback is an array
  if (Array.isArray(callback)) {
    //expand and recall
    callback.forEach(callback => {
      route(router, method, callback, priority);
    })

    return;
  }

  //route it
  method = method.toUpperCase();

  if (method === 'ALL') {
    method = '[a-zA-Z0-9]+';
  }

  const keys = path.match(/(\:[a-zA-Z0-9\-_]+)|(\*\*)|(\*)/g) || [];

  //replace the :variable-_name01
  let regex = path.replace(/(\:[a-zA-Z0-9\-_]+)/g, '*');
  //replace the stars
  //* -> ([^/]+)
  regex = regex.replace(/\*/g, '([^/]+)');
  //** -> ([^/]+)([^/]+) -> (.*)
  regex = regex.replace(/\(\[\^\/\]\+\)\(\[\^\/\]\+\)/g, '(.*)');

  //now form the event pattern
  const event = '/^' + method + "\\s" + regex + '/*$/i';

  router.on(event, (request, ...args) => {
    const route = router.meta;
    const variables = [];
    const parameters = {};
    const name = route.event;

    //sanitize the variables
    route.variables.forEach((variable, i) => {
      //if it's a * variable
      if (typeof keys[i] === 'undefined' || keys[i].indexOf('*') === 0) {
        //it's a variable
        if (variable.indexOf('/') === -1) {
          variables.push(variable);
          return;
        }

        variables.concat(variable.split('/'));
        return;
      }

      //if it's a :parameter
      if (typeof keys[i] !== 'undefined') {
        parameters[keys[i].substr(1)] = variable;
      }
    });

    request.setStage(parameters).setRoute({
      event: name,
      args: variables,
      parameters
    });

    return callback(request, ...args);
  }, priority);
}

//add the verbs
methods.map(addMethod);
