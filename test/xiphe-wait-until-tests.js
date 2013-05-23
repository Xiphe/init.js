/*global module, test, asyncTest, namespace, xiphe, ok, start, expect, lorem, stub, equal, expectCall */

var undef;

module("wait until", {
	teardown: function() {
		window.lorem = undef;
		namespace('xiphe.wait.patience', 3000, true);
	}
});

asyncTest("wait until lorem.ipsum to become available", function() {
	expect(1);
	xiphe.wait.until('lorem.ipsum', function() {
		ok(lorem.ipsum === 'hello', "lorem.ipsum available");
		start();
	});

	window.setTimeout(function() {
		namespace('lorem.ipsum', 'hello');
	}, 100);
});

asyncTest("multiple callbacks on wait.until", function() {
	expect(4);
	xiphe.wait.until('lorem.ipsum', ok);
	xiphe.wait.until('lorem.ipsum', ok);
	xiphe.wait.until('lorem.ipsum', ok);
	xiphe.wait.until('lorem.ipsum', function() {
		ok(lorem.ipsum === 'hello', "lorem.ipsum available");
		start();
	});

	window.setTimeout(function() {
		namespace('lorem.ipsum', 'hello');
	}, 1000);
});

asyncTest("module is passed into callback", function() {
	expect(1);
	xiphe.wait.until('lorem.ipsum', function($) {
		ok($ === 'hi', "module was passed.");
		start();
	});

	window.setTimeout(function() {
		namespace('lorem.ipsum', 'hi');
	}, 100);
});

asyncTest("Que is emptied after 3 seconds.", function() {
	expect(1);
	stub(window.console, 'error');
	xiphe.wait.until('lorem.unique', function($) {
		ok(typeof $ === 'undefined', "module was not passed.");
		start();
	});
});

asyncTest("Throws Error if loading times out.", function() {
	expect(1);
	var error = window.console.error;
	window.console.error = function() {
		ok(true, 'error raised.');
		start();
		window.console.error = error;
	};
	namespace('xiphe.wait.patience', 0, true);
	xiphe.wait.until('lorem.unique', function() {});
});

asyncTest("Does not fire callbacks if continueOnError is false.", function() {
	expect(1);
	var i = 0;
	stub(window.console, 'error');
	xiphe.wait.until('lorem.unique2', function() {
		i++;
	}, 1, 1, false);

	window.setTimeout(function() {
		if (i === 0) {
			ok('callback not fired');
		} else {
			ok(false, 'callback was fired');
		}
		start();
	}, 100);
});

module("load jquery", {
	teardown: function() {
		window.jQuery = undef;
	}
});

test("jQuery is not set", function() {
	var undef;
	equal(window.jQuery, undef, 'jQuery is not available.');
});

test("xiphe.jquery.loaded is wrapper for wait.until('jQuery')", function() {
	expectCall(xiphe.wait, 'until');
	xiphe.jquery.loaded(function(){});
});

asyncTest("callback is called when jQuery is available.", function() {
	expect(1);
	xiphe.jquery.loaded(function($) {
		ok($ === 'dummyQuery', 'jQuery is available');
		start();
	});

	window.setTimeout(function() {
		namespace('jQuery', 'dummyQuery');
	}, 10);
});

asyncTest("document ready callback is getting registered.", function() {
	expect(1);
	var o = {
		ready: function(callback) {
			ok(callback === 'foo', 'callback was registered');
			start();
		}
	};

	xiphe.jquery.ready('foo');

	window.setTimeout(function() {
		namespace('jQuery', function() { return o; });
	}, 10);
});