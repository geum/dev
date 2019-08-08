const EventEmitter = require('./EventEmitter');

class Framework extends EventEmitter {
  /**
   * Static loader
   *
   * @return {Framework}
   */
  static load() {
    return new Framework();
  }

  /**
   * Runs all the error handlers
   *
   * @param {*} [...args]
   *
   * @return {Framework}
   */
  async error(...args) {
    return await this.emit('error', ...args);
  }

  /**
   * Runs all the initializers
   *
   * @param {*} [...args]
   *
   * @return {Framework}
   */
  async initialize(...args) {
    return await this.emit('initialize', ...args);
  }

  /**
   * logs a message
   *
   * @param {*} [...args]
   *
   * @return {Framework}
   */
  async log(...args) {
    return await this.emit('log', ...args);
  }

  /**
   * Runs all the processors
   *
   * @param {*} [...args]
   *
   * @return {Framework}
   */
  async process(...args) {
    return await this.emit('process', ...args);
  }

  /**
   * Starts the Application
   *
   * @param {Function} callback
   * @param {*} [...args]
   *
   * @return {Framework}
   */
  async run(callback, ...args) {
    //initialize
    try {
      await this.initialize(...args);
    } catch(error) {
      this.error(error, ...args);
    }

    await callback();

    //shutdown
    try {
      await this.shutdown(...args);
    } catch(error) {
      this.error(error, ...args);
    }

    return this;
  }

  /**
   * Runs all the terminators
   *
   * @param {*} [...args]
   *
   * @return {Framework}
   */
  async shutdown(...args) {
    return await this.emit('shutdown', ...args);
  }

  /**
   * Shortcut for middleware
   *
   * @param {Function} [...callbacks]
   *
   * @return {Framework}
   */
  use(...callbacks) {
    callbacks.forEach((callback, index) => {
      if (callback instanceof Array) {
        this.use(...callback);
        return;
      }

      //determine the priority
      let priority = 0;
      if (typeof callbacks[index + 1] === 'number') {
        priority = callbacks[index + 1];
      }

      //if the callback is another framework
      if (callback instanceof Framework) {
        Object.keys(callback.listeners).forEach(event => {
          this.on(event, (...args) => {
            callback.emit(event, ...args);
          }, priority);
        });

        return;
      }

      //if a callback is not a function
      if (typeof callback !== 'function') {
        return;
      }

      this.on('process', callback, priority);
    })

    return this;
  }
}

//adapter
module.exports = Framework;
