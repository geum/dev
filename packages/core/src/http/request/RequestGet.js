const queryString = require('querystrings');
const { DataRegistry } = require('../../data');

class RequestGet extends DataRegistry {
  /**
   * GET Loader, while injecting the content into the given request
   *
   * @param {IncomingMessage}
   *
   * @return {RequestGet}
   */
  static async load(request) {
    //inject get into the request object
    const registry = request.get = new RequestGet();

    //parse url
    const url = new URL('http://' + request.headers.host + request.url);

    let query = url.search;
    if (query.indexOf('?') === 0) {
      query = query.substr(1);
    }

    //set get
    registry.data = queryString.parse(query);

    return registry;
  }
}

//adapter
module.exports = RequestGet;
