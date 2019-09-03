class TargetTrait {
  /**
   * @var {String} target - Returns final input stream
   */
  get target() {
    return this.getTarget();
  }

  /**
   * @var {String} target - Sets target
   */
  set target(target) {
    this.setTarget(target);
  }

  /**
   * Returns final input stream
   *
   * @return {String}
   */
  getTarget() {
    return this.get('target');
  }

  /**
   * Returns true if has target
   *
   * @return {Boolean}
   */
  hasTarget() {
    return this.has('target');
  }

  /**
   * Sets target
   *
   * @param {String} target
   *
   * @return {TargetTrait}
   */
  setTarget(target) {
    return this.set('target', target);
  }
}

//adapter
module.exports = TargetTrait;
