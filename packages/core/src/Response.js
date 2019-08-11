const Definition = require('./Definition');
const Registry = require('./Registry');

const ResponseInterface = require('./contracts/ResponseInterface');

const ContentTrait = require('./response/ContentTrait');
const HeaderTrait = require('./response/HeaderTrait');
const RestTrait = require('./response/RestTrait');
const StatusTrait = require('./response/StatusTrait');

class Response extends Registry {
  /**
   * Response Loader
   *
   * @return {Response}
   */
  static load(message) {
    return new Response();
  }
}

//definition check
Definition(Response).uses(
  ContentTrait,
  HeaderTrait,
  RestTrait,
  StatusTrait
).implements(ResponseInterface);

//adapter
module.exports = Response;
