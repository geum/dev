class RouteTrait {
  /**
   * @var {Array} args
   */
  get args() {
    return this.getArgs();
  }

  /**
   * @var {Object} parameters
   */
  get parameters() {
    return this.getParameters();
  }

  /**
   * @var {Object} route
   */
  get route() {
    return this.getRoute();
  }

  /**
   * @var {String} channel - Sets channel
   */
  set channel(channel) {
    this.setChannel(channel);
  }

  /**
   * Returns route data given name or all route data
   *
   * @param {Integer} [index=null] The variable index
   *
   * @return {*}
   */
  getArgs(index = null) {
    if (!index) {
      return this.getRoute('args');
    }

    return this.getRoute('args', index);
  }

  /**
   * Returns final input stream
   *
   * @return {String}
   */
  getChannel() {
    return this.get('route', 'channel');
  }

  /**
   * Returns route data given name or all route data
   *
   * @param {String} [name=null] The parameter name
   *
   * @return {*}
   */
  getParameters(name = null) {
    if (!name) {
      return this.getRoute('parameters');
    }

    return this.getRoute('parameters', name);
  }

  /**
   * Returns route data given name or all route data
   *
   * @param {String} [name=null] The key name in the route
   * @param {*} [...args]
   *
   * @return mixed
   */
  getRoute(name = null, ...args) {
    if (!name) {
      return this.get('route');
    }

    return this.get('route', name, ...args);
  }

  /**
   * Returns true if has channel
   *
   * @return {Boolean}
   */
  hasChannel() {
    return this.has('route', 'channel');
  }

  /**
   * Sets a response channel
   *
   * @param {String} channel
   *
   * @return {RouteTrait}
   */
  setChannel(channel) {
    return this.set('route', 'channel', channel);
  }

  /**
   * Sets a response route
   *
   * @param {Array} results
   *
   * @return {RouteTrait}
   */
  setRoute(route) {
    return this.set('route', route);
  }
}

//adapter
module.exports = RouteTrait;
