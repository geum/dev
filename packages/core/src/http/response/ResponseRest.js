const { DataRegistry } = require('../../data');

class ResponseRest extends DataRegistry {
  /**
   * REST Loader, while injecting the content into the given response
   *
   * @param {ServerResponse}
   *
   * @return {ResponseRest}
   */
  static async load(response) {
    //inject get into the request object
    const registry = response.rest = new ResponseRest();

    return registry;
  }

  /**
   * REST Loader, while injecting the content into the given response
   *
   * @param {IncomingMessage}
   * @param {ServerResponse}
   *
   * @return {ServerResponse}
   */
  async unload(request, response) {
    //if there's no content
    if (response.content.empty() && !response.rest.empty()) {
      response.setHeader('Content-Type', 'text/json');
      response.content.set(this.data);
    }

    return response;
  }

  /**
   *  Returns true if empty
   *
   * @return {Boolean}
   */
  empty() {
    return Object.keys(this.data).length === 0;
  }

  /**
   * Returns REST results if still in array mode
   *
   * @param {*} [...args]
   *
   * @return {*}
   */
  getResults(...args) {
    if (!args.length) {
      return this.get('results');
    }

    return this.get('results', ...args);
  }

  /**
   * Returns the message
   *
   * @return {String}
   */
  getMessage() {
    return this.get('message');
  }

  /**
   * Determines the message type based on error
   *
   * @return {String}
   */
  getMessageType() {
    error = this.get('error');

    if (error === true) {
      return 'error';
    }

    if (error === false) {
      return 'success';
    }

    return 'info';
  }

  /**
   * Returns REST validations if still in array mode
   *
   * @param {String} [name = null]
   * @param {*} [...args]
   *
   * @return {*}
   */
  getValidation(name = null, ...args) {
    if (name === null) {
      return this.get('validation');
    }

    return this.get('validation', name, ...args);
  }

  /**
   * Returns true if there's an error
   *
   * @return {Boolean}
   */
  hasError() {
    return this.get('error') === true;
  }

  /**
   * Returns true if there's a message
   *
   * @return {Boolean}
   */
  hasMessage() {
    return this.has('message');
  }

  /**
   * Returns true if there's any results given name
   *
   * @param {*} [...args]
   *
   * @return {Boolean}
   */
  hasResults(...args) {
    return this.has('results', ...args);
  }

  /**
   * Returns true if there's any validations given name
   *
   * @param {*} [...args]
   *
   * @return {Boolean}
   */
  hasValidation(...args) {
    return this.has('validation', ...args);
  }

  /**
   * Returns true if there's no error
   *
   * @return {Boolean}
   */
  isSuccessful() {
    return this.get('error') === false;
  }

  /**
   * Removes results given name or all of the results
   *
   * @param {String} name Name of the validation
   *
   * @return {ResponseRest}
   */
  removeResults(name) {
    args = Array.from(arguments);
    return this.remove('results', ...args);
  }

  /**
   * Removes a validation given name or all the validations
   *
   * @param {String} name Name of the validation
   *
   * @return {ResponseRest}
   */
  removeValidation(name) {
      args = Array.from(arguments);
      return this.remove('validation', ...args);
  }

  /**
   * Sets a REST error message
   *
   * @param {Boolean} [status = null] True if there is an error
   * @param {String} [message = null] A message to describe this error
   *
   * @return {ResponseRest}
   */
  setError(status = null, message = null) {
    this.set('error', status);

    if (message !== null) {
      this.set('message', message);
    }

    return this;
  }

  /**
   * Sets a REST result
   *
   * @param {*} data
   * @param {*} [...args]
   *
   * @return {ResponseRest}
   */
  setResults(data, ...args) {
    if (Array.isArray(data)) {
      return this.set('results', data);
    }

    return this.set('results', data, ...args);
  }

  /**
   * Adds a REST validation message or sets all the validations
   *
   * @param {String} field
   * @param {String} message
   *
   * @return {ResponseRest}
   */
  setValidation(field, message) {
    args = Array.from(arguments);
    return this.set('validation', ...args);
  }
}

//adapter
module.exports = ResponseRest;
