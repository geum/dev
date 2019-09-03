const { Reflection, Route: CoreRoute } = require('@geum/core');
const MethodTrait = require('./route/MethodTrait');

const Exception = require('../Exception');
const Router = require('../Router');

const Request = require('./Request');
const Response = require('./Response');

class Route extends CoreRoute {
  /**
   * Route Loader
   *
   * @param {RouterInterface} router
   * @param {String} event
   *
   * @return {Route}
   */
  static load(router, event) {
    return new Route(router, event);
  }

  /**
   * Sets router and event
   *
   * @param {RouterInterface} router
   * @param {String} event
   *
   * @return {Route}
   */
  constructor(router, event) {
    super(router, event);

    this.RequestInterface = Route.RequestInterface;
    this.ResponseInterface = Route.ResponseInterface;
  }
}

//allows interfaces to be manually changed
Route.RequestInterface = Request;
Route.ResponseInterface = Response;

//definition check
Reflection(Route).uses(MethodTrait);

//adapter
module.exports = Route;
