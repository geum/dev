const { Reflection, Request: CoreRequest } = require('@geum/core');

const CookieTrait = require('./request/CookieTrait');
const PostTrait = require('./request/PostTrait');
const QueryTrait = require('./request/QueryTrait');
const ServerTrait = require('./request/ServerTrait');

class Request extends CoreRequest {
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

//definition check
Reflection(Request).uses(
  CookieTrait,
  PostTrait,
  QueryTrait,
  ServerTrait
);

//adapter
module.exports = Request;
