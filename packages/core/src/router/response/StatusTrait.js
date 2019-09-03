class StatusTrait {
  /**
   * @var {Number} status
   */
  get status() {
    return this.getStatus();
  }

  /**
   * Returns the status code
   *
   * @return {Number}
   */
  getStatus() {
    return this.get('code');
  }

  /**
   * Sets a status code
   *
   * @param {Number} code Status code
   * @param {String} status The string literal code for header
   *
   * @return {StatusTrait}
   */
  setStatus(code, status) {
    return this.set('code', code).set('status', status);
  }
}

//adapter
module.exports = StatusTrait;
