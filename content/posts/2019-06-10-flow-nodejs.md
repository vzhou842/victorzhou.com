---
title: Using Flow to Type Check a Node.js Project
date: "2019-06-10T12:00:00.000Z"
template: "post"
draft: false
slug: "/blog/using-flow-with-nodejs/"
img:
category: "Javascript"
tags:
  - "Javascript"
  - "Node.js"
  - "Web Development"
  - "Flow"
description: Integrating the Flow static type checker with a full-stack Javascript project.
prev: "/blog/build-an-io-game-part-1/"
next: "/blog/why-static-type-check-javascript/"
---

Javascript is untyped, meaning it doesn't have a built-in [type system](https://en.wikipedia.org/wiki/Type_system). This **lack of type safety makes it really easy to introduce bugs** in Javascript code. Here's a classic example:

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

This kind of bug happens all the time and often goes unnoticed because Javascript basically lets you do _anything_. No, seriously:

```js
console.log(undefined + 1);   // NaN
console.log(NaN + 1);         // NaN
console.log(undefined + '1'); // undefined1
console.log(null + 1);        // 1
console.log([] + 1);          // 1
console.log({} + []);         // 0
console.log({} + {});         // [object Object][object Object]
```

You get the point. How can we prevent these kinds of type-related bugs? **How can we stop Javascript from doing all of this weird nonsense?**

## Static Type Checking

The answer is to use a **static type checker** like [Flow](https://flow.org). Flow was built and [open-sourced](https://github.com/facebook/flow) by Facebook and is one of two popular Javascript type checkers, along with [TypeScript](https://www.typescriptlang.org/).

```bash
$ npm install --save-dev @babel/core @babel/cli @babel/node @babel/preset-env @babel/preset-flow
$ npm install --save-dev flow-bin
```
