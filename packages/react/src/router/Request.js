const { Request: HttpRequest } = require('@geum/http');

class Request extends HttpRequest {
  /**
   * Request Loader
   *
   * @param {Object} data
   *
   * @return {Request}
   */
  static load(data = {}) {
    return new Request(data);
  }
}

//adapter
module.exports = Request;
