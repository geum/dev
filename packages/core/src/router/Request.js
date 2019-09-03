const Reflection = require('../Reflection');
const Registry = require('../Registry');

const RequestInterface = require('../contracts/RequestInterface');

const ContentTrait = require('./request/ContentTrait');
const HeaderTrait = require('./request/HeaderTrait');
const RouteTrait = require('./request/RouteTrait');
const StageTrait = require('./request/StageTrait');

class Request extends Registry {
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
  ContentTrait,
  HeaderTrait,
  RouteTrait,
  StageTrait
).implements(RequestInterface);

//adapter
module.exports = Request;
