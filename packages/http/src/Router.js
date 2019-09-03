const fs = require('fs');
const mime = require('mime');

const { Reflection, EventEmitter, Router: CoreRouter } = require('@geum/core');

const MethodTrait = require('./router/MethodTrait');

const Route = require('./router/Route');
const Request = require('./router/Request');
const Response = require('./router/Response');

const map = require('./map/http');

class Router extends CoreRouter {
  /**
   * Used to determine what registration method name to look for when `use()`
   *
   * @const {String} USE_METHOD
   */
  get USE_METHOD() {
    return 'http';
  }

  /**
   * Used to determine what registration event name to listen to when `use()`
   *
   * @const {String} USE_EVENT
   */
  get USE_EVENT() {
    return 'open';
  }

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

    this.RouteInterface = Router.RouteInterface;
    this.RequestInterface = Router.RequestInterface;
    this.ResponseInterface = Router.ResponseInterface;
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
        //add index.html
        path = (path + '/index.html').replace(/\/\//g, '/');
        //and try again
        if (!fs.existsSync(root + path) || !fs.lstatSync(root + path).isFile()) {
          return;
        }
      }

      res.setHeader('Content-Type', mime.getType(root + path));
      res.setContent(fs.createReadStream(root + path));

      return false;
    }, 10000);
  }

  /**
   * Runs the main routing without dispatching
   *
   * @param {Object} incomingMessage
   * @param {Object} serverResponse
   *
   * @return {Response}
   */
  async bootstrap(incomingMessage, serverResponse) {
    //make a payload
    const payload = await map.payload(this, incomingMessage, serverResponse);
    const method = payload.request.getMethod();
    const path = payload.request.getPath('string');

    const route = this.route(
      method + ' ' + path,
      payload.request,
      payload.response
    );

    return await route.emit();
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

//allows interfaces to be manually changed
Router.RouteInterface = Route;
Router.RequestInterface = Request;
Router.ResponseInterface = Response;

//definition check
Reflection(Router).uses(MethodTrait);

//adapter
module.exports = Router;
