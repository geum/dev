const DataException = require('../DataException');

/**
 * Collection contract
 */
class CollectionInterface {
  /**
   * Inserts data to an external store or via API
   *
   * @param {Object} data
   *
   * @return {CollectionInterface}
   */
  async insert(data) {
    throw DataException.forUndefinedAbstract('create');
  }

  /**
   * Retrieves data from an external store or via API
   *
   * @param {String|Integer} id
   *
   * @return {Object}
   */
  async detail(id) {
    throw DataException.forUndefinedAbstract('detail');
  }

  /**
   * Removes data from an external store or via API
   *
   * @param {String|Integer} id
   *
   * @return {CollectionInterface}
   */
  async remove(id) {
    throw DataException.forUndefinedAbstract('remove');
  }

  /**
   * Searches in an external store or via API
   *
   * @param {*} filters
   *
   * @return {Array}
   */
  async search(filters) {
    throw DataException.forUndefinedAbstract('search');
  }

  /**
   * Updates data to an external store or via API
   *
   * @param {String|Integer} id
   * @param {Object} data
   *
   * @return {CollectionInterface}
   */
  async update(id, data) {
    throw DataException.forUndefinedAbstract('update');
  }
}

//adapter
module.exports = CollectionInterface;
