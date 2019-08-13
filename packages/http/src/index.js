const Router = require('./Router');

const map = require('./map/http');

module.exports = () => {
  async function HTTPServer(request, response) {
    await HTTPServer.emit('open', request, response);

    //make a payload
    const payload = await map.makePayload(request, response);
    const method = payload.request.getMethod();
    const path = payload.request.getPath('string');

    const route = HTTPServer.route(
      method + ' ' + path,
      payload.request,
      payload.response
    );

    await route.emit();

    map.dispatcher(payload.request, payload.response);

    await HTTPServer.emit('close', request, response);
  }

  //merge router methods
  const router = Router.load();

  mixin(HTTPServer, router);

  return HTTPServer;
};

module.exports.Router = Router;

module.exports.Map = map;

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
