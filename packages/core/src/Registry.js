const Definition = require('./Definition');
const RegistryInterface = require('./contracts/RegistryInterface');

/**
 * Registry are designed to easily manipulate data in
 * preparation to integrate with any multi dimensional
 * data store.
 */
class Registry {
  /**
   * Registry Loader
   *
   * @param {Object} [data = {}]
   *
   * @return {Registry}
   */
  static load(data = {}) {
    return new Registry(data);
  }

  /**
   * Returns true if object keys is all numbers
   *
   * @param {Object} object
   *
   * @return {Boolean}
   */
  static shouldBeAnArray(object) {
    if (!Object.keys(object).length) {
      return false;
    }

    for (let key in object) {
      if (isNaN(parseInt(key)) || String(key).indexOf('.') !== -1) {
        return false;
      }
    }

    return true;
  }

  /**
   * Transforms an object into an arra
   *
   * @param {Object} object
   *
   * @return {Array}
   */
  static makeArray(object) {
    const array = [];
    Object.keys(object).sort().forEach(function(key) {
      array.push(object[key]);
    });

    return array;
  }

  /**
   * Transforms an object into an arra
   *
   * @param {Array} array
   *
   * @return {Object}
   */
  static makeObject(array) {
    return Object.assign({}, array);
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
   * @return {Registry}
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
   * Gets a value given the path in the registry.
   *
   * @param {String} notation  Name space string notation
   * @param {String} [separator = '.'] If you want to specify a different separator other than dot
   *
   * @return mixed
   */
  getDot(notation, separator = '.') {
    const path = notation.split(separator)
    return this.get(...path);
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
   * Checks to see if a key is set
   *
   * @param {String} notation  Name space string notation
   * @param {String} [separator = '.'] If you want to specify a different separator other than dot
   *
   * @return {Boolean}
   */
  hasDot(notation, separator = '.') {
    const path = notation.split(separator)
    return this.has(...path);
  }

  /**
   * Removes the data from a specified path
   *
   * @param {(...String)} [path]
   *
   * @return {Registry}
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
   * Removes name space given notation
   *
   * @param {String} notation  Name space string notation
   * @param {String} [separator = '.'] If you want to specify a different separator other than dot
   *
   * @return {DotNotationTrait}
   */
  removeDot(notation, separator = '.') {
    const path = notation.split(separator)
    return this.remove(...path);
  }

  /**
   * Sets the data of a specified path
   *
   * @param {(...String)} [path]
   * @param {*} value
   *
   * @return {Registry}
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

    const value = path.pop();

    let last = path.pop();
    let prevData = null;
    let prevStep = null;
    let pointer = this.data;

    path.forEach((step, i) => {
      if (step === null || step === '') {
        step = Object.keys(pointer).length;
      }

      if (prevData) {
        if (!Array.isArray(pointer)
          && Registry.shouldBeAnArray(pointer)
        ) {
          prevData[prevStep] = Registry.makeArray(pointer);
          pointer = prevData[prevStep];
        } else if (Array.isArray(pointer)
          && !Registry.shouldBeAnArray(pointer)
        ) {
          prevData[prevStep] = Registry.makeObject(pointer);
          pointer = prevData[prevStep];
        }
      }

      if (typeof pointer[step] !== 'object') {
        pointer[step] = {};
      }

      prevStep = step;
      prevData = pointer;
      pointer = pointer[step];
    });

    if (last === null || last === '') {
      last = Object.keys(pointer).length;
    }

    if (prevData) {
      if (!Array.isArray(pointer)
        && Registry.shouldBeAnArray(pointer)
      ) {
        prevData[prevStep] = Registry.makeArray(pointer);
        pointer = prevData[prevStep];
      } else if (Array.isArray(pointer)
        && !Registry.shouldBeAnArray(pointer)
      ) {
        prevData[prevStep] = Registry.makeObject(pointer);
        pointer = prevData[prevStep];
      }
    }

    pointer[last] = value;

    return this;
  }

  /**
   * Creates the name space given the space
   * and sets the value to that name space
   *
   * @param {String} notation Name space string notation
   * @param {*} value Value to set on this namespace
   * @param {String} [separator = '.'] If you want to specify a different separator other than dot
   *
   * @return {DotNotationTrait}
   */
  setDot(notation, value, separator = '.') {
    const path = notation.split(separator)
    return this.set(...path, value);
  }
}

//definition check
Definition(Registry).implements(RegistryInterface);

//adapter
module.exports = Registry;
