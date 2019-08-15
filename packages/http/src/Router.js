const fs = require('fs');
const mime = require('mime');

const { Definition, EventEmitter, Router: CoreRouter } = require('@geum/core');

const MethodTrait = require('./router/MethodTrait');

const Route = require('./router/Route');
const Request = require('./router/Request');
const Response = require('./router/Response');

class Router extends CoreRouter {
  /**
   * Static loader
   *
   * @return {Router}
   */
  static load() {
    return new Router();
  }

  /**
   * Sets the default state of listeners
   */
  constructor() {
    super();
    this.RouteInterace = Router.RouteInterace;
    this.RequestInterface = Router.RequestInterface;
    this.ResponseInterface = Router.ResponseInterface;
  }

  /**
   * Shortcut for middleware
   *
   * @param {Function} [callback]
   * @param {Integer} [priority = 1]
   *
   * @return {Framework}
   */
  use(callback, priority = 0) {
    //if priority is not a number ie. EventEmitter, Router, etc.
    //or there are more than 2 arguments...
    if (typeof priority !== 'number' || arguments.length > 2) {
      //set the priority to 0
      priority = 0;

      //loop through each argument as callback
      Array.from(arguments).forEach((callback, index) => {
        //if the callback is an array
        if (Array.isArray(callback)) {
          //recall use()
          this.use(...callback);
          return;
        }

        //determine the priority
        if (typeof arguments[index + 1] === 'number') {
          priority = arguments[index + 1];
        }

        //recall use() in a singular way
        this.use(callback, priority);
      });

      return this;
    }

    //make sure priority is a number
    if (typeof priority !== 'number') {
      priority = 0;
    }

    //if the callback is an EventEmitter
    if (Definition(callback).instanceOf(EventEmitter)) {
      Object.keys(callback.listeners).forEach(event => {
        this.on(event, (...args) => {
          callback.emit(event, ...args);
        }, priority);
      });

      return this;
    }

    //if a callback is not a function
    if (typeof callback === 'function') {
      this.on('open', callback, priority);
    }

    return this;
  }

  /**
   * Opens up an entire folder
   *
   * @param {String} root
   * @param {String} [publicPath = '']
   *
   * @return {Router}
   */
  public(root, publicPath = '') {
    const pattern = (publicPath + '/**').replace(/\/\//g, '/');
    return this.all(pattern, (req, res) => {
      if (res.hasContent()) {
        return;
      }

      let path = req.get('path', 'string').substr(publicPath.length);

      //if it doesnt exist
      if (!fs.existsSync(root + path) || !fs.lstatSync(root + path).isFile()) {
        return;
      }

      res.setHeader('Content-Type', mime.getType(root + path));
      res.setContent(fs.createReadStream(root + path));

      return false;
    }, 10000);
  }

  /**
   * Runs an event like a method
   *
   * @param {String} event
   * @param {Request} [request = null]
   * @param {Response} [response = null]
   *
   * @return {Integer}
   */
  async routeTo(method, path, request = null, response = null) {
    const event = method.toUpperCase() + ' ' + path;
    return await this.emit(event, request, response);
  }
}

Router.RouteInterace = Route;
Router.RequestInterface = Request;
Router.ResponseInterface = Response;

Definition(Router).uses(MethodTrait);

module.exports = Router;
