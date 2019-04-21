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

Here's the game we're going to learn from:

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
<figcaption>Try it out - it works on mobile, too! Play it fullscreen at <a href="https://example-io-game.victorzhou.com" target="_blank">https://example-io-game.victorzhou.com</a></figcaption>

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
// Header: src/server/server.js
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

## 3. The Homepage

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
// Header: src/client/index.js
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
