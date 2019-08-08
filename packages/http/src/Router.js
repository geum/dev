const { Definition, Framework } = require('@geum/core');

const RouterInterface = require('./contracts/RouterInterface');
const Route = require('./Route');
const MethodTrait = require('./router/MethodTrait');

class Router extends Framework {
  /**
   * Router Loader
   *
   * @return {Router}
   */
  static load() {
    return new Router();
  }

  /**
   * Returns an instance of a single route
   *
   * @param {String} path
   *
   * @return {RouteInterface}
   */
  route(path) {
    return new Router.RouteInterface(this, path);
  }

  /**
   * Mounts the specified function at the specified path
   *
   * @param {String} path
   * @param {Function} [...callbacks]
   *
   * @return {Router}
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
Router.RouteInterface = Route;

//definition check
Definition(Router).uses(MethodTrait).implements(RouterInterface);

//adapter
module.exports = Router;
