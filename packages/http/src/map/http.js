const queryString = require('querystrings');
const formidable = require('formidable');
const cookie = require('cookie');

const { Registry } = require('@geum/core');

const Request = require('../Request');
const Response = require('../Response');

module.exports = {
  async makePayload(incomingMessage, serverResponse) {
    const request = await makeRequest(incomingMessage);
    const response = makeResponse(request, serverResponse);

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
      serverResponse.write(response.getContent());
      //and close the connection
      serverResponse.end();
    }
  }
};

async function makeRequest(incomingMessage) {
  const request = Request.load({
    headers: {},
    get: {},
    post: {},
    server: {},
    session: {},
    cookies: {}
  });

  mapRequestHeaders(request, incomingMessage);
  mapRequestQuery(request, incomingMessage);
  await mapRequestPost(request, incomingMessage);
  mapRequestServer(request, incomingMessage);
  mapRequestStage(request, incomingMessage);
  mapRequestCookies(request, incomingMessage);

  Object.defineProperty(request, 'IncomingMessage', {
    writable: false,
    value: incomingMessage
  });

  return request;
}

function makeResponse(request, serverResponse) {
  const response = Response.load({
    headers: {},
    body: '',
    session: {},
    cookies: {}
  });

  Object.defineProperty(response, 'ServerResponse', {
    writable: false,
    value: serverResponse
  });

  mapResponseHeaders(request, response);
  mapResponseCookies(request, response);
  mapResponseSession(request, response);

  return response;
}

function mapRequestHeaders(request, incomingMessage) {
  request.set('headers', Object.assign({}, incomingMessage.headers));
}

function mapRequestQuery(request, incomingMessage) {
  const url = new URL('http://127.0.0.1' + incomingMessage.url);

  let query = url.search;
  if (query.indexOf('?') === 0) {
    query = query.substr(1);
  }

  if (!query) {
    return;
  }

  request.setQuery(queryString.parse(query));
}

function mapRequestPost(request, incomingMessage) {
  if (!incomingMessage.method || incomingMessage.method.toLowerCase() !== 'post') {
    return;
  }

  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm();
    form.parse(incomingMessage, (error, fields, files) => {
      if (error) {
        return reject(error);
      }

      //clone
      fields = Object.assign({}, fields);
      files = Object.assign({}, files);

      const body = Registry.load();

      Object.keys(fields).forEach(name => {
        //change path to dot notation
        const path = name
          .replace(/\]\[/g, '.')
          .replace('[', '.')
          .replace(/\[/g, '')
          .replace(/\]/g, '');

        //if the field value is not an array
        if (!Array.isArray(fields[name])) {
          //make it an array
          fields[name] = [fields[name]];
        }

        //now loop through each value
        fields[name].forEach(value => {
          //and set the value
          body.setDot(path, value);
        });
      });

      Object.keys(files).forEach(name => {
        //change path to dot notation
        const path = name
          .replace(/\]\[/g, '.')
          .replace('[', '.')
          .replace(/\[/g, '')
          .replace(/\]/g, '');

        //if the field value is not an array
        if (!Array.isArray(files[name])) {
          //make it an array
          files[name] = [files[name]];
        }

        //now loop through each value
        files[name].forEach(value => {
          //and set the value
          body.setDot(path, value);
        });
      });

      request.setPost(body.get());

      resolve();
    });
  });
}

function mapRequestServer(request, incomingMessage) {
  //if the required is not set
  if (!incomingMessage.headers
    || !incomingMessage.headers.host
    || !incomingMessage.url
  ) {
    return;
  }

  let protocol = 'http';
  if (incomingMessage.connection.encrypted) {
    protocol = 'https';
  }

  // Note: X-Forwarded-Proto is normally only ever a
  //       single value, but this is to be safe.
  const header = incomingMessage.headers['x-forwarded-proto'] || protocol;

  if (header.indexOf(',') !== -1) {
    protocol = header.substring(0, header.indexOf(',')).trim();
  }

  protocol = header.trim();

  const url = new URL(protocol
    + '://'
    + incomingMessage.headers.host
    + incomingMessage.url
  );

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

  request.setServer({
    REDIRECT_STATUS: incomingMessage.statusCode,
    HTTP_HOST: url.hostname,
    HTTP_USER_AGENT: incomingMessage.headers['user-agent'] || null,
    HTTP_REFERER: incomingMessage.headers['referer'] || null,
    HTTP_ACCEPT: incomingMessage.headers['accept'] || '*',
    HTTP_ACCEPT_ENCODING: incomingMessage.headers['accept-encoding'] || '*',
    HTTP_ACCEPT_CHARSET: incomingMessage.headers['accept-charset'] || '*',
    HTTP_ACCEPT_LANGUAGE: incomingMessage.headers['accept-language'] || '*',
    HTTP_COOKIE: incomingMessage.headers['cookie'] || '',
    HTTPS: protocol === 'https',
    SERVER_NAME: url.hostname,
    //SERVER_ADDR: ??
    SERVER_PORT: url.port,
    //REMOTE_ADDR: ??
    //DOCUMENT_ROOT: ??
    REDIRECT_URL: request.url,
    SERVER_PROTOCOL: 'HTTP/' + incomingMessage.httpVersion,
    REQUEST_METHOD: incomingMessage.method.toUpperCase(),
    QUERY_STRING: query,
    REQUEST_URI: incomingMessage.url,
    //REQUEST_TIME: ??,
    //SERVER_SIGNATURE: ??
  });
}

function mapRequestStage(request, incomingMessage) {
  const get = JSON.parse(JSON.stringify(request.get('get')));
  const post = JSON.parse(JSON.stringify(request.get('post')));
  request.setStage(Object.assign({}, get, post));
}

function mapRequestCookies(request, incomingMessage) {
  const cookies = (incomingMessage.headers.cookie || '')
    .replace(/; /g, ';')
    .replace(/;/g, '&');

  if (!cookies) {
    return;
  }

  request.set('cookies', queryString.parse(cookies));
}

function mapResponseHeaders(request, response) {
  response.setStatus(200, 'OK');
}

function mapResponseCookies(request, response) {
  response.set('cookies', {});
}

function mapResponseSession(request, response) {
  response.set('session', request.get('session'));
}
