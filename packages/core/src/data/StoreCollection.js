const Definition = require('../Definition');
const Helper = require('../Helper');

const CollectionInterface = require('./contracts/CollectionInterface');
const SchemaInterface = require('./contracts/SchemaInterface');
const StoreInterface = require('./contracts/StoreInterface');

const StoreModel = require('./StoreModel');

const DataException = require('./DataException');

class StoreCollection {
  /**
   * Sets the store name
   *
   * @param {SchemaInterface}
   * @param {StoreInterface}
   *
   */
  constructor(schema, store) {
    if (!Definition(schema).instanceOf(SchemaInterface)) {
      throw DataException.forInvalidArgument(0, SchemaInterface, schema);
    }

    if (!Definition(store).instanceOf(StoreInterface)) {
      throw DataException.forInvalidArgument(1, StoreInterface, store);
    }

    this.schema = schema;
    this.store = store;

    //allows interfaces to be manually changed
    this.modelInterface = StoreModel;
  }

  /**
   * Collection Loader
   *
   * @param {SchemaInterface}
   * @param {StoreInterface}
   *
   * @return {StoreCollection}
   */
  static load(schema, store) {
    return new StoreCollection(schema, store);
  }

  /**
   * Inserts data to an external store or via API
   *
   * @param {Object} data
   *
   * @return {Object}
   */
  async insert(data) {
    const errors = this.schema.getErrors(data);

    if (Object.keys(errors).length) {
      throw SqlException.forErrorsFound(errors)
    }

    const fields = this.schema.getFields(data);

    let results = await this.store.insert(this.schema.getName(), fields);

    return results
  }

  /**
   * Retrieves data from an external store or via API
   *
   * @param {String|Integer} id
   *
   * @return {Object}
   */
  async detail(id) {
    const key = this.getPrimaryKey();
    return await this.store.detail(this.schema.getName(), key, id);
  }

  /**
   * Returns the primary key name
   *
   * @return {String|Integer}
   */
  getPrimaryKey() {
    return this.store.getPrimaryKey(this.schema.getName());
  }

  /**
   * Returns wallet model
   *
   * @param {Object} data
   *
   * @return {StoreModel}
   */
  makeModel(data) {
    const modelInterface = this.modelInterface;
    return new modelInterface(this, data);
  }

  /**
   * Removes data from an external store or via API
   *
   * @param {String|Integer}
   *
   * @return {Object}
   */
  async remove(id) {
    const key = this.getPrimaryKey();
    return await this.store.remove(this.schema.getName(), key, id);
  }

  /**
   * Searches in an external store or via API
   *
   * @param {*} filters
   *
   * @return {Array}
   */
  async search(filters) {
    return await this.store.search(this.schema.getName(), filters);
  }

  /**
   * Updates data to an external store or via API
   *
   * @param {String|Integer} id
   * @param {Object} data
   *
   * @return {Object}
   */
  async update(id, data) {
    const key = this.getPrimaryKey();

    if (typeof data[key] === 'undefined') {
      throw DataException.for('Missing primary key %s', key);
    }

    const errors = this.schema.getErrors(data);

    if (Object.keys(errors).length) {
      throw DataException.forErrorsFound(errors);
    }

    const fields = this.schema.getFields(data);
    return await this.store.update(this.schema.getName(), key, id, fields);
  }
}

//definition check
Definition(StoreCollection).implements(CollectionInterface);

//adapter
module.exports = StoreCollection;
