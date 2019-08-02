---
title: Why Webpack? (or, How Not to Serve Javascript)
date: "2019-02-15T12:00:00.000Z"
template: "post"
draft: false
slug: "/blog/why-you-should-use-webpack/"
img: "https://victorzhou.com/media/webpack.png"
category: "Web Development"
tags:
  - "Web Development"
  - "Javascript"
  - "Best Practices"
description: "I learned this the hard way, but hopefully you don't have to."
prev: "/blog/minify-svgs/"
next: "/blog/properly-size-images/"
---

Back in early 2016, I began building a web game called [GeoArena](https://geoarena.online). Looking back, **my biggest regret is not using Webpack from the beginning**.

When I started GeoArena, I was _very_ new to web development. Having never heard of module bundlers before, I instead homebrewed my own approaches for serving Javascript on the web. This post explores the problems with those methods and explains **why you should be using** [**Webpack**](https://webpack.js.org/) **instead**.

> Note: I’m trying to encourage the use of module bundlers, **but not necessarily specifically Webpack** — there are other good bundlers out there like [Browserify](http://browserify.org/), [Rollup](https://rollupjs.org/guide/en), and [Parcel](https://parceljs.org/).

## Stage 1: One file = One script

In the very beginning, I separated my client Javascript into a few files and included all of them in my HTML with `html›<script>` tags. Here’s how the scripts section in my `index.html` looked on Day 1 of building GeoArena:

```html
<script src="https://cdn.socket.io/socket.io-1.4.5.js"></script>
<script src="https://code.jquery.com/jquery-latest.min.js"></script>
<script src="/js/geoarena-networking.js"></script>
<script src="/js/geoarena-game.js"></script>
```

<span class="emph-special">This works great!</span>, I thought. <span class="emph-special">I’ll just put my networking code in `geoarena-networking.js` and everything else in `geoarena-game.js`</span>.

As it turns out, splitting the code for an entire web game into only two files doesn’t actually work 🤷. Here’s that same scripts section one week later:

```html
<script src="https://code.jquery.com/jquery-latest.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.4.6/socket.io.min.js"></script>
<script src="/geoarena-constants.js"></script>
<script src="/js/geoarena-menu.js"></script>
<script src="/js/geoarena-networking.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/es5-shim/4.0.5/es5-shim.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/es6-shim/0.23.0/es6-shim.min.js"></script>
<script src="/js/timesync.min.js"></script>
<script src="/js/geoarena-resources.js"></script>
<script src="/js/Sprite.js"></script>
<script src="/js/Particles.js"></script>
<script src="/InputEvent.js"></script>
<script src="/GameUpdateEvent.js"></script>
<script src="/ObstacleBall.js"></script>
<script src="/Effect.js"></script>
<script src="/Bullet.js"></script>
<script src="/Weapon.js"></script>
<script src="/Ship.js"></script>
<script src="/Neutral.js"></script>
<script src="/js/Minimap.js"></script>
<script src="/js/geoarena-utils.js"></script>
<script src="/js/geoarena-game.js"></script>
```

Count them. That’s **22** script includes. 😬😬

There are several big problems with this approach:

1.  **Speed.** Requesting this many scripts was a network bottleneck, and as a result my site was somewhat slow to load _(keep in mind this was in 2016, before the [HTTP/2](https://en.wikipedia.org/wiki/HTTP/2) era)_. [Web performance matters](https://developers.google.com/web/fundamentals/performance/why-performance-matters/) — its importance has long been well-known and documented. What seems more efficient to you: asking for 10 lines of code 100 times, or asking for 1000 lines of code once?
2.  **Scoping.** Each file ran in the same [global scope](https://developer.mozilla.org/en-US/docs/Glossary/global_scope), so any variable I declared was available on the [global window object](https://developer.mozilla.org/en-US/docs/Glossary/Global_object). That meant _anything I declared had to have a unique name_— otherwise, there’d be a collision! Can you see how that’s problematic? More code = More variables = More <span class="emph-special">Wait, have I already used this name before?</span>
3.  **Dependencies**. I had to manually maintain an ordering of `html›<script>` includes that satisfied my dependencies. For example, `geoarena-networking.js` depended on `socket.io`, so I had to ensure the `socket.io` include appeared above the `geoarena-networking.js` include. Dependencies weren’t explicitly declared anywhere, yet my `html›<script>` ordering had to satisfy all of them.

## Stage 2: One biiiig script

The Speed problem had the easiest fix: just put everything into one huge file and download that instead! I used [Gulp](https://gulpjs.com/), a popular build tool, to concatenate all of my files into one giant bundle:

```javascript
gulp.task('build-js', function() {
  return gulp.src([
      './client/js/jquery.min.js',
      './client/js/socket.io.min.js',
      './shared/geoarena-constants.js',
      './client/js/geoarena-menu.js',
      './client/js/geoarena-networking.js',
      // ... more files here
    ])
    .pipe(uglify()) // minify code
    .pipe(concat('geoarena-bundle.min.js'))
    .pipe(gulp.dest('dist'));
});
```

All I had to do was run

```bash
$ gulp build-js
```

and Gulp would concatenate all my files, minify them (bonus speed boost!), and place the result at `dist/geoarena-bundle.min.js`.

This cut down my scripts section to just one include!

```html
<script src="/geoarena-bundle.min.js"></script>
```

**Speed problem: fixed** <span class="checkmark">✓</span>.

## Stage 3: Immediately Invoked Function Expressions ([IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE)s)

I turned to IIFEs to limit the scope of my variables. Every function in Javascript has its own scope, and any variable declared inside a function can only be accessed from that function:

```javascript
let a = 'global scope';

// Here's an IIFE:
(function() {
  let a = 'function scope';
  let b = 'also function scope';
  console.log(a); // "function scope"
  console.log(b); // "also function scope"
})(); // <- immediately invoked

console.log(a); // "global scope"
console.log(b); // ReferenceError: b is not defined
```

I wrapped my entire bundle in an IIFE to avoid the global scope and then wrapped every file individually with an IIFE. Any variables I needed to access in more than one file were declared globally at the top of my bundle. Here’s roughly what that looked like:

```javascript
(function() {
  // Global function fallback
  function gff() {
    console.error('Global function fallback called');
    alert('An unexpected error occurred.');
  }

  // Global variables
  let Constants;
  // ... more variables

  // Global functions
  let playSingleplayer = gff;
  // ... more functions

  // geoarena-constants.js
  (function() {
    Constants = {
      version: "1.0.0",
      // ... more constants
    };
  })();

  // geoarena-menu.js
  (function() {
    playSingleplayer = function() {
      // code
    };
  })();

  // another file
  (function() {
    // Now I can call playSingleplayer()!
    playSingleplayer();
  })();

  // ... more files
})();
```

**Scoping problem: fixed** <span class="checkmark">✓</span>.

However, this didn’t fix the Dependencies problem: I still had to manually order files to satisfy all dependencies. To make matters worse, I now also had to care about stuff like not using `playSingleplayer` before assigning it.

> One of the most interesting bugs I’ve fixed in my time was caused by these IIFEs - [**want to see if you can spot it**](/blog/a-javascript-bug-i-had-once/)?

## Stage 4: Webpack

2 years after starting work on GeoArena, I finally decided to rewrite my entire codebase to use Webpack. <span class="emph-special">This will take forever</span>, I grumbled. <span class="emph-special">If only I'd read a blog post explaining why I should use Webpack...</span>

Here’s an example of what Webpack lets you do:

```javascript
// geoarena-constants.js
const Constants = { version: "1.0.0" };
module.exports = Constants;
```

```javascript
// geoarena-menu.js
const Constants = require('./Constants');
console.log('GeoArena Version ' + Constants.version);
```

Each file is a **module** that declares its dependencies through `javascript›require()`s and can export variables for use in other modules. All you have to do is run

```bash
$ webpack
```

and Webpack will generate a bundle that satisfies the dependencies of each module. In other words, **Webpack fixes the Dependencies problem**. There’s no more need to manually maintain ordering, and dependencies are explicitly declared.

> Webpack and most of its alternatives actually do a lot more than just simple module bundling, but that’s outside the scope of this post. Check out the [Webpack docs](https://webpack.js.org/concepts/) to learn more.

## Recap

1. In the beginning, I just included `html›<script>` tags for every Javascript file I had. This led to the **Speed Problem**: loading that many files is too slow.

2. To fix that, I used a build tool to concatenate Javascript files into one big bundle so I’d only need one `html›<script>` tag. Then there was the **Scoping Problem**: all of that code was run in the global scope, leading to name collisions.

3. I fixed that by wrapping each file in an IIFE to keep its scope local. However, I still had the **Dependencies Problem**: dependencies weren’t explicitly declared, yet the ordering of files had to satisfy dependency requirements.

**Using a module bundler solves all of these problems!**
