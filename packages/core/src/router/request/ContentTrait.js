class ContentTrait {
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

  /**
   * Sets content
   *
   * @param {String} content
   *
   * @return {ContentTrait}
   */
  setContent(content) {
    return this.set('body', content);
  }
}

//adapter
module.exports = ContentTrait;
