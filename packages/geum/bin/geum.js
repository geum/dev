#!/usr/bin/env node
const fs = require('fs');
const { app, Terminal } = require('../src');
const events = require('../src/events');

const pwd = process.env.PWD;

let args = Array.from(process.argv);

const node = args.shift();
const brand = args.shift();

if (!args.length) {
  args = ['help'];
}

const event = args.shift();
const parameters = Terminal.parseArgs(args) || {};

app.cli.use(events);

app.cli.on('request', (req, res) => {
  req.set('route', 'pwd', pwd);
});

app.cli.on('response', (req, res) => {
  if (req.getStage('output') === 'boundary') {
    Terminal.output('-----------------------------boundary');
    Terminal.output(JSON.stringify(res.get('json')));
    Terminal.output('-----------------------------boundary--');
  } else if (req.getStage('output') === 'pretty') {
    Terminal.output(JSON.stringify(res.get('json'), null, 4));
  } else if (req.getStage('o') || req.getStage('output')) {
    Terminal.output(JSON.stringify(res.get('json')));
  }
});

app.initialize();

(async () => {
  //get the route
  const route = app.cli.route(event);

  //the the args and parameters
  route.args = args;
  route.parameters = parameters;

  //run it
  await route.emit();
})()
