const { Definition, Response: CoreResponse } = require('@geum/core');

const CookieTrait = require('./response/CookieTrait');
const PageTrait = require('./response/PageTrait');
const SessionTrait = require('./response/SessionTrait');

class Response extends CoreResponse {
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
Definition(Response).uses(CookieTrait, PageTrait, SessionTrait);

//adapter
module.exports = Response;
