const React = require('react');
const { renderToString } = require('react-dom/server');

const { Reflection } = require('@geum/core');
const ComponentTrait = require('./ComponentTrait');

const App = require('./components/App');
const Link = require('./components/Link');
//const Page = require('./components/Page');

module.exports = (history = null, Page = null, App = null) => {
  //determine the app
  App = App || module.exports.App;

  return {
    browser(router, priority) {
      Reflection(router.ResponseInterface).uses(ComponentTrait);
    },

    core(router, priority) {
      Reflection(router.ResponseInterface).uses(ComponentTrait);
    },

    http(router, priority) {
      Reflection(router.ResponseInterface).uses(ComponentTrait);
    }
  };
};

module.exports.App = App;
module.exports.Link = Link;
//module.exports.Page = Page;
