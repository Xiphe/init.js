/*global namespace, xiphe */
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