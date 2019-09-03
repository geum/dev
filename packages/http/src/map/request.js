const queryString = require('querystrings');
const formidable = require('formidable');

const { Registry } = require('@geum/core');

module.exports = async(request) => {
  request.set({
    headers: {},
    get: {},
    post: {},
    server: {},
    session: {},
    cookies: {}
  });

  populateHeaders(request);
  populateQuery(request);
  await populatePost(request);
  populateServer(request);
  populateRoute(request);
  populateStage(request);
  populateCookies(request);
};

function populateHeaders(request) {
  const message = request.IncomingMessage;
  request.set('headers', Object.assign({}, message.headers));
}

function populateQuery(request) {
  const message = request.IncomingMessage;
  const url = new URL('http://127.0.0.1' + message.url);

  let query = url.search;
  if (query.indexOf('?') === 0) {
    query = query.substr(1);
  }

  if (!query) {
    return;
  }

  request.set('query', query).set('get', queryString.parse(query));
}

function populatePost(request) {
  const message = request.IncomingMessage;
  if (!message.method || message.method.toLowerCase() !== 'post') {
    return;
  }

  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm();
    form.parse(message, (error, fields, files) => {
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

      request.set('post', body.get());

      resolve();
    });
  });
}

function populateServer(request) {
  const message = request.IncomingMessage;
  //if the required is not set
  if (!message.headers
    || !message.headers.host
    || !message.url
  ) {
    return;
  }

  let protocol = 'http';
  if (message.connection.encrypted) {
    protocol = 'https';
  }

  // Note: X-Forwarded-Proto is normally only ever a
  //       single value, but this is to be safe.
  const header = message.headers['x-forwarded-proto'] || protocol;

  if (header.indexOf(',') !== -1) {
    protocol = header.substring(0, header.indexOf(',')).trim();
  }

  protocol = header.trim();

  const url = new URL(protocol + '://' + message.headers.host + message.url);

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

  request.set('server', {
    REDIRECT_STATUS: message.statusCode,
    HTTP_HOST: url.hostname,
    HTTP_USER_AGENT: message.headers['user-agent'] || null,
    HTTP_REFERER: message.headers['referer'] || null,
    HTTP_ACCEPT: message.headers['accept'] || '*',
    HTTP_ACCEPT_ENCODING: message.headers['accept-encoding'] || '*',
    HTTP_ACCEPT_CHARSET: message.headers['accept-charset'] || '*',
    HTTP_ACCEPT_LANGUAGE: message.headers['accept-language'] || '*',
    HTTP_COOKIE: message.headers['cookie'] || '',
    HTTPS: protocol === 'https',
    SERVER_NAME: url.hostname,
    //SERVER_ADDR: ??
    SERVER_PORT: url.port,
    //REMOTE_ADDR: ??
    //DOCUMENT_ROOT: ??
    REDIRECT_URL: request.url,
    SERVER_PROTOCOL: 'HTTP/' + message.httpVersion,
    REQUEST_METHOD: message.method.toUpperCase(),
    QUERY_STRING: query,
    REQUEST_URI: message.url,
    //REQUEST_TIME: ??,
    //SERVER_SIGNATURE: ??
  });
}

function populateRoute(request) {
  const message = request.IncomingMessage;
  const url = new URL('http://' + message.headers.host + message.url);

  request
    .set('path', 'string', url.pathname)
    .set('path', 'array', url.pathname.split('/'))
    .set('method', message.method.toUpperCase());
}

function populateStage(request) {
  const get = JSON.parse(JSON.stringify(request.get('get')));
  const post = JSON.parse(JSON.stringify(request.get('post')));
  request.setStage(Object.assign({}, get, post));
}

function populateCookies(request) {
  const message = request.IncomingMessage;
  const cookies = (message.headers.cookie || '')
    .replace(/; /g, ';')
    .replace(/;/g, '&');

  if (!cookies) {
    return;
  }

  request.set('cookies', queryString.parse(cookies));
}
