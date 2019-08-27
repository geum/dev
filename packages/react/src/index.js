//this allows JSX to be transpiled on the server
require('@babel/register')({ presets: [ '@babel/preset-react' ] });

const react = require('react');
const { renderToString } = require('react-dom/server');

const { Definition } = require('@geum/core');
const { Map } = require('@geum/http');
const Router = require('./Router');
const Route = require('./router/Route');
const Request = require('./router/Request');
const Response = require('./router/Response');

module.exports = () => {
  async function Server(request, response) {
    await Server.emit('open', request, response);

    //make a payload
    const payload = await Map.makePayload(request, response, Request, Response);
    const method = payload.request.getMethod();
    const path = payload.request.getPath('string');

    const route = Server.route(
      method + ' ' + path,
      payload.request,
      payload.response
    );

    await route.emit();

    if (payload.response.hasComponent()) {
      const component = payload.response.getComponent();
      //if it's a react element
      if (react.isValidElement(component)) {
        //convert it to string
        payload.response.setContent(renderToString(component));
      }
    }

    Map.dispatcher(payload.request, payload.response);

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
module.exports.Route = Router.RouteInterface;
module.exports.Request = Router.RequestInterface;
module.exports.Response = Router.ResponseInterface;
