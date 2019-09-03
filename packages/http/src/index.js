const mime = require('mime');

const { Reflection } = require('@geum/core');

const Router = require('./Router');

const map = require('./map/http');
const methods = require('./map/methods.json');

module.exports = () => {
  async function Server(incomingMessage, serverResponse) {
    await Server.emit('open', incomingMessage, serverResponse);

    const response = await Server.bootstrap(incomingMessage, serverResponse);

    map.dispatch(response);

    await Server.emit('close', incomingMessage, serverResponse);

    return response;
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

module.exports.Route = Router.RouteInterface;
module.exports.Request = Router.RequestInterface;
module.exports.Response = Router.ResponseInterface;

module.exports.map = map;
module.exports.methods = methods;
module.exports.mime = mime;
