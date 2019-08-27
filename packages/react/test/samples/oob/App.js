const React = require('react');
const Page = require('./Page');

class App extends React.Component {
  render() {
    return (
      <Page>
        <h1>Hello, World!</h1>
      </Page>
    )
  }
}

module.exports = App;
