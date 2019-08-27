require('@babel/register')({ presets: [ '@babel/preset-react' ] });

const fs = require('fs');
const { createServer } = require('http');

const { renderToString } = require('react-dom/server');

const Router = require('./Router');
// --> Router -> Page -> App


createServer((req, res) => {
  switch (req.url) {
    case '/require-shims.js':
    case '/App.js':
    case '/client.js':
      res.setHeader('Content-Type', 'text/javascript');
      fs.createReadStream(__dirname + req.url).pipe(res);
      return;
  }

  const context = {};
  const router = Router(req.url, context);
  const html = renderToString(router);

  if (context.url) {
    res.writeHead(301, { Location: context.url });
    res.end();
  } else {
    res.write(`<!doctype html>${html}`);
    res.end();
  }
}).listen(3000);
