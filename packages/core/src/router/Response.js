const Definition = require('../Definition');
const Registry = require('../Registry');

const ResponseInterface = require('../contracts/ResponseInterface');

const ContentTrait = require('./response/ContentTrait');
const HeaderTrait = require('./response/HeaderTrait');
const RestTrait = require('./response/RestTrait');
const StatusTrait = require('./response/StatusTrait');

class Response extends Registry {
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
Definition(Response).uses(
  ContentTrait,
  HeaderTrait,
  RestTrait,
  StatusTrait
).implements(ResponseInterface);

//adapter
module.exports = Response;
