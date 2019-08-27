const fs = require('fs');
const path = require('path');

const { Definition, EventEmitter, Registry, Exception } = require('@geum/core');
const Http = require('@geum/http');
const Socket = require('@geum/socket');
const React = require('@geum/react');
const Terminal = require('./Terminal');

class Application extends EventEmitter {
  /**
   * @var {String} pwd - Present Working Directory
   */
  get pwd() {
    return this.data.pwd;
  }

  /**
   * @var {Http} server - Lazy loaded http server
   */
  get react() {
    if (!this.services.react) {
      this.services.react = React();

      //chain the errors
      this.services.react.on('error', async(...args) => {
        await this.emit('error', ...args);
      });
    }

    return this.services.react;
  }

  /**
   * @var {Http} server - Lazy loaded http server
   */
  get server() {
    if (!this.services.server) {
      this.services.server = Http();

      //chain the errors
      this.services.server.on('error', async(...args) => {
        await this.emit('error', ...args);
      });
    }

    return this.services.server;
  }

  /**
   * @var {Socket} socket - Lazy loaded socket server
   */
  get socket() {
    if (!this.services.socket) {
      this.services.socket = Socket();

      //chain the errors
      this.services.socket.on('error', async(...args) => {
        await this.emit('error', ...args);
      });
    }

    return this.services.socket;
  }

  /**
   * @var {Terminal} cli - Lazy loaded terminal interface
   */
  get cli() {
    if (!this.services.cli) {
      this.services.cli = Terminal.load();
    }

    return this.services.cli;
  }

  /**
   * Application Loader
   *
   * @return {Application}
   */
  static load() {
    return new Application();
  }

  /**
   * Set the PWD and services object
   */
  constructor() {
    super();
    //for adapters
    this.services = {};
    //for registry
    this.data = { pwd: process.env.PWD };
  }

  /**
   * Logs anything to anyone that's listening to it
   *
   * @return {Application}
   */
  async log(...args) {
    return await this.emit('log', ...args);
  }

  /**
   * Calls all the bootstraps of all registered packages
   *
   * @return {Application}
   */
  initialize() {
    const packageFile = path.join(this.pwd, 'package.json');
    if (!fs.existsSync(packageFile)) {
      return;
    }

    const config = require(packageFile);
    if (!config.geum || !config.geum.packages) {
      return;
    }

    if (!Array.isArray(config.geum.packages)) {
      config.geum.packages = [config.geum.packages];
    }

    config.geum.packages.forEach((directory) => {
      directory = getAbsolutePath(directory, this.pwd);

      //if we could not determine a folder
      if (!directory || !fs.lstatSync(directory).isDirectory()) {
        return;
      }

      //if there's a package.json
      const packageFile = path.join(directory, 'package.json');
      if (fs.existsSync(packageFile)) {
        const config = require(packageFile);
        //if there is { bootstrap: '/src/index.js' }
        if (typeof config.bootstrap === 'string') {
          const bootstrap = getAbsolutePath(config.bootstrap, directory);

          //if we could not determine that this is a path
          if (!bootstrap || !fs.lstatSync(bootstrap).isFile()) {
            return;
          }

          require(bootstrap);
          return;
        }

        //if there is { main: '/src/index.js' }
        if (typeof config.main === 'string') {
          const main = getAbsolutePath(config.main, directory);

          //if we could not determine that this is a path
          if (!main || !fs.lstatSync(main).isFile()) {
            return;
          }

          require(main);
          return;
        }
      }

      //just require it
      require(directory);
    });

    return this;
  }
}

/**
 * Tries to determine the absolute path
 *
 * @param {String} file
 * @param {String} root
 *
 * @return {String}
 */
function getAbsolutePath(file, root) {
  if (file.indexOf('./') === 0) {
    file = file.substr(2);
  }

  if (file.indexOf('/') !== 0) {
    file = path.join(root, file);
  }

  if (!fs.existsSync(file)) {
    return null;
  }

  return file;
}

//definition check
Definition(Application).uses(Registry);

module.exports = Application;
