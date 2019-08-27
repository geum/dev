const ReactDOM = require('react-dom');
const { BrowserRouter } = require('react-router-dom');
const App = require('./App');

const Home = require('./screens/Home');
const About = require('./screens/About');

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('app')
);
