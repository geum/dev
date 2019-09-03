class SessionTrait {
  /**
   * @var {Object} session
   */
  get session() {
    return this.getSession();
  }

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
}

//adapter
module.exports = SessionTrait;
