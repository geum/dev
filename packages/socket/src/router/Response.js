const { Reflection } = require('@geum/core');
const { Response: HttpResponse } = require('@geum/http');

const RouteTrait = require('./response/RouteTrait');

class Response extends HttpResponse {
  /**
   * Response Loader
   *
   * @param {Object} data
   *
   * @return {Response}
   */
  static load(data = {}) {
    return new Response(data);
  }
}

//definition check
Reflection(Response).uses(RouteTrait);

//adapter
module.exports = Response;
