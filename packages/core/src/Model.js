const Registry = require('./Registry');

/**
 * Model abstract used as a starting point
 * to implement ModelInterface
 */
class Model extends Registry {
  /**
   * Model Loader
   *
   * @param {Object} [data = {}]
   * @param {CollectionInterface} collection
   *
   * @return {StoreModel}
   */
  static load(data = {}) {
    return new Model(data);
  }

  /**
   * Clones the data and returns a new Model class
   *
   * @return {StoreModel}
   */
  clone() {
    return new this.constructor(
      Object.assign({}, this.data),
      this.collection
    );
  }

  /**
   * Copies data from one key to the other
   *
   * @param {(String|Integer)} from
   * @param {(String|Integer)} to
   *
   * @return {StoreModel}
   */
  copy(from, to) {
    this.data[to] = this.data[from];
    return this;
  }
}

//adapter
module.exports = Model;
