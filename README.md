xiphe-init.js
=============

Basic js functions for namespacing, loose/asynchronous dependencies, and jQuery plugins.


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
Overwriting is disabled by default. To replace 'ipsum' with 'dolor' the third parameter has to be true.
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
Will return undefined but will not throw an error if not or set are not defined jet.

#### Error Case 1: Don't use middle tokens that are not objects or functions.
```js
var foo = 'This is not an object.';
namespace('foo.bar', 'lorem');
```
This will throw an error and return undefined because foo is not an object or function.
Passing true as the third parameter will not suppress this error - you should handle that by yourself. 


Wait Until
----------
> _undefined_ **xiphe.wait.until** ( _string_ module, _function_ callback [, _integer_ intervall = 10 ] [, _integer_ patience = 3000 ] [, _boolean_ continue_on_error = true] );

---

This function is collecting `callbacks` that will be fired once the `module` stops being undefined. If the module is allready defined, the callback is fired instantly.  
This comes handy when dealing with asynchronous loading and loose dependencies.

#### Example
```js
var foo;
xiphe.wait.until('foo', function(module) {
  console.log("Foo is now available and it's value is "+module);
});
window.setTimeout(function() { foo = 'bar'; }, 100);
```
This will print "Foo is now available and it's value is bar" into the console after 100 miliseconds.

#### Intervall
In the background, a loop is started for each module. The time between two checks can be adjusted by setting the third value.  
```js
xiphe.wait.until('foo', function(module) {
  console.log("Foo is now available");
}, 1000);
var foo = 'bar';
```
"Foo is now available" will be printed after one second.


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