const React = require('react');
const { renderToString } = require('react-dom/server');
const { createMemoryHistory } = require('history');

const Page = require('./Page.jsx');
const router = require('../client/router.jsx');

const history = createMemoryHistory();

module.exports = (react, app) => {
  router.get('/some/path', (request, response) => {
    const App = React.createElement(react.App, { response, history });
    const page = renderToString(React.createElement(Page, { title: 'Some Path' }, App));
    response.setContent('<!DOCTYPE html>' + page);
  });

  router.get('/some/other/path', (request, response) => {
    const App = React.createElement(react.App, { response, history });
    const page = renderToString(React.createElement(Page, { title: 'Some Other Path' }, App));
    response.setContent('<!DOCTYPE html>' + page);
  });

  return router;
};
