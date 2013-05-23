/*global module, test, equal, namespace, foo, stub, expectCall */

var undef;

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