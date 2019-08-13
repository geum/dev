class ServerTrait {
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

  /**
   * Sets request method
   *
   * @param {String} method
   *
   * @return {ServerTrait}
   */
  setMethod(method) {
    return this.set('method', method);
  }

  /**
   * Sets path given in string or array form
   *
   * @param {(String|Array)} path
   *
   * @return {ServerTrait}
   */
  setPath(path) {
    let array = [];
    if (typeof path === 'string') {
      path = path.split('/');
    }

    if (path instanceof Array) {
      array = path;
      path = path.join('/');
    }

    return this
      .set('path', 'string', path)
      .set('path', 'array', array);
  }

  /**
   * Sets SERVER
   *
   * @param {Array} server
   *
   * @return {ServerTrait}
   */
  setServer(server) {
    this.set('server', server);

    //if there is no path set
    if (!this.has('path') && typeof server['REQUEST_URI'] === 'string') {
      let path = server['REQUEST_URI'];

      //remove ? url queries
      if (path.indexOf('?') !== -1) {
        path = path.split('?')[0];
      }

      this.setPath(path);
    }

    if (!this.has('method') && server['REQUEST_METHOD'] !== 'undefined') {
      this.setMethod(server['REQUEST_METHOD']);
    }

    if (!this.has('query') && server['QUERY_STRING'] !== 'undefined') {
      this.set('query', server['QUERY_STRING']);
    }

    return this;
  }
}

//adapter
module.exports = ServerTrait;
