const Exception = require('../Exception');

/**
 * Response contract
 */
class ResponseInterface {
  /**
   * Adds a header parameter
   *
   * @param {String} name Name of the header
   * @param {String} [value=null] Value of the header
   *
   * @return {ResponseInterface}
   */
  setHeader(name, value = null) {
    throw Exception.forUndefinedAbstract('setHeader');
  }

  /**
   * Sets the content
   *
   * @param {*} content Can it be an array or string please?
   *
   * @return {ResponseInterface}
   */
  setContent(content) {
    throw Exception.forUndefinedAbstract('setContent');
  }

  /**
   * Sets a status code
   *
   * @param {Number} code Status code
   * @param {String} status The string literal code for header
   *
   * @return {ResponseInterface}
   */
  setStatus(code, status) {
    throw Exception.forUndefinedAbstract('setStatus');
  }
}

//adapter
module.exports = ResponseInterface;
