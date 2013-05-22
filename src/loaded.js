/*global namespace, xiphe */

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