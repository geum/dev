const React = require('react');
const { Link } = require('react-router-dom');

class Page extends React.Component {
  render() {
    return (
      <html>
        <head>
          <meta charSet="utf-8" />
          <title>React Server</title>
          <script dangerouslySetInnerHTML={{__html: this.props.initialState}} />
        </head>
        <body>
          <div id="app">
            <ul>
              <li><Link to="/" activeStyle={{fontWeight: 'bold'}} onlyActiveOnIndex>Home</Link></li>
              <li><Link to="/about" activeStyle={{fontWeight: 'bold'}}>About Us</Link></li>
            </ul>
            {this.props.children}
            <p style={{marginTop: '4em', textAlign: 'center'}}>Made with &hearts; in 2019</p>
          </div>

          {/* Delete or comment out script tags in this block when using webpack */}
          {/**/}
          <script src="https://cdnjs.cloudflare.com/ajax/libs/react/0.14.7/react.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/react/0.14.7/react-dom.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/react-router-dom/5.0.1/react-router-dom.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.6.15/browser.js"></script>
          <script src="/require-shims.js"></script>
          <script type="text/babel" src="/App.js"></script>
          <script type="text/babel" src="/client.js"></script>
          {/**/}
          {/* End of scripts to remove when using webpack */}

          <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.0/jquery.min.js"></script>
        </body>
      </html>
    )
  }
}

module.exports = Page;
