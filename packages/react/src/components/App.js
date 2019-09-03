const React = require('react');

const { Reflection } = require('@geum/core');
const ComponentTrait = require('../ComponentTrait');

class App extends React.Component {
  constructor(props) {
    super(props);

    const { browser, response, history } = this.props;

    //only for browser
    if (browser) {
      browser.on('response', this.handleResponse.bind(this));
    }

    //merge the history
    response.history = history;

    //initial state
    this.state = { response };
  }

  handleResponse(request, response) {
    //if there is no target
    if (!response.target) {
      const { history } = this.props;
      //merge the history
      response.history = history;
      //update the state with the new response
      this.setState(state => {
        return { response };
      });
    }

    //if there is a target, we want to allow
    //them to process without the App component
  }

  render() {
    //get the response
    const response = this.state.response;

    //if there is no component
    if (!response.hasContent()) {
      return null;
    }

    //get the component
    const content = response.getContent();

    //prevent geum/browser from writing
    //react will take it from there
    response.remove('body');

    //if component is a react component
    if (response.isReactComponent()) {
      //make it to an element
      return React.createElement(content, { response });
    }

    //should be an element
    return content;
  }
}

module.exports = App;
