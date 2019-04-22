---
title: How to Build a Multiplayer (.io) Web Game
date: "2019-04-22T12:00:00.000Z"
template: "post"
draft: false
slug: "/blog/build-an-io-game/"
img:
category: "Game Development"
tags:
  - "Game Development"
  - "Web Development"
  - "Javascript"
  - "Node.js"
  - "For Beginners"
description: A deep dive into an example open-source .io game.
prev: "/blog/intro-to-neural-networks/"
next: "/blog/gini-impurity/"
discussLinkTwitter:
discussLinkHN:
discussLinkReddit:
---

When [Agar.io](https://agar.io) came out in 2015, it inspired a new [**.io game**](https://www.google.com/search?q=.io+game) genre that has since exploded in popularity. I experienced the rise of .io games firsthand: I've [built and sold 2 .io games](/about/) in the past 3 years.

A quick description in case you've never heard of .io games before: they're free, multiplayer web games that are easy to join (no account required) and usually pit many players against each other in one arena. Other famous .io games include [Slither.io](https://slither.io) and [Diep.io](https://diep.io).

In this post, we're going to **understand how to build an .io game by breaking down an example one**. All you need is a working knowledge of Javascript: you should have seen things like [ES6](https://www.w3schools.com/js/js_es6.asp) syntax, the `this` keyword, and [Promises](https://developers.google.com/web/fundamentals/primers/promises) before.

## An Example .io Game

Below is the game we're going to learn from. Go ahead, try it out! You can play it right here on this page:

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

## Table of Contents

Here's what we'll cover in this post:

1. [Project Overview / Structure](#1-project-overview--structure): A high level view of the project.
2. [Builds](#2-builds): Development Tooling and configuration.
3. [Client Entrypoints](#3-client-entrypoints): `index.html` and `index.js`.
4. [Client Networking](#4-client-networking): Communicating with the server.
5. [Client Rendering](#5-client-rendering): Downloading image assets + Rendering the game.
6. [Client Input](#6-client-input): Letting users actually play the game.

## 1. Project Overview / Structure

> I recommend [**downloading the source code**](https://github.com/vzhou842/example-.io-game) for the example game so you can follow along.

Our example game uses:

- [Express](https://expressjs.com/), the most popular web framework for Node.js, to power its web server.
- [socket.io](https://socket.io/), a websocket library, to communicate between the browser and the server.
- [Webpack](https://webpack.js.org/), a module bundler. Learn more about <a href="/blog/why-you-should-use-webpack/" target="_blank">why you should use Webpack</a>.

Here's what the project directory structure look like:

```
public/
    assets/
        ...
    index.html
src/
    client/
        css/
            ...
        index.js
        ...
    server/
        server.js
        ...
    shared/
        constants.js
```

### `public/`

Anything in the `public/` folder will be statically served by our server. `index.html` is our HTML homepage, and `public/assets/` contains images used by our project.

### `src/`

All the source code is in the `src/` folder. `client/` and `server/` are pretty self explanatory, and `shared/` contains a constants file that's imported by **both the client and the server**.

## 2. Builds

As mentioned before, we're using the [Webpack](https://webpack.js.org/) module bundler to build our project. Let's take a look at our Webpack configs:

```js
// header: webpack.common.js
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {
    game: './src/client/index.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].bundle.css',
    }),
  ],
};
```

To summarize:

- `src/client/index.js` is the Javascript (JS) client entrypoint. Webpack will start there and recursively look for other files that are imported.
- The JS output of our Webpack build will be a file called `game.bundle.js` in the `dist/` directory.
- We're using [Babel](https://babeljs.io/), specifically the [@babel/preset-env](https://babeljs.io/docs/en/babel-preset-env) config, to transpile our JS code for older browsers.
- We're using a plugin to extract all CSS referenced by our JS files and bundle it together into a file called `game.bundle.css`.

The `webpack.common.js` file is a base config file that we import in our development and production configuations:

```js
// Header: webpack.dev.js
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
});
```

```js
// Header: webpack.prod.js
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
  },
});
```

We use `webpack.dev.js` for efficiency while developing, and we switch to `webpack.prod.js` to optimize bundle sizes when deploying to production.

Here's an excerpt from `src/server/server.js` showing how we use `webpack.dev.js`:

```js
// Header: server.js
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackConfig = require('../../webpack.dev.js');

// Setup an Express server
const app = express();

if (process.env.NODE_ENV === 'development') {
  // Setup Webpack for development
  const compiler = webpack(webpackConfig);
  app.use(webpackDevMiddleware(compiler));
}

app.listen(3000);
```

`webpack-dev-middleware` is an [Express](https://expressjs.com/) middleware that watches the filesystem and automatically rebuilds our JS/CSS bundles when needed.

To develop, just run

```bash
$ npm run develop
```

and visit [localhost:3000](http://localhost:3000) in your web browser!

## 3. Client Entrypoints

Let's get to the actual game code. Here's an very abridged version of our `index.html`:

```html
// Header: index.html
<!DOCTYPE html>
<html>
<head>
  <title>An example .io game</title>
  <link type="text/css" rel="stylesheet" href="/game.bundle.css"></script>
</head>
<body>
  <canvas id="game-canvas"></canvas>
  <script async src="/game.bundle.js"></script>
  <div id="play-menu" class="hidden">
    <input type="text" id="username-input" placeholder="Username" />
    <button id="play-button">PLAY</button>
  </div>
</body>
</html>
```

We have:

- An [HTML5 Canvas](https://www.w3schools.com/html/html5_canvas.asp) (`html›<canvas>`) element that we'll use to render the game.
- A `html›<link>` include for our CSS bundle.
- A `html›<script>` include for our Javascript bundle.
- The main menu, with a username `html›<input>` and a "PLAY" `html›<button>`.

Once the homepage is loaded in your browser, the first thing that runs is `src/client/index.js`, our client-side entrypoint. Here's a slightly shortened version of it:

```js
// Header: index.js
import { connect, play } from './networking';
import { startRendering, stopRendering } from './render';
import { startCapturingInput, stopCapturingInput } from './input';
import { downloadAssets } from './assets';
import { initState } from './state';
import { setLeaderboardHidden } from './leaderboard';

import './css/main.css';

const playMenu = document.getElementById('play-menu');
const playButton = document.getElementById('play-button');
const usernameInput = document.getElementById('username-input');

Promise.all([
  connect(),
  downloadAssets(),
]).then(() => {
  playMenu.classList.remove('hidden');
  usernameInput.focus();
  playButton.onclick = () => {
    // Play!
    play(usernameInput.value);
    playMenu.classList.add('hidden');
    initState();
    startCapturingInput();
    startRendering();
    setLeaderboardHidden(false);
  };
});
```

This might seem complicated, but there's actually not that much going on here:

1. Import a bunch of other JS files.
2. Import some CSS (so Webpack knows to include it in our CSS bundle).
3. Run `js›connect()` to establish a connection to the server, and run `js›downloadAssets()` to download the images we need to render the game.
4. _Once step 3 has finished_, display the main menu (`js›playMenu`).
5. Setup a click handler for the "PLAY" button. If clicked, initialize the game and tell the server we're ready to play.

The meat of our client-side logic resides in those other files that are imported by `index.js`. We'll go through each of those next.

## 4. Client Networking

A major component of the client-side code is networking. We have one file, `src/client/networking.js`, that takes care of **all** communication with the server:

```js
// Header: networking.js
import io from 'socket.io-client';
import { processGameUpdate } from './state';

const Constants = require('../shared/constants');

const socket = io(`ws://${window.location.host}`);
const connectedPromise = new Promise(resolve => {
  socket.on('connect', () => {
    console.log('Connected to server!');
    resolve();
  });
});

export const connect = onGameOver => (
  connectedPromise.then(() => {
    // Register callbacks
    socket.on(Constants.MSG_TYPES.GAME_UPDATE, processGameUpdate);
    socket.on(Constants.MSG_TYPES.GAME_OVER, onGameOver);
  })
);

export const play = username => {
  socket.emit(Constants.MSG_TYPES.JOIN_GAME, username);
};

export const updateDirection = dir => {
  socket.emit(Constants.MSG_TYPES.INPUT, dir);
};
```
<figcaption>This code was slightly abridged for clarity, as I've been doing with other files.</figcaption>

We're using the well-known [socket.io](https://socket.io/) library to communicate with the server. Socket.io includes built-in support for [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API), which are great for two-way communication: we can send messages to the server _and_ the server can send messages to us over the same connection.

3 major things happen in this file:

- We try to connect to the server. `js›connectedPromise` only resolves once we've established a connection.
- If the connection succeeds, we register callbacks (`js›processGameUpdate()` and `js›onGameOver()`) for messages we might receive from the server.
- We export `js›play()` and `js›updateDirection()` for other files to use.

## 5. Client Rendering

Before we can render the game, we need to download all the images we need to do so. `src/client/assets.js` manages these assets (images):

```js
// Header: assets.js
const ASSET_NAMES = ['ship.svg', 'bullet.svg'];

const assets = {};
const downloadPromise = Promise.all(ASSET_NAMES.map(downloadAsset));

function downloadAsset(assetName) {
  return new Promise(resolve => {
    const asset = new Image();
    asset.onload = () => {
      console.log(`Downloaded ${assetName}`);
      assets[assetName] = asset;
      resolve();
    };
    asset.src = `/assets/${assetName}`;
  });
}

export const downloadAssets = () => downloadPromise;
export const getAsset = assetName => assets[assetName];
```

Managing assets isn't so hard to implement! The main idea is keeping an `js›assets` object that maps a filename key to an `js›Image` object value. We resolve `downloadPromise` once each individual asset download Promise has resolved (meaning **all** assets have been downloaded).

With downloading assets out of the way, we can move on to rendering. As mentioned earlier, we're using an [HTML5 Canvas](https://www.w3schools.com/html/html5_canvas.asp) (`html›<canvas>`) to draw to our webpage. One file controls all rendering logic: `src/client/render.js`. Here are the important parts:

```js
// Header: render.js
import { getAsset } from './assets';
import { getCurrentState } from './state';

const Constants = require('../shared/constants');
const { PLAYER_RADIUS, PLAYER_MAX_HP, BULLET_RADIUS, MAP_SIZE } = Constants;

// Get the canvas graphics context
const canvas = document.getElementById('game-canvas');
const context = canvas.getContext('2d');

// Make the canvas fullscreen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function render() {
  const { me, others, bullets } = getCurrentState();
  if (!me) {
    return;
  }

  // Draw background
  renderBackground(me.x, me.y);

  // Draw all bullets
  bullets.forEach(renderBullet.bind(null, me));

  // Draw all players
  renderPlayer(me, me);
  others.forEach(renderPlayer.bind(null, me));
}

// ... Helper functions here excluded

let renderInterval = null;
export function startRendering() {
  renderInterval = setInterval(render, 1000 / 60);
}
export function stopRendering() {
  clearInterval(renderInterval);
}
```
<figcaption>This code was also slightly edited for clarity.</figcaption>

`js›render()` is the primary function of this file - when invoked, it draws the current game state to our canvas. `js›startRendering()` and `js›stopRendering()` control activation of the 60 FPS render loop.

The specific implementations of the individual render helper functions (e.g. `js›renderBullet()`) are not as relevant / up to you, but here's one simple example:

```js
// Header: render.js
function renderBullet(me, bullet) {
  const { x, y } = bullet;
  context.drawImage(
    getAsset('bullet.svg'),
    canvas.width / 2 + x - me.x - BULLET_RADIUS,
    canvas.height / 2 + y - me.y - BULLET_RADIUS,
    BULLET_RADIUS * 2,
    BULLET_RADIUS * 2,
  );
}
```

Notice how we're using the `js›getAsset()` method we saw earlier from `asset.js`!

## 6. Client Input

It's time to actually _play_ the game! Our control scheme is very simple: use the mouse (on desktop) or touch the screen (on mobile) to control the direction of movement. `src/client/input.js` takes care of it all:

```js
// Header: input.js
import { updateDirection } from './networking';

function onMouseInput(e) {
  handleInput(e.clientX, e.clientY);
}

function onTouchInput(e) {
  const touch = e.touches[0];
  handleInput(touch.clientX, touch.clientY);
}

function handleInput(x, y) {
  const dir = Math.atan2(x - window.innerWidth / 2, window.innerHeight / 2 - y);
  updateDirection(dir);
}

export function startCapturingInput() {
  window.addEventListener('mousemove', onMouseInput);
  window.addEventListener('touchmove', onTouchInput);
}

export function stopCapturingInput() {
  window.removeEventListener('mousemove', onMouseInput);
  window.removeEventListener('touchmove', onTouchInput);
}
```

`js›onMouseInput()` and `js›onTouchInput()` are [Event Listeners](https://developer.mozilla.org/en-US/docs/Web/API/EventListener) that call `js›updateDirection()` from `networking.js` when an input event happens (e.g. the mouse moves). `js›updateDirection()` takes care of messaging the server, which handles the input event.

