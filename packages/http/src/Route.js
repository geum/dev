const { Definition } = require('@geum/core');

const RouteInterface = require('./contracts/RouteInterface');
const RouterInterface = require('./contracts/RouterInterface');
const MethodTrait = require('./route/MethodTrait');
const HttpException = require('./HttpException');

class Route {
  /**
   * Sets up the route with http verb methods
   *
   * @param {RouterInterface} router
   * @param {String} path
   */
  constructor(router, path) {
    if (!Definition(router).instanceOf(RouterInterface)) {
      throw HttpException.forInvalidArgument(0, RouterInterface, router);
    }

    this.path = path;
    this.router = router;
  }

  /**
   * Route Loader
   *
   * @param {RouterInterface} router
   * @param {String} path
   *
   * @return {Route}
   */
  load(router, path) {
    return new Route(router, path);
  }

  /**
   * Adds routing middleware
   *
   * @param {String} method The request method
   * @param {Function} callback The middleware handler
   * @param {Integer} [priority = 0] if true will be prepended in order
   *
   * @return {Route}
   */
  method(method, callback, priority = 0) {
    //if callback is an array
    if (callback instanceof Array) {
      //expand and recall
      callback.forEach(callback => {
        this.method(method, callback, priority);
      })

      return;
    }

    //route it
    method = method.toUpperCase();

    if (method === 'ALL') {
      method = '[a-zA-Z0-9]+';
    }

    const keys = this.path.match(/(\:[a-zA-Z0-9\-_]+)|(\*\*)|(\*)/g) || [];

    //replace the :variable-_name01
    let regex = this.path.replace(/(\:[a-zA-Z0-9\-_]+)/g, '*');
    //replace the stars
    //* -> ([^/]+)
    regex = regex.replace(/\*/g, '([^/]+)');
    //** -> ([^/]+)([^/]+) -> (.*)
    regex = regex.replace(/\(\[\^\/\]\+\)\(\[\^\/\]\+\)/g, '(.*)');

    //now form the event pattern
    const event = '/^' + method + "\\s" + regex + '/*$/i';

    this.router.on(event, (request, ...args) => {
      const route = this.router.meta;
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
        variables,
        parameters
      });

      return callback(request, ...args);
    }, priority);

    return this;
  }
}

//definition check
Definition(Route).uses(MethodTrait).implements(RouteInterface);

//adapter
module.exports = Route;
