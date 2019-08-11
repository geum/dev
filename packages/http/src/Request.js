const { Definition, Request: CoreRequest } = require('@geum/core');

const CookieTrait = require('./request/CookieTrait');
const PostTrait = require('./request/PostTrait');
const QueryTrait = require('./request/QueryTrait');
const RouteTrait = require('./request/RouteTrait');
const ServerTrait = require('./request/ServerTrait');
const SessionTrait = require('./request/SessionTrait');

class Request extends CoreRequest {
  /**
   * Request Loader
   *
   * @return {Request}
   */
  static load(data = {}) {
    return new Request(data);
  }
}

//definition check
Definition(Request).uses(
  CookieTrait,
  PostTrait,
  QueryTrait,
  RouteTrait,
  ServerTrait,
  SessionTrait
);

//adapter
module.exports = Request;
