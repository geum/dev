const React = require('react');

class Page extends React.Component {
  render() {
    const title = this.props.title;
    return (
      <html>
        <head>
          <meta charSet="utf-8" />
          <title>{title}</title>
        </head>
        <body>
          <div id="root">
            {this.props.children}
          </div>
          <noscript>
            You need to enable JavaScript to run this app.
          </noscript>
          <script src="/bundle.js"></script>
        </body>
      </html>
    );
  }
}

module.exports = Page;
