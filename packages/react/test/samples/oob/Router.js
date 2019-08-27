const React = require('react');
const { StaticRouter, Route } = require('react-router');
const App = require('./App');

module.exports = (url, context) => {
  return (
    <StaticRouter location={url} context={context}>
      <App />
    </StaticRouter>
  );
}
