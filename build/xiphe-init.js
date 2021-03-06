/*!
 * xiphe-init.js v0.1.2
 * https://github.com/Xiphe/init.js
 *
 * Basic js functions for namespacing, loose / asynchronous dependencies, and jQuery plugins.
 *
 * Copyright 2013, Hannes Diercks <info@xiphe.net>
 * Released under the MIT license
 * https://github.com/Xiphe/init.js/blob/master/MIT-LICENSE.txt
 */
(function(){
var namespace = this.namespace = function(objectPath, value, overwrite) {
  var undef,
    token,
    self = this,
    object = self,
    undef_str = typeof undef,
    tokens = objectPath.split('.');

  /* Turn off overwriting by default. */
  overwrite = (typeof overwrite !== undef_str ? overwrite : false);

  /* Loop through tokens. */
  while (tokens.length > 0) {
    token = tokens.shift();

    /*
     * If this is a middle token and is not capable to handle sub objects
     * throw an error and return undefined.
     */
    if (tokens.length > 0 &&
      typeof object[token] !== 'object' &&
      typeof object[token] !== 'function' &&
      typeof object[token] !== undef_str
    ) {
      if (self.console) {
        self.console.error('Namespace token "'+token+'" is not an object or function.');
      }
      return undef;
    }

    /* If the token is not defined jet... */
    if (typeof object[token] === undef_str) {
      /* And no value is passed... */
      if (typeof value === undef_str) {
        /* Stop looping and return undefined. */
        return undef;
      }

      /*
       * If this is a middle token, make it a new object.
       * If it is the last one - set the value.
       */
      object[token] = tokens.length === 0 ? value : {};
    }

    /* If this is the last token and, it is defined and overwriting is enabled. */
    else if(tokens.length === 0 && overwrite) {
      object[token] = value;
    }

    /* Get deeper. */
    object = object[token];
  }

  return object;
};

/*
 * Global setting for the time when a xiphe.wait.until call stops
 * searching for the given module.
 */
namespace('xiphe.wait.patience', 3000);
/*
 * Global setting for if xiphe.wait.until callbacks should be
 * called even if the module could not be found.
 */
namespace('xiphe.wait.continueOnError', true);

/**
 * Initiate a new loop that searches for the passed module and
 * calls passed callbacks when the module stops being undefined.
 *
 * @param  {String}   module          The module name.
 * @param  {Function} callback        The callback function.
 * @param  {Integer}  interval        The pause between checks.
 * @param  {Integer}  patience        The time until abort.
 * @param  {Boolean}  continueOnError Whether or not the callbacks should be fired if loop was aborted.
 *
 * @return {Undefined}
 */
namespace('xiphe.wait.until', (function() {
  var undef,
    _available,
    _waitFor,
    _callbacks,
    wait = xiphe.wait,
    self = this,
    slice = Array.prototype.slice,
    undef_str = typeof undef,
    _callback_list = {};

  /**
   * Extension of the namespace function.
   * Uses _callback_list instead of window object.
   *
   * @param  {String}  objectPath
   * @param  {Mixed}   variable
   * @param  {Boolean} overwrite
   *
   * @return {Mixed}   Whatever is at the end of the objectPath.
   */
  _callbacks = function() { return namespace.apply(_callback_list, arguments); };

  /**
   * Check if the passed module is defined yet.
   *
   * @param  {string} module the module name
   *
   * @return {boolean}
   */
  _available = function(module) {
    return (typeof namespace(module) !== undef_str);
  };

  /**
   * Initiate a new loop that waits for a module to become available.
   *
   * @param  {String}  module          The module name.
   * @param  {Integer} interval        The pause between checks.
   * @param  {Integer} patience        The time until abort.
   * @param  {Boolean} continueOnError Whether or not the callbacks should be fired if loop was aborted.
   *
   * @return {Undefined}
   */
  _waitFor = function(module, interval, patience, continueOnError) {
    var endOfPartience = new Date().getTime(),
      moduleKey = slice.call(arguments).join('.'),
      error = false,
      _loader;

    /* Set defaults for patience and continueOnError if not defined. */
    endOfPartience += patience =+ (typeof patience === undef_str ? wait.patience : patience);
    continueOnError = (typeof continueOnError === undef_str ? wait.continueOnError : continueOnError);

    _loader = self.setInterval(function() {
      /* If module became available or patience is over. */
      if (_available(module) ||
        (patience > -1 && endOfPartience <= new Date().getTime() && (error = true) === true)
      ) {
        var _myCallbacks;

        /* Stop the timer */
        self.clearInterval(_loader);

        /* Notify the console if the timer stopped because patience was over. */
        if (error && self.console) {
          self.console.error('Module "'+module+'" not found in '+(patience/1000)+' seconds - aborting!');
        }

        /* Fire callbacks if no error occurred or callbacks should be fired anyways. */
        if (!error || continueOnError) {
          _myCallbacks = _callbacks(moduleKey);
          for (var i = 0, l = _myCallbacks.length; i < l; i++) {
            _myCallbacks[i].call(self, namespace(module));
          }
        }

        /* Clear the callback list. */
        _callbacks(moduleKey, undef, true);
      }
    }, interval);
  };

  /**
   * The actual interface
   *
   * @param  {String}   module          The module name.
   * @param  {Function} callback        The callback function.
   * @param  {Integer}  interval        The pause between checks.
   * @param  {Integer}  patience        The time until abort.
   * @param  {Boolean}  continueOnError Whether or not the callbacks should be fired if loop was aborted.
   *
   * @return {Undefined}
   */
  return function(module, callback, interval) {
    var moduleKey, _arguments = slice.call(arguments);

    /* Set the default on the interval if undefined. */
    _arguments[2] = interval =+ (typeof interval === undef_str ? 10 : interval);

    /* If the module is unavailable... */
    if (!_available(module)) {
      /* Build the full key from arguments without callback. */
      _arguments.splice(1,1);
      moduleKey = _arguments.join('.');

      /*
       * If this is the first callback for this module prepare the
       * callback list and start a new loop.
       */
      if (typeof _callbacks(moduleKey) === undef_str) {
        _callbacks(moduleKey, []);
        _waitFor.apply(self, _arguments);
      }

      /* And add the callback to the list. */
      _callbacks(moduleKey).push(callback);
    }
    /* Fire the callback instantly if the module is already defined. */
    else {
      callback.call(self, namespace(module));
    }
  };
}).call(this));

/**
 * Shorthand for xiphe.wait.until('jQuery', callback, intervall || 1)
 * 
 * @param  {Function}  callback  The callback function.
 * @param  {integer}   intervall Optional, The pause between checks.
 * 
 * @return {Undefined}
 */
namespace('xiphe.jquery.loaded', function(callback, intervall) {
  xiphe.wait.until('jQuery', callback, intervall || 1);
});

/**
 * Wrapper for jQuery(document).ready(), that can be called even if
 * jQuery is not loaded, yet.
 * 
 * @param  {Function}  callback  The callback function.
 * @param  {integer}   intervall Optional, The pause between checks.
 * 
 * @return {Undefined}
 */
namespace('xiphe.jquery.ready', function(callback, intervall) {
	xiphe.jquery.loaded(function($) {
		$(document).ready(callback);
	}, intervall || 1);
});

/*
 * Results of plugin methods that start with this strings will be returned.
 * (Other methods will return jQuery for chainability.)
 */
namespace('xiphe.jquery.bridge_returns', ['get', 'is', 'should']);

/**
 * A generic jquery plugin bridge.
 * 
 * @param  {string}   name     The name of the jQuery plugin.
 * @param  {Function} callback A function, returning the actual plugin constructor.
 * 
 * @return {mixed}             jQuery or the result of the plugin method.
 */
namespace('xiphe.jquery.bridge', function(name, callback) {
  var self = this,
      undef_str = typeof undef;

  xiphe.jquery.loaded(function($) {

    /* Get the actual plugin constructor from callback. */
    var Constructor = callback.call(window, name);

    /* Initiate the jQuery plugin */
    $.fn[name] = function(options) {

      /* Results of method calls will be collected here */
      var return_vars = [];

      /*
       * Methods are called by passing a the method name as a string to the plugin.
       * Example: $('.foo').my_plugin('myMethod');
       */
      if (typeof options === 'string') {
        /* Remove the first entry from arguments array (as it is the method name). */
        var args = Array.prototype.slice.call(arguments, 1);

        /* Loop through all current elements. */
        this.each(function() {
          var return_var, error = 0, instance = $.data(this, 'plugin_' + name);

          /* Plugin has not been initialized yet. */
          if (!instance) {
            if (self.console) {
              self.console.error("Cannot call methods on " + name + " prior to initialization; " +
                "attempted to call method '" + options + "'.");
            }
            return;
          }

          /* Method is protected. */
          if (options.charAt(0) === "_") {
            error = 1;
          /* Method does not exist. */
          } else if (!$.isFunction(instance[options])) {
            /* Apply magic getters / setters if the variable is not protected. */
            if (instance._magicGetSet === true && options.charAt(3) !== "_") {
              var method = options.substring(0, 3),
                  variable = options.charAt(3).toLowerCase() + options.substring(4),
                  exists = typeof instance[variable] !== undef_str;

              if (exists && method === 'get') {
                return_var = instance[variable];
              } else if (exists && method === 'set') {
                if (typeof args[0] !== undef_str) {
                  instance[variable] = args[0];
                } else {
                  error = 3;
                }
              } else {
                error = 2;
              }
            } else {
              error = 2;
            }
          } else {
            /* Apply the method. */
            return_var = instance[options].apply(instance, args);
          }

          /* An error occurred - method or variable is not available / existent. */
          if (error > 0) {
            if (window.console) {
              var message = error === 1 ? 'Unable to access protected method' : error === 2 ? 'No such method' : 'Missing second parameter when called';
              window.console.error(message + " '" + options + "' for " + name + " instance.");
            }
            return;
          }

          /* Check if the method result should be returned by the bridge. */
          var bridge_returns = xiphe.jquery.bridge_returns;
          for (var i = 0; i < bridge_returns.length; i++) {
            if (options.substring(0, bridge_returns[i].length) === bridge_returns[i]) {
              return_vars.push(return_var);
              break;
            }
          }
        });

      /* No method has been called. */
      } else {
        /* Loop through all current elements. */
        this.each(function() {
          var instance = $.data(this, 'plugin_' + name);
          /* Plugin has already been initialized. */
          if (instance) {
            /* Apply options & re-init. */
            instance.options = $.extend({}, instance.options, options);
            instance._init();
          /* Plugin has not been initialized yet. */
          } else {
            /* Initialize a new instance. */
            $.data(this, 'plugin_' + name, new Constructor(this, options));
          }
        });
      }

      /* Return jQuery object so plugin methods do not have to */
      if (return_vars.length === 0) {
        return this;

      /* A getter method was called and one object is selected. */
      } else if(return_vars.length === 1) {
        return return_vars[0];

      /* A getter method was called and multiple objects are selected. */
      } else {
        return return_vars;
      }
    };
  });
});
}).call(this);