const Exception = require('../Exception');

/**
 * Request contract
 */
class RequestInterface {
  /**
   * Returns _HEADERS given name or all _HEADERS
   *
   * @param {String} [name = null]
   *
   * @return {*}
   */
  getHeader(name = null) {
    throw Exception.forUndefinedAbstract('getHeader');
  }

  /**
   * Returns _REQUEST given name or all _REQUEST
   *
   * @param {*} [...args]
   *
   * @return {*}
   */
  getStage(...args) {
    throw Exception.forUndefinedAbstract('getStage');
  }

  /**
   * Sets _REQUEST
   *
   * @param {*} data
   * @param {*} [...args]
   *
   * @return {RequestInterface}
   */
  setStage(data, ...args) {
    throw Exception.forUndefinedAbstract('setStage');
  }
}

//adapter
module.exports = RequestInterface;
