/*global namespace, xiphe */
namespace('xiphe.wait.patience', 3000);
namespace('xiphe.wait.continueOnError', true);
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
   * @param  {Integer} interval       The pause between checks.
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
    _arguments[2] = intervall =+ (typeof intervall === undef_str ? 10 : interval);

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