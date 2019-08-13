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
    this.properties = Definition.getPrototype(definition);
    this.methods = Object.getOwnPropertyNames(this.properties);
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

    const properties = Definition.getPrototype(definition);
    const methods = Object.getOwnPropertyNames(properties);

    //loop through interface methods
    Helper.forEach(methods, method => {
      //ignore constructor
      if (method === 'constructor') {
        return;
      }

      if (!Definition.isImplemented(
        properties[method],
        this.properties
      )) {
        //throw an exception
        throw Exception.for(
          'Class %s did not implement %s',
          this.definition.name,
          method
        );
      }
    });

    return this;
  }

  /**
   * Checks to see if the class definition implements the given interface/s
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
      Helper.forEach(Array.from(arguments), definition => {
        this.uses(definition);
      });

      return this;
    }

    const properties = Definition.getPrototype(definition);
    const methods = Object.getOwnPropertyNames(properties);

    //loop through interface methods
    Helper.forEach(methods, method => {
      //ignore constructor
      if (method === 'constructor') {
        return;
      }

      if (!Definition.isImplemented(
        properties[method],
        this.properties
      )) {
        //implement it
        this.properties[method] = properties[method];
      }
    });

    return this;
  }

  /**
   * Returns true if the given method is implemented in the definition
   *
   * @param {Function} method
   * @param {Object} definition
   *
   * @return {Boolean}
   */
  static isImplemented(method, definition) {
    const name = method.name;
    if (typeof definition[name] === 'undefined') {
      return false;
    }

    const interfaceClause = Definition.getArgumentClause(method);
    const definitionClause = Definition.getArgumentClause(definition[name]);

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
  static getArgumentClause(callback) {
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

  /**
   * Returns where the methods are defined
   *
   * @param {Object} definition
   */
  static getPrototype(definition) {
    let prototype = definition;
    if (typeof definition === 'function') {
      prototype = definition.prototype || {};
    }

    return prototype;
  }
}

//adapter
module.exports = definition => {
  return new Definition(definition);
}
