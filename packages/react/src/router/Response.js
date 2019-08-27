const { Definition } = require('@geum/core');
const { Response: HttpResponse } = require('@geum/http');

const ComponentTrait = require('./response/ComponentTrait');

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
Definition(Response).uses(ComponentTrait);

//adapter
module.exports = Response;
