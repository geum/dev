const { Definition, Router: CoreRouter } = require('@geum/core');

const MethodTrait = require('./router/MethodTrait');

const Route = require('./router/Route');
const Request = require('./router/Request');
const Response = require('./router/Response');

class Router extends CoreRouter {
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
    const route = new Router.Route(this, event);

    //if its not a request
    if (!(request instanceof Request)) {
      //if it's an array
      if (request instanceof Array) {
        route.args = request;
      } else if (typeof request === 'object' && request !== null) {
        route.parameters = Object.assign({}, request);
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
    route.request = request
    route.response = response;

    return route;
  }
}

Router.Route = Route;
Router.Request = Request;
Router.Response = Response;

Definition(Router).uses(MethodTrait);

module.exports = Router;
