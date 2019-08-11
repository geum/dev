class PostTrait {
  /**
   * Returns _POST given name or all _POST
   *
   * @param {*} [...args]
   *
   * @return {*}
   */
  getPost(...args) {
    return this.get('post', ...args);
  }

  /**
   * Returns true if has _POST given name or if _POST is set
   *
   * @param {*} [...args]
   *
   * @return {Boolean}
   */
  hasPost(...args) {
    return this.has('post', ...args);
  }

  /**
   * Removes _POST given name or all _POST
   *
   * @param {*} [...args]
   *
   * @return {PostTrait}
   */
  removePost(...args) {
    return this.remove('post', ...args);
  }

  /**
   * Sets _POST
   *
   * @param {*} data
   * @param {*} [...args]
   *
   * @return {PostTrait}
   */
  setPost(data, ...args) {
    if (typeof data === 'object') {
      Object.keys(data).forEach(key => {
        this.setPost(key, data[key]);
      });

      return this;
    }

    if (args.length === 0) {
      return this;
    }

    return this.set('post', data, ...args);
  }

  /**
   * Get the raw body
   *
   * @param {IncomingMessage}
   *
   * @return {Promise} [{String}]
   */
  static getBody(message) {
    return new Promise(resolve => {
      let body = [];

      message.on('data', chunk => {
        body.push(chunk.toString()); // convert Buffer to string
      });

      message.on('end', () => {
        resolve(body.join(''));
      });
    });
  }
}

//adapter
module.exports = PostTrait;
