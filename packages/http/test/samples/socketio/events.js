const { EventEmitter } = require('@geum/core');

const event = EventEmitter.load();

event.on('message-create', function(req, res) {
  res.rest.setError(false);
  res.rest.setResults(req.stage.get('message'));
});

module.exports = event;
