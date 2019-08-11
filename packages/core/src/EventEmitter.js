const Definition = require('./Definition');
const TaskQueue = require('./TaskQueue');

const EventInterface = require('./contracts/EventInterface');

/**
 * Allows the ability to listen to events made known by another
 * piece of functionality. Events are items that transpire based
 * on an action. With events you can add extra functionality
 * right after the event has triggered.
 */
class EventEmitter {
  /**
   * @const {Integer} STATUS_INCOMPLETE
   */
  static get STATUS_INCOMPLETE() {
    return TaskQueue.STATUS_INCOMPLETE;
  }

  /**
   * @const {Integer} STATUS_NOT_FOUND
   */
  static get STATUS_NOT_FOUND() {
    return TaskQueue.STATUS_EMPTY;
  }

  /**
   * @const {Integer} STATUS_OK
   */
  static get STATUS_OK() {
    return TaskQueue.STATUS_OK;
  }

  /**
   * Sets the default state of listeners
   */
  constructor() {
    this.meta = {};
    this.regexp = [];
    this.listeners = {};
  }

  /**
   * Static loader
   *
   * @return {EventEmitter}
   */
  static load() {
    return new EventEmitter();
  }

  /**
   * Calls all the callbacks of the given event passing the given arguments
   *
   * @param {String} event
   * @param {(...*)} args
   *
   * @return {Integer}
   */
  async emit(event, ...args) {
    const matches = this.match(event);

    //if there are no events found
    if (!Object.keys(matches).length) {
      //report a 404
      return EventEmitter.STATUS_NOT_FOUND;
    }

    const queue = new EventEmitter.QueueInterface();

    Object.keys(matches).forEach(key => {
      const match = matches[key];
      const event = match.pattern;
      //if no direct observers
      if (typeof this.listeners[event] === 'undefined') {
        return;
      }

      //add args on to match
      match.args = args;

      //then loop the observers
      this.listeners[event].forEach(listener => {
        queue.add(async (...args) => {
          //set the current
          this.meta = Object.assign({}, match, listener);
          //if this is the same event, call the method, if the method returns false
          if (await listener.callback(...args) === false) {
            return false;
          }
        }, listener.priority);
      });
    });

    //call the callbacks
    return await queue.run(...args);
  }

  /**
   * Returns possible event matches
   *
   * @param {String} event
   *
   * @return {Array}
   */
  match(event) {
    const matches = {};

    //do the obvious match
    if (typeof this.listeners[event] !== 'undefined') {
      matches[event] = {
        event: event,
        pattern: event,
        variables: []
      };
    }

    this.regexp.forEach(pattern => {
      const regexp = new RegExp(
        // pattern,
        pattern.substr(
          pattern.indexOf('/') + 1,
          pattern.lastIndexOf('/') - 1
        ),
        // flag
        pattern.substr(
          pattern.lastIndexOf('/') + 1
        )
      );

      const match = event.match(regexp);
      if (!match || !match.length) {
        return;
      }

      let variables = [];
      if (match instanceof Array) {
        variables = match.slice();
        variables.shift();
      }

      matches[pattern] = { event, pattern, variables };
    });

    return matches;
  }

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
    //deal with multiple events
    if (event instanceof Array) {
      event.forEach((event) => {
        this.on(event, callback, priority);
      });

      return this;
    }

    //if it is a regexp object
    if (event instanceof RegExp) {
      //make it into a string
      event = event.toString()
    }

    //is it a regexp string?
    if(event.indexOf('/') === 0 && event.lastIndexOf('/') !== 0) {
      this.regexp.push(event);
    }

    //add the event to the listeners
    if (typeof this.listeners[event] === 'undefined') {
      this.listeners[event] = [];
    }

    this.listeners[event].push({ priority, callback });
    return this;
  }

  /**
   * Stops listening to an event
   *
   * @param {(String|Null)} event name of the event
   * @param {(Function|Null)} callback callback handler
   *
   * @return {EventEmitter}
   */
  unbind(event = null, callback = null) {
    //if there is no event and not callable
    if (!event && !callback) {
        //it means that they want to remove everything
        this.listeners = {};
        return this;
    }

    //if there are callbacks listening to
    //this and no callback was specified
    if (!callback && typeof this.listeners[event] !== 'undefined') {
        //it means that they want to remove
        //all callbacks listening to this event
        delete this.listeners[event];
        return this;
    }

    //if there are callbacks listening
    //to this and we have a callback
    if (typeof this.listeners[event] !== 'undefined'
      && typeof callback === 'function'
    ) {
      this.listeners[event].forEach((listener, i) => {
        if(callback === listener.callback) {
          this.listeners[event].splice(i, 1);
          if (!this.listeners[event].length) {
            delete this.listeners[event];
          }
        }
      })
    }

    //if no event, but there is a callback
    if (!event && typeof callback === 'function') {
      Object.keys(this.listeners).forEach(event => {
        this.listeners[event].forEach((listener, i) => {
          if(callback === listener.callback) {
            this.listeners[event].splice(i, 1);
            if (!this.listeners[event].length) {
              delete this.listeners[event];
            }
          }
        })
      });
    }

    // @codeCoverageIgnoreStart
    return $this;
    // @codeCoverageIgnoreEnd
  }
}

//allows interfaces to be manually changed
EventEmitter.QueueInterface = TaskQueue;

//definition check
Definition(EventEmitter).implements(EventInterface);

//adapter
module.exports = EventEmitter;
