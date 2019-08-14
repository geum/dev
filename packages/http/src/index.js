const { Definition } = require('@geum/core');

const Router = require('./Router');
const Route = require('./router/Route');
const Request = require('./router/Request');
const Response = require('./router/Response');

const map = require('./map/http');

module.exports = () => {
  async function Server(request, response) {
    await Server.emit('open', request, response);

    //make a payload
    const payload = await map.makePayload(request, response);
    const method = payload.request.getMethod();
    const path = payload.request.getPath('string');

    const route = Server.route(
      method + ' ' + path,
      payload.request,
      payload.response
    );

    await route.emit();

    map.dispatcher(payload.request, payload.response);

    await Server.emit('close', request, response);
  }

  //merge router methods
  const router = Router.load();
  const methods = Definition.getMethods(router);

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
