const React = require('react');
const { Router } = require('@geum/browser');

const react = require('../../../../src');
const { Link } = react;

const router = Router.load();
router.use(react());

const Menu = (props) => {
  const history = props.response.history;
  return (
    <ul>
      <li><Link to="/some/path?foo=bar" history={history}>Some Path</Link></li>
      <li><Link to="/some/other/path?foo=bar" history={history}>Some Other Path</Link></li>
    </ul>
  );
}

router.get('/some/path', function(req, res) {
  res.component = (
    <div>
      <Menu response={res} />
      <h1>Some Path</h1>
    </div>
  )
});

router.get('/some/other/path', function(req, res) {
  res.component = (
    <div>
      <Menu response={res} />
      <h1>Some Other Path</h1>
    </div>
  )
});

module.exports = router;
