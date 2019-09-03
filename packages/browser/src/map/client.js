const cookie = require('cookie');
const makeRequest = require('./request');
const makeResponse = require('./response');

module.exports = {
  payload(router, window, location) {
    const request = router.RequestInterface.load();

    Object.defineProperty(request, 'window', { writable: false, value: window });
    Object.defineProperty(request, 'location', { writable: false, value: location });

    makeRequest(request);

    const response = router.ResponseInterface.load();

    Object.defineProperty(response, 'window', { writable: false, value: window });
    Object.defineProperty(response, 'location', { writable: false, value: location });

    makeResponse(response);

    return { request, response };
  },

  dispatch(response) {
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
    response.setHeader('Set-Cookie', cookies);

    //set the cookies
    cookies.forEach(cookie => {
      response.window.document.cookie = cookie;
    });

    //case for redirect
    if (response.hasHeader('Location')) {
      const location = response.getHeader('Location');
      response.removeHeader('Location');
      response.location.replace(location, response.location.state || {});
    }

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

    if (response.hasContent()) {
      const target = response.get('target');
      if (target) {
        const element = response.window.document.querySelector(target);
        if (element) {
          element.innerHTML = String(response.getContent());
        }

        return;
      }

      response.window.document.write(response.getContent());
    }
  }
};
