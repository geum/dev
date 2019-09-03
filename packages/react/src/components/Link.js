const React = require('react');

class Link extends React.Component {
  constructor(props) {
    super(props);
    //quirk that is recommended by react. lame.
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    const { replace, to, history } = this.props;

    event.preventDefault();

    if (replace) {
      history.replace(to, {});
      return false;
    }

    history.push(to, {});
    return false;
  }

  render() {
    const { to, children } = this.props;
    const props = { href: to, onClick: this.handleClick };
    return React.createElement('a', props, children);
  }
}

module.exports = Link;
