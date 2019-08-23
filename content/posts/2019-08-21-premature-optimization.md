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
description: How I fell into the trap of premature optimization, the root of all evil.
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

At this point, I should've just quickly tested out fast.js: install it, replace native `Array` methods with fast.js methods, then benchmark and evaluate. Instead, I came up with...

## faster.js

The obsessive perfectionist in me wanted to squeeze out _every last drop_ of performance I could. fast.js just wasn't good enough for me, because it required a method invocation. <span class="emph-special">What if I could replace native Array methods <b>inline</b> with faster implementations?</span>, I thought. <span class="emph-special">That would eliminate the need for those method invocations...</span>

...and that's how I came up with the _genius_ idea to build a **compiler**, which I cheekily named [faster.js](https://github.com/vzhou842/faster.js), that would rewrite idiomatic Javascript to faster, uglier code. For example, faster.js would compile this code:

```js
// Original code
const arr = [1, 2, 3];
const results = arr.map(e => 2 * e);
```

into this code:

```js
// Compiled with faster.js
const arr = [1, 2, 3];
const results = new Array(arr.length);
const _f = (e => 2 * e);
for (let _i = 0; _i < arr.length; _i++) {
  results[_i] = _f(arr[_i], _i, arr);
}
```

The idea behind faster.js was the same: micro-optimize for performance by dropping support for sparse arrays.

At first glance, faster.js was a huge success. Here's select output from a full benchmark run of faster.js:

```
  array-filter large
    ✓ native x 232,063 ops/sec ±0.36% (58 runs sampled)
    ✓ faster.js x 1,083,695 ops/sec ±0.58% (57 runs sampled)
faster.js is 367.0% faster (3.386μs) than native

  array-map large
    ✓ native x 223,896 ops/sec ±1.10% (58 runs sampled)
    ✓ faster.js x 1,726,376 ops/sec ±1.13% (60 runs sampled)
faster.js is 671.1% faster (3.887μs) than native

  array-reduce large
    ✓ native x 268,919 ops/sec ±0.41% (57 runs sampled)
    ✓ faster.js x 1,621,540 ops/sec ±0.80% (57 runs sampled)
faster.js is 503.0% faster (3.102μs) than native

  array-reduceRight large
    ✓ native x 68,671 ops/sec ±0.92% (53 runs sampled)
    ✓ faster.js x 1,571,918 ops/sec ±1.16% (57 runs sampled)
faster.js is 2189.1% faster (13.926μs) than native
```
<figcaption>You can <a href="https://gist.github.com/vzhou842/6f22cf3c18391a7f0c0bbcfb2abdaa1a">view the full output here</a>. Benchmarked on Node v8.16.1 using a 15-inch 2018 Macbook Pro.</figcaption>

Over **2000%** faster than native?! That's a huge performance win _any_ way you look at it, right?

**Nope**.

Let's consider a simple example. Suppose that

- The average GeoArena game requires a total of 5,000 milliseconds (ms) of computation.
- faster.js increases the execution speed of `Array` methods by 10x on average.

The question we really care about, though, is this: **what portion of those 5000ms is spent in `Array` methods**?

Let's say it's half: 2500ms spent in `Array` methods, 2500ms spent elsewhere. Faster.js would then indeed be a huge performance win:

<style>
.size-next-img + * {
  max-width: 600px;
}
</style>

<div class="size-next-img"></div>

![](./media-link/premature-opt-post/example1.png)

That's a **45%** decrease in total execution time!

Unfortunately, **this is nowhere near realistic**. Yes, GeoArena does use a lot of `Array` methods, but the actual distribution of execution time looks more like this:

<div class="size-next-img"></div>

![](./media-link/premature-opt-post/example2.png)

😬😬😬.

This is the exact mistake Donald Knuth warned us about:

> The real problem is that programmers have spent far too much time **worrying about efficiency in the wrong places** and at the wrong times

It's basic math: if something only accounts for 1% of your total execution time, **optimizing it will give you an overall performance increase of _at most_ 1%**.

This is what Knuth means by "the wrong places": **focus on areas that contribute significantly to your performance metric**, be it execution time, binary size, or something else. A 10% improvement in a big area is better than a 100% improvement in a tiny area.

Knuth also mentions "the wrong times": **only optimize when you need to**. Remember how I built all of faster.js before even trying out fast.js on GeoArena? **Don't be like me**. I could've saved myself weeks of work with minutes of testing and benchmarking.

## Epilogue
