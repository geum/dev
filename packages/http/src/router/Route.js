const { Definition, RouterInterface, Route: CoreRoute } = require('@geum/core');
const MethodTrait = require('./route/MethodTrait');

const Exception = require('../Exception');
const Router = require('../Router');

class Route extends CoreRoute {
  /**
   * Route Loader
   *
   * @param {RouterInterface} router
   * @param {String} event
   *
   * @return {Route}
   */
  static load(router, event) {
    console.log('in route')
    if (!Definition(router).instanceOf(RouterInterface)) {
      throw Exception.forInvalidArgument(0, RouterInterface, router);
    }

    return new Route(router, event);
  }
}

Definition(Route).uses(MethodTrait);

module.exports = Route;
