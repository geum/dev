const HttpException = require('../HttpException');

/**
 * Route contract
 */
class RouteInterface {
  /**
   * Virtual Methods:
   *
   * all(...callbacks)
   * get(...callbacks)
   * post(...callbacks)
   * put(...callbacks)
   * delete(...callbacks)
   */

  /**
   * Adds routing middleware
   *
   * @param {String} method The request method
   * @param {Function} callback The middleware handler
   * @param {Integer} [priority = 0] if true will be prepended in order
   *
   * @return {RouteInterface}
   */
  method(method, callback, priority = 0) {
    throw HttpException.forUndefinedAbstract('method');
  }
}

//adapter
module.exports = RouteInterface;
