class PostTrait {
  /**
   * @var {Object} post
   */
  get post() {
    return this.getPost();
  }

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
