const { Reflection, EventEmitter, Router: CoreRouter } = require('@geum/core');

const MethodTrait = require('./router/MethodTrait');

const Route = require('./router/Route');
const Request = require('./router/Request');
const Response = require('./router/Response');

const map = require('./map/client');

class Router extends CoreRouter {
  /**
   * Used to determine what registration method name to look for when `use()`
   *
   * @const {String} USE_METHOD
   */
  get USE_METHOD() {
    return 'browser';
  }

  /**
   * Used to determine what registration event name to listen to when `use()`
   *
   * @const {String} USE_EVENT
   */
  get USE_EVENT() {
    return 'open';
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
   * Runs the main routing without dispatching
   *
   * @param {Object} location
   * @param {String} [action = null]
   *
   * @return {Response}
   */
  async bootstrap(location, action = null) {
    //make a payload
    const payload = map.payload(this, window, location);

    const method = payload.request.getMethod();
    const path = payload.request.getPath('string');

    const route = this.route(
      method + ' ' + path,
      payload.request,
      payload.response
    );

    return await route.emit();
  }

  /**
   * Runs an event like a method
   *
   * @param {String} event
   * @param {Request} [request = null]
   * @param {Response} [response = null]
   *
   * @return {Integer}
   */
  async routeTo(method, path, request = null, response = null) {
    const event = method.toUpperCase() + ' ' + path;
    return await this.emit(event, request, response);
  }
}

//allows interfaces to be manually changed
Router.RouteInterface = Route;
Router.RequestInterface = Request;
Router.ResponseInterface = Response;

//definition check
Reflection(Router).uses(MethodTrait);

//adapter
module.exports = Router;
