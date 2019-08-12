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
    let status = EventEmitter.STATUS_OK, error = null;

    try {
      //emit a request event
      status = await this.emit('process', ...args);
    } catch(error) {
      status = await this.emit('error', error, ...args);
    }

    //if the status was incomplete (308)
    return status !== EventEmitter.STATUS_INCOMPLETE;
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
    //try to trigger initializers
    if (!await initialize.apply(this, args)) {
      //if the request exits, then stop
      return this;
    }

    await callback();

    //shutdown
    await shutdown.apply(this, args);

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

/**
 * Runs the 'initialize' event and interprets
 *
 * @param {RequestInterface} request
 * @param {ResponseInterface} response
 *
 * @return {Boolean} whether its okay to continue
 */
async function initialize(...args) {
  let status = EventEmitter.STATUS_OK, error = null;

  try {
    //emit a response event
    status = await this.emit('initialize', ...args);
  } catch(error) {
    //if there is an error
    status = await this.emit('error', error, ...args);
  }

  //if the status was incomplete (308)
  return status !== EventEmitter.STATUS_INCOMPLETE;
}

/**
 * Runs the 'initialize' event and interprets
 *
 * @param {RequestInterface} request
 * @param {ResponseInterface} response
 *
 * @return {Boolean} whether its okay to continue
 */
async function shutdown(...args) {
  let status = EventEmitter.STATUS_OK, error = null;

  try {
    //emit a response event
    status = await this.emit('shutdown', ...args);
  } catch(error) {
    //if there is an error
    status = await this.emit('error', error, ...args);
  }

  //if the status was incomplete (308)
  return status !== EventEmitter.STATUS_INCOMPLETE;
}

//adapter
module.exports = Framework;
