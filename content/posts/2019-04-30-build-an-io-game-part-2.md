---
title: How to Build a Multiplayer (.io) Web Game, Part 2
date: "2019-04-30T12:00:00.000Z"
template: "post"
draft: false
slug: "/blog/build-an-io-game-part-2/"
img: "https://victorzhou.com/media/io-game-post/screenshot.png"
category: "Game Development"
tags:
  - "Game Development"
  - "Web Development"
  - "Javascript"
  - "Node.js"
  - "For Beginners"
description: A look into the backend server behind an .io game.
prev: "/blog/build-an-io-game-part-1/"
next: "/blog/how-i-became-a-programmer/"
discussLinkTwitter:
discussLinkHN:
discussLinkReddit:
---

This is Part 2 of my "How to Build a Multiplayer (.io) Web Game" series - **make sure you read [Part 1](/blog/build-an-io-game-part-1/) first.**

In this post, we'll take a look at the Node.js backend powering our [example .io game](https://example-io-game.victorzhou.com):

<style>
@media screen and (max-height: 750px) {
    #example-io-game, #example-io-game iframe {
        height: 600px;
    }
}
@media screen and (max-height: 640px) {
    #example-io-game, #example-io-game iframe {
        height: 500px;
    }
}
</style>
<div id="example-io-game" height="700px">
    <iframe src="https://example-io-game.victorzhou.com" width="100%" height="700px" /></iframe>
</div>
<figcaption>It works on mobile, too! Play it fullscreen at <a href="https://example-io-game.victorzhou.com" target="_blank">https://example-io-game.victorzhou.com</a></figcaption>

As a reminder, here's what we went over in [Part 1](/blog/build-an-io-game-part-1/) of the series:

1. [Project Overview / Structure](#1-project-overview--structure): A high level view of the project.
2. [Builds / Project Setup](#2-builds--project-setup): Development tooling, configuration, and setup.
3. [Client Entrypoints](#3-client-entrypoints): `index.html` and `index.js`.
4. [Client Networking](#4-client-networking): Communicating with the server.
5. [Client Rendering](#5-client-rendering): Downloading image assets + Rendering the game.
6. [Client Input](#6-client-input-%EF%B8%8F): Letting users actually play the game.
7. [Client State](#7-client-state): Processing game updates from the server.

## Table of Contents

We'll cover the following topics in this post:

1. [Server Entrypoint](#1-server-entrypoint): Setting up Express and socket.io.
2. [The Server Game](#2-the-server-game): Managing server-side game state.

## 1. Server Entrypoint

We'll be using [Express](https://expressjs.com/), a popular web framework for Node.js, to power our web server. Our server entrypoint file, `src/server/server.js`, takes care of setting that up:

```js
// Header: server.js, Part 1
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackConfig = require('../../webpack.dev.js');

// Setup an Express server
const app = express();
app.use(express.static('public'));

if (process.env.NODE_ENV === 'development') {
  // Setup Webpack for development
  const compiler = webpack(webpackConfig);
  app.use(webpackDevMiddleware(compiler));
} else {
  // Static serve the dist/ folder in production
  app.use(express.static('dist'));
}

// Listen on port
const port = process.env.PORT || 3000;
const server = app.listen(port);
console.log(`Server listening on port ${port}`);
```

Remember [discussing Webpack](/blog/build-an-io-game-part-1/#2-builds--project-setup) in Part 1 of this series? This is where we put our Webpack configurations to use. We either

- Use [webpack-dev-middleware](https://github.com/webpack/webpack-dev-middleware) to automatically rebuild our development bundles, or
- Static serve the `dist/` folder, which is where Webpack will write our files after a production build.

The other primary job `server.js` has is to setup our [socket.io](https://socket.io/) server, which actually just attaches to our Express server:

```js
// Header: server.js, Part 2
const socketio = require('socket.io');
const Constants = require('../shared/constants');

// Setup Express
// ...
const server = app.listen(port); // highlight-line
console.log(`Server listening on port ${port}`);

// Setup socket.io
const io = socketio(server); // highlight-line

// Listen for socket.io connections
io.on('connection', socket => {
  console.log('Player connected!', socket.id);

  socket.on(Constants.MSG_TYPES.JOIN_GAME, joinGame);
  socket.on(Constants.MSG_TYPES.INPUT, handleInput);
  socket.on('disconnect', onDisconnect);
});
```

Whenever a socket.io connection to the server is successfully established, we setup event handlers for the new socket. The event handlers process messages received from clients by delegating to the singleton `game` object:

```js
// Header: server.js, Part 3
const Game = require('./game');

// ...

// Setup the Game
const game = new Game();

function joinGame(username) {
  game.addPlayer(this, username);
}

function handleInput(dir) {
  game.handleInput(this, dir);
}

function onDisconnect() {
  game.removePlayer(this);
}
```

This is an .io game, so we only need one `Game` instance ("the Game") - all players play in the same arena! We'll see how this `Game` class works in the next section.

## 2. The Server Game

