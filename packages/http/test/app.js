const http = require('http');
const { Application, Router } = require('../src');

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});

const app = Application.load();

//make some routes
app.route('/some/path').get((req, res) => {
  res.content.set(
    '<form enctype="multipart/form-data" method="post">' +
    '<input type="text" name="product[product_title]" /><br>' +
    '<input type="file" name="product[product_image]" multiple="multiple" /><br>' +
    '<input type="submit" value="Create Product" />' +
    '</form>'
  );
});

app.post('/some/path', (req, res) => {
  res.content.set('Hello again from /some/path');
});

app.post('/:category/:name', (req, res) => {
  res.rest.setError(true, 'Something went wrong');
  res.content.set('Hello :name from /some/path');
});

app.on('error', (e, req, res) => {
  throw e
})

///default
const server = http.createServer(app.process);

//initialze the app
app.initialize();

//listen to server
server.listen(3000);
