const Definition = require('../Definition');
const Framework = require('../Framework');

const RouterInterface = require('./contracts/RouterInterface');
const HttpRoute = require('./HttpRoute');
const MethodTrait = require('./router/MethodTrait');

class HttpRouter extends Framework {
  /**
   * Router Loader
   *
   * @return {HttpRouter}
   */
  static load() {
    return new HttpRouter();
  }

  /**
   * Returns an instance of a single route
   *
   * @param {String} path
   *
   * @return {RouteInterface}
   */
  route(path) {
    return new HttpRouter.RouteInterface(this, path);
  }

  /**
   * Mounts the specified function at the specified path
   *
   * @param {String} path
   * @param {Function} [...callbacks]
   *
   * @return {HttpRouter}
   */
  use(path, ...callbacks) {
    //if path is a function
    if (typeof path === 'function' || path instanceof Framework) {
      return super.use(path, ...callbacks);
    }

    if (typeof path === 'string' || path instanceof RegExp) {
      //same as all method
      this.all(path, ...callbacks);
    }

    return this;
  }
}

//allows interfaces to be manually changed
HttpRouter.RouteInterface = HttpRoute;

//definition check
Definition(HttpRouter).uses(MethodTrait).implements(RouterInterface);

//adapter
module.exports = HttpRouter;
