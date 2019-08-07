class Helper {
  /**
   * Looper
   *
   * @param {(Object|Array)} list
   * @param {Function} callback
   *
   * @return {Boolean}
   */
  static forEach(list, callback) {
    for (let index = 0; index < list.length; index++) {
      if (callback(list[index], index) === false) {
        return false;
      }
    }

    return true;
  }

  /**
   * Asyncronous Looper
   *
   * @param {(Object|Array)} list
   * @param {Function} callback
   *
   * @return {Boolean}
   */
  static async asyncForEach(list, callback) {
    for (let index = 0; index < list.length; index++) {
      if (await callback(list[index], index) === false) {
        return false;
      }
    }

    return true;
  }

  /**
   * Makes the app sleep for a bit.
   *
   * @param {Integer} milliseconds
   *
   * @return {Promise}
   */
  static sleep (milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }
}

//adapter
module.exports = Helper;
