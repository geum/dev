const Exception = require('../Exception');

/**
 * This is an exception marker so we specifically know what section threw it
 */
class HttpException extends Exception {}

//adapter
module.exports = HttpException;
