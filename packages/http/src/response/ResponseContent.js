class ResponseContent {
  /**
   * Content Loader, while injecting the content into the given response
   *
   * @param {ServerResponse}
   *
   * @return {ResponseContent}
   */
  static async load(response) {
    return new ResponseContent();
  }

  /**
   * Returns the content
   *
   * @return {String}
   */
  get() {
    return this.data || null;
  }

  /**
   * Returns true if there's content
   *
   * @return {Boolean}
   */
  empty() {
    if (!this.data) {
      return true;
    }

    if (typeof this.data === 'object' && !Array.isArray(this.data)) {
      return false;
    }

    return !this.data.length;
  }

  /**
   * Sets the content
   *
   * @param {*} content Can it be an array or string please?
   *
   * @return {ResponseInterface}
   */
  set(content) {
    //if it's an array
    if (content instanceof Array) {
      content = JSON.stringify(content, null, 2);
    }

    //if it's an object
    if (typeof content === 'object') {
      //if its not streamable
      if (typeof content.pipe !== 'function') {
        content = JSON.stringify(content, null, 2);
      }
    }

    //if its boolean
    if (typeof content === 'boolean') {
      content = content ? '1': '0';
    }

    //if it's null
    if (content === null) {
      content = '';
    }

    this.data = content;

    return this;
  }

  /**
   * Returns true if the content is streamable
   *
   * @return {Boolean}
   */
  streamable() {
    return this.data && typeof this.data.pipe === 'function';
  }
}

//adapter
module.exports = ResponseContent;
