const { Registry } = require('@geum/core');

class RequestServer extends Registry {
  /**
   * SERVER Loader, while injecting the content into the given request
   *
   * @param {IncomingMessage}
   *
   * @return {RequestServer}
   */
  static async load(request) {
    //inject get into the request object
    const registry = new RequestServer();

    //if the required is not set
    if (!request.headers || !request.headers.host || !request.url) {
      //dont load
      return registry;
    }

    //parse url
    const protocol = RequestServer.getProtocol(request);
    const host = request.headers.host;
    const url = new URL(protocol + '://' + host + request.url);

    //LEGEND:
    // url.hash - #foo
    // url.host - 127.0.0.1:3000
    // url.hostname - 127.0.0.1
    // url.href - http://127.0.0.1:3000/some/path?lets=dothis
    // url.origin - http://127.0.0.1:3000
    // url.password - ??
    // url.pathname - /some/path
    // url.port - 3000
    // url.protocol - http:
    // url.search - ?lets=dothis

    let query = url.search;
    if (query.indexOf('?') === 0) {
      query = query.substr(1);
    }

    //set server things
    const server = {
      REDIRECT_STATUS: request.statusCode,
      HTTP_HOST: url.hostname,
      HTTP_USER_AGENT: request.headers['user-agent'] || null,
      HTTP_REFERER: request.headers['referer'] || null,
      HTTP_ACCEPT: request.headers['accept'] || '*',
      HTTP_ACCEPT_ENCODING: request.headers['accept-encoding'] || '*',
      HTTP_ACCEPT_CHARSET: request.headers['accept-charset'] || '*',
      HTTP_ACCEPT_LANGUAGE: request.headers['accept-language'] || '*',
      HTTP_COOKIE: request.headers['cookie'] || '',
      HTTPS: protocol === 'https',
      SERVER_NAME: url.hostname,
      //SERVER_ADDR: ??
      SERVER_PORT: url.port,
      //REMOTE_ADDR: ??
      //DOCUMENT_ROOT: ??
      REDIRECT_URL: request.url,
      SERVER_PROTOCOL: 'HTTP/' + request.httpVersion,
      REQUEST_METHOD: request.method.toUpperCase(),
      QUERY_STRING: query,
      REQUEST_URI: request.url,
      //REQUEST_TIME: ??,
      //SERVER_SIGNATURE: ??
    };

    //set the post
    registry.data = server;

    return registry;
  }

  /**
   * Determines the server encryption protocol
   *
   * @param {IncomingMessage}
   *
   * @return {String}
   */
  static getProtocol(request) {
    let protocol = 'http';
    if (request.connection.encrypted) {
      protocol = 'https';
    }

    // Note: X-Forwarded-Proto is normally only ever a
    //       single value, but this is to be safe.
    const header = request.headers['x-forwarded-proto'] || protocol;

    if (header.indexOf(',') !== -1) {
      return header.substring(0, index).trim();
    }

    return header.trim();
  }
}

//adapter
module.exports = RequestServer;
