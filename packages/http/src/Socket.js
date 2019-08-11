const { EventEmitter } = require('@geum/core');

const Application = require('./Application');
const Request = require('./Request');
const Response = require('./Response');
const HttpException = require('./HttpException');

const map = require('./map/socket');

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

    //inject the addons for the request and response
    const payload = await map.makePayload(
      socket.client.request,
      socket.client.request.res
    );

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
      const request = Request.load(
        Object.assign({}, payload.request.get())
      );

      const response = Response.load(
        Object.assign({}, payload.response.get())
      );

      //set the request
      packet.session = socket.id;
      request.setRoute({
        event: args.shift(),
        variables: [],
        parameters: {},
        packet: packet
      })

      //if there's data
      if (packet.data && typeof packet.data[0] !== 'undefined') {
        request.set('route', 'parameters', packet.data[0]);
        //set stage and post
        request.setStage(packet.data[0]);
        request.setPost(packet.data[0]);
      }

      //set the response
      const route = JSON.parse(JSON.stringify(request.getRoute()));
      route.socket = socket;
      route.target = 'self';
      response.setRoute(route);

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
      map.dispatch(response);
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
    const event = request.getRoute('event');

    //try to trigger the routes with the request and response
    try {
      status = (await this.emit(event, request, response)).meta;
    } catch(error) {
      //if there is an error
      response.setStatus(500, Socket.STATUS_500);
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
    if (!response.hasContent() && !response.hasJson()) {
      response.setStatus(404, Socket.STATUS_404);
      error = new HttpException(Socket.STATUS_404, 404);
      status = (await this.emit('error', error, request, response)).meta;
    }

    //if the status was incomplete (308)
    return status !== EventEmitter.STATUS_INCOMPLETE;
  }
}

//adapter
module.exports = Socket;
