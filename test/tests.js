/*global asyncTest, expect, ok, start, lorem, xiphe, test, deepEqual, equal,  module, expectCall, namespace, foo, stub */
jQuery(document).ready(function() {
	var undef, realQuery = window.jQuery;

	window.jQuery = undef;

	module("namespaces", {
		teardown: function() {
			window.foo = undef;
		}
	});

	test("ensure foo is not set", function() {
		equal(typeof foo, 'undefined', "foo is not set jet.");
	});

	test("global namespace function exist", function() {
		equal(typeof window.namespace, 'function', "namespace function exist.");
	});

	test("new namespaces can be generated", function() {
		namespace('foo.bar', {});
		equal(typeof foo, 'object', "global nacespace 'foo' has been crated.");
		equal(typeof foo.bar, 'object', "sub nacespace 'bar' has been crated.");
	});

	test("namespaces are global", function() {
		namespace('foo.bar', {});
		equal(typeof window.foo, 'object', "namespace 'foo' is still available.");
	});

	test("append value to namespace", function() {
		namespace('foo.bar.lorem', 'ipsum');
		equal(foo.bar.lorem, 'ipsum', "lorem variable set into foo.bar.");
	});


	test("append value to namespace variant", function() {
		namespace('foo.bar.cow', 'mooh');
		equal(namespace('foo.bar.cow'), 'mooh', "cow variable set into foo.bar.");
	});

	test("ensure first value still exists", function() {
		namespace('foo.bar.lorem', 'ipsum');
		namespace('foo.bar.cow', 'mooh');
		equal(foo.bar.lorem, 'ipsum', "lorem variable still set in foo.bar.");
	});

	test("ensure values will not be overwritten by default", function() {
		namespace('foo.bar.lorem', 'ipsum');
		namespace('foo.bar.lorem');
		equal(foo.bar.lorem, 'ipsum', "lorem variable still set in foo.bar.");
	});

	test("value will not be overwritten when a second parameter is passed", function() {
		namespace('foo.bar.lorem', 'ipsum');
		namespace('foo.bar.lorem', 'dolor');
		equal(foo.bar.lorem, 'ipsum', "lorem variable still is ipsum.");
	});

	test("values will be overwritten when true as the third parameter is passed.", function() {
		namespace('foo.bar.cow', 'mooh');
		namespace('foo.bar.cow', 'meow', true);
		equal(foo.bar.cow, 'meow', "the cow makes meow.");
	});

	test("throws error if middle token is not an object", function() {
		namespace('foo.bar.cow', 'mooh');
		stub(window.console, 'error');
		expectCall(window.console, 'error');
		namespace('foo.bar.cow.makes', 'milk');
	});

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

	module("jquery.bridge", {
		setup: function() {
			window.jQuery = realQuery;
		},
		teardown: function() {
			window.jQuery.fn.bridge_test = undef;
			window.jQuery = undef;
		}
	});

	function init_plugin_fixture() {
		xiphe.jquery.bridge('bridge_test', function() {
			var BridgeTest = function(element, options) {
				this.el = element;
				this.options = options;
				this._init();
			};

			BridgeTest.prototype = {
				_init: function() {

				},
				_hidden: function() {
					return 'hidden';
				},
				silentMethod: function() {
					return 'doin stuff';
				},
				getResult: function() {
					return 'Result';
				}
			};

			return BridgeTest;
		});
	}

	test('bridge exists', function() {
		equal('function', typeof xiphe.jquery.bridge, 'bridge not available.');
	});

	test('bridge_test available', function() {
		init_plugin_fixture();
		equal('function', typeof window.jQuery.fn.bridge_test, 'bridge_test not available.');
	});

	test('silentMethod returns jquery object.', function() {
		init_plugin_fixture();
		$('#qunit-fixture').bridge_test();
		equal('object', typeof $('#qunit-fixture').bridge_test('silentMethod'));
	});

	test('getter method returns result.', function() {
		init_plugin_fixture();
		$('#qunit-fixture').bridge_test();
		equal('Result', $('#qunit-fixture').bridge_test('getResult'));
	});

	test('getter method returns array of results if multiple elements are selected.', function() {
		init_plugin_fixture();
		var $fixture = $('#qunit-fixture').add($('<div />'));
		$fixture.bridge_test();
		deepEqual(['Result', 'Result'], $fixture.bridge_test('getResult'));
	});
});