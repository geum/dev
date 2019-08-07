const HttpException = require('../HttpException');

/**
 * Server contract
 */
class ServerInterface {
  /**
   * Processor to add to the process stack
   *
   * @param {RequestInterface} request
   * @param {ResponseInterface} response
   *
   * @return {ServerInterface}
   */
  async processor(request, response) {
    throw HttpException.forUndefinedAbstract('processor');
  }
}

//adapter
module.exports = ServerInterface;
