/**
 * The DotTrait allows multidimensional data to
 * be accessed like `foo.bar.zoo` as well as be
 * manipulated in the same fashion.
 */
class DotNotationTrait {
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

//adapter
module.exports = DotNotationTrait;
