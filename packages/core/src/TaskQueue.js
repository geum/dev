const Reflection = require('./Reflection');
const QueueInterface = require('./contracts/QueueInterface');

/**
 * A task queue linearly executes each task
 */
class TaskQueue {
  /**
   * @const {Integer} STATUS_EMPTY
   */
  static get STATUS_EMPTY() {
    return 404;
  }

  /**
   * @const {Integer} STATUS_INCOMPLETE
   */
  static get STATUS_INCOMPLETE() {
    return 308;
  }

  /**
   * @const {Integer} STATUS_OK
   */
  static get STATUS_OK() {
    return 200;
  }

  /**
   * Sets up properties
   */
  constructor() {
    this.tasks = [];
    this.lower = 0;
    this.upper = 0;
  }

  /**
   * Static loader
   *
   * @return {TaskQueue}
   */
  static load() {
    return new TaskQueue();
  }

  /**
   * Adds a task to the queue
   *
   * @param {Function} callback
   * @param {Integer} [priority = 0]
   *
   * @return {TaskQueue}
   */
  add(callback, priority = 0) {
    if (priority > this.upper) {
      this.upper = priority;
    } else if (priority < this.lower) {
      this.lower = priority;
    }

    //fifo by default
    this.tasks.push({ callback, priority });

    //then sort by priority
    this.tasks.sort((a, b) => {
      return a.priority <= b.priority ? 1: -1;
    });

    return this;
  }

  /**
   * Adds a task to the bottom of the queue
   *
   * @param {Function} callback
   *
   * @return {TaskQueue}
   */
  push(callback) {
    return this.add(callback, this.lower - 1);
  }

  /**
   * Adds a task to the top of the queue
   *
   * @param {Function} callback
   *
   * @return {TaskQueue}
   */
  shift(callback) {
    return this.add(callback, this.upper + 1);
  }

  /**
   * When calling await, js looks for a then (to emulate a promise)
   *
   * @param {Function} callback
   *
   * @return {TaskQueue}
   */
  then(callback) {
    this.run().then(callback);
    return this;
  }

  /**
   * Runs the tasks
   *
   * @param {*} [...args]
   *
   * @return {Integer}
   */
  async run(...args) {
    if (!this.tasks.length) {
      //report a 404
      return TaskQueue.STATUS_EMPTY;
    }

    let task = null;
    while (this.tasks.length) {
      task = this.tasks.shift();
      if (await task.callback(...args) === false) {
        return TaskQueue.STATUS_INCOMPLETE;
      }
    }

    return TaskQueue.STATUS_OK;
  }
}

//definition check
Reflection(TaskQueue).implements(QueueInterface);

//adapter
module.exports = TaskQueue;
