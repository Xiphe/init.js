/*global namespace, xiphe */

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