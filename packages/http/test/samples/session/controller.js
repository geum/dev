const fs = require('fs');
const { Router } = require('../../../src');

const router = Router.load();

router.get('/', (req, res) => {
  res.setContent('Hello World');
});

router.route('/cookie').get((req, res) => {
  const views = (req.getCookie('views') || 0) + 1;
  res.setContent(`Viewed ${views} times`);
  res.setCookie('views', views);
});

router.route('/session').get((req, res) => {
  const views = (req.getSession('views') || 0) + 1;
  res.setContent(`Viewed ${views} times`);
  res.setSession('views', views);
});

module.exports = router;
