const http = require('http');

const { Application, Socket } = require('../../../src');

const controller = require('./controller');

const app = Application.load();

const cookie = require('cookie-parser')();
const session = require('express-session')({
  secret: 'keyboard cat',
  cookie: { maxAge: 60000 },
  resave: true,
  saveUninitialized: true
});

//use cookie
app.use((req, res) => {
  //transform to async function
  return new Promise(resolve => {
    cookie(req, res, resolve);
  });
});

//use session
app.use((req, res) => {
  //transform to async function
  return new Promise(resolve => {
    session(req, res, resolve)
  });
});

app.on('request', (req, res) => {
  //load the session
  const incomingMessage = req.IncomingMessage;
  const session = Object.assign({}, incomingMessage.session);
  delete session.cookie;
  req.setSession(session);
  res.setSession(session);
});

app.on('response', (req, res) => {
  //unload the session
  const session = req.getSession();
  const incomingMessage = req.IncomingMessage;
  Object.keys(session).forEach(name => {
    incomingMessage.session[name] = session[name];
  });
});

app.use(controller);

app.on('error', (e, req, res) => {
  console.log(e);
  res.setContent(e.message)
})

app.run(() => {
  const server = http.createServer(app.process);

  //listen to server
  server.listen(3000);
});
