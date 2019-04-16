---
title: How to Build a Multiplayer (.io) Web Game
date: "2019-04-17T12:00:00.000Z"
template: "post"
draft: false
slug: "/blog/how-to-build-a-web-game/"
img: 
category: "Game Development"
tags:
  - "Game Development"
  - "Web Development"
  - "Javascript"
  - "For Beginners"
description: A step-by-step guide to making a multiplayer web game.
prev: "/blog/why-you-should-use-webpack/"
next: "/blog/intro-to-neural-networks/"
---

intro about .io games

To build our web game, we'll use:

- [Express](https://expressjs.com/), the most popular web framework for Node.js, to power our web server.
- [socket.io](https://socket.io/), a websocket library, to communicate between browsers and our server.
- [Webpack](https://webpack.js.org/), a module bundler. Learn more about <a href="/blog/why-you-should-use-webpack/" target="_blank">why you should use Webpack</a>.

> This guide assumes that you have [Node.js](https://nodejs.org) and [NPM](https://www.npmjs.com/get-npm) installed and that you have a basic understanding of Javascript.

## 1. Project Setup

I'm not going to walk through every step of basic project setup - instead, just [download the starter project](https://github.com/vzhou842/multiplayer-web-game-example/releases/tag/starter-project) if you want to follow along.

Here's how the starter project directory looks:

```
public/
    index.html
src/
    client/
        css/
            main.css
        index.js
        networking.js
    server/
        server.js
    shared/
        constants.js
```

### Public

Anything in the `public/` directory will be statically served by our server. For now, we're just serving the `index.html` file:

```html
<!-- public/index.html -->
<!DOCTYPE html>
<html>
<head>
  <title>A .io game</title>
</head>
<body>
  <h1>A Multiplayer Web Game Example</h1>
  <p>If you see this, your starter project works!</p>
  <script async src="/game.bundle.js"></script>
</body>
</html>
```

### Client

`src/client/index.js` is the client-side entrypoint. All it does right now is import `networking.js` and `main.css`:

```js
// --- src/index.js
import './networking'
import './css/main.css'
```

`networking.js` imports `socket.io` and establishes a connection to the server:

```js
// --- src/networking.js
import io from 'socket.io-client';

const socket = io(`ws://${window.location.host}`);

socket.on('connect', () => {
  console.log('Connected to server!');
});
```

### Server

`src/server/server.js` is the server-side entrypoint. It sets up Express, socket.io, and Webpack:

```js
// --- server.js
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

// Setup an Express server
const app = express();
app.use(express.static('public'));

// Setup Webpack for development
const config = require('./webpack.dev.config.js');
const compiler = webpack(config);
app.use(webpackDevMiddleware(compiler));

// Listen on port
const port = process.env.PORT || 3000;
const server = app.listen(port);
console.log(`Server listening on port ${port}`);

// Setup socket.io
const io = require('socket.io')(server);

// Listen for socket.io connections
io.on('connection', socket => {
  console.log('Player connected!', socket.id);
});
```

We can run

```bash
$ npm run start
```

to start the server. Visit [localhost:3000](http://localhost:3000) in your web browser and you should see the starter project page!

### Shared

Files in the `src/shared/` directory are **used by both client and server code**. For example, `src/shared/constants.js` will include game constants that will need to be the same between the client and server. Note that shared files will use [CommonJS](https://en.wikipedia.org/wiki/CommonJS) `js›module.exports` instead of [ES6](https://www.w3schools.com/js/js_es6.asp) `js›import` because Node.js doesn't support ES6 modules yet.

That's why `src/shared/constants.js` looks like this:

```js
// --- src/shared/constants.js
// CommonJS
module.exports = Object.freeze({});
```

and not like this:

```js
// --- src/shared/constants.js
// ES6
export default Object.freeze({});
```

## 2. Client Rendering

Let's get stuff to show up on the client. We'll use an [HTML5 Canvas](https://www.w3schools.com/html/html5_canvas.asp) to draw images. Replace the text in the `html›<body>` of `index.html` with a `html›<canvas>` element:

```html
<!-- public/index.html -->
<body>
  <canvas id="game-canvas"></canvas> // highlight-line
  <script async src="/game.bundle.js"></script>
</body>
```

Add some styling to `main.css` to ensure our `html›<canvas>` takes up the whole screen:

```css
/* --- src/client/css/main.css */
/* highlight-start */
html, body {
  margin: 0;
  padding: 0;
}
/* highlight-end */
```

Next, add a field to our shared `constants.js` file:

```js
// --- src/shared/constants.js
module.exports = Object.freeze({
  PLAYER_RADIUS: 20, // highlight-line
});
```

Now, create a new file at `src/client/render.js` to handle rendering to our `html›<canvas>`. This file will use the `PLAYER_RADIUS` field we just added to our shared constants file:

```js
// --- src/client/render.js
const Constants = require('../shared/constants');

// Setup the canvas and get the graphics context
const canvas = document.getElementById('game-canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const context = canvas.getContext('2d');

function render() {
  // Clear everything
  context.fillStyle = 'black';
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Draw the player in the center of our screen
  renderCircle(canvas.width / 2, canvas.height / 2, Constants.PLAYER_RADIUS, 'blue');
}

// Renders an circle with the given attributes
function renderCircle(x, y, r, color) {
  context.beginPath();
  context.arc(x, y, r, 0, 2 * Math.PI);
  context.fillStyle = color;
  context.fill();
}

export function startRendering() {
  // Render at 60 FPS
  setInterval(render, 1000 / 60);
}
```

`js›canvas.getContext('2d')` gives us a [2d drawing context](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D) for the canvas, which we can use to draw to our webpage. We then define a `js›render()` function that clears the canvas and draws a circle for the player and the enemy.

Finally, open `src/client/index.js` and setup rendering:

```js
// --- src/client/index.js
import './networking'
// highlight-start
import { startRendering } from './render'
 
startRendering();
// highlight-end
```

If you've kept the server running, you can simply refresh the page and you should see the changes we've made:

![](./media-link/build-io-game-post/step1.png)

