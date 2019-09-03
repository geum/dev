const cookie = require('cookie');
const makeRequest = require('./request');
const makeResponse = require('./response');

module.exports = {
  async payload(router, incomingMessage, serverResponse) {
    const request = router.RequestInterface.load();

    Object.defineProperty(request, 'IncomingMessage', {
      writable: false,
      value: incomingMessage
    });

    await makeRequest(request);

    const response = router.ResponseInterface.load();

    Object.defineProperty(response, 'ServerResponse', {
      writable: false,
      value: serverResponse
    });

    makeResponse(response);

    response.set('session', request.get('session'));

    return { request, response };
  },

  dispatch(response) {
    const serverResponse = response.ServerResponse;
    //serialize all the cookies
    const cookies = [];
    Object.keys(response.getCookie()).forEach(name => {
      let value = response.getCookie(name).value;
      const options = response.getCookie(name).options;

      //if value is null
      if (value === null) {
        //lets expire
        value = '';
        const expire = new Date().getTime() - 1000000;
        options.expires = new Date(expire);
      }

      cookies.push(cookie.serialize(name, String(value), options));
    });

    //set the message cookie headers
    serverResponse.setHeader('Set-Cookie', cookies);

    //if there's no content but theres rest
    if (!response.hasContent() && response.hasJson()) {
      //set the content to rest
      response.setHeader('Content-Type', 'text/json');
      response.setContent(response.get('json'));
    }

    //if no content type
    if (!response.getHeader('Content-Type')) {
      //make it html
      response.setHeader('Content-Type', 'text/html; charset=utf-8');
    }

    serverResponse.statusCode = parseInt(response.get('code')) || 200;
    serverResponse.statusMessage = response.get('status') || 'OK';

    //copy all the headers to the message
    const headers = response.getHeader();
    if (Object.keys(headers).length) {
      Object.keys(headers).forEach(name => {
        serverResponse.setHeader(name, headers[name]);
      });
    }

    //if we can stream
    if (response.isContentStreamable()) {
      //pipe it through
      response.getContent().pipe(serverResponse);
    //else if theres content
    } else if (response.hasContent()) {
      //manually write the content
      serverResponse.write(String(response.getContent()));
      //and close the connection
      serverResponse.end();
    }
  }
};
