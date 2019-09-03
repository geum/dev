const { Reflection } = require('@geum/core');
const { Request, Router, Route } = require('@geum/http');

const Response = require('./router/Response');

const map = require('./map/socket');

module.exports = () => {
  async function Server(socket, next) {
    //inject the addons for the request and response
    const payload = await map.payload(
      Router,
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
      request.set('route', {
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
        request.set('post', packet.data[0]);
      }

      //set the response
      const data = JSON.parse(JSON.stringify(request.getRoute()));
      data.socket = socket;
      data.channel = 'self';
      response.set('route', data);

      const route = Server.route(data.event, request, response);

      await route.emit();

      //dispatch
      map.dispatch(request, response);
    };

    next();
  }

  //merge router methods
  const router = Router.load();
  const methods = Reflection.getMethods(router);

  Object.keys(methods).forEach(method => {
    Server[method] = router[method].bind(router);
  });

  Server.router = router;

  return Server;
};

module.exports.Router = Router;
module.exports.Route = Route;
module.exports.Request = Request;
module.exports.Response = Response;
module.exports.Map = map;
