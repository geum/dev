const EventEmitter = require('./EventEmitter');

const Request = require('./Request');
const Response = require('./Response');

class Router extends EventEmitter {
  /**
   * @const STATUS_404
   */
  static get STATUS_404() {
    return '404 Not Found';
  }

  /**
   * @const STATUS_500
   */
  static get STATUS_500() {
    return '500 Server Error';
  }

  /**
   * Static loader
   *
   * @return {Framework}
   */
  static load() {
    return new Router();
  }

  /**
   * Shortcut for middleware
   *
   * @param {Function} [...callbacks]
   *
   * @return {Framework}
   */
  use(...callbacks) {
    callbacks.forEach((callback, index) => {
      if (callback instanceof Array) {
        this.use(...callback);
        return;
      }

      //determine the priority
      let priority = 1;
      if (typeof callbacks[index + 1] === 'number') {
        priority = callbacks[index + 1];
      }

      //if the callback is an EventEmitter
      if (callback instanceof EventEmitter) {
        Object.keys(callback.listeners).forEach(event => {
          this.on(event, (...args) => {
            callback.emit(event, ...args);
          }, priority);
        });

        return;
      }

      //if a callback is not a function
      if (typeof callback !== 'function') {
        return;
      }

      this.on('request', callback, priority);
    })

    return this;
  }

  /**
   * Runs the 'response' event and interprets
   *
   * @param {RequestInterface} request
   * @param {ResponseInterface} response
   *
   * @return {Boolean} whether its okay to continue
   */
  async dispatch(request, response) {
    let status = EventEmitter.STATUS_OK, error = null;

    try {
      //emit a response event
      status = await this.emit('response', request, response);
    } catch(error) {
      //if there is an error
      response.setStatus(500, Router.STATUS_500);
      status = await this.emit('error', error, request, response);
    }

    //if the status was incomplete (308)
    return status !== EventEmitter.STATUS_INCOMPLETE;
  }

  /**
   * Runs 'request' event and interprets
   *
   * @param {RequestInterface} request
   * @param {ResponseInterface} response
   *
   * @return {Boolean} whether its okay to continue
   */
  async prepare(request, response) {
    let status = EventEmitter.STATUS_OK, error = null;

    try {
      //emit a request event
      status = await this.emit('request', request, response);
    } catch(error) {
      //if there is an error
      response.setStatus(500, Router.STATUS_500);
      status = await this.emit('error', error, request, response);
    }

    //if the status was incomplete (308)
    return status !== EventEmitter.STATUS_INCOMPLETE;
  }

  /**
   * Runs the route event and interprets
   *
   * @param {RequestInterface} request
   * @param {ResponseInterface} response
   *
   * @return {Boolean} whether its okay to continue
   */
  async process(request, response) {
    let status = EventEmitter.STATUS_OK, error = null;

    //build the event name
    const event = request.getRoute('event');

    //try to trigger the routes with the request and response
    try {
      status = await this.emit(event, request, response);
    } catch(error) {
      //if there is an error
      response.setStatus(500, Router.STATUS_500);
      status = await this.emit('error', error, request, response);
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
      error = new HttpException(Router.STATUS_404, 404);
      status = await this.emit('error', error, request, response);
    }

    //if the status was incomplete (308)
    return status !== EventEmitter.STATUS_INCOMPLETE;
  }

  /**
   * Processor to add to the process stack
   *
   * @param {RequestInterface} request
   * @param {ResponseInterface} response
   *
   * @return {Application}
   */
  async route(route, dispatch = null) {
    //route - { event, variables, parameters, request, response }
    route = Object.assign({}, route);

    let request = null, response = null;

    if (route.request instanceof Request) {
      request = route.request;
      delete route.request;
    } else {
      request = Request.load();
    }

    if (route.response instanceof Response) {
      response = route.response;
      delete route.response;
    } else {
      response = Response.load();
    }

    request.setStage(route.parameters);
    request.setRoute(route);

    //try to trigger request pre-processors
    if (!await this.prepare(request, response)) {
      //if the request exits, then stop
      return this;
    }

    // from here we can assume that it is okay to
    // continue with processing the routes
    if (!await this.process(request, response)) {
      //if the request exits, then stop
      return this;
    }

    //last call before dispatch
    if (!await this.dispatch(request, response)) {
      //if the dispatch exits, then stop
      return this;
    }

    if (typeof dispatch === 'function') {
      dispatch(request, response);
    }

    return this;
  }
}

module.exports = Router;
