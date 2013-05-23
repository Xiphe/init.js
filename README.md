xiphe-init.js
=============

Basic js functions for namespacing, loose dependencies, asynchronous loading and jQuery plugins.


Namespace
---------
> _mixed_ **namespace** ( _string_ objectPath [, _mixed_ value ] [, _boolean_ overwrite = false ] );

---

#### Case 1: Set a value into a nested object.
```js
var ipsm = namespace('foo.bar.lorem', 'ipsum');
```
Is short for:

```js
var ipsm = 'ipsum';
window.foo = {
  bar: {
    lorem: ipsm
  }
};
```
But existent values will not be overwritten and existent objects will be extended.
Overwriting is disabled by default. To replace 'ipsum' with 'dolor' the third parameter
has to be `true`.
```js
namespace('foo.bar.lorem', 'dolor', true);
```

#### Case 2: Get a value from a nested object.
```js
namespace('foo.bar.lorem');
```
Will return "ipsum".
```js
namespace('not.set.jet');
```
Will return `undefined` but will not throw an error if `not` or `set` are not defined jet.

#### Error Case 1: Don't use middle tokens that are not objects or functions.
```js
var foo = 'This is a string.';
namespace('foo.bar', 'lorem');
```
This will throw an error and return `undefined` because foo is not an object or function.
Passing `true` as the third parameter will not suppress this error - you should handle
that by yourself. 


Wait Until
----------
> _undefined_ **xiphe.wait.until** ( _string_ module, _function_ callback [, _integer_ intervall = 10 ] [, _integer_ patience = 3000 ] [, _boolean_ continueOnError = true] );

---

This tool is collecting `callbacks` that will be fired once the `module` stops being
undefined. If the module is already defined, the callback is fired instantly.  
This comes handy when dealing with asynchronous loading and loose dependencies.

#### Example
```js
var foo;
xiphe.wait.until('foo', function(module) {
  console.log("Foo is now available and it's value is "+module);
});
window.setTimeout(function() { foo = 'bar'; }, 100);
```
This will print "Foo is now available and it's value is bar" into the console after
100 miliseconds.

#### Intervall
In the background, a loop is started for each module. The time between two checks can be
adjusted by setting the third value.  
```js
xiphe.wait.until('foo.bar', function(module) {
  console.log("foo.bar is now available");
}, 1000 /* Default: 10 */);
var foo = { bar: 'lorem' };
```
"foo.bar is now available" will be printed after one second.

#### Patience
To keep the number of loops low, this tool will abort after 3 seconds by default.
This can be changed globally by setting the number of milliseconds until aborting into
`xiphe.wait.patience`. (-1 will never abort).
```js
xiphe.wait.patience = 6000; // 6 Seconds, Default: 3000
```
A single call accepts patience as the forth parameter and will prefer this value to
the global one.
```js
xiphe.wait.until(
	'foo.mooh',
	function(module) {
  		console.log("foo.mooh is now available");
	},
	10,
	100
);

window.setTimeout(function() { foo = { mooh: 'dolor' }; }, 200);
```
This will put the following error into the console: 'Module "foo.bar" not found in 0.1
seconds - aborting!'

#### Continue on Error
By default, the registered callbacks will be fired even if the module has not been found
within the given patience (Loose Dependency Mode). By setting the value of
`xiphe.wait.continueOnError`, this behavior can be changed globally.
```js
xiphe.wait.continueOnError = false; // Default: true
```

This behavior can also be changed individually by passing a boolean as the fifth
parameter.
```js
xiphe.wait.until(
	'foo.maeh',
	function(module) {
  		console.log("This will never be executed.");
	},
	10,
	100,
	false
);
```

Changelog
---------
### 0.1.2
* Magic getters and setters for the bridge
* Add no-jQuery builds.


Todo
----
* more documentation.


License
-------

Copyright (c) 2013 Hannes Diercks

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.