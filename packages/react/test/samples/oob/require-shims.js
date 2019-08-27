if(typeof require === 'undefined' && typeof module === 'undefined' && typeof window !== 'undefined') {

  var require = function(module) {
    var libs = {}
    libs['react'] = 'React';
    libs['react-dom'] = 'ReactDOM';
    libs['react-router-dom'] = 'ReactRouterDOM';
    libs['./App'] = 'App';
    if(module in libs && libs[module] in window) {
      return window[libs[module]]
    }
  }

  var module = {
    set exports(value) {
      let name = null;
      if (typeof value !== 'undefined'
        && value.prototype
        && value.prototype.constructor.WrappedComponent
      ) {
        name = value.prototype.constructor.WrappedComponent.name;
        window[name] = value;
      }

      if(value.prototype && value.prototype.isReactComponent) {
        var displayName = value.displayName;

        if('WrappedComponent' in value) {
          displayName = value.WrappedComponent.displayName;
        }

        window[displayName] = value;
        return;
      }

      if('configureStore' in value) {
        window.storage = value;
        return;
      }

      if('routes' in value) {
        window.routes = value;
        return;
      }
    }
  };
}
