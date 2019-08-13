const Exception = require('../Exception');

/**
 * Router contract
 */
class RouterInterface {
  /**
   * Returns a route
   *
   * @param {String} event
   * @param {Request} [request = null]
   * @param {Response} [response = null]
   *
   * @return {Route}
   */
  route(event, request = null, response = null) {
    throw Exception.forUndefinedAbstract('route');
  }
}

//adapter
module.exports = RouterInterface;
