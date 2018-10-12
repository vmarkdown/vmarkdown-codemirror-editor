# function qualityGuide () {

> A **quality conscious** and _organic_ JavaScript quality guide

This style guide aims to provide the ground rules for an application's JavaScript code, such that it's highly readable and consistent across different developers on a team. The focus is put on quality and coherence across the different pieces of your application.

## Goal

These suggestions aren't set in stone, they aim to provide a baseline you can use in order to write more consistent codebases. To maximize effectiveness, share the styleguide among your co-workers and attempt to enforce it. Don't become obsessed about code style, as it'd be fruitless and counterproductive. Try and find the sweet spot that makes everyone in the team comfortable developing for your codebase, while not feeling frustrated that their code always fails automated style checking because they added a single space where they weren't supposed to. It's a thin line, but since it's a very personal line I'll leave it to you to do the drawing.

> Use together with [bevacqua/css][32] for great good!

Feel free to fork this style guide, or better yet, send [Pull Requests][33] this way!

## Table of Contents

1. [Modules](#modules)
2. [Strict Mode](#strict-mode)
3. [Spacing](#spacing)
4. [Semicolons](#semicolons)
5. [Style Checking](#style-checking)
6. [Linting](#linting)
7. [Strings](#strings)
8. [Variable Declaration](#variable-declaration)
9. [Conditionals](#conditionals)
10. [Equality](#equality)
11. [Ternary Operators](#ternary-operators)
12. [Functions](#functions)
13. [Prototypes](#prototypes)
14. [Object Literals](#object-literals)
15. [Array Literals](#array-literals)
16. [Regular Expressions](#regular-expressions)
17. [`console` Statements](#console-statements)
18. [Comments](#comments)
19. [Variable Naming](#variable-naming)
20. [Polyfills](#polyfills)
21. [Everyday Tricks](#everyday-tricks)
22. [License](#license)

## Modules

This style guide assumes you're using a module system such as [CommonJS][1], [AMD][2], [ES6 Modules][3], or any other kind of module system. Modules systems provide individual scoping, avoid leaks to the `global` object, and improve code base organization by **automating dependency graph generation**, instead of having to resort to manually creating multiple `<script>` tags.

Module systems also provide us with dependency injection patterns, which are crucial when it comes to testing individual components in isolation.

## Strict Mode

**Always** put [`'use strict';`][4] at the top of your modules. Strict mode allows you to catch nonsensical behavior, discourages poor practices, and _is faster_ because it allows compilers to make certain assumptions about your code.

## Spacing

Spacing must be consistent across every file in the application. To this end, using something like [`.editorconfig`][5] configuration files is highly encouraged. Here are the defaults I suggest to get started with JavaScript indentation.

```ini
# editorconfig.org
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false
```

Settling for either tabs or spaces is up to the particularities of a project, but I recommend using 2 spaces for indentation. The `.editorconfig` file can take care of that for us and everyone would be able to create the correct spacing by pressing the tab key.

Spacing doesn't just entail tabbing, but also the spaces before, after, and in between arguments of a function declaration. This kind of spacing is **typically highly irrelevant to get right**, and it'll be hard for most teams to even arrive at a scheme that will satisfy everyone.

```js
function () {}
```

```js
function( a, b ){}
```

```js
function(a, b) {}
```

```js
function (a,b) {}
```

Try to keep these differences to a minimum, but don't put much thought to it either.

Where possible, improve readability by keeping lines below the 80-character mark.

## Semicolons`;`

The majority of JavaScript programmers [prefer using semicolons][6]. This choice is done to avoid potential issues with Automatic Semicolon Insertion _(ASI)_. If you decide against using semicolons, [make sure you understand the ASI rules][7].

Regardless of your choice, a linter should be used to catch unnecessary or unintentional semicolons.

## Style Checking

**Don't**. Seriously, [this is super painful][8] for everyone involved, and no observable gain is attained from enforcing such harsh policies.

## Linting

On the other hand, linting is sometimes necessary. Again, don't use a linter that's super opinionated about how the code should be styled, like [`jslint`][9] is. Instead use something more lenient, like [`jshint`][10] or [`eslint`][11].

A few tips when using JSHint.

- Declare a `.jshintignore` file and include `node_modules`, `bower_components`, and the like
- You can use a `.jshintrc` file like the one below to keep your rules together

```json
{
  "curly": true,
  "eqeqeq": true,
  "newcap": true,
  "noarg": true,
  "noempty": true,
  "nonew": true,
  "sub": true,
  "undef": true,
  "unused": true,
  "trailing": true,
  "boss": true,
  "eqnull": true,
  "strict": true,
  "immed": true,
  "expr": true,
  "latedef": "nofunc",
  "quotmark": "single",
  "indent": 2,
  "node": true
}
```

By no means are these rules the ones you should stick to, but **it's important to find the sweet spot between not linting at all and not being super obnoxious about coding style**.

## Strings

Strings should always be quoted using the same quotation mark. Use `'` or `"` consistently throughout your codebase. Ensure the team is using the same quotation mark in every portion of JavaScript that's authored.

##### Bad

```js
var message = 'oh hai ' + name + "!";
```

##### Good

```js
var message = 'oh hai ' + name + '!';
```

Usually you'll be a happier JavaScript developer if you hack together a parameter-replacing method like [`util.format` in Node][12]. That way it'll be far easier to format your strings, and the code looks a lot cleaner too.

##### Better

```js
var message = util.format('oh hai %s!', name);
```

You could implement something similar using the piece of code below.

```js
function format () {
  var args = [].slice.call(arguments);
  var initial = args.shift();

  function replacer (text, replacement) {
    return text.replace('%s', replacement);
  }
  return args.reduce(replacer, initial);
}
```

To declare multi-line strings, particularly when talking about HTML snippets, it's sometimes best to use an array as a buffer and then join its parts. The string concatenating style may be faster but it's also much harder to keep track of.

```js
var html = [
  '<div>',
    format('<span class="monster">%s</span>', name),
  '</div>'
].join('');
```

With the array builder style, you can also push parts of the snippet and then join everything together at the end. This is in fact what some [string templating engines like Jade][13] prefer to do.

## Variable Declaration

Always declare variables in **a consistent manner**, and at the top of their scope. Keeping variable declarations to _one per line is encouraged_. Comma-first, a single `var` statement, multiple `var` statements, it's all fine, just be consistent across the project, and ensure the team is on the same page.

##### Bad

```js
var foo = 1,
    bar = 2;

var baz;
var pony;

var a
  , b;
```

```js
var foo = 1;

if (foo > 1) {
  var bar = 2;
}
```
##### Good

<sub>Just because they're consistent with each other, not because of the style</sub>

```js
var foo = 1;
var bar = 2;

var baz;
var pony;

var a;
var b;
```

```js
var foo = 1;
var bar;

if (foo > 1) {
  bar = 2;
}
```

Variable declarations that aren't immediately assigned a value are acceptable to share the same line of code.

##### Acceptable

```js
var a = 'a';
var b = 2;
var i, j;
```

## Conditionals

**Brackets are enforced**. This, together with a reasonable spacing strategy will help you avoid mistakes such as [Apple's SSL/TLS bug][14].

##### Bad

```js
if (err) throw err;
```

##### Good

```js
if (err) { throw err; }
```

It's even better if you avoid keeping conditionals on a single line, for the sake of text comprehension.

##### Better

```js
if (err) {
  throw err;
}
```

## Equality

Avoid using `==` and `!=` operators, always favor `===` and `!==`. These operators are called the "strict equality operators," while [their counterparts will attempt to cast the operands][15] into the same value type.

##### Bad

```js
function isEmptyString (text) {
  return text == '';
}

isEmptyString(0);
// <- true
```

##### Good

```js
function isEmptyString (text) {
  return text === '';
}

isEmptyString(0);
// <- false
```

## Ternary Operators

Ternary operators are fine for clear-cut conditionals, but unacceptable for confusing choices. As a rule, if you can't eye-parse it as fast as your brain can interpret the text that declares the ternary operator, chances are it's probably too complicated for its own good.

jQuery is a prime example of a codebase that's [**filled with nasty ternary operators**][16].

##### Bad

```js
function calculate (a, b) {
  return a && b ? 11 : a ? 10 : b ? 1 : 0;
}
```

##### Good

```js
function getName (mobile) {
  return mobile ? mobile.name : 'Generic Player';
}
```

In cases that may prove confusing just use `if` and `else` statements instead.

## Functions

When declaring a function, always use the [function declaration form][17] instead of [function expressions][18]. Because [hoisting][19].

##### Bad

```js
var sum = function (x, y) {
  return x + y;
};
```

##### Good

```js
function sum (x, y) {
  return x + y;
}
```

That being said, there's nothing wrong with function expressions that are just [currying another function][20].

##### Good

```js
var plusThree = sum.bind(null, 3);
```

Keep in mind that [function declarations will be hoisted][21] to the top of the scope so it doesn't matter the order they are declared in. That being said, you should always keep functions at the top level in a scope, and avoid placing them inside conditional statements.

##### Bad

```js
if (Math.random() > 0.5) {
  sum(1, 3);

  function sum (x, y) {
    return x + y;
  }
}

```

##### Good

```js
if (Math.random() > 0.5) {
  sum(1, 3);
}

function sum (x, y) {
  return x + y;
}
```

```js
function sum (x, y) {
  return x + y;
}

if (Math.random() > 0.5) {
  sum(1, 3);
}
```

If you need a _"no-op"_ method you can use either `Function.prototype`, or `function noop () {}`. Ideally a single reference to `noop` is used throughout the application.

Whenever you have to manipulate an array-like object, cast it to an array.

##### Bad

```js
var divs = document.querySelectorAll('div');

for (i = 0; i < divs.length; i++) {
  console.log(divs[i].innerHTML);
}
```

##### Good

```js
var divs = document.querySelectorAll('div');

[].slice.call(divs).forEach(function (div) {
  console.log(div.innerHTML);
});
```

However, be aware that there is a [substantial performance hit][22] in V8 environments when using this approach on `arguments`. If performance is a major concern, avoid casting `arguments` with `slice` and instead use a `for` loop.

#### Bad
```js
var args = [].slice.call(arguments);
```

#### Good
```js
var i;
var args = new Array(arguments.length);
for (i = 0; i < args.length; i++) {
    args[i] = arguments[i];
}
```

Don't declare functions inside of loops.

##### Bad

```js
var values = [1, 2, 3];
var i;

for (i = 0; i < values.length; i++) {
  setTimeout(function () {
    console.log(values[i]);
  }, 1000 * i);
}
```

```js
var values = [1, 2, 3];
var i;

for (i = 0; i < values.length; i++) {
  setTimeout(function (i) {
    return function () {
      console.log(values[i]);
    };
  }(i), 1000 * i);
}
```

##### Good

```js
var values = [1, 2, 3];
var i;

for (i = 0; i < values.length; i++) {
  setTimeout(function (i) {
    console.log(values[i]);
  }, 1000 * i, i);
}
```

```js
var values = [1, 2, 3];
var i;

for (i = 0; i < values.length; i++) {
  wait(i);
}

function wait (i) {
  setTimeout(function () {
    console.log(values[i]);
  }, 1000 * i);
}
```

Or even better, just use `.forEach` which doesn't have the same caveats as declaring functions in `for` loops.

##### Better

```js
[1, 2, 3].forEach(function (value, i) {
  setTimeout(function () {
    console.log(value);
  }, 1000 * i);
});
```

Whenever a method is non-trivial, make the effort to **use a named function declaration rather than an anonymous function**. This will make it easier to pinpoint the root cause of an exception when analyzing stack traces.

##### Bad

```js
function once (fn) {
  var ran = false;
  return function () {
    if (ran) { return };
    ran = true;
    fn.apply(this, arguments);
  };
}
```

##### Good

```js
function once (fn) {
  var ran = false;
  return function run () {
    if (ran) { return };
    ran = true;
    fn.apply(this, arguments);
  };
}
```

Avoid keeping indentation levels from raising more than necessary by using guard clauses instead of flowing `if` statements.

##### Bad

```js
if (car) {
  if (black) {
    if (turbine) {
      return 'batman!';
    }
  }
}
```

```js
if (condition) {
  // 10+ lines of code
}
```

##### Good

```js
if (!car) {
  return;
}
if (!black) {
  return;
}
if (!turbine) {
  return;
}
return 'batman!';
```

```js
if (!condition) {
  return;
}
// 10+ lines of code
```

## Prototypes

Hacking native prototypes should be avoided at all costs, use a method instead. If you must extend the functionality in a native type, try using something like [poser][23] instead.

##### Bad

```js
String.prototype.half = function () {
  return this.substr(0, this.length / 2);
};
```

##### Good

```js
function half (text) {
  return text.substr(0, text.length / 2);
}
```

**Avoid prototypical inheritance models** unless you have a very good _performance reason_ to justify yourself.

- Prototypical inheritance boosts puts need for `this` through the roof
- It's way more verbose than using plain objects
- It causes headaches when creating `new` objects
- Needs a closure to hide valuable private state of instances
- Just use plain objects instead

## Object Literals

Instantiate using the egyptian notation `{}`. Use factories instead of constructors, here's a proposed pattern for you to implement objects in general.

```js
function util (options) {
  // private methods and state go here
  var foo;

  function add () {
    return foo++;
  }

  function reset () { // note that this method isn't publicly exposed
    foo = options.start || 0;
  }

  reset();

  return {
    // public interface methods go here
    uuid: add
  };
}
```

## Array Literals

Instantiate using the square bracketed notation `[]`. If you have to declare a fixed-dimension array for performance reasons then it's fine to use the `new Array(length)` notation instead.

It's about time you master array manipulation! [Learn about the basics][24]. It's way easier than you might think.

- [`.forEach`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)
- [`.slice`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice)
- [`.splice`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice)
- [`.join`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join)
- [`.concat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat)
- [`.unshift`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/unshift)
- [`.shift`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/shift)
- [`.push`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push)
- [`.pop`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/pop)

Learn and abuse the functional collection manipulation methods. These are **so** worth the trouble.

- [`.filter`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
- [`.map`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
- [`.reduce`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)
- [`.reduceRight`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight)
- [`.some`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/some)
- [`.every`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/every)
- [`.sort`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
- [`.reverse`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse)

## Regular Expressions

Keep regular expressions in variables, don't use them inline. This will vastly improve readability.

##### Bad

```js
if (/\d+/.test(text)) {
  console.log('so many numbers!');
}
```

##### Good

```js
var numeric = /\d+/;
if (numeric.test(text)) {
  console.log('so many numbers!');
}
```

Also [learn how to write regular expressions][25], and what they actually do. Then you can also [visualize them online][26].

## `console` statements

Preferably bake `console` statements into a service that can easily be disabled in production. Alternatively, don't ship any `console.log` printing statements to production distributions.

## Comments

Comments **aren't meant to explain what** the code does. Good **code is supposed to be self-explanatory**. If you're thinking of writing a comment to explain what a piece of code does, chances are you need to change the code itself. The exception to that rule is explaining what a regular expression does. Good comments are supposed to **explain why** code does something that may not seem to have a clear-cut purpose.

##### Bad

```js
// create the centered container
var p = $('<p/>');
p.center(div);
p.text('foo');
```

##### Good

```js
var container = $('<p/>');
var contents = 'foo';
container.center(parent);
container.text(contents);
megaphone.on('data', function (value) {
  container.text(value); // the megaphone periodically emits updates for container
});
```

```js
var numeric = /\d+/; // one or more digits somewhere in the string
if (numeric.test(text)) {
  console.log('so many numbers!');
}
```

Commenting out entire blocks of code _should be avoided entirely_, that's why you have version control systems in place!

## Variable Naming

Variables must have meaningful names so that you don't have to resort to commenting what a piece of functionality does. Instead, try to be expressive while succinct, and use meaningful variable names.

##### Bad

```js
function a (x, y, z) {
  return z * y / x;
}
a(4, 2, 6);
// <- 3
```

##### Good

```js
function ruleOfThree (had, got, have) {
  return have * got / had;
}
ruleOfThree(4, 2, 6);
// <- 3
```

## Polyfills

Where possible use the native browser implementation and include [a polyfill that provides that behavior][27] for unsupported browsers. This makes the code easier to work with and less involved in hackery to make things just work.

If you can't patch a piece of functionality with a polyfill, then [wrap all uses of the patching code][28] in a globally available method that is accessible from everywhere in the application.

## Everyday Tricks

Use `||` to define a default value. If the left-hand value is [falsy][29] then the right-hand value will be used. Be advised, that because of loose type comparison, inputs like `false`, `0`, `null` or `''` will be evaluated as falsy, and converted to default value. For strict type checking use `if (value === void 0) { value = defaultValue }`.

```js
function a (value) {
  var defaultValue = 33;
  var used = value || defaultValue;
}
```

Use `.bind` to [partially-apply][30] functions.

```js
function sum (a, b) {
  return a + b;
}

var addSeven = sum.bind(null, 7);

addSeven(6);
// <- 13
```

Use `Array.prototype.slice.call` to cast array-like objects to true arrays.

```js
var args = Array.prototype.slice.call(arguments);
```

Use [event emitters][31] on all the things!

```js
var emitter = contra.emitter();

body.addEventListener('click', function () {
  emitter.emit('click', e.target);
});

emitter.on('click', function (elem) {
  console.log(elem);
});

// simulate click
emitter.emit('click', document.body);
```

Use `Function()` as a _"no-op"_.

```js
function (cb) {
  setTimeout(cb || Function(), 2000);
}
```

## License

MIT

> Fork away!

# }


  [1]: http://wiki.commonjs.org/wiki/CommonJS
  [2]: http://requirejs.org/docs/whyamd.html
  [3]: http://eviltrout.com/2014/05/03/getting-started-with-es6.html
  [4]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions_and_function_scope/Strict_mode
  [5]: http://editorconfig.org
  [6]: http://dailyjs.com/2012/12/24/817-javascript-survey-results
  [7]: http://blog.izs.me/post/2353458699/an-open-letter-to-javascript-leaders-regarding
  [8]: https://github.com/jscs-dev/node-jscs
  [9]: http://www.jslint.com/
  [10]: https://github.com/jshint/jshint/
  [11]: https://github.com/eslint/eslint
  [12]: http://nodejs.org/api/util.html#util_util_format_format
  [13]: https://github.com/jadejs/jade
  [14]: https://www.imperialviolet.org/2014/02/22/applebug.html
  [15]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Comparison_Operators
  [16]: https://github.com/jquery/jquery/blob/c869a1ef8a031342e817a2c063179a787ff57239/src/ajax.js#L117
  [17]: http://stackoverflow.com/q/336859/389745
  [18]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/function
  [19]: https://github.com/buildfirst/buildfirst/tree/master/ch05/04_hoisting
  [20]: http://ejohn.org/blog/partial-functions-in-javascript/
  [21]: https://github.com/buildfirst/buildfirst/tree/master/ch05/04_hoisting
  [22]: https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#3-managing-arguments
  [23]: https://github.com/bevacqua/poser
  [24]: https://ponyfoo.com/articles/fun-with-native-arrays
  [25]: https://ponyfoo.com/articles/learn-regular-expressions
  [26]: http://www.regexper.com/#%2F%5Cd%2B%2F
  [27]: https://remysharp.com/2010/10/08/what-is-a-polyfill
  [28]: https://ponyfoo.com/articles/building-high-quality-front-end-modules
  [29]: http://james.padolsey.com/javascript/truthy-falsey/
  [30]: http://ejohn.org/blog/partial-functions-in-javascript/
  [31]: https://github.com/bevacqua/contra#%CE%BBemitterthing-options
  [32]: https://github.com/bevacqua/css
  [33]: https://github.com/bevacqua/js/issues
  
  
# [![](https://i.imgur.com/rb8oPur.png)](http://turbo.github.io)

turbo.js is a small library that makes it easier to perform complex calculations that can be done in parallel. The actual calculation performed (the *kernel* executed) uses the GPU for execution. This enables you to work on an array of values all at once.

turbo.js is compatible with all browsers (even IE when not using ES6 template strings) and most desktop and mobile GPUs.

**For a live demo and short intro, please visit [turbo.github.io](http://turbo.github.io).**

![](https://i.imgur.com/BiiQSzP.png)

### Example 1

For this example, which can also be found at the aforementioned website, we are going to perform a simple calculation on a big-ish array of values.

First, include turbo.js in your site:

```html
<script src="https://turbo.github.io/js/turbo.js"></script>
```

or pull [`turbojs`](https://www.npmjs.com/package/turbojs) via npm to use it in your project.

turbo.js only has two functions that can be called by your code. Both are contained within the `turbojs` object. If this object is not initialized, something went wrong. So the first step is to check for turbo.js support. You can optionally check for exceptions thrown by turbo.js, which will provide further details on the error.

```js
if (turbojs) {
  // yay
}
```

Now we need some memory. Because data has to be transferred to and from GPU and system memory, we want to reduce the overhead this copy operation creates. To do this, turbo.js provides the `alloc` function. This will reserve memory on the GPU and in your browser. JavaScript can access and change contents of allocated memory by accessing the `.data` sub-array of a variable that contains allocated memory.

For both turbo.js and JavaScript, the allocated memory is strictly typed and represents a one-dimensional array of 32bit IEEE floating-point values. Thus, the `.data` sub-array is a standard JavaScript [`Float32Array`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Float32Array) object. After allocation, you can interact with this array however you want, except for changing it's size. Doing so will result in undefined behavior.

```js
if (turbojs) {
  var foo = turbojs.alloc(1e6);
}
```

We now have an array with 1,000,000 elements. Let's fill it with some data.

```js
if (turbojs) {
  var foo = turbojs.alloc(1e6);

  for (var i = 0; i < 1e6; i++) foo.data[i] = i;

  // print first five elements
  console.log(foo.data.subarray(0, 5));
}
```

Running this, the console should now display `[0, 1, 2, 3, 4]`. Now for our simple calculation: Multiplying each value by `nFactor` and printing the results:

```js
if (turbojs) {
  var foo = turbojs.alloc(1e6);
  var nFactor = 4;

  for (var i = 0; i < 1e6; i++) foo.data[i] = i;

  turbojs.run(foo, `void main(void) {
    commit(read() * ${nFactor}.);
  }`);

  console.log(foo.data.subarray(0, 5));
}
```

The console should now display `[0, 4, 8, 12, 16]`. That was easy, wasn't it? Let's break done what we've done:

- `turbojs.run`'s first parameter is the previously allocated memory. The second parameter is the code that will be executed for each value in the array.
- The code is written in an extension of C called GLSL. If you are not familiar with it, there is some good documentation on the internet. If you know C (or JS and know what types are), you'll pick it up in no time.
- The kernel code here consists just of the main function, which takes no parameters. However, kernels can have any number of functions (except zero).
- The `read()` function reads the current input value.
- `${nFactor}` is substituted by the value of `nFactor`. Since GLSL expects numerical constant expressions to be typed, we append a `.` to mark it as a float. Otherwise the GLSL compiler will throw a type error.
- `commit()` writes the result back to memory. You can `commit` from any function, but it is good practice to do so from the last line of the `main` function.

### Example 2: Working with vectors

That's great. But sometimes you need to return more than a single value from each operation. Well, it might not look like it, but we've been doing that all along. Both `commit` and `read` actually work on 4-dimensional vectors. To break it down:

- `vec4 read()` returns the GLSL data type `vec4`.
- `void commit(vec4)` takes a `vec4` and writes it to memory

A `vec4` is basically just an array. You could say it's akin to `foobar = {r:0, g:0, b:0, a:0}` in JS, but it's much more similar to JavaScript [`SIMD`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SIMD)'s `Float32x4`.

The nice thing about GLSL is that all operations are overloaded so that they can work with vectors without the need to deal with each element individually, so

```GLSL
commit(vec4(read().r * 4., read().g * 4., read().b * 4., read().a * 4.));
```

is equivalent to

```GLSL
commit(read() * 4.);
```

Neat, huh? Of course there are other types of vectors in GLSL, namely `vec2` and `vec3`. If you create a bigger vector and supply a smaller one as a parameter, GLSL will automatically align the values:

```GLSL
vec2 foo = vec2(1., 2.);

commit(vec4(foo.r, foo.g, 0., 0.));

// is the same as

commit(vec4(foo.rg, 0., 0.));
```

So we'll use that right now. If you visit the website mentioned above, you will get results from a simple benchmark comparing JS to JS + turbo.js. The benchmark calculates random points on a mandelbrot fractal. Let's break down what happens there, starting with the JavaScript code:

For each run, the first two values of each `vec4` of the allocated memory are filled with random coordinates as the input for the fractal function:

```js
for (var i = 0; i < sampleSize; i += 4) {
  testData.data[i] = Math.random();
  testData.data[i + 1] = Math.random();
}
```

For each operation, the result will be a greyscale color value. That will be written to the third (i.e. `b`) component of each vector:

```js
function testJS() {
	for (var i = 0; i < sampleSize; i += 4) {
		var x0 = -2.5 + (3.5 * testData.data[i]);
		var y0 = testData.data[i + 1], x = 0, y = 0, xt = 0, c = 0;

		for (var n = 0; n < sampleIterations; n++) {
			if (x * x + y * y >= 2 * 2) break;

			xt = x * x - y * y + x0;
			y = 2 * x * y + y0;
			x = xt;
			c++;
		}

		var col = c / sampleIterations;

		testData.data[i + 2] = col;
	}
}
```

The fractal is calculated to the iteration depth of `sampleIterations`. Now let's take a look at the turbo.js code performing the same task:

```js
function testTurbo() {
	turbojs.run(testData, `void main(void) {
		vec4 ipt = read();

		float x0 = -2.5 + (3.5 * ipt.r);
		float y0 = ipt.g, x, y, xt, c;

		for(int i = 0; i < ${sampleIterations}; i++) {
			if (x * x + y * y >= 2. * 2.) break;

			xt = x * x - y * y + x0;
			y = 2. * x * y + y0;
			x = xt;
			c++;
		}

		float col = c / ${sampleIterations}.;

		commit(vec4(ipt.rg, col, 0.));
	}`);
}
```

Notice how easy the JS code can be translated to GLSL and vice versa, as long as no exclusive paradigms are used. Of course this example is not the optimal algorithm in JS or GLSL, this is just for comparison.

### Example 3: Debugging

GLSL code is compiled by your GPU vendor's compiler. Usually these compilers provide verbose error information. You can catch compile-time errors by catching exceptions thrown by turbo.js. As an example, consider this invalid code:

```js
if (turbojs) {
  var foo = turbojs.alloc(1e6);
  var nFactor = 4;

  turbojs.run(foo, `void main(void) {
    commit(${nFactor}. + bar);
  }`);
}
```

This will generate two errors. The first one is `bar` being undefined. The second one is a type mismatch: `commit` expects a vector, but we've just given it a float. Opening your browser's console will reveal the error:

![](https://i.imgur.com/49Z6Fei.png)

### Further considerations

- Always provide a JS fallback if you detect that turbo.js is not supported.
- Use web workers for huge datasets to prevent the page from blocking.
- Always warm-up the GPU using dummy data. You won't get the full performance if you don't.
- In addition to error checking, do a sanity check using a small dataset and a simple kernel. If the numbers don't check out, fall back to JS.
- I haven't tried it, but I guess you can adapt [glsl-transpiler](https://github.com/stackgl/glsl-transpiler) to create JS fallback code automatically.
- Consider if you *really* need turbo.js. Optimize your *algorithm* (not code) first. Consider using JS SIMD. turbo.js can't be used for non-parallel workloads.

Make sure to familiarize yourself with the GLSL standard, which can be found at [OpenGL.org](https://www.opengl.org/registry/doc/GLSLangSpec.4.40.pdf).

Follow best practices to reduce your algorithm complexity. MDN adds:

> Simpler shaders perform better than complex ones. In particular, if you can remove an if statement from a shader, that will make it run faster. Division and math functions like `log()` should be considered expensive too.

Many C shorthands apply to GLSL. Having said that, this also applies:

> However, nowadays even mobile devices possess powerful GPUs that are capable of running even relatively complex shader programs. Moreover, because shaders are compiled, the eventual machine code that actually runs on the hardware may be highly optimized. What may seem like an expensive function call may in fact compile into only few (or even a single) machine instructions. This is particularly true for GLSL functions that typically operate on vectors, such as `normalize()`, `dot()` and `mix()`. The best advice in that regard is to use the built-in functions, rather than try to implement, for example, one's own version of a dot-product or linear interpolation, which may in fact compile to larger and less optimized machine code. Finally, it is important to keep in mind that GPUs are constructed to do complex mathematical calculations in hardware, and therefore, may support math functions, such as `sin()`, `cos()` and other, through dedicated machine instructions.



[![General Assembly Logo](https://camo.githubusercontent.com/1a91b05b8f4d44b5bbfb83abac2b0996d8e26c92/687474703a2f2f692e696d6775722e636f6d2f6b6538555354712e706e67)](https://generalassemb.ly/education/web-development-immersive)

# JavaScript Basics

## Introduction

A review of many of the building blocks of JavaScript.

Although ECMAScript 2015 ([ES2015](http://www.ecma-international.org/ecma-262/6.0/))
is the latest standard, adopted in June of 2015, we'll mostly focus on features
from the [ES5](http://www.ecma-international.org/ecma-262/5.1/) standard.  Some
of the references in this document may include descriptions of ES2015 features.
These features will usually be denoted with `(new in ECMAScript 2015)` in the
main text or with a **flask icon** in the navigation sidebar.

`let` and `const` are the primary ES2015 features introduced in this training.  In
order to to use these features, we'll need to be in strict mode.

## Objectives

By the end of this lesson, students should be able to:

-   List all 5 JavaScript primitives and give an example of each
-   Identify the operator in an expression and explain what it does
-   Define variable and contrast with value
-   Evaluate simple JavaScript by inspection
-   Write simple scripts that use flow control

## Preparation

1.  [Fork and clone](https://github.com/ga-wdi-boston/meta/wiki/ForkAndClone)
    this repository.
1.  Create a new branch, `training`, for your work.
1.  Switch to the new `training` branch.
1.  Install dependencies with `npm install`.
1.  Open the repository in Atom with `atom .`.

Note: Create and switch to a new branch at the same time with the shortcut:
`git checkout -b <new branch name>`.

## Basics

### Primitive types

ES5 has 5 primitive [types](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures): `Number`, `String`, `Boolean`, `null`, and `undefined`.

| Type      | Examples                        |
|:----------|:--------------------------------|
| Number    | `-0`, `NaN`, `Infinity`         |
| String    | `''`, `"The non-empty string."` |
| Boolean   | `true`, `false`                 |
| null      | `null`                          |
| undefined | `undefined`                     |

Primitive types represent **immutable** values.  We'll contrast this with
reference types in a later lesson.

The types Number and String both have large sets of possible values.  Boolean
has only two values and null and undefined each have just one.

The ES2015 primitive type `Symbol` is intentionally omitted.

### Literals

Literals represent specific values in the source code.
Some examples are `1`, `'A string'`, `null`.

### Variables

#### Node.js

We'll use Node.js as a [REPL](https://nodejs.org/api/repl.html) and script
runner to evaluate expressions and explore JavaScript features.

-   **R**ead
-   **E**valuate
-   **P**rint
-   **L**oop

#### Code Along: Declare Variables

```bash
$ node
> 'use strict'
>
```

```js
> bornOn
```

Variables need to be declared.

```js
> let bornOn
```

Variables name storage for the value they contain.  Because JavaScript is a
dynamically typed language, you can assign a value of one type to a variable and
then later assign a value of a different type to that same variable.

In JavaScript, `null` represents the explicitly omitted value, whereas
`undefined` represents the default omitted value.  Variables that have been
declared but are uninitialized or unset have the value `undefined`.

### Operators

Operators come in three classes, unary, binary (the most common), and ternary
(there is only one).

Operator precedence determines the order in which operators are evaluated.
Operators with higher precedence are evaluated first.

Associativity determines the order in which operators of the same precedence are
processed.

The following table lists a subset of the JavaScript
[operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence)
from higher to lower precedence.

| Type                                                 | Associativity | Operators                      |
|:-----------------------------------------------------|:--------------|:-------------------------------|
| grouping                                             | n/a           | `()`                           |
| postfix increment                                    | n/a           | `++` `--`                      |
| negation, numeric conversion, prefix increment, type | right-to-left | `!` `-` `+` `++` `--` `typeof` |
| multiplication, division, modulo                     | left-to-right | `* / %`                        |
| addition, subtraction                                | left-to-right | `+ -`                          |
| relation, instance                                   | left-to-right | `<` `<=` `>` `>=` `instanceof` |
| strict equality                                      | left-to-right | `===` `!==`                    |
| logical and                                          | left-to-right | `&&`                           |
| logical or                                           | left-to-right | `||`                           |
| conditional                                          | right-to-left | `?:`                           |
| assignment                                           | right-to-left | `=` `+=` `-=` `*=` `/=` `%=`   |

### Expressions

An expression is a combination of literals, variables, operators, function
invocations and sub-expressions that are interpreted and produce a value.  Not
all such combinations produce _sensible_ results.

The simplest expression is a variable or literal followed by a semicolon. More
complicated expressions are formed by combining simpler expressions using
operators.

An expression with all of the variables replaced with literals that are equal to
the values of the variables will produce the same result.

#### Code Along: Assignment expressions

Assignment changes the value of a variable.

```js
let height
height
height = 72
height
let name
name = 'Brian'
name
```

Remember: JavaScript variables are untyped.

```js
name = 'Brian'
name = 29
```

Although it doesn't cause an error, avoid confusing code like the above.

Now try it yourself!
Create a new variable named `developer`, and store the name of the person
sitting next to you in it. Now change it to someone else in the room!

##### Constants

Constants must be initialized, assigned a value, when created.  Uninitialized
constants are a syntax error in Firefox.  In Chrome or node they will always
have the value `undefined`.

```js
const pi = 3.14159265359 // rounded
pi
const e
e = 2.71828182846 // rounded
e
```

#### Numeric expressions

Simple calculations:

```js
5 + 3
7 - 2
11 % 5
```

Expressions with variables only change values with assignment.

```js
height = 80
height - 1
height
```

What will `height` be at the end of the 3 lines above?

Now let's compare some common methods of counting.

```js
let i
i = 0
i
i = i + 1
i
i += 1
i
++i
i
i++
i
```

Note: `++i` and `i++` are not the same! `++i` will increment i by 1 and then
evaluate i, whereas `i++` will evaluate i and then increment.

#### String expressions

```js
let givenName
let surname
let fullName
givenName = 'Brian'
surname = 'Berzellini'
fullName = givenName + ' ' + surname
```

Try it with your name now!

```js
bornOn = '1982-09-29'
```

What happens if you don't enter the date as a string?


#### Code Along: Boolean expressions

A boolean expression is a comparison (e.g. `>`, `>=`, `===`) or any value
interpreted as a boolean.  We'll use that fact when we get to flow control.
Boolean expression combine using the logical and `&&` and logical `||`
operators.

```js
let height = 72
height === 60
height > 72
height = 76
height > 72
height > 72 && height < 78
```

The logical operators 'short circuit', which means they stop evaluating operands
as soon as the expression is `false` for `&&`, or true for `||`.

##### Truthy and Falsy Values

What do you think of when you hear 'truthy' and 'falsy'?

All values in JS are inherently truthy with the exception of these 6 values:

-   `false`
-   `undefined`
-   `null`
-   `0` and `-0`
-   `NaN`
-   `''`, `""`, and ` `` `

Note:  The negation of a truthy value is `false` and the negation of a falsy
value is `true`.

```js
let truthyValue
let falsyValue
truthyValue = 'A non-empty string'
falsyValue = 0
!truthyValue
!falsyValue
```

#### Demo: Type conversions

The unary `+` operator attempts to convert its operand to a Number.  If
unsuccessful the result is `NaN`.

If either operand of the binary `+` operator is a string the operator converts
the other operator to a string.  Some results of this conversion are more useful
than others.

Note the difference between `3 + 5 + ' times'` and `'times ' + 3 + 5`?

The unary `!` operator converts its operand to a boolean value.

For non-strict-equality comparisons with numbers, boolean values are coerced to
`1` or `0` (from `true` or `false` respectively).

### Code Along: Flow Control

Remember how we used node as a REPL earlier? It actually has a completely
different use as well--as a script runner. Let's see how that works while we
explore some examples of flow control.

To start, exit your REPL using `CTRL-d` and make sure you're in the 'lib' folder. Add 3 files using the `touch`
command from your terminal.

`touch greeter.js psychic.js forLoop.js`

#### Printing to the Console

As developers, we often want to take a look at the
inner workings of processing and just get a read on what variables store which
values at a specific time while our code is running. To do this we type
`console.log("Whatever we want to print out to the console.")`.

It's an extremely effective tool that often gets pulled out before
production, but can help give you an idea of what should be returned, and
a good point of reference for debugging.

#### `if` Statements

Open `greeter.js` and we'll type some code in...

```js
'use strict'
//We'll learn about require later in the course
const ask = require('../lib/ask.js')

let name = ask("What's your name? ")
if (name === 'Brian') {
  console.log('Hi, Brian!')
} else if (name === 'Jeff') {
  console.log('Hi, Jeff!')
} else if (name === 'Chris') {
  console.log('Hi, Chris!')
} else {
  console.log('Hi, stranger.')
}
```

Save this file and return to your terminal.
Type `node greeter.js`
Type your name and hit ENTER.

Press the UP arrow on your keyboard to reload the previous line OR type
`node greeter.js` again.
Type `Lauren` and hit ENTER.

#### `while` Loops

Now go to `psychic.js`

```js
'use strict'
//We'll learn about require later in the course
const ask = require('../lib/ask.js')

let count = 0
let answer = ''

while (answer !== 'Jeff') {
  answer = ask('Guess my name? ')
  count = count + 1
}
console.log('You got it in ' + count + ' tries!')
```

Save this file and return to your terminal.
Type `node psychic.js`
Type your name and hit ENTER.
Try your neighbor's name.
Try `Antony`.

#### `for` Loops

```js
for (let i = 0; i < 10; i++) {
  console.log(i)
}
```

Save this file and return to your terminal.
Think about what you expect this file to produce to the terminal...
Now type `node forLoop.js` and hit ENTER.

which is _almost_ equivalent to:

```js
let i = 0
while (i < 10) {
  console.log(i)
  i++
}
```

Nesting conditionals in loops:

```js
for (let i = 0; i < 10; i++) {
  if (i === 5) {
    console.log('five!')
  } else {
    console.log('nah')
  }
}
```

Save. Think about what you expect this file to produce to the terminal...
What do we type in the terminal to run our code?

#### Lab: Build a Script Yourself

Try building your own script in the ./bin directory titled `guessMyAge.js`. Have
this script ask the user their age, and if they're older than 90 print to the
console "You old fart!" If they're under the age of 10 print "Why are you on a
computer? Go outside!" If they're between 10 and 90, print "How boring...".

If you finish early, challenge yourself by designing your own script that runs
something using two or more examples of flow control we've introduced today!
Save it as it in `bonusChallenge.js`

Note: refer to the beginning lines of our `greeter.js` code to enable working
with user input.

## Additional Resources

See the following sections at
<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide>

-   Grammar and types
-   Control flow and error handling
-   Loops and iteration
-   Expressions and operators
-   Number and [dates](https://en.wikipedia.org/wiki/ISO_8601)
-   Text formatting

## [License](LICENSE)

1.  All content is licensed under a CC­BY­NC­SA 4.0 license.
1.  All software code is licensed under GNU GPLv3. For commercial use or
    alternative licensing, please contact legal@ga.co.
    
    
    
# reveal.js [![Build Status](https://travis-ci.org/hakimel/reveal.js.svg?branch=master)](https://travis-ci.org/hakimel/reveal.js) <a href="https://slides.com?ref=github"><img src="https://s3.amazonaws.com/static.slid.es/images/slides-github-banner-320x40.png?1" alt="Slides" width="160" height="20"></a>

A framework for easily creating beautiful presentations using HTML. [Check out the live demo](http://revealjs.com/).

reveal.js comes with a broad range of features including [nested slides](https://github.com/hakimel/reveal.js#markup), [Markdown contents](https://github.com/hakimel/reveal.js#markdown), [PDF export](https://github.com/hakimel/reveal.js#pdf-export), [speaker notes](https://github.com/hakimel/reveal.js#speaker-notes) and a [JavaScript API](https://github.com/hakimel/reveal.js#api). There's also a fully featured visual editor and platform for sharing reveal.js presentations at [slides.com](https://slides.com?ref=github).


## Table of contents

- [Online Editor](#online-editor)
- [Installation](#installation)
  - [Basic setup](#basic-setup)
  - [Full setup](#full-setup)
  - [Folder Structure](#folder-structure)
- [Instructions](#instructions)
  - [Markup](#markup)
  - [Markdown](#markdown)
  - [Element Attributes](#element-attributes)
  - [Slide Attributes](#slide-attributes)
- [Configuration](#configuration)
- [Presentation Size](#presentation-size)
- [Dependencies](#dependencies)
- [Ready Event](#ready-event)
- [Auto-sliding](#auto-sliding)
- [Keyboard Bindings](#keyboard-bindings)
- [Touch Navigation](#touch-navigation)
- [Lazy Loading](#lazy-loading)
- [API](#api)
  - [Slide Changed Event](#slide-changed-event)
  - [Presentation State](#presentation-state)
  - [Slide States](#slide-states)
  - [Slide Backgrounds](#slide-backgrounds)
  - [Parallax Background](#parallax-background)
  - [Slide Transitions](#slide-transitions)
  - [Internal links](#internal-links)
  - [Fragments](#fragments)
  - [Fragment events](#fragment-events)
  - [Code syntax highlighting](#code-syntax-highlighting)
  - [Slide number](#slide-number)
  - [Overview mode](#overview-mode)
  - [Fullscreen mode](#fullscreen-mode)
  - [Embedded media](#embedded-media)
  - [Stretching elements](#stretching-elements)
  - [postMessage API](#postmessage-api)
- [PDF Export](#pdf-export)
- [Theming](#theming)
- [Speaker Notes](#speaker-notes)
  - [Share and Print Speaker Notes](#share-and-print-speaker-notes)
  - [Server Side Speaker Notes](#server-side-speaker-notes)
- [Multiplexing](#multiplexing)
  - [Master presentation](#master-presentation)
  - [Client presentation](#client-presentation)
  - [Socket.io server](#socketio-server)
- [MathJax](#mathjax)
- [License](#license)

#### More reading

- [Changelog](https://github.com/hakimel/reveal.js/releases): Up-to-date version history.
- [Examples](https://github.com/hakimel/reveal.js/wiki/Example-Presentations): Presentations created with reveal.js, add your own!
- [Browser Support](https://github.com/hakimel/reveal.js/wiki/Browser-Support): Explanation of browser support and fallbacks.
- [Plugins](https://github.com/hakimel/reveal.js/wiki/Plugins,-Tools-and-Hardware): A list of plugins that can be used to extend reveal.js.


## Online Editor

Presentations are written using HTML or Markdown but there's also an online editor for those of you who prefer a graphical interface. Give it a try at [https://slides.com](https://slides.com?ref=github).


## Installation

The **basic setup** is for authoring presentations only. The **full setup** gives you access to all reveal.js features and plugins such as speaker notes as well as the development tasks needed to make changes to the source.

### Basic setup

The core of reveal.js is very easy to install. You'll simply need to download a copy of this repository and open the index.html file directly in your browser.

1. Download the latest version of reveal.js from <https://github.com/hakimel/reveal.js/releases>
2. Unzip and replace the example contents in index.html with your own
3. Open index.html in a browser to view it

### Full setup

Some reveal.js features, like external Markdown and speaker notes, require that presentations run from a local web server. The following instructions will set up such a server as well as all of the development tasks needed to make edits to the reveal.js source code.

1. Install [Node.js](http://nodejs.org/) (4.0.0 or later)

1. Clone the reveal.js repository
   ```sh
   $ git clone https://github.com/hakimel/reveal.js.git
   ```

1. Navigate to the reveal.js folder
   ```sh
   $ cd reveal.js
   ```

1. Install dependencies
   ```sh
   $ npm install
   ```

1. Serve the presentation and monitor source files for changes
   ```sh
   $ npm start
   ```

1. Open <http://localhost:8000> to view your presentation

   You can change the port by using `npm start -- --port=8001`.

### Folder Structure

- **css/** Core styles without which the project does not function
- **js/** Like above but for JavaScript
- **plugin/** Components that have been developed as extensions to reveal.js
- **lib/** All other third party assets (JavaScript, CSS, fonts)


## Instructions

### Markup

Here's a barebones example of a fully working reveal.js presentation:
```html
<html>
	<head>
		<link rel="stylesheet" href="css/reveal.css">
		<link rel="stylesheet" href="css/theme/white.css">
	</head>
	<body>
		<div class="reveal">
			<div class="slides">
				<section>Slide 1</section>
				<section>Slide 2</section>
			</div>
		</div>
		<script src="js/reveal.js"></script>
		<script>
			Reveal.initialize();
		</script>
	</body>
</html>
```

The presentation markup hierarchy needs to be `.reveal > .slides > section` where the `section` represents one slide and can be repeated indefinitely. If you place multiple `section` elements inside of another `section` they will be shown as vertical slides. The first of the vertical slides is the "root" of the others (at the top), and will be included in the horizontal sequence. For example:

```html
<div class="reveal">
	<div class="slides">
		<section>Single Horizontal Slide</section>
		<section>
			<section>Vertical Slide 1</section>
			<section>Vertical Slide 2</section>
		</section>
	</div>
</div>
```

### Markdown

It's possible to write your slides using Markdown. To enable Markdown, add the `data-markdown` attribute to your `<section>` elements and wrap the contents in a `<textarea data-template>` like the example below. You'll also need to add the `plugin/markdown/marked.js` and `plugin/markdown/markdown.js` scripts (in that order) to your HTML file.

This is based on [data-markdown](https://gist.github.com/1343518) from [Paul Irish](https://github.com/paulirish) modified to use [marked](https://github.com/chjj/marked) to support [GitHub Flavored Markdown](https://help.github.com/articles/github-flavored-markdown). Sensitive to indentation (avoid mixing tabs and spaces) and line breaks (avoid consecutive breaks).

```html
<section data-markdown>
	<textarea data-template>
		## Page title

		A paragraph with some text and a [link](http://hakim.se).
	</textarea>
</section>
```

#### External Markdown

You can write your content as a separate file and have reveal.js load it at runtime. Note the separator arguments which determine how slides are delimited in the external file: the `data-separator` attribute defines a regular expression for horizontal slides (defaults to `^\r?\n---\r?\n$`, a newline-bounded horizontal rule)  and `data-separator-vertical` defines vertical slides (disabled by default). The `data-separator-notes` attribute is a regular expression for specifying the beginning of the current slide's speaker notes (defaults to `notes?:`, so it will match both "note:" and "notes:"). The `data-charset` attribute is optional and specifies which charset to use when loading the external file.

When used locally, this feature requires that reveal.js [runs from a local web server](#full-setup).  The following example customises all available options:

```html
<section data-markdown="example.md"
         data-separator="^\n\n\n"
         data-separator-vertical="^\n\n"
         data-separator-notes="^Note:"
         data-charset="iso-8859-15">
    <!--
        Note that Windows uses `\r\n` instead of `\n` as its linefeed character.
        For a regex that supports all operating systems, use `\r?\n` instead of `\n`.
    -->
</section>
```

#### Element Attributes

Special syntax (through HTML comments) is available for adding attributes to Markdown elements. This is useful for fragments, amongst other things.

```html
<section data-markdown>
	<script type="text/template">
		- Item 1 <!-- .element: class="fragment" data-fragment-index="2" -->
		- Item 2 <!-- .element: class="fragment" data-fragment-index="1" -->
	</script>
</section>
```

#### Slide Attributes

Special syntax (through HTML comments) is available for adding attributes to the slide `<section>` elements generated by your Markdown.

```html
<section data-markdown>
	<script type="text/template">
	<!-- .slide: data-background="#ff0000" -->
		Markdown content
	</script>
</section>
```

#### Configuring *marked*

We use [marked](https://github.com/chjj/marked) to parse Markdown. To customise marked's rendering, you can pass in options when [configuring Reveal](#configuration):

```javascript
Reveal.initialize({
	// Options which are passed into marked
	// See https://github.com/chjj/marked#options-1
	markdown: {
		smartypants: true
	}
});
```

### Configuration

At the end of your page you need to initialize reveal by running the following code. Note that all configuration values are optional and will default to the values specified below.

```javascript
Reveal.initialize({

	// Display presentation control arrows
	controls: true,

	// Help the user learn the controls by providing hints, for example by
	// bouncing the down arrow when they first encounter a vertical slide
	controlsTutorial: true,

	// Determines where controls appear, "edges" or "bottom-right"
	controlsLayout: 'bottom-right',

	// Visibility rule for backwards navigation arrows; "faded", "hidden"
	// or "visible"
	controlsBackArrows: 'faded',

	// Display a presentation progress bar
	progress: true,

	// Display the page number of the current slide
	slideNumber: false,

	// Push each slide change to the browser history
	history: false,

	// Enable keyboard shortcuts for navigation
	keyboard: true,

	// Enable the slide overview mode
	overview: true,

	// Vertical centering of slides
	center: true,

	// Enables touch navigation on devices with touch input
	touch: true,

	// Loop the presentation
	loop: false,

	// Change the presentation direction to be RTL
	rtl: false,

	// Randomizes the order of slides each time the presentation loads
	shuffle: false,

	// Turns fragments on and off globally
	fragments: true,

	// Flags whether to include the current fragment in the URL,
	// so that reloading brings you to the same fragment position
	fragmentInURL: false,

	// Flags if the presentation is running in an embedded mode,
	// i.e. contained within a limited portion of the screen
	embedded: false,

	// Flags if we should show a help overlay when the questionmark
	// key is pressed
	help: true,

	// Flags if speaker notes should be visible to all viewers
	showNotes: false,

	// Global override for autoplaying embedded media (video/audio/iframe)
	// - null: Media will only autoplay if data-autoplay is present
	// - true: All media will autoplay, regardless of individual setting
	// - false: No media will autoplay, regardless of individual setting
	autoPlayMedia: null,

	// Number of milliseconds between automatically proceeding to the
	// next slide, disabled when set to 0, this value can be overwritten
	// by using a data-autoslide attribute on your slides
	autoSlide: 0,

	// Stop auto-sliding after user input
	autoSlideStoppable: true,

	// Use this method for navigation when auto-sliding
	autoSlideMethod: Reveal.navigateNext,

	// Specify the average time in seconds that you think you will spend
	// presenting each slide. This is used to show a pacing timer in the
	// speaker view
	defaultTiming: 120,

	// Enable slide navigation via mouse wheel
	mouseWheel: false,

	// Hides the address bar on mobile devices
	hideAddressBar: true,

	// Opens links in an iframe preview overlay
	// Add `data-preview-link` and `data-preview-link="false"` to customise each link
	// individually
	previewLinks: false,

	// Transition style
	transition: 'slide', // none/fade/slide/convex/concave/zoom

	// Transition speed
	transitionSpeed: 'default', // default/fast/slow

	// Transition style for full page slide backgrounds
	backgroundTransition: 'fade', // none/fade/slide/convex/concave/zoom

	// Number of slides away from the current that are visible
	viewDistance: 3,

	// Parallax background image
	parallaxBackgroundImage: '', // e.g. "'https://s3.amazonaws.com/hakim-static/reveal-js/reveal-parallax-1.jpg'"

	// Parallax background size
	parallaxBackgroundSize: '', // CSS syntax, e.g. "2100px 900px"

	// Number of pixels to move the parallax background per slide
	// - Calculated automatically unless specified
	// - Set to 0 to disable movement along an axis
	parallaxBackgroundHorizontal: null,
	parallaxBackgroundVertical: null,

	// The display mode that will be used to show slides
	display: 'block'

});
```

The configuration can be updated after initialization using the `configure` method:

```javascript
// Turn autoSlide off
Reveal.configure({ autoSlide: 0 });

// Start auto-sliding every 5s
Reveal.configure({ autoSlide: 5000 });
```

### Presentation Size

All presentations have a normal size, that is, the resolution at which they are authored. The framework will automatically scale presentations uniformly based on this size to ensure that everything fits on any given display or viewport.

See below for a list of configuration options related to sizing, including default values:

```javascript
Reveal.initialize({

	// ...

	// The "normal" size of the presentation, aspect ratio will be preserved
	// when the presentation is scaled to fit different resolutions. Can be
	// specified using percentage units.
	width: 960,
	height: 700,

	// Factor of the display size that should remain empty around the content
	margin: 0.1,

	// Bounds for smallest/largest possible scale to apply to content
	minScale: 0.2,
	maxScale: 1.5

});
```

If you wish to disable this behavior and do your own scaling (e.g. using media queries), try these settings:

```javascript
Reveal.initialize({

	// ...

	width: "100%",
	height: "100%",
	margin: 0,
	minScale: 1,
	maxScale: 1
});
```

### Dependencies

Reveal.js doesn't _rely_ on any third party scripts to work but a few optional libraries are included by default. These libraries are loaded as dependencies in the order they appear, for example:

```javascript
Reveal.initialize({
	dependencies: [
		// Cross-browser shim that fully implements classList - https://github.com/eligrey/classList.js/
		{ src: 'lib/js/classList.js', condition: function() { return !document.body.classList; } },

		// Interpret Markdown in <section> elements
		{ src: 'plugin/markdown/marked.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
		{ src: 'plugin/markdown/markdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },

		// Syntax highlight for <code> elements
		{ src: 'plugin/highlight/highlight.js', async: true, callback: function() { hljs.initHighlightingOnLoad(); } },

		// Zoom in and out with Alt+click
		{ src: 'plugin/zoom-js/zoom.js', async: true },

		// Speaker notes
		{ src: 'plugin/notes/notes.js', async: true },

		// MathJax
		{ src: 'plugin/math/math.js', async: true }
	]
});
```

You can add your own extensions using the same syntax. The following properties are available for each dependency object:
- **src**: Path to the script to load
- **async**: [optional] Flags if the script should load after reveal.js has started, defaults to false
- **callback**: [optional] Function to execute when the script has loaded
- **condition**: [optional] Function which must return true for the script to be loaded

To load these dependencies, reveal.js requires [head.js](http://headjs.com/) *(a script loading library)* to be loaded before reveal.js.

### Ready Event

A `ready` event is fired when reveal.js has loaded all non-async dependencies and is ready to start navigating. To check if reveal.js is already 'ready' you can call `Reveal.isReady()`.

```javascript
Reveal.addEventListener( 'ready', function( event ) {
	// event.currentSlide, event.indexh, event.indexv
} );
```

Note that we also add a `.ready` class to the `.reveal` element so that you can hook into this with CSS.

### Auto-sliding

Presentations can be configured to progress through slides automatically, without any user input. To enable this you will need to tell the framework how many milliseconds it should wait between slides:

```javascript
// Slide every five seconds
Reveal.configure({
  autoSlide: 5000
});
```

When this is turned on a control element will appear that enables users to pause and resume auto-sliding. Alternatively, sliding can be paused or resumed by pressing »A« on the keyboard. Sliding is paused automatically as soon as the user starts navigating. You can disable these controls by specifying `autoSlideStoppable: false` in your reveal.js config.

You can also override the slide duration for individual slides and fragments by using the `data-autoslide` attribute:

```html
<section data-autoslide="2000">
	<p>After 2 seconds the first fragment will be shown.</p>
	<p class="fragment" data-autoslide="10000">After 10 seconds the next fragment will be shown.</p>
	<p class="fragment">Now, the fragment is displayed for 2 seconds before the next slide is shown.</p>
</section>
```

To override the method used for navigation when auto-sliding, you can specify the `autoSlideMethod` setting. To only navigate along the top layer and ignore vertical slides, set this to `Reveal.navigateRight`.

Whenever the auto-slide mode is resumed or paused the `autoslideresumed` and `autoslidepaused` events are fired.

### Keyboard Bindings

If you're unhappy with any of the default keyboard bindings you can override them using the `keyboard` config option:

```javascript
Reveal.configure({
  keyboard: {
    13: 'next', // go to the next slide when the ENTER key is pressed
    27: function() {}, // do something custom when ESC is pressed
    32: null // don't do anything when SPACE is pressed (i.e. disable a reveal.js default binding)
  }
});
```

### Touch Navigation

You can swipe to navigate through a presentation on any touch-enabled device. Horizontal swipes change between horizontal slides, vertical swipes change between vertical slides. If you wish to disable this you can set the `touch` config option to false when initializing reveal.js.

If there's some part of your content that needs to remain accessible to touch events you'll need to highlight this by adding a `data-prevent-swipe` attribute to the element. One common example where this is useful is elements that need to be scrolled.

### Lazy Loading

When working on presentation with a lot of media or iframe content it's important to load lazily. Lazy loading means that reveal.js will only load content for the few slides nearest to the current slide. The number of slides that are preloaded is determined by the `viewDistance` configuration option.

To enable lazy loading all you need to do is change your `src` attributes to `data-src` as shown below. This is supported for image, video, audio and iframe elements. Lazy loaded iframes will also unload when the containing slide is no longer visible.

```html
<section>
  <img data-src="image.png">
  <iframe data-src="http://hakim.se"></iframe>
  <video>
    <source data-src="video.webm" type="video/webm" />
    <source data-src="video.mp4" type="video/mp4" />
  </video>
</section>
```

### API

The `Reveal` object exposes a JavaScript API for controlling navigation and reading state:

```javascript
// Navigation
Reveal.slide( indexh, indexv, indexf );
Reveal.left();
Reveal.right();
Reveal.up();
Reveal.down();
Reveal.prev();
Reveal.next();
Reveal.prevFragment();
Reveal.nextFragment();

// Randomize the order of slides
Reveal.shuffle();

// Toggle presentation states, optionally pass true/false to force on/off
Reveal.toggleOverview();
Reveal.togglePause();
Reveal.toggleAutoSlide();

// Shows a help overlay with keyboard shortcuts, optionally pass true/false
// to force on/off
Reveal.toggleHelp();

// Change a config value at runtime
Reveal.configure({ controls: true });

// Returns the present configuration options
Reveal.getConfig();

// Fetch the current scale of the presentation
Reveal.getScale();

// Retrieves the previous and current slide elements
Reveal.getPreviousSlide();
Reveal.getCurrentSlide();

Reveal.getIndices();        // { h: 0, v: 0, f: 0 }
Reveal.getSlidePastCount();
Reveal.getProgress();       // (0 == first slide, 1 == last slide)
Reveal.getSlides();         // Array of all slides
Reveal.getTotalSlides();    // Total number of slides

// Returns the speaker notes for the current slide
Reveal.getSlideNotes();

// State checks
Reveal.isFirstSlide();
Reveal.isLastSlide();
Reveal.isOverview();
Reveal.isPaused();
Reveal.isAutoSliding();
```

### Custom Key Bindings

Custom key bindings can be added and removed using the following Javascript API. Custom key bindings will override the default keyboard bindings, but will in turn be overridden by the user defined bindings in the ``keyboard`` config option.

```javascript
Reveal.addKeyBinding( binding, callback );
Reveal.removeKeyBinding( keyCode );
```

For example

```javascript
// The binding parameter provides the following properties
//      keyCode: the keycode for binding to the callback
//          key: the key label to show in the help overlay
//  description: the description of the action to show in the help overlay
Reveal.addKeyBinding( { keyCode: 84, key: 'T', description: 'Start timer' }, function() {
	// start timer
} )

// The binding parameter can also be a direct keycode without providing the help description
Reveal.addKeyBinding( 82, function() {
	// reset timer
} )
```

This allows plugins to add key bindings directly to Reveal so they can

* make use of Reveal's pre-processing logic for key handling (for example, ignoring key presses when paused); and
* be included in the help overlay (optional)

### Slide Changed Event

A `slidechanged` event is fired each time the slide is changed (regardless of state). The event object holds the index values of the current slide as well as a reference to the previous and current slide HTML nodes.

Some libraries, like MathJax (see [#226](https://github.com/hakimel/reveal.js/issues/226#issuecomment-10261609)), get confused by the transforms and display states of slides. Often times, this can be fixed by calling their update or render function from this callback.

```javascript
Reveal.addEventListener( 'slidechanged', function( event ) {
	// event.previousSlide, event.currentSlide, event.indexh, event.indexv
} );
```

### Presentation State

The presentation's current state can be fetched by using the `getState` method. A state object contains all of the information required to put the presentation back as it was when `getState` was first called. Sort of like a snapshot. It's a simple object that can easily be stringified and persisted or sent over the wire.

```javascript
Reveal.slide( 1 );
// we're on slide 1

var state = Reveal.getState();

Reveal.slide( 3 );
// we're on slide 3

Reveal.setState( state );
// we're back on slide 1
```

### Slide States

If you set `data-state="somestate"` on a slide `<section>`, "somestate" will be applied as a class on the document element when that slide is opened. This allows you to apply broad style changes to the page based on the active slide.

Furthermore you can also listen to these changes in state via JavaScript:

```javascript
Reveal.addEventListener( 'somestate', function() {
	// TODO: Sprinkle magic
}, false );
```

### Slide Backgrounds

Slides are contained within a limited portion of the screen by default to allow them to fit any display and scale uniformly. You can apply full page backgrounds outside of the slide area by adding a `data-background` attribute to your `<section>` elements. Four different types of backgrounds are supported: color, image, video and iframe.

#### Color Backgrounds

All CSS color formats are supported, including hex values, keywords, `rgba()` or `hsl()`.

```html
<section data-background-color="#ff0000">
	<h2>Color</h2>
</section>
```

#### Image Backgrounds

By default, background images are resized to cover the full page. Available options:

| Attribute                        | Default    | Description |
| :------------------------------- | :--------- | :---------- |
| data-background-image            |            | URL of the image to show. GIFs restart when the slide opens. |
| data-background-size             | cover      | See [background-size](https://developer.mozilla.org/docs/Web/CSS/background-size) on MDN.  |
| data-background-position         | center     | See [background-position](https://developer.mozilla.org/docs/Web/CSS/background-position) on MDN. |
| data-background-repeat           | no-repeat  | See [background-repeat](https://developer.mozilla.org/docs/Web/CSS/background-repeat) on MDN. |
| data-background-opacity          | 1          | Opacity of the background image on a 0-1 scale. 0 is transparent and 1 is fully opaque. |

```html
<section data-background-image="http://example.com/image.png">
	<h2>Image</h2>
</section>
<section data-background-image="http://example.com/image.png" data-background-size="100px" data-background-repeat="repeat">
	<h2>This background image will be sized to 100px and repeated</h2>
</section>
```

#### Video Backgrounds

Automatically plays a full size video behind the slide.

| Attribute                        | Default | Description |
| :---------------------------     | :------ | :---------- |
| data-background-video            |         | A single video source, or a comma separated list of video sources. |
| data-background-video-loop       | false   | Flags if the video should play repeatedly. |
| data-background-video-muted      | false   | Flags if the audio should be muted. |
| data-background-size             | cover   | Use `cover` for full screen and some cropping or `contain` for letterboxing. |
| data-background-opacity          | 1       | Opacity of the background video on a 0-1 scale. 0 is transparent and 1 is fully opaque. |

```html
<section data-background-video="https://s3.amazonaws.com/static.slid.es/site/homepage/v1/homepage-video-editor.mp4,https://s3.amazonaws.com/static.slid.es/site/homepage/v1/homepage-video-editor.webm" data-background-video-loop data-background-video-muted>
	<h2>Video</h2>
</section>
```

#### Iframe Backgrounds

Embeds a web page as a slide background that covers 100% of the reveal.js width and height. The iframe is in the background layer, behind your slides, and as such it's not possible to interact with it by default. To make your background interactive, you can add the `data-background-interactive` attribute.

```html
<section data-background-iframe="https://slides.com" data-background-interactive>
	<h2>Iframe</h2>
</section>
```

#### Background Transitions

Backgrounds transition using a fade animation by default. This can be changed to a linear sliding transition by passing `backgroundTransition: 'slide'` to the `Reveal.initialize()` call. Alternatively you can set `data-background-transition` on any section with a background to override that specific transition.


### Parallax Background

If you want to use a parallax scrolling background, set the first two properties below when initializing reveal.js (the other two are optional).

```javascript
Reveal.initialize({

	// Parallax background image
	parallaxBackgroundImage: '', // e.g. "https://s3.amazonaws.com/hakim-static/reveal-js/reveal-parallax-1.jpg"

	// Parallax background size
	parallaxBackgroundSize: '', // CSS syntax, e.g. "2100px 900px" - currently only pixels are supported (don't use % or auto)

	// Number of pixels to move the parallax background per slide
	// - Calculated automatically unless specified
	// - Set to 0 to disable movement along an axis
	parallaxBackgroundHorizontal: 200,
	parallaxBackgroundVertical: 50

});
```

Make sure that the background size is much bigger than screen size to allow for some scrolling. [View example](http://revealjs.com/?parallaxBackgroundImage=https%3A%2F%2Fs3.amazonaws.com%2Fhakim-static%2Freveal-js%2Freveal-parallax-1.jpg&parallaxBackgroundSize=2100px%20900px).

### Slide Transitions

The global presentation transition is set using the `transition` config value. You can override the global transition for a specific slide by using the `data-transition` attribute:

```html
<section data-transition="zoom">
	<h2>This slide will override the presentation transition and zoom!</h2>
</section>

<section data-transition-speed="fast">
	<h2>Choose from three transition speeds: default, fast or slow!</h2>
</section>
```

You can also use different in and out transitions for the same slide:

```html
<section data-transition="slide">
    The train goes on …
</section>
<section data-transition="slide">
    and on …
</section>
<section data-transition="slide-in fade-out">
    and stops.
</section>
<section data-transition="fade-in slide-out">
    (Passengers entering and leaving)
</section>
<section data-transition="slide">
    And it starts again.
</section>
```
You can choose from `none`, `fade`, `slide`, `convex`, `concave` and `zoom`.
### Internal links

It's easy to link between slides. The first example below targets the index of another slide whereas the second targets a slide with an ID attribute (`<section id="some-slide">`):

```html
<a href="#/2/2">Link</a>
<a href="#/some-slide">Link</a>
```

You can also add relative navigation links, similar to the built in reveal.js controls, by appending one of the following classes on any element. Note that each element is automatically given an `enabled` class when it's a valid navigation route based on the current slide.

```html
<a href="#" class="navigate-left">
<a href="#" class="navigate-right">
<a href="#" class="navigate-up">
<a href="#" class="navigate-down">
<a href="#" class="navigate-prev"> <!-- Previous vertical or horizontal slide -->
<a href="#" class="navigate-next"> <!-- Next vertical or horizontal slide -->
```

### Fragments

Fragments are used to highlight individual elements on a slide. Every element with the class `fragment` will be stepped through before moving on to the next slide. Here's an example: http://revealjs.com/#/fragments

The default fragment style is to start out invisible and fade in. This style can be changed by appending a different class to the fragment:

```html
<section>
	<p class="fragment grow">grow</p>
	<p class="fragment shrink">shrink</p>
	<p class="fragment fade-out">fade-out</p>
	<p class="fragment fade-up">fade-up (also down, left and right!)</p>
	<p class="fragment fade-in-then-out">fades in, then out when we move to the next step</p>
	<p class="fragment fade-in-then-semi-out">fades in, then obfuscate when we move to the next step</p>
	<p class="fragment highlight-current-blue">blue only once</p>
	<p class="fragment highlight-red">highlight-red</p>
	<p class="fragment highlight-green">highlight-green</p>
	<p class="fragment highlight-blue">highlight-blue</p>
</section>
```

Multiple fragments can be applied to the same element sequentially by wrapping it, this will fade in the text on the first step and fade it back out on the second.

```html
<section>
	<span class="fragment fade-in">
		<span class="fragment fade-out">I'll fade in, then out</span>
	</span>
</section>
```

The display order of fragments can be controlled using the `data-fragment-index` attribute.

```html
<section>
	<p class="fragment" data-fragment-index="3">Appears last</p>
	<p class="fragment" data-fragment-index="1">Appears first</p>
	<p class="fragment" data-fragment-index="2">Appears second</p>
</section>
```

### Fragment events

When a slide fragment is either shown or hidden reveal.js will dispatch an event.

Some libraries, like MathJax (see #505), get confused by the initially hidden fragment elements. Often times this can be fixed by calling their update or render function from this callback.

```javascript
Reveal.addEventListener( 'fragmentshown', function( event ) {
	// event.fragment = the fragment DOM element
} );
Reveal.addEventListener( 'fragmenthidden', function( event ) {
	// event.fragment = the fragment DOM element
} );
```

### Code syntax highlighting

By default, Reveal is configured with [highlight.js](https://highlightjs.org/) for code syntax highlighting. To enable syntax highlighting, you'll have to load the highlight plugin ([plugin/highlight/highlight.js](plugin/highlight/highlight.js)) and a highlight.js CSS theme (Reveal comes packaged with the zenburn theme: [lib/css/zenburn.css](lib/css/zenburn.css)).

```javascript
Reveal.initialize({
	// More info https://github.com/hakimel/reveal.js#dependencies
	dependencies: [
		{ src: 'plugin/highlight/highlight.js', async: true, callback: function() { hljs.initHighlightingOnLoad(); } },
	]
});
```

Below is an example with clojure code that will be syntax highlighted. When the `data-trim` attribute is present, surrounding whitespace is automatically removed.  HTML will be escaped by default. To avoid this, for example if you are using `<mark>` to call out a line of code, add the `data-noescape` attribute to the `<code>` element.

```html
<section>
	<pre><code data-trim data-noescape>
(def lazy-fib
  (concat
   [0 1]
   <mark>((fn rfib [a b]</mark>
        (lazy-cons (+ a b) (rfib b (+ a b)))) 0 1)))
	</code></pre>
</section>
```

### Slide number

If you would like to display the page number of the current slide you can do so using the `slideNumber` and `showSlideNumber` configuration values.

```javascript
// Shows the slide number using default formatting
Reveal.configure({ slideNumber: true });

// Slide number formatting can be configured using these variables:
//  "h.v": 	horizontal . vertical slide number (default)
//  "h/v": 	horizontal / vertical slide number
//    "c": 	flattened slide number
//  "c/t": 	flattened slide number / total slides
Reveal.configure({ slideNumber: 'c/t' });

// Control which views the slide number displays on using the "showSlideNumber" value:
//     "all": show on all views (default)
// "speaker": only show slide numbers on speaker notes view
//   "print": only show slide numbers when printing to PDF
Reveal.configure({ showSlideNumber: 'speaker' });
```

### Overview mode

Press »ESC« or »O« keys to toggle the overview mode on and off. While you're in this mode, you can still navigate between slides,
as if you were at 1,000 feet above your presentation. The overview mode comes with a few API hooks:

```javascript
Reveal.addEventListener( 'overviewshown', function( event ) { /* ... */ } );
Reveal.addEventListener( 'overviewhidden', function( event ) { /* ... */ } );

// Toggle the overview mode programmatically
Reveal.toggleOverview();
```

### Fullscreen mode

Just press »F« on your keyboard to show your presentation in fullscreen mode. Press the »ESC« key to exit fullscreen mode.

### Embedded media

Add `data-autoplay` to your media element if you want it to automatically start playing when the slide is shown:

```html
<video data-autoplay src="http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4"></video>
```

If you want to enable or disable autoplay globally, for all embedded media, you can use the `autoPlayMedia` configuration option. If you set this to `true` ALL media will autoplay regardless of individual `data-autoplay` attributes. If you initialize with `autoPlayMedia: false` NO media will autoplay.

Note that embedded HTML5 `<video>`/`<audio>` and YouTube/Vimeo iframes are automatically paused when you navigate away from a slide. This can be disabled by decorating your element with a `data-ignore` attribute.

### Embedded iframes

reveal.js automatically pushes two [post messages](https://developer.mozilla.org/en-US/docs/Web/API/Window.postMessage) to embedded iframes. `slide:start` when the slide containing the iframe is made visible and `slide:stop` when it is hidden.

### Stretching elements

Sometimes it's desirable to have an element, like an image or video, stretch to consume as much space as possible within a given slide. This can be done by adding the `.stretch` class to an element as seen below:

```html
<section>
	<h2>This video will use up the remaining space on the slide</h2>
    <video class="stretch" src="http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4"></video>
</section>
```

Limitations:
- Only direct descendants of a slide section can be stretched
- Only one descendant per slide section can be stretched

### postMessage API

The framework has a built-in postMessage API that can be used when communicating with a presentation inside of another window. Here's an example showing how you'd make a reveal.js instance in the given window proceed to slide 2:

```javascript
<window>.postMessage( JSON.stringify({ method: 'slide', args: [ 2 ] }), '*' );
```

When reveal.js runs inside of an iframe it can optionally bubble all of its events to the parent. Bubbled events are stringified JSON with three fields: namespace, eventName and state. Here's how you subscribe to them from the parent window:

```javascript
window.addEventListener( 'message', function( event ) {
	var data = JSON.parse( event.data );
	if( data.namespace === 'reveal' && data.eventName ==='slidechanged' ) {
		// Slide changed, see data.state for slide number
	}
} );
```

This cross-window messaging can be toggled on or off using configuration flags.

```javascript
Reveal.initialize({
	// ...

	// Exposes the reveal.js API through window.postMessage
	postMessage: true,

	// Dispatches all reveal.js events to the parent window through postMessage
	postMessageEvents: false
});
```


## PDF Export

Presentations can be exported to PDF via a special print stylesheet. This feature requires that you use [Google Chrome](http://google.com/chrome) or [Chromium](https://www.chromium.org/Home) and to be serving the presentation from a webserver.
Here's an example of an exported presentation that's been uploaded to SlideShare: http://www.slideshare.net/hakimel/revealjs-300.

### Separate pages for fragments
[Fragments](#fragments) are printed on separate slides by default. Meaning if you have a slide with three fragment steps, it will generate three separate slides where the fragments appear incrementally.

If you prefer printing all fragments in their visible states on the same slide you can set the `pdfSeparateFragments` config option to false.

### Page size

Export dimensions are inferred from the configured [presentation size](#presentation-size). Slides that are too tall to fit within a single page will expand onto multiple pages. You can limit how many pages a slide may expand onto using the `pdfMaxPagesPerSlide` config option, for example `Reveal.configure({ pdfMaxPagesPerSlide: 1 })` ensures that no slide ever grows to more than one printed page.

### Print stylesheet

To enable the PDF print capability in your presentation, the special print stylesheet at [/css/print/pdf.css](https://github.com/hakimel/reveal.js/blob/master/css/print/pdf.css) must be loaded. The default index.html file handles this for you when `print-pdf` is included in the query string. If you're using a different HTML template, you can add this to your HEAD:

```html
<script>
	var link = document.createElement( 'link' );
	link.rel = 'stylesheet';
	link.type = 'text/css';
	link.href = window.location.search.match( /print-pdf/gi ) ? 'css/print/pdf.css' : 'css/print/paper.css';
	document.getElementsByTagName( 'head' )[0].appendChild( link );
</script>
```

### Instructions

1. Open your presentation with `print-pdf` included in the query string i.e. http://localhost:8000/?print-pdf. You can test this with [revealjs.com?print-pdf](http://revealjs.com?print-pdf).
  * If you want to include [speaker notes](#speaker-notes) in your export, you can append `showNotes=true` to the query string: http://localhost:8000/?print-pdf&showNotes=true
1. Open the in-browser print dialog (CTRL/CMD+P).
1. Change the **Destination** setting to **Save as PDF**.
1. Change the **Layout** to **Landscape**.
1. Change the **Margins** to **None**.
1. Enable the **Background graphics** option.
1. Click **Save**.

![Chrome Print Settings](https://s3.amazonaws.com/hakim-static/reveal-js/pdf-print-settings-2.png)

Alternatively you can use the [decktape](https://github.com/astefanutti/decktape) project.


## Theming

The framework comes with a few different themes included:

- black: Black background, white text, blue links (default theme)
- white: White background, black text, blue links
- league: Gray background, white text, blue links (default theme for reveal.js < 3.0.0)
- beige: Beige background, dark text, brown links
- sky: Blue background, thin dark text, blue links
- night: Black background, thick white text, orange links
- serif: Cappuccino background, gray text, brown links
- simple: White background, black text, blue links
- solarized: Cream-colored background, dark green text, blue links

Each theme is available as a separate stylesheet. To change theme you will need to replace **black** below with your desired theme name in index.html:

```html
<link rel="stylesheet" href="css/theme/black.css" id="theme">
```

If you want to add a theme of your own see the instructions here: [/css/theme/README.md](https://github.com/hakimel/reveal.js/blob/master/css/theme/README.md).


## Speaker Notes

reveal.js comes with a speaker notes plugin which can be used to present per-slide notes in a separate browser window. The notes window also gives you a preview of the next upcoming slide so it may be helpful even if you haven't written any notes. Press the »S« key on your keyboard to open the notes window.

A speaker timer starts as soon as the speaker view is opened. You can reset it to 00:00:00 at any time by simply clicking/tapping on it.

Notes are defined by appending an `<aside>` element to a slide as seen below. You can add the `data-markdown` attribute to the aside element if you prefer writing notes using Markdown.

Alternatively you can add your notes in a `data-notes` attribute on the slide. Like `<section data-notes="Something important"></section>`.

When used locally, this feature requires that reveal.js [runs from a local web server](#full-setup).

```html
<section>
	<h2>Some Slide</h2>

	<aside class="notes">
		Oh hey, these are some notes. They'll be hidden in your presentation, but you can see them if you open the speaker notes window (hit »S« on your keyboard).
	</aside>
</section>
```

If you're using the external Markdown plugin, you can add notes with the help of a special delimiter:

```html
<section data-markdown="example.md" data-separator="^\n\n\n" data-separator-vertical="^\n\n" data-separator-notes="^Note:"></section>

# Title
## Sub-title

Here is some content...

Note:
This will only display in the notes window.
```

#### Share and Print Speaker Notes

Notes are only visible to the speaker inside of the speaker view. If you wish to share your notes with others you can initialize reveal.js with the `showNotes` configuration value set to `true`. Notes will appear along the bottom of the presentations.

When `showNotes` is enabled notes are also included when you [export to PDF](https://github.com/hakimel/reveal.js#pdf-export). By default, notes are printed in a box on top of the slide. If you'd rather print them on a separate page, after the slide, set `showNotes: "separate-page"`.

#### Speaker notes clock and timers

The speaker notes window will also show:

- Time elapsed since the beginning of the presentation.  If you hover the mouse above this section, a timer reset button will appear.
- Current wall-clock time
- (Optionally) a pacing timer which indicates whether the current pace of the presentation is on track for the right timing (shown in green), and if not, whether the presenter should speed up (shown in red) or has the luxury of slowing down (blue).

The pacing timer can be enabled by configuring by the `defaultTiming` parameter in the `Reveal` configuration block, which specifies the number of seconds per slide.  120 can be a reasonable rule of thumb.  Timings can also be given per slide `<section>` by setting the `data-timing` attribute.  Both values are in numbers of seconds.


## Server Side Speaker Notes

In some cases it can be desirable to run notes on a separate device from the one you're presenting on. The Node.js-based notes plugin lets you do this using the same note definitions as its client side counterpart. Include the required scripts by adding the following dependencies:

```javascript
Reveal.initialize({
	// ...

	dependencies: [
		{ src: 'socket.io/socket.io.js', async: true },
		{ src: 'plugin/notes-server/client.js', async: true }
	]
});
```

Then:

1. Install [Node.js](http://nodejs.org/) (4.0.0 or later)
2. Run `npm install`
3. Run `node plugin/notes-server`


## Multiplexing

The multiplex plugin allows your audience to view the slides of the presentation you are controlling on their own phone, tablet or laptop. As the master presentation navigates the slides, all client presentations will update in real time. See a demo at [https://reveal-js-multiplex-ccjbegmaii.now.sh/](https://reveal-js-multiplex-ccjbegmaii.now.sh/).

The multiplex plugin needs the following 3 things to operate:

1. Master presentation that has control
2. Client presentations that follow the master
3. Socket.io server to broadcast events from the master to the clients

#### Master presentation

Served from a static file server accessible (preferably) only to the presenter. This need only be on your (the presenter's) computer. (It's safer to run the master presentation from your own computer, so if the venue's Internet goes down it doesn't stop the show.) An example would be to execute the following commands in the directory of your master presentation:

1. `npm install node-static`
2. `static`

If you want to use the speaker notes plugin with your master presentation then make sure you have the speaker notes plugin configured correctly along with the configuration shown below, then execute `node plugin/notes-server` in the directory of your master presentation. The configuration below will cause it to connect to the socket.io server as a master, as well as launch your speaker-notes/static-file server.

You can then access your master presentation at `http://localhost:1947`

Example configuration:

```javascript
Reveal.initialize({
	// other options...

	multiplex: {
		// Example values. To generate your own, see the socket.io server instructions.
		secret: '13652805320794272084', // Obtained from the socket.io server. Gives this (the master) control of the presentation
		id: '1ea875674b17ca76', // Obtained from socket.io server
		url: 'https://reveal-js-multiplex-ccjbegmaii.now.sh' // Location of socket.io server
	},

	// Don't forget to add the dependencies
	dependencies: [
		{ src: '//cdn.socket.io/socket.io-1.3.5.js', async: true },
		{ src: 'plugin/multiplex/master.js', async: true },

		// and if you want speaker notes
		{ src: 'plugin/notes-server/client.js', async: true }

		// other dependencies...
	]
});
```

#### Client presentation

Served from a publicly accessible static file server. Examples include: GitHub Pages, Amazon S3, Dreamhost, Akamai, etc. The more reliable, the better. Your audience can then access the client presentation via `http://example.com/path/to/presentation/client/index.html`, with the configuration below causing them to connect to the socket.io server as clients.

Example configuration:

```javascript
Reveal.initialize({
	// other options...

	multiplex: {
		// Example values. To generate your own, see the socket.io server instructions.
		secret: null, // null so the clients do not have control of the master presentation
		id: '1ea875674b17ca76', // id, obtained from socket.io server
		url: 'https://reveal-js-multiplex-ccjbegmaii.now.sh' // Location of socket.io server
	},

	// Don't forget to add the dependencies
	dependencies: [
		{ src: '//cdn.socket.io/socket.io-1.3.5.js', async: true },
		{ src: 'plugin/multiplex/client.js', async: true }

		// other dependencies...
	]
});
```

#### Socket.io server

Server that receives the `slideChanged` events from the master presentation and broadcasts them out to the connected client presentations. This needs to be publicly accessible. You can run your own socket.io server with the commands:

1. `npm install`
2. `node plugin/multiplex`

Or you can use the socket.io server at [https://reveal-js-multiplex-ccjbegmaii.now.sh/](https://reveal-js-multiplex-ccjbegmaii.now.sh/).

You'll need to generate a unique secret and token pair for your master and client presentations. To do so, visit `http://example.com/token`, where `http://example.com` is the location of your socket.io server. Or if you're going to use the socket.io server at [https://reveal-js-multiplex-ccjbegmaii.now.sh/](https://reveal-js-multiplex-ccjbegmaii.now.sh/), visit [https://reveal-js-multiplex-ccjbegmaii.now.sh/token](https://reveal-js-multiplex-ccjbegmaii.now.sh/token).

You are very welcome to point your presentations at the Socket.io server running at [https://reveal-js-multiplex-ccjbegmaii.now.sh/](https://reveal-js-multiplex-ccjbegmaii.now.sh/), but availability and stability are not guaranteed.

For anything mission critical I recommend you run your own server. The easiest way to do this is by installing [now](https://zeit.co/now). With that installed, deploying your own Multiplex server is as easy running the following command from the reveal.js folder: `now plugin/multiplex`.

##### socket.io server as file static server

The socket.io server can play the role of static file server for your client presentation, as in the example at [https://reveal-js-multiplex-ccjbegmaii.now.sh/](https://reveal-js-multiplex-ccjbegmaii.now.sh/). (Open [https://reveal-js-multiplex-ccjbegmaii.now.sh/](https://reveal-js-multiplex-ccjbegmaii.now.sh/) in two browsers. Navigate through the slides on one, and the other will update to match.)

Example configuration:

```javascript
Reveal.initialize({
	// other options...

	multiplex: {
		// Example values. To generate your own, see the socket.io server instructions.
		secret: null, // null so the clients do not have control of the master presentation
		id: '1ea875674b17ca76', // id, obtained from socket.io server
		url: 'example.com:80' // Location of your socket.io server
	},

	// Don't forget to add the dependencies
	dependencies: [
		{ src: '//cdn.socket.io/socket.io-1.3.5.js', async: true },
		{ src: 'plugin/multiplex/client.js', async: true }

		// other dependencies...
	]
```

It can also play the role of static file server for your master presentation and client presentations at the same time (as long as you don't want to use speaker notes). (Open [https://reveal-js-multiplex-ccjbegmaii.now.sh/](https://reveal-js-multiplex-ccjbegmaii.now.sh/) in two browsers. Navigate through the slides on one, and the other will update to match. Navigate through the slides on the second, and the first will update to match.) This is probably not desirable, because you don't want your audience to mess with your slides while you're presenting. ;)

Example configuration:

```javascript
Reveal.initialize({
	// other options...

	multiplex: {
		// Example values. To generate your own, see the socket.io server instructions.
		secret: '13652805320794272084', // Obtained from the socket.io server. Gives this (the master) control of the presentation
		id: '1ea875674b17ca76', // Obtained from socket.io server
		url: 'example.com:80' // Location of your socket.io server
	},

	// Don't forget to add the dependencies
	dependencies: [
		{ src: '//cdn.socket.io/socket.io-1.3.5.js', async: true },
		{ src: 'plugin/multiplex/master.js', async: true },
		{ src: 'plugin/multiplex/client.js', async: true }

		// other dependencies...
	]
});
```


## MathJax

If you want to display math equations in your presentation you can easily do so by including this plugin. The plugin is a very thin wrapper around the [MathJax](http://www.mathjax.org/) library. To use it you'll need to include it as a reveal.js dependency, [find our more about dependencies here](#dependencies).

The plugin defaults to using [LaTeX](http://en.wikipedia.org/wiki/LaTeX) but that can be adjusted through the `math` configuration object. Note that MathJax is loaded from a remote server. If you want to use it offline you'll need to download a copy of the library and adjust the `mathjax` configuration value.

Below is an example of how the plugin can be configured. If you don't intend to change these values you do not need to include the `math` config object at all.

```js
Reveal.initialize({
	// other options ...

	math: {
		mathjax: 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js',
		config: 'TeX-AMS_HTML-full'  // See http://docs.mathjax.org/en/latest/config-files.html
	},

	dependencies: [
		{ src: 'plugin/math/math.js', async: true }
	]
});
```

Read MathJax's documentation if you need [HTTPS delivery](http://docs.mathjax.org/en/latest/start.html#secure-access-to-the-cdn) or serving of [specific versions](http://docs.mathjax.org/en/latest/configuration.html#loading-mathjax-from-the-cdn) for stability.


## License

MIT licensed

Copyright (C) 2018 Hakim El Hattab, http://hakim.se
    
    
    
