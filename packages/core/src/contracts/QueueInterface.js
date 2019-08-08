const Exception = require('../Exception');

/**
 * Queue contract
 */
class QueueInterface {
  /**
   * Adds a task to the queue
   *
   * @param {Function} callback
   * @param {Integer} [priority = 0]
   *
   * @return {TaskQueue}
   */
  add(callback, priority = 0) {
    throw Exception.forUndefinedAbstract('add');
  }

  /**
   * Runs the tasks
   *
   * @param {*} [...args]
   *
   * @return {Integer}
   */
  async run(...args) {
    throw Exception.forUndefinedAbstract('run');
  }
}

//adapter
module.exports = QueueInterface;
