require('@babel/register')({ presets: [ '@babel/preset-react' ] });

//Hello World example
const ReactDOMServer = require('react-dom/server');
const Header = require('./Header.jsx');

const header = ReactDOMServer.renderToString(Header);
console.log(header);
