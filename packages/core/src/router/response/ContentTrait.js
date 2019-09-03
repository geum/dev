class ContentTrait {
  /**
   * @var {String} content
   */
  get content() {
    return this.getContent();
  }

  /**
   * @var {Boolean} streamable
   */
  get streamable() {
    return this.isContentStreamable();
  }

  /**
   * @var {String} content
   */
  set content(content) {
    this.setContent(content);
  }

  /**
   * Returns the content body
   *
   * @return {String}
   */
  getContent() {
    return this.get('body');
  }

  /**
   * Returns true if content is set
   *
   * @return {Boolean}
   */
  hasContent() {
    return !!this.getContent();
  }

  /**
   * Returns true if the content is streamable
   *
   * @return {Boolean}
   */
  isContentStreamable() {
    return this.hasContent() && typeof this.getContent().pipe === 'function';
  }

  /**
   * Sets the content
   *
   * @param {*} content Can it be an array or string please?
   *
   * @return {ResponseInterface}
   */
  setContent(content) {
    //if null
    if (content === null) {
      content = '';
    }

    //if boolean
    if (typeof content === 'boolean') {
      content = content ? 1: 0;
    }

    //if number
    if (typeof content === 'number') {
      content = String(content);
    }

    //if it's an array
    if (Array.isArray(content)) {
      content = JSON.stringify(content, null, 2);
    }

    //if it's an object
    if (typeof content === 'object') {
      //if its not streamable
      if (typeof content.pipe !== 'function') {
        content = JSON.stringify(content, null, 2);
      }
    }

    //if it's a function
    if (typeof content === 'function') {
      content = content();
    }

    return this.set('body', content);
  }
}

//adapter
module.exports = ContentTrait;
