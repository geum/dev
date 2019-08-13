const EventEmitter = require('./EventEmitter');

const Route = require('./router/Route');
const Request = require('./router/Request');
const Response = require('./router/Response');

class Router extends EventEmitter {
  /**
   * Static loader
   *
   * @return {Router}
   */
  static load() {
    return new Router();
  }

  /**
   * Returns a route
   *
   * @param {String} event
   * @param {Request} [request = null]
   * @param {Response} [response = null]
   *
   * @return {Route}
   */
  route(event, request = null, response = null) {
    const route = new Router.Route({router: this, event});

    //if its not a request
    if (!(request instanceof Request)) {
      //if it's an array
      if (request instanceof Array) {
        route.setArgs(request);
      } else if (typeof request === 'object' && request !== null) {
        route.setParameters(Object.assign({}, request));
      }

      //make a request
      request = new Router.Request();
    }

    //if its not a response
    if (!(response instanceof Response)) {
      //make a response
      response = new Router.Response();
    }

    //set the request and response
    route.setRequest(request).setResponse(response);

    return route;
  }

  /**
   * Shortcut for middleware
   *
   * @param {Function} [callback]
   * @param {Integer} [priority = 1]
   *
   * @return {Framework}
   */
  use(callback, priority = 0) {
    if (typeof priority === 'function' || arguments.length > 2) {
      Array.from(arguments).forEach((callback, index) => {
        if (callback instanceof Array) {
          this.use(...callback);
          return;
        }

        //determine the priority
        if (typeof arguments[index + 1] === 'number') {
          priority = arguments[index + 1];
        }

        this.use(callback, priority);
      });

      return this;
    }

    if (typeof priority !== 'number') {
      priority = 0;
    }

    //if the callback is an EventEmitter
    if (callback instanceof EventEmitter) {
      Object.keys(callback.listeners).forEach(event => {
        this.on(event, (...args) => {
          callback.emit(event, ...args);
        }, priority);
      });

      return this;
    }

    //if a callback is not a function
    if (typeof callback === 'function') {
      this.on('request', callback, priority);
    }

    return this;
  }

  /**
   * Runs an event like a method
   *
   * @param {String} event
   * @param {Request} [request = null]
   * @param {Response} [response = null]
   *
   * @return {*}
   */
  async request(event, request = null, response = null) {
    //make the route
    const route = this.route(event, request, response);

    //run the route
    response = await route.emit();

    //if theres an error
    if (response.hasError()) {
        return false;
    }

    return response.getResults();
  }
}

Router.Route = Route;
Router.Request = Request;
Router.Response = Response;


module.exports = Router;
