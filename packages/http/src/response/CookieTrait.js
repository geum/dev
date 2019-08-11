class CookieTrait {
  /**
   * Returns _COOKIE given name or all _COOKIE
   *
   * @param {String} [name = null]
   *
   * @return {String}
   */
  getCookie(name = null) {
    if (!name) {
      return this.get('cookies');
    }

    return this.get('cookies', name);
  }

  /**
   * Returns true if has _COOKIE given name or if _COOKIE is set
   *
   * @param {*} [...args]
   *
   * @return {Boolean}
   */
  hasCookie(name) {
    return this.has('cookies', name);
  }

  /**
   * Removes _COOKIE given name or all _COOKIE
   *
   * @param {*} [...args]
   *
   * @return {CookieTrait}
   */
  removeCookie(...args) {
    return this.remove('cookies', ...args);
  }

  /**
   * Sets a cookie to be added in the headers, eventually
   *
   * @param {String} name
   * @param {(String|Object)} [value = null]
   * @param {Object} [options = {}]
   *
   * @return {CookieTrait}
   */
  setCookie(name, value = null, options = {}) {
    if (typeof name === 'object') {
      if (value && typeof value === 'object') {
        options = value;
      }

      Object.keys(name).forEach(key => {
        this.setCookie(key, name[key], options);
      });

      return this;
    }

    //if its an object
    if (value && typeof value === 'object') {
      Object.keys(value).forEach(key => {
        this.setCookie(`${name}[${key}]`, value[key], options);
      });

      return this;
    }

    return this.set('cookies', name, { value, options });
  }
}

//adapter
module.exports = CookieTrait;
