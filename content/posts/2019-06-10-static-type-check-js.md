---
title: Should You Static Type Check Your Javascript?
date: "2019-06-10T12:00:00.000Z"
template: "post"
draft: false
slug: "/blog/why-static-type-check-javascript/"
img:
category: "Javascript"
tags:
  - "Javascript"
  - "Web Development"
  - "Flow"
description: The pros and cons (but mostly pros) of using a static type checker for Javascript.
prev: "/blog/using-flow-with-nodejs/"
next: "/blog/why-you-should-use-webpack/"
---

Javascript is **dynamically typed**: it performs type checking at **runtime**. On the other hand, a **statically typed** language like C performs type checking at **compile time**. Allow me to illustrate the difference. Here's some simple C code:

```c
#include <stdio.h>

// Adds one to an integer.
int addOne(int x) {
  return x + 1;
}

int main() {
  const char *value = "2";
  printf("%d", addOne(value)); // ?
}

```

That code doesn't compile cleanly:

```
warning: incompatible pointer to integer conversion passing 'const char *' to parameter of type 'int'
```

The C compiler type checks our code and sees that we're trying to do something weird: pass a `c›const char *` (basically, a string) to a function that expects an `c›int`. We'd catch this problem immediately and fix it.

Now, here's some similar Javascript code:

```js
// Add one to (hopefully) a number.
const addOne = x => x + 1;

// Let me declare this object! REMINDER: value is a string.
const object = { value: '2' };

// A bunch more code here...
// ...
// So much code that I forgot exactly what was in object...
// ...

// object.value is a number...right?
console.log(addOne(object.value)) // 21
```

This code works perfectly fine (even though it doesn't do what we intended) because `js›'2' + 1` is `js›'21'` in Javascript. Sometimes we'd catch this bug immediately, but other times **bugs like this could go unnoticed** for a long time.

Here's another type of bug that happens a lot:

```js
const Constants = Object.freeze({
  someKey: 'value',
  someOtherKey: 'otherValue',
});

// ...

const string = `Welcome to ${Constants.someOthreKey}`;
console.log(string); // or use the string in some other way
```

See the problem? This prints out `Welcome to undefined` because we typoed `someOtherKey`. Sometimes it's convenient that Javascript lets you access arbitrary fields on objects, but often it will cause bugs. This dynamic, flexible typing can be dangerous because _Javascript basically lets you do anything_. No, seriously:

```js
console.log(undefined + 1);   // NaN
console.log(NaN + 1);         // NaN
console.log(undefined + '1'); // undefined1
console.log(null + 1);        // 1
console.log([] + 1);          // 1
console.log({} + []);         // 0
console.log({} + {});         // [object Object][object Object]
```
<figcaption>Good old Javascript.</figcaption>

You get the point.

**How can we prevent these and other kinds of type-related bugs?** How can we stop Javascript from letting us do so much nonsense?

## Static Type Checking for Javascript

One good solution is to use a **static type checker** like [Flow](https://flow.org) or [TypeScript](https://www.typescriptlang.org/).
