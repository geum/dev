module.exports = (response) => {
  response.set({
    headers: {},
    body: '',
    session: {},
    cookies: {}
  });

  populateHeaders(response);
  populateCookies(response);
  populateSession(response);
};

function populateHeaders(response) {
  response.setStatus(200, 'OK');
}

function populateCookies(response) {
  response.set('cookies', {});
}

function populateSession(response) {
  response.set('session', {});
}
