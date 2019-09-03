require('@babel/register')({ presets: [ '@babel/preset-react' ] });
const path = require('path');
//main app
const app = require('./http');

//get middleware
const { dev, hot } = require('@geum/webpack')(
  './client/App.jsx',
  path.resolve(__dirname, '../client/')
);

const router = require('./router');
const react = require('../../../../src');

//add middleware
app.use(dev, hot, react(), router(react, app));

// for troubleshooting
process.on('unhandledRejection', error => {
  throw error;
});
