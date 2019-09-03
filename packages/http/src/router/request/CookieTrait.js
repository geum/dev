class CookieTrait {
  /**
   * @var {Object} cookies
   */
  get cookies() {
    return this.getCookie();
  }

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
}

//adapter
module.exports = CookieTrait;
