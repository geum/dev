const Definition = require('../Definition');

const SchemaInterface = require('./contracts/SchemaInterface');
const StoreInterface = require('./contracts/StoreInterface');
const StoreCollection = require('./StoreCollection');
const DataException = require('./DataException');

/**
 * Schema used for stores and form validation
 */
class StoreSchema {
  /**
   * Sets up the default field collection
   *
   * @param {String} name
   * @param {StoreInterface} store
   */
  constructor(name, store) {
    if (!Definition(store).instanceOf(StoreInterface)) {
      throw DataException.forInvalidArgument(1, StoreInterface, store);
    }

    this.name = name;
    this.store = store;
    this.fields = {};
    this.collection = null;
  }

  /**
   * Static loader
   *
   * @param {String} name
   * @param {StoreInterface} store
   *
   * @return {StoreSchema}
   */
  static load(name, store) {
    return new StoreSchema(name, store);
  }

  /**
   * Adds a field definition
   *
   * @param {String} name
   * @param {String} type
   * @param {*} initial
   *
   * @return {StoreSchema}
   */
  addField(name, type, initial) {
    this.fields[name] = {
        type,
        initial,
        validation: []
    };

    return this;
  }

  /**
   * Adds a custom validator against a field
   *
   * @param {String} name
   * @param {Function} callback
   *
   * @return {StoreSchema}
   */
  addValidation(name, callback) {
    if (typeof this.fields[name] === 'undefined') {
      throw DataException.for('Adding validation for undefined field %s', name);
    }

    this.fields[name].validation.push(callback);
    return this;
  }

  /**
   * Builds the schema into a store
   *
   * @return {StoreSchema}
   */
  async build() {
    throw DataException.forUndefinedAbstract('build');
  }

  /**
   * Returns errors based on validation
   *
   * @param {Object} data
   *
   * @return {Object}
   */
  getErrors(data) {
    let errors = {};

    Object.keys(this.fields).forEach(name => {
      let type = this.fields[name].type;
      let value = data[name];

      if (
        typeof value === 'undefined'
        && typeof this.fields[name].initial === 'undefined'
      ) {
        errors[name] = 'missing';
        return;
      }

      switch (true) {
        case type === 'int' && !Number.isInteger(value):
        case type === 'float' && isNaN(parseFloat(value)):
        case type === 'bool' && typeof value !== 'boolean':
        case type === 'string' && typeof value !== 'string':
        case type === 'text' && typeof value !== 'text':
        case type === 'json' && typeof value !== 'object':
          errors[name] = 'expected ' + type;
          return;
      }

      this.fields[name].validation.forEach(callback => {
        callback(value, errors);
      });
    });

    return errors;
  }

  /**
   * Removes keys from the data that is not defined in the schema
   *
   * @param {Object} data
   *
   * @return {Object}
   */
  getFields(data) {
    let fields = {};
    //add the primary
    const primary = this.getPrimaryKey();
    if (typeof data[primary] !== 'undefined') {
      fields[primary] = data[primary];
    }

    //add the other fields
    Object.keys(this.fields).forEach(name => {
      if (typeof data[name] !== 'undefined') {
        fields[name] = data[name];
      } else if (typeof this.fields[name].initial !== 'undefined') {
        fields[name] = this.fields[name].initial;
      }
    });

    return fields;
  }

  /**
   * Returns the name of the schema
   *
   * @return {String}
   */
  getName() {
    return this.name;
  }

  /**
   * Returns the primary key name
   *
   * @return {String}
   */
  getPrimaryKey() {
    return this.store.getPrimaryKey(this.name);
  }

  /**
   * Returns a collection
   *
   * @param {StoreSchema} schema
   *
   * @return {StoreCollection}
   */
  makeCollection() {
    //no need for multiple collections
    if (!this.collection) {
      this.collection = StoreCollection.load(this, this.store);
    }
    return this.collection;
  }
}

//definition check
Definition(StoreSchema).implements(SchemaInterface);

//adapter
module.exports = StoreSchema;
