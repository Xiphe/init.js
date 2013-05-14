/*global namespace, xiphe */
namespace('xiphe.jquery.loaded', function(callback, intervall) {
  xiphe.wait.until('jQuery', callback, intervall || 1);
});