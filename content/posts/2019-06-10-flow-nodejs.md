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

This creates an empty `.flowconfig` file for us. That's it! Now we can use Flow!

```bash
$ npm run flow
No errors!
```

Running Flow doesn't actually do anything right now because **we haven't activated it yet** for any files. We'll get to that next.

## Backend Builds

In a Javascript project with a Node.js backend, you'd normally only have a build step for your client-side code, e.g. using [Webpack](/blog/why-you-should-use-webpack/) with [Babel](https://babeljs.io/) to transpile (possibly removing Flow typings) and bundle your JS. However, to use Flow with Node.js, **we'll need a build step for our backend, too**.
