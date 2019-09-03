const Reflection = require('./Reflection');
const Exception = require('./Exception');

const EventEmitter = require('./EventEmitter');

const Route = require('./router/Route');
const Request = require('./router/Request');
const Response = require('./router/Response');

/**
 * A router parses a request and determines
 * where and what to route to matching callbacks
 */
class Router extends EventEmitter {
  /**
   * Used to determine what registration method name to look for when `use()`
   *
   * @const {String} USE_METHOD
   */
  get USE_METHOD() {
    return 'core';
  }

  /**
   * Used to determine what registration event name to listen to when `use()`
   *
   * @const {String} USE_EVENT
   */
  get USE_EVENT() {
    return 'request';
  }

  /**
   * Static loader
   *
   * @return {Router}
   */
  static load() {
    return new Router();
  }

  /**
   * Sets the default state of listeners
   */
  constructor() {
    super();

    this.RouteInterface = Router.RouteInterface;
    this.RequestInterface = Router.RequestInterface;
    this.ResponseInterface = Router.ResponseInterface;
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
    const route = new this.RouteInterface(this, event);

    //if its not a request
    if (!Reflection(request).instanceOf(Request)) {
      //if it's an array
      if (Array.isArray(request)) {
        route.args = request;
      } else if (typeof request === 'object' && request !== null) {
        route.parameters = Object.assign({}, request);
      }

      //make a request
      request = new this.RequestInterface();
    }

    //if its not a response
    if (!Reflection(response).instanceOf(Response)) {
      //make a response
      response = new this.ResponseInterface();
    }

    //set the request and response
    route.request = request;
    route.response = response;

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
    //if priority is not a number ie. EventEmitter, Router, etc.
    //or there are more than 2 arguments...
    if (typeof priority !== 'number' || arguments.length > 2) {
      //set the priority to 0
      priority = 0;

      //loop through each argument as callback
      Array.from(arguments).forEach((callback, index) => {
        //if the callback is an array
        if (Array.isArray(callback)) {
          //recall use()
          this.use(...callback);
          return;
        }

        //determine the priority
        if (typeof arguments[index + 1] === 'number') {
          priority = arguments[index + 1];
        }

        //recall use() in a singular way
        this.use(callback, priority);
      });

      return this;
    }

    //make sure priority is a number
    if (typeof priority !== 'number') {
      priority = 0;
    }

    //if there is explicitly a registration function
    if (typeof callback[this.USE_METHOD] === 'function') {
      callback[this.USE_METHOD](this, priority);
      return this;
    }

    //if the callback is an EventEmitter
    if (Reflection(callback).instanceOf(EventEmitter)) {
      Object.keys(callback.listeners).forEach(event => {
        this.on(event, async(...args) => {
          await callback.emit(event, ...args);
        }, priority);
      });

      return this;
    }

    //if a callback is not a function
    if (typeof callback !== 'function') {
      return this;
    }

    //it's a function,
    const length = Reflection.getArgumentNames(callback).length;

    //if req, res, next (legacy)
    if (length === 3) {
      const original = callback;
      callback = (req, res) => {
        //transform to async function
        return new Promise(resolve => {
          original(req, res, function(error = null) {
            if (error) {
              throw Exception.for(error);
            }

            resolve();
          });
        });
      };
    }

    this.on(this.USE_EVENT, callback, priority);

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

//allows interfaces to be manually changed
Router.RouteInterface = Route;
Router.RequestInterface = Request;
Router.ResponseInterface = Response;

//adapter
module.exports = Router;
