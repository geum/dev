const fs = require('fs');
const http = require('http');
const geum = require('../../../src');

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});

const app = geum();

app.public(__dirname + '/assets', '/assets');
app.public(__dirname + '/public');

//make some routes
app.route('/some/path').get((req, res) => {
  res.setContent(
    '<form enctype="multipart/form-data" method="post">' +
    '<input type="text" name="product[product_title]" /><br>' +
    '<input type="file" name="product[product_image]" multiple="multiple" /><br>' +
    '<input type="submit" value="Create Product" />' +
    '</form>'
  );
});

app.post('/some/path', (req, res) => {
  res.setContent('Hello again from /some/path');
});

app.post('/:category/:name', (req, res) => {
  res.setError(true, 'Something went wrong');
  res.setContent('Hello :name from /some/path');
});

app.get('/redirect', (req, res) => {
  return res.redirect('/some/path');
});

app.route('/note.txt').get(async(req, res) => {
  const file = __dirname + '/note.txt';
  res.setHeader('Content-Type', 'text/plain');
  res.setContent(fs.createReadStream(file));
});

app.on('error', (e, req, res) => {
  console.log(e);
  res.setContent(e.message)
})

///default
const server = http.createServer(app);

//listen to server
server.listen(3000);
