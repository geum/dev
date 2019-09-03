## Install

```bash
$ npm i --save @geum/browser
```

## Usage

```js
require('@babel/polyfill');
const { createBrowserHistory } = require('history');
const browser = require('@geum/browser');
const history = createBrowserHistory();

const app = browser();

const menu = [
  '<a href="/some/path?foo=bar">Some Path</a>',
  '<a href="/some/other/path?foo=bar">Some Other Path</a>'
];

app.get('/some/path', function(req, res) {
  res.target = '#root';
  res.content = menu.join('') + '<h1>Some Path</h1>';
});

app.get('/some/other/path', function(req, res) {
  res.target = '#root';
  res.content = menu.join('') + '<h1>Some Other Path</h1>';
});

const routeTo = (event) => {
  const href = this.getAttribute('href');
  const target = this.getAttribute('target');

  //if there is a target or it's an external link
  if (target || href.includes('://')) {
    //do nothing
    return;
  }

  event.preventDefault();
  history.push(href, {});
  return false;
}

app.on('close', () => {
  Array.from(document.querySelectorAll('#root a')).forEach(link => {
    link.addEventListener('click', routeTo)
  });
}).emit('close')

history.listen(app);
```
