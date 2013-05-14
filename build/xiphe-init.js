/*!
 * xiphe-init.js v0.1.0
 * https://github.com/Xiphe/init.js
 *
 * Basic js functions for namespacing, loose/asynchronous dependencies, and jQuery plugins.
 *
 * Copyright 2013, Hannes Diercks <info@xiphe.net>
 * Released under the MIT license
 * https://github.com/Xiphe/init.js/blob/master/MIT-LICENSE.txt
 */
(function(){
var namespace = this.namespace = function(space, value, enableOverwrite) {
  var self = this, object = this, tokens = space.split("."), token, overwrite = false;

  if (typeof enableOverwrite !== 'undefined') {
    overwrite = Boolean(enableOverwrite);
  }

  while (tokens.length > 0) {
    token = tokens.shift();

    if (tokens.length > 0 && typeof object[token] !== 'object' && typeof object[token] !== 'function' && typeof object[token] !== "undefined") {
      if (self.console) {
        self.console.error('Namespace token "'+token+'" is not an object or function.');
      }
      return false;
    }

    if (typeof object[token] === "undefined") {
      if (typeof value === 'undefined') {
        return;
      }
      object[token] = tokens.length === 0 ? value : {};
    } else if(tokens.length === 0 && overwrite) {
      object[token] = value;
    }

    object = object[token];
  }

  return object;
};

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

namespace('xiphe.jquery.loaded', function(callback, intervall) {
  xiphe.wait.until('jQuery', callback, intervall || 1);
});

namespace('xiphe.jquery.ready', function(callback, intervall) {
	xiphe.jquery.loaded(function($) {
		$(document).ready(callback);
	}, intervall || 1);
});

namespace('xiphe.jquery.bridge_returns', ['get', 'is', 'should']);
namespace('xiphe.jquery.bridge', function(name, callback) {
  var self = this;
  xiphe.jquery.loaded(function($) {
    var Constructor = callback.call(window, name);
    $.fn[name] = function(options) {
      var return_vars = [];

      if (typeof options === 'string') {
        // call method
        var args = Array.prototype.slice.call(arguments, 1);

        this.each(function() {
          var return_var, instance = $.data(this, 'plugin_' + name);
          if (!instance) {
            if (self.console) {
              self.console.error("Cannot call methods on " + name + " prior to initialization; " +
                "attempted to call method '" + options + "'.");
            }
            return;
          }

          if (!$.isFunction(instance[options]) || options.charAt(0) === "_") {
            if (self.console) {
              self.console.error("No such method '" + options + "' for " + name + " instance.");
            }
            return;
          }
          // apply method
          return_var = instance[options].apply(instance, args);
          var bridge_returns = xiphe.jquery.bridge_returns;
          for (var i = 0; i < bridge_returns.length; i++) {
            if (options.substring(0, bridge_returns[i].length) === bridge_returns[i]) {
              return_vars.push(return_var);
              break;
            }
          }
        });
      } else {
        this.each(function() {
          var instance = $.data(this, 'plugin_' + name);
          if (instance) {
            // apply options & init
            instance.options = $.extend({}, instance.options, options);
            instance._init();
          } else {
            // initialize new instance
            $.data(this, 'plugin_' + name, new Constructor(this, options));
          }
        });
      }

      if (return_vars.length === 0) {
        // return jQuery object
        // so plugin methods do not have to
        return this;

      // a getter method was called
      } else if(return_vars.length === 1) {
        // on only one object, return the result
        return return_vars[0];
      } else {
        // on multiple objects, return all results
        return return_vars;
      }
    };
  });
});
}).call(this);