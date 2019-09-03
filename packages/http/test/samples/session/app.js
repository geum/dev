const http = require('http');

const geum = require('../../../src');

const controller = require('./controller');

const app = geum();

const cookie = require('cookie-parser')();
const session = require('express-session')({
  secret: 'keyboard cat',
  cookie: { maxAge: 60000 },
  resave: true,
  saveUninitialized: true
});

//use cookie
app.use(cookie);

//use session
app.use(session);

app.on('request', (req, res) => {
  //load the session
  const incomingMessage = req.IncomingMessage;
  const session = Object.assign({}, incomingMessage.session);
  delete session.cookie;
  req.set('session', session);
  res.set('session', session);
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

const server = http.createServer(app);

//listen to server
server.listen(3000);
