class HeaderTrait {
  /**
   * Returns _HEADERS given name or all _HEADERS
   *
   * @param {String} [name = null]
   *
   * @return {*}
   */
  getHeader(name = null) {
    if (!name) {
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
   * Removes _HEADERS
   *
   * @param {String} name
   *
   * @return {HeaderTrait}
   */
  removeHeader(name) {
    return this.remove('headers', name);
  }

  /**
   * Sets _HEADERS
   *
   * @param {String} name
   * @param {String} [value = null]
   *
   * @return {HeaderTrait}
   */
  setHeader(name, value = null) {
    return this.set('headers', name, value);
  }
}

//adapter
module.exports = HeaderTrait;
