const { EventEmitter } = require('@geum/core');

const event = EventEmitter.load();

event.on('message-create', function(req, res) {
  res.setTarget('all');
  res.setError(false);
  res.setResults(req.getStage('message'));
});

module.exports = event;
