const DataException = require('../DataException');

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
    throw DataException.forUndefinedAbstract('get');
  }

  /**
   * Returns true if the specified path exists
   *
   * @param {(...String)} [path]
   *
   * @return {Boolean}
   */
  has(...path) {
    throw DataException.forUndefinedAbstract('has');
  }

  /**
   * Removes the data from a specified path
   *
   * @param {(...String)} [path]
   *
   * @return {RegistryInterface}
   */
  remove(...path) {
    throw DataException.forUndefinedAbstract('remove');
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
    throw DataException.forUndefinedAbstract('set');
  }
}

//adapter
module.exports = RegistryInterface;
