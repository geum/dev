class StageTrait {
  /**
   * @var {Object} stage
   */
  get stage() {
    return this.getStage();
  }

  /**
   * @var {Object} stage
   */
  set stage(stage) {
    this.setStage(stage);
  }

  /**
   * @var {Object} softStage
   */
  set softStage(stage) {
    this.setSoftStage(stage);
  }

  /**
   * Returns _REQUEST given name or all _REQUEST
   *
   * @param {*} [...args]
   *
   * @return {*}
   */
  getStage(...args) {
    return this.get('stage', ...args);
  }

  /**
   * Returns true if has _REQUEST given name or if _REQUEST is set
   *
   * @param {*} [...args]
   *
   * @return {Boolean}
   */
  hasStage(...args) {
    return this.has('stage', ...args);
  }

  /**
   * Removes _REQUEST given name or all _REQUEST
   *
   * @param {*} [...args]
   *
   * @return {StageTrait}
   */
  removeStage(...args) {
    return this.remove('stage', ...args);
  }

  /**
   * Clusters request data together softly
   *
   * @param {*} data
   *
   * @return {StageTrait}
   */
  setSoftStage(data) {
    Object.keys(data).forEach(key => {
      if (this.has('stage', key)) {
        return;
      }

      this.set('stage', key, data[key]);
    });

    return this;
  }

  /**
   * Sets _REQUEST
   *
   * @param {*} data
   * @param {*} [...args]
   *
   * @return {StageTrait}
   */
  setStage(data, ...args) {
    if (typeof data === 'object') {
      Object.keys(data).forEach(key => {
        this.setStage(key, data[key]);
      });

      return this;
    }

    if (args.length === 0) {
      return this;
    }

    return this.set('stage', data, ...args);
  }
}

//adapter
module.exports = StageTrait;
