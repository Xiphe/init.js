/*global namespace, xiphe */

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