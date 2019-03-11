---
title: How to Build a Multiplayer (.io) Web Game
date: "2019-03-14T12:00:00.000Z"
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
web-game-tutorial/
    public/
        index.html
    src/
        index.js
    package-lock.json
    package.json
    server.js
```

`src/index.js` is the client-side entrypoint. All it does right now is use socket.io to connect to the server:

```javascript
import io from 'socket.io-client';

const socket = io(`ws://${window.location.host}`);

socket.on('connect', () => {
  console.log('Connected to server!');
});
```

`server.js` is the server-side entrypoint. All it does right now is set up Express and socket.io:

```javascript
const express = require('express');

// Setup an Express server
const app = express();
app.use(express.static('dist'));
app.use(express.static('public'));

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
$ npm run build
```

to have Webpack bundle our client code, and then we can start the server:

```bash
$ npm start
Server listening on port 3000
```

Visit [localhost:3000](http://localhost:3000) in your web browser and you should see the starter project page!

## 2. Client Rendering

Let's get stuff to show up on the client. We'll use an [HTML5 Canvas](https://www.w3schools.com/html/html5_canvas.asp) to draw images. Add a `html›<canvas>` element to `index.html`:

```html
<body>
  <h1>A Multiplayer Web Game Example</h1>
  <p>If you see this, your starter project works!</p>
  <canvas id="game-canvas" width="800" height="600"></canvas> // highlight-line
  <script async src="/main.js"></script>
</body>
```

Then, open `src/index.js` and 
