/*global namespace, xiphe */
namespace('xiphe.jquery.ready', function(callback, intervall) {
	xiphe.jquery.loaded(function($) {
		$(document).ready(callback);
	}, intervall || 1);
});