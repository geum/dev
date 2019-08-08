const { DataRegistry } = require('../../data');

class RequestStage extends DataRegistry {
  /**
   * Stage Loader, while injecting the content into the given request
   *
   * @param {IncomingMessage}
   *
   * @return {RequestStage}
   */
  static async load(request) {
    //inject get into the request object
    const registry = request.stage = new RequestStage();

    //get the get and post and the variables from path which we dont know right now....
    registry.data = Object.assign({}, request.get.data, request.post.data);

    return registry;
  }
}

//adapter
module.exports = RequestStage;