---
title: "Why You Should Avoid Premature Optimization"
date: "2019-08-21T12:00:00.000Z"
template: "post"
draft: false
slug: "/blog/avoid-premature-optimization/"
img:
category: "Best Practices"
tags:
  - "Best Practices"
  - "Performance"
description: My personal story with premature optimization, the root of all evil.
prev: "/blog/properly-size-images/"
next: "/blog/minify-svgs/"
---

[Donald Knuth](https://en.wikipedia.org/wiki/Donald_Knuth) once famously said:

> The real problem is that programmers have spent far too much time worrying about efficiency in the wrong places and at the wrong times; **premature optimization is the root of all evil** (or at least most of it) in programming.

Here's my story of learning to avoid premature optimization the hard way...

## GeoArena Online

A few years ago, I was working on a web game called GeoArena Online (I've since [sold it](/blog/creating-and-selling-io-games/), and the new owners rebranded to <a rel="nofollow" href="https://geoarena.io">geoarena.io</a>). It was a multiplayer game where players controlled ships in last-man-standing style 1v1 battles:

<style>
.shadow-next-img + * {
    box-shadow: 0 0 15px gray;
}
</style>

<div class="shadow-next-img"></div>

![](./media-link/premature-opt-post/geoarena1.png)

<div class="shadow-next-img"></div>

![](./media-link/premature-opt-post/geoarena2.png)

Running a fast-paced game with lots of particles and effects is rather computationally expensive - some older computers would experience frame rate drops when gameplay got particularly intense. As [a bit of a performance geek](/tag/performance/), I welcomed this challenge: **how could I make GeoArena's client-side Javascript faster?**

## fast.js

After some Googling, I found a library called [fast.js](https://github.com/codemix/fast.js) that was "a collection of micro-optimisations aimed at making writing very fast JavaScript programs easier." It did this by offering **faster implementations for built-in native methods** like [Array.prototype.forEach()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach).

Woah. Sounds cool, right? GeoArena used a lot of arrays and performed a lot of array operations, so maybe this could help speed up the game. The [fast.js README](https://github.com/codemix/fast.js) includes the following example benchmark result for `forEach()`:

```
Native .forEach() vs fast.forEach() (10 items)
  ✓  Array::forEach() x 8,557,082 ops/sec ±0.37% (97 runs sampled)
  ✓  fast.forEach() x 8,799,272 ops/sec ±0.41% (97 runs sampled)

  Result: fast.js is 2.83% faster than Array::forEach().
```

How could a user-land implementation be faster than the native one?!

It's because there was a catch (<span class="emph-special">there's always a catch...</span>): it only worked on arrays that weren't **sparse**:

```js
// This array is sparse: there's nothing at index 1.
const sparse1 = [0, , 1];
console.log(sparse1.length); // 3

// This is an empty array...
const sparse2 = [];

// ...and now it's sparse: there's nothing at indices 0 - 4.
sparse2[5] = 0;
console.log(sparse2.length); // 6
```
<figcaption>Two simple examples of sparse arrays.</figcaption>

To understand why fast.js didn't work on sparse arrays, I took a look at its source code. Turns out, the fast.js implementations were basically just `for` loops. For example, `js›fast.forEach()` looked something like this:


```js
// This is slightly simplified for clarity.
function fastForEach(array, f) {
  for (let i = 0; i < array.length; i++) {
    f(array[i], i, array);
  }
}

const sparseArray = [1, , 2];
const print = x => console.log(x);

fastForEach(sparseArray, print); // Executes print() 3 times.
sparseArray.forEach(print); // Executes print() only 2 times.
```

The `js›fastForEach()` call prints 3 lines:

```
1
undefined
2
```

The `js›sparseArray.forEach()` call only prints 2:

```
1
2
```

This discrepancy is because the JS spec calls for the callback function ```f``` to [not be invoked for deleted or uninitialized indices](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach#Description), aka **holes**. The `js›fastForEach()` implementation skips checking for holes, which leads to **speedups at the expense of correctness** for sparse arrays. This was perfect for my use case, since GeoArena didn't use any sparse arrays.

At this point, it's obvious that I should've just quickly tested out fast.js, right? Install it, replace native `Array` methods with fast.js methods, then benchmark and evaluate?

Of course, that's not what I did...

## faster.js

Instead, the obsessive perfectionist in me wanted to squeeze out every last drop of performance I could. For some reason, fast.js didn't satisfy me because it _required a method invocation_.
