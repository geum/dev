module.exports = (response) => {
  response.set({
    headers: {},
    body: '',
    cookies: {}
  });

  populateHeaders(response);
  populateCookies(response);
};

function populateHeaders(response) {
  response.setStatus(200, 'OK');
}

function populateCookies(response) {
  response.set('cookies', {});
}
