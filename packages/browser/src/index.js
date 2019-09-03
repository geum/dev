const { Reflection } = require('@geum/core');

const Router = require('./Router');

const map = require('./map/client');
const methods = require('./map/methods.json');

module.exports = () => {
  //to be used like: history.listen(Client)
  async function Client(location, action) {
    await Client.emit('open', location, action);

    const response = await Client.bootstrap(location, action);

    map.dispatch(response);

    await Client.emit('close', location, action);

    return response;
  }

  //merge router methods
  const router = Router.load();
  const methods = Reflection.getMethods(router);

  Object.keys(methods).forEach(method => {
    Client[method] = router[method].bind(router);
  });

  Client.router = router;

  return Client;
};

module.exports.Router = Router;

module.exports.Route = Router.RouteInterface;
module.exports.Request = Router.RequestInterface;
module.exports.Response = Router.ResponseInterface;

module.exports.map = map;
module.exports.methods = methods;
