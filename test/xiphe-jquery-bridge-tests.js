/*global jQuery, module, xiphe, test, equal, deepEqual, expectCall, stub */
jQuery(document).ready(function() {
	var undef, realQuery = window.jQuery;

	window.jQuery = undef;

	module("jquery.bridge", {
		setup: function() {
			window.jQuery = realQuery;
			init_plugin_fixture();
		},
		teardown: function() {
			window.jQuery.fn.bridge_test = undef;
			window.jQuery = undef;
			$('#qunit-fixture').data('plugin_bridge_test', void 0);
		}
	});

	function init_plugin_fixture() {
		xiphe.jquery.bridge('bridge_test', function() {
			var BridgeTest = function(element, options) {
				this._magicGetSet = true;
				this.el = element;
				this.options = options;
				this._init();
				this.variable = 'foo';
				this._protectedVariable = 'bar';
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
		equal(typeof xiphe.jquery.bridge, 'function', 'bridge not available.');
	});

	test('bridge_test available', function() {
		equal(typeof window.jQuery.fn.bridge_test, 'function', 'bridge_test not available.');
	});

	test('silentMethod returns jquery object.', function() {
		$('#qunit-fixture').bridge_test();
		equal(typeof $('#qunit-fixture').bridge_test('silentMethod'), 'object');
	});

	test('protected method is not accessible', function() {
		$('#qunit-fixture').bridge_test();
		stub(window.console, 'error');
		expectCall(window.console, 'error');
		$('#qunit-fixture').bridge_test('_hidden');
	});

	test('getter method returns result.', function() {
		$('#qunit-fixture').bridge_test();
		equal($('#qunit-fixture').bridge_test('getResult'), 'Result');
	});

	test('getter method returns array of results if multiple elements are selected.', function() {
		var $fixture = $('#qunit-fixture').add($('<div />'));
		$fixture.bridge_test();
		deepEqual($fixture.bridge_test('getResult'), ['Result', 'Result']);
	});

	test('magic getter', function() {
		$('#qunit-fixture').bridge_test();
		equal($('#qunit-fixture').bridge_test('getVariable'), 'foo', 'magic getter not working.');
	});

	test('magic getter fails on protected variables', function() {
		$('#qunit-fixture').bridge_test();
		stub(window.console, 'error');
		expectCall(window.console, 'error');
		$('#qunit-fixture').bridge_test('get_protectedVariable');
	});

	test('magic getter fails on inexistent variables', function() {
		$('#qunit-fixture').bridge_test();
		stub(window.console, 'error');
		expectCall(window.console, 'error');
		$('#qunit-fixture').bridge_test('getUnsetVar');
	});

	test('magic setter', function() {
		$('#qunit-fixture').bridge_test();
		$('#qunit-fixture').bridge_test('setVariable', 'lorem');
		equal($('#qunit-fixture').data('plugin_bridge_test').variable, 'lorem', 'magic setter not working');
	});

	test('magic setter fails on protected variables', function() {
		$('#qunit-fixture').bridge_test();
		stub(window.console, 'error');
		expectCall(window.console, 'error');
		$('#qunit-fixture').bridge_test('_set_protectedVariable', 'lorem');
	});

	test('magic setter fails on inexistent variables', function() {
		$('#qunit-fixture').bridge_test();
		stub(window.console, 'error');
		expectCall(window.console, 'error');
		$('#qunit-fixture').bridge_test('setUnsetVar', 'lorem');
	});

	test('magic setter fails if no new value is passed', function() {
		$('#qunit-fixture').bridge_test();
		stub(window.console, 'error');
		expectCall(window.console, 'error');
		$('#qunit-fixture').bridge_test('setVariable');
	});
});