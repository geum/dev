const { Exception } = require('@geum/core');

/**
 * This is an exception marker so we specifically know what section threw it
 */
class BrowserException extends Exception {}

//adapter
module.exports = BrowserException;
