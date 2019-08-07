const HttpException = require('../HttpException');

/**
 * Router contract
 */
class RouterInterface {
  /**
   * Virtual Methods:
   *
   * all(path, ...callbacks)
   * get(path, ...callbacks)
   * post(path, ...callbacks)
   * put(path, ...callbacks)
   * delete(path, ...callbacks)
   */

  /**
   * Returns an instance of a single route
   *
   * @param {String} path
   *
   * @return {RouterInterface}
   */
  route(path) {
    throw HttpException.forUndefinedAbstract('route');
  }

  /**
   * Mounts the specified function at the specified path
   *
   * @param {String} path
   * @param {Function} [...callbacks]
   *
   * @return {RouterInterface}
   */
  use(path, ...callbacks) {
    throw HttpException.forUndefinedAbstract('use');
  }
}

//adapter
module.exports = RouterInterface;
