const { map } = require('@geum/http');

module.exports = {
  async payload(Router, incomingMessage, serverResponse) {
    if (incomingMessage.headers.referer) {
      const url = new URL(incomingMessage.headers.referer);
      //LEGEND:
      // url.hash - #foo
      // url.host - 127.0.0.1:3000
      // url.hostname - 127.0.0.1
      // url.href - http://127.0.0.1:3000/some/path?lets=dothis
      // url.origin - http://127.0.0.1:3000
      // url.password - ??
      // url.pathname - /some/path
      // url.port - 3000
      // url.protocol - http:
      // url.search - ?lets=dothis
      incomingMessage.url = url.pathname + url.search;
    }

    return await map.payload(Router, incomingMessage, serverResponse);
  },

  dispatch(request, response) {
    const route = response.getRoute();
    let socket = route.socket;
    // SOCKET LEGEND:
    // route.socket.emit - send to self
    // route.socket.nsp.emit - send to namespace
    // route.socket.server.emit - send to all
    switch (route.channel) {
      case 'nsp':
      case 'namespace':
        socket = socket.nsp;
        break;
      case 'all':
      case 'server':
        socket = socket.server;
        break;
    }

    //if there's no content but theres rest
    if (!response.hasContent() && response.hasJson()) {
      socket.emit(route.event, response.get('json'));
      //if we can stream
    } else if (response.isContentStreamable()) {
      //TODO: pipe it through
      //response.content.get().pipe(response);
    //else if theres content
    } else if (response.hasContent()) {
      socket.emit(request.getRoute('event'), response.getContent());
    }
  }
};
