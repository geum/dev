const { Definition, Response: CoreResponse } = require('@geum/core');

const CookieTrait = require('./response/CookieTrait');
const PageTrait = require('./response/PageTrait');
const RouteTrait = require('./response/RouteTrait');
const SessionTrait = require('./response/SessionTrait');

class Response extends CoreResponse {
  /**
   * Response Loader
   *
   * @return {Response}
   */
  static load(data = {}) {
    return new Response(data);
  }
}

//definition check
Definition(Response).uses(CookieTrait, PageTrait, RouteTrait, SessionTrait);

//adapter
module.exports = Response;
