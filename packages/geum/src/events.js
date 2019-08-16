const { EventEmitter } = require('@geum/core');
const Terminal = require('./Terminal');

const commands = EventEmitter.load();

commands.on('version', async(req, res) => {
  const config = require('../package.json');
  req.setStage('o', true);
  res.setResults(config.version);
});

commands.on('help', async(req, res) => {
  Terminal.error('TODO');
});

commands.on('install', async(req, res) => {
  Terminal.error('TODO');
});

//adapter
module.exports = commands;
