const EventException = require('../EventException');

/**
 * Event contract
 */
class EventInterface {
  /**
   * Adds a callback to the given event listener
   *
   * @param {String} event
   * @param {Function} callback
   * @param {Number} priority
   *
   * @return {EventEmitter}
   */
  on(event, callback, priority = 0) {
    throw EventException.forUndefinedAbstract('on');
  }

  /**
   * Calls all the callbacks of the given event passing the given arguments
   *
   * @param {String} event
   * @param {(...*)} args
   *
   * @return {EventEmitter}
   */
  async emit(event, ...args) {
    throw EventException.forUndefinedAbstract('emit');
  }
}

//adapter
module.exports = EventInterface;
