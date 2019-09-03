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
}

//adapter
module.exports = RouteTrait;
