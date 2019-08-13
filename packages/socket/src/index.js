const { Request, Router } = require('@geum/http');
//const Router = require('./Router');
const Response = require('./router/Response');

const map = require('./map/socket');

module.exports = () => {
  async function SocketServer(socket, next) {
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
        args: [],
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
      const data = JSON.parse(JSON.stringify(request.getRoute()));
      data.socket = socket;
      data.channel = 'self';
      response.setRoute(data);

      const route = SocketServer.route(data.event, request, response);

      await route.emit();

      //dispatch
      map.dispatcher(request, response);
    };

    next();
  }

  //merge router methods
  const router = Router.load();

  mixin(SocketServer, router);

  return SocketServer;
};

module.exports.Router = Router;

function mixin(destination, source) {
    let invalid = [
      'constructor',
      '__defineGetter__',
      '__defineSetter__',
      'hasOwnProperty',
      '__lookupGetter__',
      '__lookupSetter__',
      'isPrototypeOf',
      'propertyIsEnumerable',
      'toString',
      'valueOf',
      'toLocaleString'
    ]

    function methods(prototype) {
      if (!prototype) {
        return;
      }

      Object.getOwnPropertyNames(prototype).forEach(property => {
        if(invalid.indexOf(property) !== -1) {
          return;
        }

        if (prototype[property] instanceof Function) {
          destination[property] = source[property].bind(source);
        }
      });

      methods(Object.getPrototypeOf(prototype));
    }

    methods(source);
}
