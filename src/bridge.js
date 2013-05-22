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
          var return_var, instance = $.data(this, 'plugin_' + name);

          /* Plugin has not been initialized yet. */
          if (!instance) {
            if (self.console) {
              self.console.error("Cannot call methods on " + name + " prior to initialization; " +
                "attempted to call method '" + options + "'.");
            }
            return;
          }

          /* Method does not exist or is protected. */
          if (!$.isFunction(instance[options]) || options.charAt(0) === "_") {
            var method = options.substring(0, 3),
                variable = options.substring(3),
                f = options.charAt(0).toLowerCase(),
                exists;
            variable = f + variable.substr(1);
            exists = typeof instance[variable] !== undef_str;

            if (exists && method === 'get') {
              return_var = instance[variable];
            } else if (exists && method === 'set' && typeof args[0] !== undef_str) {
              instance[variable] = args[0];
            } else {
              if (self.console) {
                self.console.error("No such method '" + options + "' for " + name + " instance.");
              }
              return;
            }
          } else {
            /* Apply the method. */
            return_var = instance[options].apply(instance, args);
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