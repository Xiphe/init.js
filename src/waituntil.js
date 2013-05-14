/*global namespace, xiphe */
namespace('xiphe.wait.patience', 3000);
namespace('xiphe.wait.until', (function() {
  var undef, _available, _callbacks = {}, _waitFor, self = this;

  _available = function(module) {
    return (typeof namespace(module) !== 'undefined');
  };

  _waitFor = function(module, intervall, patience, continue_on_error) {
    var h = new Date().getTime(),
      error = false,
      _loader;

    intervall =+ (typeof intervall === 'undefined' ? 10 : intervall);
    patience =+ (typeof patience === 'undefined' ? xiphe.wait.patience : patience);
    continue_on_error = (typeof continue_on_error === 'undefined' ? true : Boolean(continue_on_error));

    _loader = self.setInterval(function() {
      if (_available(module) ||
        (patience > -1 && h + patience <= new Date().getTime() && (error = true) === true)
      ) {
        self.clearInterval(_loader);
        if (error && self.console) {
          self.console.error('Module "'+module+'" not found after '+(patience/1000)+' seconds - aborting!');
        }
        if (!error || continue_on_error) {
          for (var i = 0, l = _callbacks[module].length; i < l; i++) {
            _callbacks[module][i].call(self, namespace(module));
          }
        }
        _callbacks[module] = undef;
      }
    }, intervall);
  };

  return function(module, callback, intervall, patience, continue_on_error) {
    if (!_available(module)) {
      if (typeof _callbacks[module] === 'undefined') {
        _callbacks[module] = [];
        _waitFor(module, intervall, patience, continue_on_error);
      }
      _callbacks[module].push(callback);
    } else {
      callback.call(self, namespace(module));
    }
  };
}).call(this));