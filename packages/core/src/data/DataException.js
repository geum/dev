const Exception = require('../Exception');

/**
 * This is an exception marker so we specifically know what section threw it
 */
class DataException extends Exception {}

//adapter
module.exports = DataException;
