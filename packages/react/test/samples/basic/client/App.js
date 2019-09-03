require('@babel/polyfill');

const React = require('react');
const ReactDOM = require('react-dom');
const { createBrowserHistory } = require('history');

const browser = require('@geum/browser');

const react = require('../../../../src');
const router = require('./router');

const history = createBrowserHistory();
const app = browser();

//this is the same as the server
app.use(react(), router);

//track errors
app.on('error', (e, req, res) => {
  console.log(e);
});

//this is similar to http.createServer()
history.listen(app);

(async() => {
  const { App } = react;
  const response = await app.bootstrap(history.location, history.action);

  ReactDOM.render(
    <App browser={app} response={response} history={history} />,
    document.getElementById('root')
  );
})();
