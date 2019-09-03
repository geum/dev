class ContentTrait {
  /**
   * @var {String} content - Returns final input stream
   */
  get content() {
    return this.getContent();
  }

  /**
   * Returns final input stream
   *
   * @return {String}
   */
  getContent() {
    return this.get('body');
  }

  /**
   * Returns true if has content
   *
   * @return {Boolean}
   */
  hasContent() {
    return this.has('body');
  }
}

//adapter
module.exports = ContentTrait;
