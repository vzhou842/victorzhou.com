---
title: Using Flow to Type Check a Node.js Codebase
date: "2019-06-10T12:00:00.000Z"
template: "post"
draft: false
slug: "/blog/using-flow-with-nodejs/"
img: "https://victorzhou.com/media/flow-post/flow-homepage.png"
isWeb: true
category: "Javascript"
tags:
  - "Javascript"
  - "Node.js"
  - "Flow"
description: Integrating the Flow static type checker with a Javascript backend.
prev: "/blog/build-an-io-game-part-2/"
next: "/blog/why-static-type-check-javascript/"
---

Javascript is **dynamically typed**, but tools like [Flow](https://flow.org/) allow you to add static type checking to improve the safety of your codebase.

> No clue what "typing" is, or never heard of Flow? Read my primer on [**using Flow to static type check your Javascript**](/blog/why-static-type-check-javascript/).

While Flow is most commonly used to add types to client-side Javascript, **it can also be easily used with Node.js!** In this post, we'll walk through integrating Flow with a Node.js backend and see firsthand how simple yet effective it can be.

![](./media-link/flow-post/flow-homepage.png)

## Setup

We'll use my open-source [example-io-game](https://github.com/vzhou842/example-.io-game) codebase (from my [building an .io web game](/blog/build-an-io-game-part-1/) series) for this post. It's a multiplayer web game that uses Javascript for both the client and the server - try out the [live demo](https://example-io-game.victorzhou.com/) if you're curious.

First, [download the code](https://github.com/vzhou842/example-.io-game) and open it up. Notice that we're already using [Babel 7](https://babeljs.io/) for our [Webpack](/blog/why-you-should-use-webpack/) builds.

We'll start by installing some dependencies we don't have yet:

```bash
$ npm install --save-dev @babel/cli @babel/node @babel/preset-flow
$ npm install --save-dev flow-bin
```

Next, let's add a `flow` script to our `package.json` for convenience:

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

Finally, we initialize Flow by running

```bash
$ npm run flow init
```

This creates an empty `.flowconfig` file for us. That's it - now we can use Flow!

```bash
$ npm run flow
No errors!
```

Running Flow doesn't actually do anything right now because **we haven't activated it yet** for any files - we'll get to that later.

## Backend Builds

In a Javascript project with a Node.js backend, you'd normally only have a build step for your client-side code, e.g. using [Webpack](/blog/why-you-should-use-webpack/) with [Babel](https://babeljs.io/) to transpile (possibly removing Flow typings) and bundle your JS. However, to use Flow with Node.js, **we'll need a build step for our backend, too**, since we need to compile out those Flow typings as well.

Luckily, this is pretty simple to setup since we're already using Babel. First, create a `.babelrc` (since we don't already have one):

```json
// Header: .babelrc
{
  "presets": ["@babel/preset-flow"]
}
```

This just lets Babel know we want to use the Flow preset (i.e. we want to compile out Flow typings). Next, we'll add a build script for our backend files:

```json
// Header: package.json
{
  "scripts": {
    "build:node": "babel src/ -d lib/",
    // ...
  }
}
```

Now, running `npm run build:node` will compile all of our files at `src/` to `lib/`.

We'll also add `lib/` to our `.gitignore` as well as the `[ignore]` section of our `.flowconfig`, since it's a build product:

```bash
// Header: .gitignore
# ...
lib/
```

```bash
// Header: .flowconfig
[ignore]
./lib/.* # highlight-line

[include]

[libs]

[lints]

[options]

[strict]
```

Changing the directory where our runnable backend code lives means we also have to change two run scripts: `develop` and `start`. Here's what they originally were:

```json
// Header: package.json
{
  "scripts": {
    "develop": "cross-env NODE_ENV=development node src/server/server.js",
    "start": "cross-env NODE_ENV=production node src/server/server.js",
    // ...
  }
}
```
<figcaption>package.json before Flow</figcaption>

Modifying the `start` script is easy: we just replace `src/` with `lib/`. The `develop` script is a bit trickier, since we don't want to have to manually rerun a build every time we change code during development. Luckily, Babel provides a tool we can use for this situation: [babel-node](https://babeljs.io/docs/en/babel-node), which _"works exactly the same as the Node.js CLI, with the added benefit of compiling...before running."_ Perfect!

Here are our new scripts:

```json
// Header: package.json
{
  "scripts": {
    "develop": "cross-env NODE_ENV=development babel-node src/server/server.js",
    "start": "cross-env NODE_ENV=production node lib/server/server.js",
    // ...
  }
}
```
<figcaption>package.json after Flow</figcaption>

Try running `npm run develop` to test the development setup. Then, try `npm run build:node` and `npm start` to test the production setup. Everything should work just as before!

> REMINDER: You now need to run `npm run build:node` before `npm start`! You can also just embed a `npm run build:node` inside `npm run start` if you want to make sure a build always happens before a production start.

## Enabling Flow

We're done with setup - it's time to start activating Flow! As I alluded to earlier, Flow must be **enabled on a file-by-file basis** by simply adding `js›// @flow` to the top of any file.

An easy place to start would be the shared `constants.js` file:

```js
// Header: constants.js
// highlight-next-line
// @flow
module.exports = Object.freeze({
  PLAYER_RADIUS: 20,
  // ...
});
```

Rerun `npm run flow` and Flow will check that file!

At this point, we can now incrementally enable Flow for the rest of our backend. I won't go into all of it here, but you can see the finished product of a full Flow integration on [Github](https://github.com/vzhou842/example-.io-game/tree/flow), including both frontend and backend JS.

Thanks for reading!
