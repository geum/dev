class QueryTrait {
  /**
   * @var {Object} query
   */
  get query() {
    return this.getQuery();
  }

  /**
   * Returns _GET given name or all _GET
   *
   * @param {*} [...args]
   *
   * @return {*}
   */
  getQuery(...args) {
    return this.get('get', ...args);
  }

  /**
   * Returns true if has _GET given name or if _GET is set
   *
   * @param {*} [...args]
   *
   * @return {Boolean}
   */
  hasQuery(...args) {
    return this.has('get', ...args);
  }
}

//adapter
module.exports = QueryTrait;
