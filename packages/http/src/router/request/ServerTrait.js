class ServerTrait {
  /**
   * @var {String} method
   */
  get method() {
    return this.getMethod();
  }

  /**
   * @var {Object} path
   */
  get path() {
    return this.getPath();
  }

  /**
   * @var {String} query
   */
  get query() {
    return this.getQuery();
  }

  /**
   * @var {Object} server
   */
  get server() {
    return this.getServer();
  }

  /**
   * Returns method if set
   *
   * @return {String}
   */
  getMethod() {
    return this.get('method').toUpperCase();
  }

  /**
   * Returns path data given name or all path data
   *
   * @param {String} [name=null] The key name in the path (string|array)
   *
   * @return {(String|Array)}
   */
  getPath(name = null) {
    if (!name) {
      return this.get('path');
    }

    return this.get('path', name);
  }

  /**
   * Returns string query if set
   *
   * @return {String}
   */
  getQuery() {
    return this.get('query');
  }

  /**
   * Returns SERVER data given name or all SERVER data
   *
   * @param {String} [name=null] name The key name in the SERVER
   *
   * @return mixed
   */
  getServer(name = null) {
    if (!name) {
      return this.get('server');
    }

    return this.get('server', name);
  }

  /**
   * Returns SERVER data given name or all SERVER data
   *
   * @param {String} [name=null] The key name in the SERVER
   *
   * @return {Boolean}
   */
  hasServer(name = null) {
    if (!name) {
      return this.has('server');
    }

    return this.has('server', name);
  }

  /**
   * Returns true if method is the one given
   *
   * @param {String} method
   *
   * @return {Boolean}
   */
  isMethod(method) {
    return method.toUpperCase() === this.get('method').toUpperCase();
  }
}

//adapter
module.exports = ServerTrait;
