const Definition = require('./Definition');
const Registry = require('./Registry');

const RequestInterface = require('./contracts/RequestInterface');

const ContentTrait = require('./request/ContentTrait');
const HeaderTrait = require('./request/HeaderTrait');
const StageTrait = require('./request/StageTrait');

class Request extends Registry {
  /**
   * Request Loader
   *
   * @return {Request}
   */
  static load() {
    return new Request();
  }
}

//definition check
Definition(Request).uses(
  ContentTrait,
  HeaderTrait,
  StageTrait
).implements(RequestInterface);

//adapter
module.exports = Request;
