---
title: Should You Static Type Check Your Javascript?
date: "2019-06-10T12:00:00.000Z"
template: "post"
draft: false
slug: "/blog/why-static-type-check-javascript/"
img: "https://victorzhou.com/media/flow-post/flow-homepage.png"
isWeb: true
category: "Javascript"
tags:
  - "Javascript"
  - "Web Development"
  - "Flow"
description: The pros and cons of using a static type checker for Javascript.
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
console.log(addOne(object.value)); // 21
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

![](./media-link/flow-post/flow-homepage.png "The Flow homepage.")

One good solution is to use a **static type checker** like [Flow](https://flow.org) or [TypeScript](https://www.typescriptlang.org/). These let you add types to your code and then remove them during build (compile) time to leave normal Javascript code. Here's a simple example of Flow trivially fixing our earlier code:

```flow
// @flow
const addOne = (x: number) => x + 1; // highlight-line
const object = { value: '2' };

console.log(addOne(object.value));
```

All we had to do was add the `flow›number` type for Flow to set us straight:

![](./media-link/flow-post/flow-example-1.png)

Similarly, Flow completely eliminates "I typoed the object field name" bugs:

```js
// @flow
const Constants = Object.freeze({
  someKey: 'value',
  someOtherKey: 'otherValue',
});

const string = `Welcome to ${Constants.someOthreKey}`;
```

![](./media-link/flow-post/flow-example-2.png)

Seems useful, doesn't it? These are only two of many cases where Flow could help prevent bugs.

To put the cherry on top, Flow is also super easy to setup in an existing codebase. I'll prove it to you: we'll integrate Flow with my open-source [example-io-game](https://github.com/vzhou842/example-.io-game) codebase (from my [building an .io web game](/blog/build-an-io-game-part-1/) series) right now!

### Setting up Flow for a Website

If you want to follow along, [download the code](https://github.com/vzhou842/example-.io-game) first. If you're curious, you can also check out a [live demo](https://example-io-game.victorzhou.com/) of the code.

What exactly this codebase does is actually pretty irrelevant: all you need to know is that it uses [Webpack](/blog/why-you-should-use-webpack/) and [Babel 7](https://babeljs.io/) for builds.

To start, we'll install some dependencies we need:

```bash
$ npm install --save-dev flow-bin @babel/preset-flow
```

Then, we need to make sure Babel strips out our Flow typings at build time. This is super easy:

```json
// Header: .babelrc
{
  "presets": ["@babel/preset-flow"]
}
```
<figcaption>We create a .babelrc since we don't already have one.</figcaption>

Let's add a `flow` script to our `package.json` for convenience:

```json
// Header: package.json
{
  // ...
  "scripts": {
    "flow": "flow",
    // ...
  }
}
```

Finally, let's initialize Flow by running

```bash
$ npm run flow init
```

This creates an empty `.flowconfig` file for us. That's it! Now we can use Flow!

```bash
$ npm run flow
No errors!
```

Running Flow doesn't actually do anything yet because we haven't activated it for any files. We can **enable Flow on a file-by-file basis** by adding a `js›// @flow` comment at the top of any file. Let's try it for the `src/client/assets.js` file:

```js
// Header: assets.js
// highlight-next-line
// @flow
const ASSET_NAMES = [
  'ship.svg',
  'bullet.svg',
];

const assets = {};

// More code
// ...
```

Running `npm run flow` again gives us one error:

![](./media-link/flow-post/flow-integration-1.png)

We have to declare the type of any function arguments. This is an easy fix:

```flow
// Header: assets.js
// @flow
const ASSET_NAMES = [
  'ship.svg',
  'bullet.svg',
];

// ...

export const getAsset = (assetName: string) => assets[assetName]; // highlight-line
```

Now we're good:

```bash
$ npm run flow
No errors!
```

We can now incrementally enable Flow for the rest of our client JS files. We've fully integrated Flow!

## The Bad

We've seen some of The Good. What about The Bad?

In my opinion, there are 2 primary kinds of drawbacks to using something like Flow: I'll refer to them broadly as **investment** and **pace**.

### The Bad #1: Investment

In short: learning and using Flow can be a big investment. This is especially true if you're working with other developers: are you going to make _everyone_ learn and use Flow? As with any new technology, there's work you have to put in **upfront** in order to reap rewards down the line.

Often times, this investment is worth it. But, depending on the project, you might be better of skipping static typing.

### The Bad #2: Pace

Using Flow will almost certainly slow down how fast you can develop (but maybe that's a good thing...). Adding types will **increase the verbosity** of your code and possibly make it a bit harder to read. Plus, sometimes you'll run into situations where you know what you're doing is fine but Flow doesn't believe you, usually because it doesn't support that specific scenario well. Jumping through a few hoops to write your code the way you want to can be a bit of a nuisance.

Again, often times this pace slowdown is **worth the benefits**. If you're working on a large project that's built to last, using Flow is almost certainly a good idea. On the other hand, if you're just throwing together a small weekend project, it's probably safe to skip static typing.

## To Recap...

Using a static type checker for Javascript can greatly **improve the safety** of your code, but it does comes with drawbacks you should be thinking about.

Some Flow resources:

- An example Flow implementation: [victorzhou.com](https://github.com/vzhou842/victorzhou.com) (yes, this blog!).
- Another example: [example-io-game](https://github.com/vzhou842/example-.io-game/tree/flow), our example from this post.
- [Try Flow in your browser](https://flow.org/try/) on the official Flow site.

Did you know that you can also use Flow **with Node.js** to type-check your backend Javascript code? If you're interested, read more about [how to use Flow with a Node.js project](/blog/using-flow-with-nodejs/).
