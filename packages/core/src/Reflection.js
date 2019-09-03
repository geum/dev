const Exception = require('./Exception');
const Helper = require('./Helper');

/**
 * Reflection helps with constructing classes polyfilling interfaces and traits
 */
class Reflection {
  /**
   * Sets the definition
   *
   * @param {Object} definition
   */
  constructor(definition) {
    this.definition = definition;
    this.methods = Reflection.getMethods(this.definition);
    this.descriptors = Reflection.getDescriptors(this.definition);
  }

  /**
   * Checks to see if the class definition implements all of the given interfaces
   *
   * @param {Object} definition
   *
   * @return {Reflection}
   */
  implements(definition) {
    if (arguments.length > 1) {
      Array.from(arguments).forEach(definition => {
        this.implements(definition);
      });

      return this;
    }

    const methods = Reflection.getMethods(definition);

    //loop through interface methods
    Object.keys(methods).forEach(method => {
      if (!isImplemented(method, methods[method], this.methods)) {
        const name = this.definition.name;
        //throw an exception
        throw Exception.for('Class %s did not implement %s', name, method);
      }
    });

    return this;
  }

  /**
   * Checks to see if the class definition implements the given interface/s
   *
   * NOTE: There is an NPM bug where its possible that the exact same class
   *       in the exact same package can be defined in two packages as
   *       sub-packages. Therefore we should not trust the native instanceof
   *       for custom objects while using NPM.
   *
   * @param {Object} [...definitions]
   *
   * @return {Reflection}
   */
  instanceOf(...definitions) {
    var nativeInstance = Helper.forEach(definitions, definition => {
      return this.definition instanceof definition;
    });

    if (nativeInstance) {
      return true;
    }

    try {
      this.implements(...definitions);
    } catch (e) {
      return false;
    }

    return true;
  }

  /**
   * Implements all of the given traits
   *
   * @param {Object} [...traits]
   *
   * @return {Reflection}
   */
  uses(definition) {
    if (arguments.length > 1) {
      Array.from(arguments).forEach(definition => {
        this.uses(definition);
      });

      return this;
    }

    const descriptors = Reflection.getDescriptors(definition);

    Object.keys(descriptors).forEach(method => {
      //if there's already a descriptor for this
      if (this.descriptors[method]) {
        //dont add
        return;
      }

      //add it
      Object.defineProperty(getPrototypeOf(this.definition), method, descriptors[method]);

      //update methods and descriptors
      this.methods = Reflection.getMethods(this.definition);
      this.descriptors = Reflection.getDescriptors(this.definition);
    });

    return this;
  }

  /**
   * Returns where the descriptors are defined
   *
   * @param {Object} definition
   */
  static getDescriptors(definition) {
    return Object.getOwnPropertyDescriptors(Reflection.getMethods(definition));
  }

  /**
   * Returns the argument clause of a function
   *
   * @param {Object} callback
   *
   * @return {Array}
   */
  static getArgumentNames(callback) {
    if (typeof callback !== 'function') {
      return [];
    }

    let clause = callback.toString();
    if (clause.indexOf('function') !== 0) {
      clause = 'function ' + clause;
    }

    const names = clause
      .replace(/[\r\n\s]+/g, ' ')
      .match(/(?:function\s*\w*)?\s*(?:\((.*?)\)|([^\s]+))/)
      .slice(1,3)
      .join('')
      .split(/\s*,\s*/);

    if (names.length === 1 && names[0] === '') {
      names.pop();
    }

    return names;
  }

  /**
   * Returns where the methods are defined
   *
   * @param {Object} definition
   */
  static getMethods(definition) {
    const prototype = {};
    definition = getPrototypeOf(definition);

    //for short hand functions ie. () => {}, there is no prototype
    if (!definition) {
      return prototype;
    }

    Object.getOwnPropertyNames(definition).forEach(property => {
      if(Reflection.nativeMethods.indexOf(property) !== -1) {
        return;
      }

      const descriptor = Object.getOwnPropertyDescriptor(definition, property);

      if (typeof descriptor.value === 'function') {
        prototype[property] = definition[property];
        return;
      }

      if (typeof descriptor.get === 'function'
        || typeof descriptor.set === 'function'
      ) {
        Object.defineProperty(prototype, property, descriptor);
      }
    });

    return Object.assign(prototype, Reflection.getMethods(
      Object.getPrototypeOf(definition)
    ));
  }

  /**
   * Returns the argument clause of a function
   *
   * @param {Object} callback
   * @param {Array} names
   *
   * @return {Boolean}
   */
  static hasArgumentNames(callback, names) {
    const args = Reflection.getArgumentNames(callback);
    for(let i = 0; i < names.length; i++) {
      if (args.indexOf(names[i]) === -1) {
        return false;
      }
    }

    return true;
  }

  /**
   * Returns the argument clause of a function
   *
   * @param {Object} callback
   * @param {Array} names
   *
   * @return {Boolean}
   */
  static hasArgumentNamesInOrder(callback, names) {
    const args = Reflection.getArgumentNames(callback);
    for(let i = 0; i < names.length; i++) {
      if (args[i] !== names[i]) {
        return false;
      }
    }

    return true;
  }
}

/**
 * Methods which should not be considered as custom methods
 */
Reflection.nativeMethods = [
  'constructor',
  '__proto__',
  '__defineGetter__',
  '__defineSetter__',
  'hasOwnProperty',
  '__lookupGetter__',
  '__lookupSetter__',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toString',
  'valueOf',
  'toLocaleString'
];

/**
 * Returns true if the given method is implemented in the definition
 *
 * @param {String} name
 * @param {Function} method
 * @param {Object} definition
 *
 * @return {Boolean}
 */
function isImplemented(name, method, definition) {
  const descriptors = Reflection.getDescriptors(definition);
  if (!descriptors[name] || !descriptors[name].value) {
    return false;
  }

  const interfaceClause = Reflection.getArgumentNames(method).join(', ');
  const definitionClause = Reflection.getArgumentNames(descriptors[name].value).join(', ');

  return interfaceClause === definitionClause;
}

/**
 * Returns the actual prototype location
 *
 * @param {Object} definition
 *
 * @return {Object}
 */
function getPrototypeOf(definition) {
  if (typeof definition === 'function') {
    return definition.prototype;
  }

  return definition;
}

//adapter
module.exports = definition => {
  return new Reflection(definition);
};

module.exports.getDescriptors = Reflection.getDescriptors;
module.exports.getArgumentNames = Reflection.getArgumentNames;
module.exports.getMethods = Reflection.getMethods;
module.exports.hasArgumentNames = Reflection.hasArgumentNames;
module.exports.hasArgumentNamesInOrder = Reflection.hasArgumentNamesInOrder;
module.exports.nativeMethods = Reflection.nativeMethods;
