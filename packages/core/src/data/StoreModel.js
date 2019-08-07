const Definition = require('../Definition');

const CollectionInterface = require('./contracts/CollectionInterface');
const ModelInterface = require('./contracts/ModelInterface');
const DataModel = require('./DataModel');
const DataException = require('./DataException');

/**
 * Model abstract used as a starting point
 * to implement ModelInterface
 */
class StoreModel extends DataModel {
  /**
   * Adds the initial data
   *
   * @param {CollectionInterface} collection
   * @param {Object} [data = {}]
   */
  constructor(collection, data = {}) {
    super(data);

    if (!Definition(collection).instanceOf(CollectionInterface)) {
      throw DataException.forInvalidArgument(0, CollectionInterface, collection);
    }

    //then set the collection
    this.collection = collection;
  }

  /**
   * Model Loader
   *
   * @param {Object} [data = {}]
   * @param {CollectionInterface} collection
   *
   * @return {StoreModel}
   */
  static load(data = {}, collection) {
    return new StoreModel(data, collection);
  }

  /**
   * Inserts data to an external store or via API
   *
   * @return {StoreModel}
   */
  async insert() {
    this.data = await this.collection.insert(this.data);
    return this;
  }

  /**
   * Removes data from an external store or via API
   *
   * @return {StoreModel}
   */
  async remove() {
    const primaryKey = this.collection.getPrimaryKey();

    if (typeof this.data[primaryKey] === 'undefined') {
      throw DataException.for('Missing %s', primaryKey);
    }

    return this.collection.remove(this.data[primaryKey]);
  }

  /**
   * Inserts or updates data to an external store or via API
   *
   * @return {StoreModel}
   */
  async save() {
    const primaryKey = this.collection.getPrimaryKey();

    if (typeof this.data[primaryKey] === 'undefined') {
      return this.insert();
    }

    return this.update();
  }

  /**
   * Updates data to an external store or via API
   *
   * @return {StoreModel}
   */
  async update() {
    const primaryKey = this.collection.getPrimaryKey();

    if (typeof this.data[primaryKey] === 'undefined') {
      throw DataException.for('Missing %s', primaryKey);
    }

    this.data = await this.collection.update(this.data[primaryKey], this.data);

    return this;
  }
}

//definition check
Definition(StoreModel).implements(ModelInterface);

//adapter
module.exports = StoreModel;
