const RegistryInterface = require('./RegistryInterface');
const DataException = require('../DataException');

/**
 * Model contract
 */
class ModelInterface extends RegistryInterface {
  /**
   * Inserts data to an external store or via API
   *
   * @return {ModelInterface}
   */
  async insert() {
    throw DataException.forUndefinedAbstract('create');
  }

  /**
   * Removes data from an external store or via API
   *
   * @return {ModelInterface}
   */
  async remove() {
    throw DataException.forUndefinedAbstract('remove');
  }

  /**
   * Inserts or updates data to an external store or via API
   *
   * @return {ModelInterface}
   */
  async save() {
    throw DataException.forUndefinedAbstract('save');
  }

  /**
   * Updates data to an external store or via API
   *
   * @return {ModelInterface}
   */
  async update() {
    throw DataException.forUndefinedAbstract('update');
  }
}

//adapter
module.exports = ModelInterface;
