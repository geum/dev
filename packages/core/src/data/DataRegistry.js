const Definition = require('../Definition');
const RegistryInterface = require('./contracts/RegistryInterface');
const DotNotationTrait = require('./registry/DotNotationTrait');

/**
 * Registry are designed to easily manipulate data in
 * preparation to integrate with any multi dimensional
 * data store.
 */
class DataRegistry {
  /**
   * Registry Loader
   *
   * @param {Object} [data = {}]
   *
   * @return {DataRegistry}
   */
  static load(data = {}) {
    return new DataRegistry(data);
  }

  /**
   * Sets the initial data
   *
   * @param {Object} [data = {}]
   */
  constructor(data = {}) {
    this.data = data;
  }

  /**
   * Loops though the data of a specified path
   *
   * @param {(...String)} [path]
   *
   * @return {DataRegistry}
   */
  each(...path) {
    const callback = path.pop();
    let list = this.get(...path);

    if (!list) {
      return this;
    }

    if (list instanceof Array && !list.length) {
      return this;
    }

    if (typeof list === 'string' && !list.length) {
      return this;
    }

    if (typeof list === 'object' && !Object.keys(list).length) {
      return this;
    }

    for(let key in list) {
      if (callback(list[key], key) === false) {
        break;
      }
    }

    return this;
  }

  /**
   * Retrieves the data stored specified by the path
   *
   * @param {(...String)} [path]
   *
   * @return {*}
   */
  get(...path) {
    if (!path.length) {
      return this.data;
    }

    if (!this.has(...path)) {
      return null;
    }

    const last = path.pop();
    let pointer = this.data;

    path.forEach((step, i) => {
      pointer = pointer[step];
    });

    return pointer[last];
  }

  /**
   * Returns true if the specified path exists
   *
   * @param {(...String)} [path]
   *
   * @return {Boolean}
   */
  has(...path) {
    if (!path.length) {
      return false;
    }

    let found = true;
    const last = path.pop();
    let pointer = this.data;

    path.forEach((step, i) => {
      if (!found) {
        return;
      }

      if (typeof pointer[step] !== 'object') {
        found = false;
        return;
      }

      pointer = pointer[step];
    });

    return !(!found || typeof pointer[last] === 'undefined');
  }

  /**
   * Removes the data from a specified path
   *
   * @param {(...String)} [path]
   *
   * @return {DataRegistry}
   */
  remove(...path) {
    if (!path.length) {
      return this;
    }

    if (!this.has(...path)) {
      return this;
    }

    const last = path.pop();
    let pointer = this.data;

    path.forEach((step, i) => {
      pointer = pointer[step];
    });

    delete pointer[last];

    return this;
  }

  /**
   * Sets the data of a specified path
   *
   * @param {(...String)} [path]
   * @param {*} value
   *
   * @return {DataRegistry}
   */
  set(...path) {
    if (path.length < 1) {
      return this;
    }

    if (typeof path[0] === 'object') {
      Object.keys(path[0]).forEach(key => {
        this.set(key, path[0][key]);
      });

      return this;
    }

    let value = path.pop();
    const last = path.pop();
    let pointer = this.data;

    path.forEach((step, i) => {
      if (typeof pointer[step] !== 'object') {
        pointer[step] = {};
      }

      pointer = pointer[step];
    });

    pointer[last] = value;

    return this;
  }
}

//definition check
Definition(DataRegistry).uses(DotNotationTrait).implements(RegistryInterface);

//adapter
module.exports = DataRegistry;
