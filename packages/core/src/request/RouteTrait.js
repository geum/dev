class RouteTrait {
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
   * @param {Integer} [index=null] The variable index
   *
   * @return {*}
   */
  getVariables(index = null) {
    if (!index) {
      return this.getRoute('variables');
    }

    return this.getRoute('variables', index);
  }

  /**
   * Sets a request route
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
