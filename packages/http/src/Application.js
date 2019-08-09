const { EventEmitter } = require('@geum/core');

const Router = require('./Router');
const HttpException = require('./HttpException');

const RequestGet = require('./request/RequestGet');
const RequestPost = require('./request/RequestPost');
const RequestServer = require('./request/RequestServer');
const RequestStage = require('./request/RequestStage');

const ResponseContent = require('./response/ResponseContent');
const ResponseRest = require('./response/ResponseRest');

class Application extends Router {
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
    return '500 Application Error';
  }

  /**
   * Application loader
   *
   * @return {Application}
   */
  static load() {
    const server = new Application();
    //process to be used in middleware like
    //app.use(server.process)
    server.process = server.process.bind(server);
    return server;
  }

  /**
   * Adds the processor to the main process
   *
   * @param {Object} options
   */
  constructor() {
    super();
    //add the processor
    this.on('process', this.processor.bind(this));
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
      status = (await this.emit('response', request, response)).meta;
    } catch(error) {
      //if there is an error
      response.statusCode = 500;
      response.statusMessage = Application.STATUS_500;

      status = (await this.emit('error', error, request, response)).meta;
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
      status = (await this.emit('request', request, response)).meta;
    } catch(error) {
      //if there is an error
      response.statusCode = 500;
      response.statusMessage = Application.STATUS_500;

      status = (await this.emit('error', error, request, response)).meta;
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
  async processor(request, response) {
    //if the processors before this doesnt want to continue it
    //would have returned false so theres no need to case for that

    //inject the addons for the request and response
    request.get = await RequestGet.load(request);
    request.post = await RequestPost.load(request);
    request.server = await RequestServer.load(request);
    request.stage = await RequestStage.load(request);
    response.rest = await ResponseRest.load(response);
    response.content = await ResponseContent.load(response);

    //try to trigger request pre-processors
    if (!await this.prepare(request, response)) {
      //if the request exits, then stop
      return this;
    }

    // from here we can assume that it is okay to
    // continue with processing the routes
    if (!await this.respond(request, response)) {
      //if the request exits, then stop
      return this;
    }

    //last call before dispatch
    if (!await this.dispatch(request, response)) {
      //if the dispatch exits, then stop
      return this;
    }

    //dispatch

    //if there's no content but theres rest
    if (response.content.empty() && !response.rest.empty()) {
      //set the content to rest
      response.setHeader('Content-Type', 'text/json');
      response.content.set(response.rest.get());
    }

    //if no content type
    if (!response.getHeader('Content-Type')) {
      //make it html
      response.setHeader('Content-Type', 'text/html; charset=utf-8');
    }

    //if we can stream
    if (response.content.streamable()) {
      //pipe it through
      response.content.get().pipe(response);
    //else if theres content
    } else if (!response.content.empty()) {
      //manually write the content
      response.write(response.content.get());
      //and close the connection
      response.end();
    }

    return this;
  }

  /**
   * Runs the route event and interprets
   *
   * @param {RequestInterface} request
   * @param {ResponseInterface} response
   *
   * @return {Boolean} whether its okay to continue
   */
  async respond(request, response) {
    let status = EventEmitter.STATUS_OK, error = null;

    //build the event name
    const path = request.url.split('?')[0];
    const method = request.method;
    const event = method + ' ' + path;

    //try to trigger the routes with the request and response
    try {
      status = (await this.emit(event, request, response)).meta;
    } catch(error) {
      //if there is an error
      response.statusCode = 500;
      response.statusMessage = Application.STATUS_500;

      status = (await this.emit('error', error, request, response)).meta;
    }

    //if the status was incomplete (308)
    if (status === EventEmitter.STATUS_INCOMPLETE) {
      //the callback that set that should have already processed
      //the request and is signaling to no longer conitnue
      return false;
    }

    //check for content
    //check for redirect
    if (response.content.empty() && response.rest.empty() && !response.getHeader('Location')) {
      response.statusCode = 404;
      response.statusMessage = Application.STATUS_404;

      error = new HttpException(Application.STATUS_404, 404);
      status = (await this.emit('error', error, request, response)).meta;
    }

    //if the status was incomplete (308)
    return status !== EventEmitter.STATUS_INCOMPLETE;
  }
}

//adapter
module.exports = Application;
