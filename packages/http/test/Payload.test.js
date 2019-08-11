const http = require('http');
const { Request, Response } = require('../src');

test('request test', async() => {
  const request = await Request.load();
  //console.log(request);
  const response = await Response.load(request);
  //console.log(response);
});
