class HeaderTrait {
  /**
   * @var {Object} headers
   */
  get headers() {
    return this.getHeader();
  }

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
}

//adapter
module.exports = HeaderTrait;
