class QueryTrait {
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

  /**
   * Removes _GET given name or all _GET
   *
   * @param {*} [...args]
   *
   * @return {QueryTrait}
   */
  removeQuery(...args) {
    return this.remove('get', ...args);
  }

  /**
   * Sets _GET
   *
   * @param {*} data
   * @param {*} [...args]
   *
   * @return {QueryTrait}
   */
  setQuery(data, ...args) {
    if (typeof data === 'object') {
      Object.keys(data).forEach(key => {
        this.setQuery(key, data[key]);
      });

      return this;
    }

    if (args.length === 0) {
      return this;
    }

    return this.set('get', data, ...args);
  }
}

//adapter
module.exports = QueryTrait;
