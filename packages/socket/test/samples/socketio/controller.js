const fs = require('fs');
const { Router } = require('../../../src');
const events = require('./events');

const router = Router.load();

router.get('/', (req, res) => {
  res.setContent('Hello World');
});

router.get('/message/create', async(req, res) => {
  await events.emit('message-create', req, res);
});

router.route('/socketio').get(async(req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setContent(fs.createReadStream(__dirname + '/socketio.html'));
});

router.route('/jquery.min.js').get(async(req, res) => {
  res.setHeader('Content-Type', 'text/javascript');
  res.setContent(fs.createReadStream(__dirname + '/jquery.min.js'));
});

module.exports = router;
