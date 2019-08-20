const Exception = require('./Exception');
const Helper = require('./Helper');

/**
 * Definition helps with constructing classes polyfilling interfaces and traits
 */
class Definition {
  /**
   * Sets the definition
   *
   * @param {Object} definition
   */
  constructor(definition) {
    this.definition = definition;
    this.methods = Definition.getMethods(definition);
  }

  /**
   * Checks to see if the class definition implements all of the given interfaces
   *
   * @param {Object} definition
   *
   * @return {Definition}
   */
  implements(definition) {
    if (arguments.length > 1) {
      Helper.forEach(Array.from(arguments), definition => {
        this.implements(definition);
      });

      return this;
    }

    const methods = Definition.getMethods(definition);

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
   * @return {Definition}
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
   * @return {Definition}
   */
  uses(definition) {
    if (arguments.length > 1) {
      Array.from(arguments).forEach(definition => {
        this.uses(definition);
      });

      return this;
    }

    const methods = Definition.getMethods(definition);

    //loop through interface methods
    Object.keys(methods).forEach(method => {
      //if it's implemented
      if (isImplemented(method, methods[method], this.methods)) {
        return;
      }

      //implement it
      implement(method, methods[method], this.definition);
      this.methods = Definition.getMethods(this.definition);
    });

    return this;
  }

  /**
   * Returns where the methods are defined
   *
   * @param {Object} definition
   */
  static getMethods(definition) {
    const prototype = {};
    if (!definition) {
      return prototype;
    }

    if (typeof definition === 'function') {
      //i found that this is possible...
      if (!definition.prototype) {
        definition.prototype = {};
      }

      definition = definition.prototype;
    }

    Object.getOwnPropertyNames(definition).forEach(property => {
      if(Definition.nativeMethods.indexOf(property) !== -1) {
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

    return Object.assign(prototype, Definition.getMethods(
      Object.getPrototypeOf(definition)
    ));
  }
}

/**
 * Methods which should not be considered as custom methods
 */
Definition.nativeMethods = [
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
 * Adds a method to the definition
 *
 * @param {String} name
 * @param {Function} method
 * @param {Object} definition
 */
function implement(name, method, definition) {
  let prototype = definition;
  if (typeof definition === 'function') {
    //i found that this is possible...
    if (!definition.prototype) {
      definition.prototype = {};
    }

    prototype = definition.prototype;
  }

  prototype[name] = method;
}

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
  if (typeof definition[name] === 'undefined') {
    return false;
  }

  const interfaceClause = getArgumentClause(method);
  const definitionClause = getArgumentClause(definition[name]);

  if (interfaceClause !== definitionClause) {
    return false;
  }

  return true;
}

/**
 * Returns the argument clause of a function
 *
 * @param {Object} callback
 *
 * @return {Boolean}
 */
function getArgumentClause(callback) {
  if (typeof callback !== 'function') {
    return false;
  }

  const code = callback.toString();

  const start = code.indexOf('(');
  const end = code.indexOf(')');

  if (start === -1 || end === -1 || !(start < end)) {
    return false;
  }

  return code.substr(start + 1, end - start - 1);
}

//adapter
module.exports = definition => {
  return new Definition(definition);
};

module.exports.getMethods = Definition.getMethods;
module.exports.nativeMethods = Definition.nativeMethods;
