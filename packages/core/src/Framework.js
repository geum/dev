const EventEmitter = require('./EventEmitter');
const Request = require('./Request');
const Response = require('./Response');

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
   * Runs an event like a method
   *
   * @param {String} event
   * @param {Request} [request = null]
   * @param {Response} [response = null]
   *
   * @return {*}
   */
  async request(event, request = null, response = null) {
    if (request === null) {
      request = Request.load();
    } else if (!(request instanceof Request)) {
      if (typeof request === 'object') {
        request = Request.load().setStage(request);
      } else {
        request = Request.load();
      }
    }

    if (!(response instanceof Response)) {
      response = Response.load();
    }

    await this.emit(event, request, response);

    if (response.hasError()) {
        return false;
    }

    return response.getResults();
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
      await await this.emit('initialize', ...args);
    } catch(error) {
      this.error(error, ...args);
    }

    await callback();

    //shutdown
    try {
      await this.emit('shutdown', ...args);
    } catch(error) {
      this.error(error, ...args);
    }

    return this;
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
      let priority = 1;
      if (typeof callbacks[index + 1] === 'number') {
        priority = callbacks[index + 1];
      }

      //if the callback is an EventEmitter
      if (callback instanceof EventEmitter) {
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
