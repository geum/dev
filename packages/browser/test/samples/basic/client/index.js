require('@babel/polyfill');
const { createBrowserHistory } = require('history');

const browser = require('../../../../src');
const history = createBrowserHistory()
const app = browser();

const route = () => {
  const routeTo = function(event) {
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

  Array.from(document.querySelectorAll('#root a')).forEach(link => {
    link.addEventListener('click', routeTo)
  });
};

app.use(require('./router'));
app.on('close', route);

route();
history.listen(app);
