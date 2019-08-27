const { RouterInterface } = require('@geum/core');
const { Route: HttpRoute } = require('@geum/http');

class Route extends HttpRoute {
  /**
   * Route Loader
   *
   * @param {RouterInterface} router
   * @param {String} event
   *
   * @return {Route}
   */
  static load(router, event) {
    if (!Definition(router).instanceOf(RouterInterface)) {
      throw Exception.forInvalidArgument(0, RouterInterface, router);
    }

    return new Route(router, event);
  }
}

module.exports = Route;
