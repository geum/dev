class RestTrait {
  /**
   * Adds a JSON validation message or sets all the validations
   *
   * @param {String} field
   * @param {String} message
   *
   * @return {RestTrait}
   */
  addValidation(field, message) {
    args = Array.from(arguments);
    return this.set('json', 'validation', ...args);
  }

  /**
   * Returns JSON results if still in array mode
   *
   * @param {*} [...args]
   *
   * @return {*}
   */
  getResults(...args) {
    if (!args.length) {
      return this.get('json', 'results');
    }

    return this.get('json', 'results', ...args);
  }

  /**
   * Returns the message
   *
   * @return {String}
   */
  getMessage() {
    return this.get('json', 'message');
  }

  /**
   * Determines the message type based on error
   *
   * @return {String}
   */
  getMessageType() {
    error = this.get('json', 'error');

    if (error === true) {
      return 'error';
    }

    if (error === false) {
      return 'success';
    }

    return 'info';
  }

  /**
   * Returns JSON validations if still in array mode
   *
   * @param {String} [name = null]
   * @param {*} [...args]
   *
   * @return {*}
   */
  getValidation(name = null, ...args) {
    if (name === null) {
      return this.get('json', 'validation');
    }

    return this.get('json', 'validation', name, ...args);
  }

  /**
   * Returns true if there's an error
   *
   * @return {Boolean}
   */
  hasError() {
    return this.get('json', 'error') === true;
  }

  /**
   * Returns true if there's any JSON
   *
   * @param {String} [...args]
   *
   * @return {Boolean}
   */
  hasJson(...args) {
    if (!args.length) {
      return this.has('json');
    }

    return this.has('json', ...args);
  }

  /**
   * Returns true if there's a message
   *
   * @return {Boolean}
   */
  hasMessage() {
    return this.hasJson('message');
  }

  /**
   * Returns true if there's any results given name
   *
   * @param {*} [...args]
   *
   * @return {Boolean}
   */
  hasResults(...args) {
    return this.hasJson('results', ...args);
  }

  /**
   * Returns true if there's any validations given name
   *
   * @param {*} [...args]
   *
   * @return {Boolean}
   */
  hasValidation(...args) {
    return this.hasJson('validation', ...args);
  }

  /**
   * Returns true if there's no error
   *
   * @return {Boolean}
   */
  isSuccessful() {
    return this.get('json', 'error') === false;
  }

  /**
   * Removes results given name or all of the results
   *
   * @param {String} name Name of the validation
   *
   * @return {RestTrait}
   */
  removeResults(name) {
    args = Array.from(arguments);
    return this.remove('json', 'results', ...args);
  }

  /**
   * Removes a validation given name or all the validations
   *
   * @param {String} name Name of the validation
   *
   * @return {RestTrait}
   */
  removeValidation(name) {
      args = Array.from(arguments);
      return this.remove('json', 'validation', ...args);
  }

  /**
   * Sets a JSON error message
   *
   * @param {Boolean} [status = null] True if there is an error
   * @param {String} [message = null] A message to describe this error
   *
   * @return {RestTrait}
   */
  setError(status = null, message = null) {
    this.set('json', 'error', status);

    if (message !== null) {
      this.set('json', 'message', message);
    }

    return this;
  }

  /**
   * Sets a JSON result
   *
   * @param {*} data
   * @param {*} [...args]
   *
   * @return {RestTrait}
   */
  setResults(data, ...args) {
    if (Array.isArray(data)) {
      return this.set('json', 'results', data);
    }

    return this.set('json', 'results', data, ...args);
  }
}

//adapter
module.exports = RestTrait;
