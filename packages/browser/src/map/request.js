const queryString = require('querystrings');

module.exports = (request) => {
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
  populateServer(request);
  populateRoute(request);
  populateStage(request);
  populateCookies(request);
};

function populateHeaders(request) {
  request.set('headers', {
    Cookie: request.window.document.cookie,
    Host: location.host,
    Referer: request.window.document.referrer,
    "Status-Code": 200,
    "User-Agent": request.window.navigator.userAgent
  });
}

function populateQuery(request) {
  let query = request.location.search;
  if (query.indexOf('?') === 0) {
    query = query.substr(1);
  }

  if (!query) {
    return;
  }

  request.set('query', query).set('get', queryString.parse(query));
}

function populateServer(request) {
  request.set('server', {
    REDIRECT_STATUS: 200,
    HTTP_HOST: request.window.location.host,
    HTTP_USER_AGENT: request.window.navigator.userAgent,
    HTTP_REFERER: request.window.document.referrer,
    HTTP_COOKIE: request.window.document.cookie,
    HTTPS: request.location.protocol === 'https:',
    SERVER_NAME: request.window.location.host,
    SERVER_PORT: request.window.location.port || 80,
    REDIRECT_URL: request.location.pathname + request.location.search,
    REQUEST_METHOD: 'GET',
    QUERY_STRING: request.location.search.substr(1),
    REQUEST_URI: request.location.pathname + request.location.search
  });
}

function populateRoute(request) {
  request
    .set('path', 'string', request.location.pathname)
    .set('path', 'array', request.location.pathname.split('/'))
    .set('method', 'GET');
}

function populateStage(request) {
  const get = JSON.parse(JSON.stringify(request.get('get')));
  const post = JSON.parse(JSON.stringify(request.get('post')));
  request.setStage(Object.assign({}, get, post));
}

function populateCookies(request) {
  const cookies = (request.window.document.cookie || '')
    .replace(/; /g, ';')
    .replace(/;/g, '&');

  if (!cookies) {
    return;
  }

  request.set('cookies', queryString.parse(cookies));
}
