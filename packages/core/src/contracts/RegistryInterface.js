const Exception = require('../Exception');

/**
 * Registry contract
 */
class RegistryInterface {
  /**
   * Retrieves the data stored specified by the path
   *
   * @param {(...String)} [path]
   *
   * @return {*}
   */
  get(...path) {
    throw Exception.forUndefinedAbstract('get');
  }

  /**
   * Returns true if the specified path exists
   *
   * @param {(...String)} [path]
   *
   * @return {Boolean}
   */
  has(...path) {
    throw Exception.forUndefinedAbstract('has');
  }

  /**
   * Removes the data from a specified path
   *
   * @param {(...String)} [path]
   *
   * @return {RegistryInterface}
   */
  remove(...path) {
    throw Exception.forUndefinedAbstract('remove');
  }

  /**
   * Sets the data of a specified path
   *
   * @param {(...String)} [path]
   * @param {*} value
   *
   * @return {RegistryInterface}
   */
  set(...path) {
    throw Exception.forUndefinedAbstract('set');
  }
}

//adapter
module.exports = RegistryInterface;
