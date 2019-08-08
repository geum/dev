class ResponseContent {
  /**
   * Content Loader, while injecting the content into the given response
   *
   * @param {ServerResponse}
   *
   * @return {ResponseContent}
   */
  static async load(response) {
    const content = response.content = new ResponseContent()
    return content;
  }

  /**
   * REST Loader, while injecting the content into the given response
   *
   * @param {IncomingMessage}
   * @param {ServerResponse}
   *
   * @return {ServerResponse}
   */
  async unload(request, response) {
    //if no content type
    if (!response.getHeader('Content-Type')) {
      //make it html
      response.setHeader('Content-Type', 'text/html; charset=utf-8');
    }

    //set content
    if (!response.content.empty()) {
      response.write(response.content.get());
    }

    return response;
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
    return !this.data || !this.data.length;
  }

  /**
   * Sets the content
   *
   * @param {*} content Can it be an array or string please?
   *
   * @return {ResponseInterface}
   */
  set(content) {
    if (content instanceof Array || typeof content === 'object') {
      content = JSON.stringify(content, null, 2);
    }

    if (typeof content === 'boolean') {
      content = content ? '1': '0';
    }

    if (content === null) {
      content = '';
    }

    this.data = content;

    return this;
  }
}

//adapter
module.exports = ResponseContent;
