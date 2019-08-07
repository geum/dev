const DataException = require('../DataException');

/**
 * Schema used for stores and form validation
 */
class SchemaInterface {
  /**
   * Returns errors based on validation
   *
   * @param {Object} data
   *
   * @return {Object}
   */
  getErrors(data) {
    throw DataException.forUndefinedAbstract('getErrors');
  }

  /**
   * Removes keys from the data that is not defined in the schema
   *
   * @param {Object} data
   *
   * @return {Object}
   */
  getFields(data) {
    throw DataException.forUndefinedAbstract('getFields');
  }

  /**
   * Returns the name of the schema
   *
   * @return {String}
   */
  getName() {
    throw DataException.forUndefinedAbstract('getName');
  }
}

//adapter
module.exports = SchemaInterface;
