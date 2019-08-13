const Definition = require('../Definition');
const RequestInterface = require('../contracts/RequestInterface');
const ResponseInterface = require('../contracts/ResponseInterface');
const RouterInterface = require('../contracts/RouterInterface');

const Request = require('./Request');
const Response = require('./Response');

const EventEmitter = require('../EventEmitter');
const Exception = require('../Exception');
const Registry = require('../Registry');
const Router = require('../Router');

class Route extends Registry {
  /**
   * Route Loader
   *
   * @param {RouterInterface} router
   * @param {String} event
   *
   * @return {Route}
   */
  static load(router, event) {
    if (!Definition(router).instanceOf(RouterInterface)) {
      throw Exception.forInvalidArgument(0, RouterInterface, router);
    }

    return new Route({ router, event });
  }

  /**
   * Sets route arguments
   *
   * @param {Array} args
   *
   * @return {Route}
   */
  setArgs(args) {
    if (!(args instanceof Array)) {
      throw Exception.forInvalidArgument(0, Array, args);
    }

    return this.set('args', args);
  }

  /**
   * Sets route parameters
   *
   * @param {Object} parameters
   *
   * @return {Route}
   */
  setParameters(parameters) {
    if (typeof parameters !== 'object') {
      throw Exception.forInvalidArgument(0, Object, args);
    }

    return this.set('parameters', parameters);
  }

  /**
   * Sets the request
   *
   * @param {RequestInterface} request
   *
   * @return {Route}
   */
  setRequest(request) {
    if (!Definition(request).instanceOf(RequestInterface)) {
      throw Exception.forInvalidArgument(0, RequestInterface, request);
    }

    return this.set('request', request);
  }

  /**
   * Sets resonse
   *
   * @param {ResponseInterface} response
   *
   * @return {Route}
   */
  setResponse(response) {
    if (!Definition(response).instanceOf(ResponseInterface)) {
      throw Exception.forInvalidArgument(0, ResponseInterface, response);
    }

    return this.set('response', response);
  }

  /**
   * Runs the route
   *
   * @return {Response}
   */
  async emit() {
    const router = this.get('router');

    const request = this.get('request') || new Route.Request();
    const response = this.get('response') || new Route.Response();

    const event = this.get('event');
    const args = this.get('args') || [];
    const parameters = this.get('parameters') || {};

    request
      .setStage(parameters)
      .setRoute({ event, args, parameters });

    //try to trigger request pre-processors
    if (!await prepare(router, request, response)) {
      //if the request exits, then stop
      return this;
    }

    // from here we can assume that it is okay to
    // continue with processing the routes
    if (!await process(router, request, response)) {
      //if the request exits, then stop
      return this;
    }

    //last call before dispatch
    if (!await dispatch(router, request, response)) {
      //if the dispatch exits, then stop
      return this;
    }

    //anything else?

    return response;
  }
}

/**
 * Runs the 'response' event and interprets
 *
 * @param {RouterInterface} router
 * @param {RequestInterface} request
 * @param {ResponseInterface} response
 *
 * @return {Boolean} whether its okay to continue
 */
async function dispatch(router, request, response) {
  let status = EventEmitter.STATUS_OK, error = null;

  try {
    //emit a response event
    status = await router.emit('response', request, response);
  } catch(error) {
    //if there is an error
    response.setStatus(500, Router.STATUS_500);
    status = await router.emit('error', error, request, response);
  }

  //if the status was incomplete (308)
  return status !== EventEmitter.STATUS_INCOMPLETE;
}

/**
 * Runs 'request' event and interprets
 *
 * @param {RouterInterface} router
 * @param {RequestInterface} request
 * @param {ResponseInterface} response
 *
 * @return {Boolean} whether its okay to continue
 */
async function prepare(router, request, response) {
  let status = EventEmitter.STATUS_OK, error = null;

  try {
    //emit a request event
    status = await router.emit('request', request, response);
  } catch(error) {
    //if there is an error
    response.setStatus(500, Router.STATUS_500);
    status = await router.emit('error', error, request, response);
  }

  //if the status was incomplete (308)
  return status !== EventEmitter.STATUS_INCOMPLETE;
}

/**
 * Runs the route event and interprets
 *
 * @param {RouterInterface} router
 * @param {RequestInterface} request
 * @param {ResponseInterface} response
 *
 * @return {Boolean} whether its okay to continue
 */
async function process(router, request, response) {
  let status = EventEmitter.STATUS_OK, error = null;

  //build the event name
  const event = request.getRoute('event');

  //try to trigger the routes with the request and response
  try {
    status = await router.emit(event, request, response);
  } catch(error) {
    //if there is an error
    response.setStatus(500, Router.STATUS_500);
    status = await router.emit('error', error, request, response);
  }

  //if the status was incomplete (308)
  if (status === EventEmitter.STATUS_INCOMPLETE) {
    //the callback that set that should have already processed
    //the request and is signaling to no longer conitnue
    return false;
  }

  //check for content
  //check for redirect
  if (!response.hasContent() && !response.hasJson()) {
    response.setStatus(404, Router.STATUS_404);
    error = new Exception(Router.STATUS_404, 404);
    status = await router.emit('error', error, request, response);
  }

  //if the status was incomplete (308)
  return status !== EventEmitter.STATUS_INCOMPLETE;
}

Route.Request = Request;
Route.Response = Response;

module.exports = Route;
