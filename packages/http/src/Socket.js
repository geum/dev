const { EventEmitter } = require('@geum/core');

const Router = require('./Router');
const Application = require('./Application');
const HttpException = require('./HttpException');

const RequestGet = require('./request/RequestGet');
const RequestPost = require('./request/RequestPost');
const RequestServer = require('./request/RequestServer');
const RequestStage = require('./request/RequestStage');

const ResponseContent = require('./response/ResponseContent');
const ResponseRest = require('./response/ResponseRest');

class Socket extends Application {
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
    const server = new Socket();
    //process to be used in middleware like
    //app.use(server.process)
    server.process = server.process.bind(server);
    return server;
  }

  /**
   * Processor to add to the process stack
   *
   * @param {RequestInterface} request
   * @param {ResponseInterface} response
   *
   * @return {Application}
   */
  async processor(socket, next) {
    //if the processors before this doesnt want to continue it
    //would have returned false so theres no need to case for that

    //get the request and response from socket
    const req = socket.client.request;
    const res = socket.client.request.res;

    //inject the addons for the request and response
    req.get = await RequestGet.load(req);
    req.post = await RequestPost.load(req);
    req.server = await RequestServer.load(req);
    req.stage = await RequestStage.load(req);
    res.rest = await ResponseRest.load(res);
    res.content = await ResponseContent.load(res);

    //route socket to app events
    const onevent = socket.onevent;
    socket.onevent = async(packet) => {
      //arguments are the data
      const args = packet.data || [];
      //if there are args
      if (!args.length) {
        //business as usual
        return onevent.call(socket, packet);
      }

      //clone the request and response
      const request = Object.assign({}, req);
      const response = Object.assign({}, res);

      //set the request
      request.event = args.shift();
      request.packet = packet;
      packet.session = socket.id;

      //if there's data
      if (packet.data && typeof packet.data[0] !== 'undefined') {
        //set stage and post
        request.stage.set(packet.data[0]);
        request.post.set(packet.data[0]);
      }

      //set the response
      response.socket = socket;

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

      // SOCKET LEGEND:
      // response.socket.emit - send to self
      // response.socket.nsp.emit - send to all
      // response.socket.server.emit - send to all

      //if there's no content but theres rest
      if (response.content.empty() && !response.rest.empty()) {
        response.socket.nsp.emit(request.event, response.rest.get());
        //if we can stream
      } else if (response.content.streamable()) {
        //TODO: pipe it through
        //response.content.get().pipe(response);
      //else if theres content
      } else if (!response.content.empty()) {
        response.socket.nsp.emit(request.event, response.content.get());
      }
    };

    next();

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
    const event = request.event;

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
    if (response.content.empty() && response.rest.empty()) {
      error = new HttpException(Application.STATUS_404, 404);
      status = (await this.emit('error', error, request, response)).meta;
    }

    //if the status was incomplete (308)
    return status !== EventEmitter.STATUS_INCOMPLETE;
  }
}

//adapter
module.exports = Socket;
