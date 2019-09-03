const { Router } = require('../../../src');
const router = Router.load();

const menu = [
  '<a href="/some/path?foo=bar">Some Path</a>',
  '<a href="/some/other/path?foo=bar">Some Other Path</a>'
];

router.get('/some/path', function(req, res) {
  res.target = '#root';
  res.content = menu.join('') + '<h1>Some Path</h1>';
});

router.get('/some/other/path', function(req, res) {
  res.target = '#root';
  res.content = menu.join('') + '<h1>Some Other Path</h1>';
});

module.exports = router;
