class HeaderTrait {
  /**
   * Returns either the header value given
   * the name or the all headers
   *
   * @param {String} [name = null] Name of the header
   *
   * @return {*}
   */
  getHeader(name = null) {
    if (name === null) {
      return this.get('headers');
    }

    return this.get('headers', name);
  }

  /**
   * Returns true if header exists
   *
   * @param {String} name
   *
   * @return {Boolean}
   */
  hasHeader(name) {
    return this.has('headers', name);
  }

  /**
   * Removes a header parameter
   *
   * @param {String} name Name of the header
   *
   * @return {HeaderTrait}
   */
  removeHeader(name) {
    return this.remove('headers', name);
  }

  /**
   * Adds a header parameter
   *
   * @param {String} name Name of the header
   * @param {String} [value=null] Value of the header
   *
   * @return HeaderTrait
   */
  setHeader(name, value = null) {
    return this.set('headers', name, value);
  }
}

//adapter
module.exports = HeaderTrait;
