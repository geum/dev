#!/usr/bin/env node
const fs = require('fs');
const { Router, Request, Response} = require('@geum/core');
const Terminal = require('../src/Terminal');
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

const router = Router.load();

router.use(events);

router.on('request', (req, res) => {
  req.set('route', 'pwd', pwd);
});

router.on('response', (req, res) => {
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

(() => {
  if (!fs.existsSync(pwd + '/package.json')) {
    return;
  }

  const package = require(pwd + '/package.json');
  if (!package.geum || !package.geum.commands) {
    return;
  }

  if (!(package.geum.commands instanceof Array)) {
    package.geum.commands = [package.geum.commands];
  }

  package.geum.commands.forEach((file) => {
    if (file.indexOf('./') === 0) {
      file = file.substr(2);
    }

    if (file.indexOf('/') !== 0) {
      file = pwd + '/' + file;
    }

    if (!fs.existsSync(file)) {
      return;
    }

    //add it as a middle ware
    router.use(require(file));
  });
})();

(async () => {
  //get the route
  const route = router.route(event);

  //the the args and parameters
  route.args = args;
  route.parameters = parameters;

  //run it
  await route.emit();
})()
