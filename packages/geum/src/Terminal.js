const inquirer = require('inquirer');
const { Router } = require('@geum/core');

class Terminal extends Router {
  /**
   * Transforms array args to object
   *
   * @param {Array} args
   *
   * @return {Object}
   */
  static parseArgs(args) {
    const results = {};

    let i = 0, j = 0, index = 0, arg = null, key = null, value = null, chars = null;
    for (; i < args.length; i++) {
      arg = args[i];
      // --foo --bar=baz
      if (arg.indexOf('--') === 0) {
        // --foo
        if (arg.indexOf('=') === -1) {
          key = arg.substr(2);
          // --foo value
          if ((i + 1) < args.length && args[i + 1][0] !== '-') {
            value = args[i + 1];
            i++;
          } else {
            value = true;

            if (typeof results[key] !== 'undefined') {
              value = results[key];
            }
          }

          results[key] = value;
        // --bar=baz
        } else {
          key = arg.substr(2, arg.indexOf('=') - 2);
          value = arg.substr(arg.indexOf('=') + 1);
          results[key] = value;
        }
      // -k=value -abc
      } else if (arg.substr(0, 1) === '-') {
        // -k=value
        if (arg.substr(2, 1) === '=') {
          key = arg.substr(1, 1);
          value = arg.substr(3);
          results[key] = value;
        // -abc
        } else {
          chars = arg.substr(1);
          for (j = 0; j < chars.length; j++) {
            key = chars[j];
            value = true;
            if (typeof results[key] !== 'undefined') {
              value = results[key];
            }

            results[key] = value;
          }

          // -a value1 -abc value2
          if ((i + 1) < args.length && args[i + 1][0] !== '-') {
            results[key] = args[i + 1];
            i++;
          }
        }
      } else if (arg.indexOf('=') !== -1) {
        key = arg.substr(0, arg.indexOf('='));
        value = arg.substr(arg.indexOf('=') + 1);
        results[key] = value;
      // plain-arg
      } else {
        results[index++] = arg;
      }
    }

    return results;
  }

  /**
   * Outputs colorful (blue) message
   *
   * @param {String} message
   */
  static info(message) {
    const branded = (Terminal.brand + ' ' + message).trim();
    Terminal.output(branded, "\x1b[36m%s\x1b[0m");
  }

  /**
   * asks for input
   *
   * @param {String} question
   * @param {String} [answer = null]
   *
   * @return {String}
   */
  static async input(question, answer = null) {
    let key = null;
    if (typeof question === 'string') {
      key = 'answer';
      question = {
        type: 'input',
        name: key,
        message: question,
        default: answer
      };
    }

    const answers = await inquirer.prompt([question]);

    if (key) {
      return answers[key];
    }

    return answers;
  }

  /**
   * Terminal Loader
   */
  static load() {
    return new Terminal();
  }

  /**
   * Outputs the given message to the console
   *
   * @param {String} message
   * @param {String} [color = null]
   */
  static output(message, color = null) {
    if (color) {
      console.log(color, message);
      return;
    }

    console.log(message);
  }

  /**
   * Outputs colorful (green) message
   *
   * @param {String} message
   */
  static success(message) {
    const branded = (Terminal.brand + ' ' + message).trim();
    Terminal.output(branded, "\x1b[32m%s\x1b[0m");
  }

  /**
   * Outputs colorful (purple) message
   *
   * @param {String} message
   */
  static system(message) {
    const branded = (Terminal.brand + ' ' + message).trim();
    Terminal.output(branded, "\x1b[33m%s\x1b[0m");
  }

  /**
   * Outputs colorful (orange) message
   *
   * @param {String} message
   */
  static warning(message) {
    const branded = (Terminal.brand + ' ' + message).trim();
    Terminal.output(branded, "\x1b[33m%s\x1b[0m");
  }

  /**
   * Outputs colorful (red) message
   *
   * @param {String} message
   */
  static error(message) {
    const branded = (Terminal.brand + ' ' + message).trim();
    Terminal.output(branded, "\x1b[31m%s\x1b[0m");
  }
}

Terminal.brand = '[geum]';

module.exports = Terminal;
