class SessionTrait {
  /**
   * Returns _SESSION given name or all _SESSION
   *
   * @param {*} [...args]
   *
   * @return {*}
   */
  getSession(...args) {
    return this.get('session', ...args);
  }

  /**
   * Returns true if has _SESSION given name or if _SESSION is set
   *
   * @param {*} [...args]
   *
   * @return {Boolean}
   */
  hasSession(...args) {
    return this.has('session', ...args);
  }

  /**
   * Removes _SESSION given name or all _SESSION
   *
   * @param {*} [...args]
   *
   * @return {SessionTrait}
   */
  removeSession(...args) {
    return this.remove('session', ...args);
  }

  /**
   * Sets _SESSION
   *
   * @param {*} data
   * @param {*} [...args]
   *
   * @return {SessionTrait}
   */
  setSession(data, ...args) {
    if (typeof data === 'object') {
      Object.keys(data).forEach(key => {
        this.setSession(key, data[key]);
      });

      return this;
    }

    if (args.length === 0) {
      return this;
    }

    return this.set('session', data, ...args);
  }
}

//adapter
module.exports = SessionTrait;
