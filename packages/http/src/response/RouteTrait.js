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
   * Sets a response route
   *
   * @param {Object} route
   *
   * @return {RouteTrait}
   */
  setRoute(route) {
    return this.set('route', route);
  }

  /**
   * Sets a response target
   *
   * @param {String} target
   *
   * @return {RouteTrait}
   */
  setTarget(target) {
    return this.set('route', 'target', target);
  }
}

//adapter
module.exports = RouteTrait;
