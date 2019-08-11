class PageTrait {
  /**
   * Adds a page meta item
   *
   * @param {String} name
   * @param {String} content
   *
   * @return PageTrait
   */
  addMeta(name, content) {
    args = Array.from(arguments);
    return this.set('page', 'meta', ...args);
  }

  /**
   * Returns flash data
   *
   * @return {Array}
   */
  getFlash() {
    return this.get('page', 'flash');
  }

  /**
   * Returns meta given path or all meta data
   *
   * @param {String} [...args]
   *
   * @return {*}
   */
  getMeta(...args) {
    return this.get('page', 'meta', ...args);
  }

  /**
   * Returns page data given path or all page data
   *
   * @param {String} [...args]
   *
   * @return {*}
   */
  getPage(...args) {
    return this.get('page', ...args);
  }

  /**
   * Returns true if there's any page data
   *
   * @param {String} [...args]
   *
   * @return {Boolean}
   */
  hasPage(...args) {
    if (!args.length) {
      return this.has('page');
    }

    return this.has('page', ...args);
  }

  /**
   * Removes arbitrary page data
   *
   * @param {String} [...args]
   *
   * @return {PageTrait}
   */
  removePage(...args) {
    return this.remove('page', ...args);
  }

  /**
   * Sets a Page flash
   *
   * @param {String} message
   * @param {String} [type = 'info']
   *
   * @return PageTrait
   */
  setFlash(message, type = 'info') {
    return this
      .set('page', 'flash', 'message', message)
      .set('page', 'flash', 'type', type);
  }

  /**
   * Sets arbitrary page data
   *
   * @param {String} [...args]
   *
   * @return {PageTrait}
   */
  setPage(...args) {
    if (args.length < 2) {
      return this;
    }

    return this.set('page', ...args);
  }

  /**
   * Sets a Page title
   *
   * @param {String} title
   *
   * @return {PageTrait}
   */
  setTitle(title) {
    return this.set('page', 'title', title);
  }
}

//adapter
module.exports = PageTrait;
