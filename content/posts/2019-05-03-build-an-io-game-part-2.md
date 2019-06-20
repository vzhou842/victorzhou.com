---
title: How to Build a Multiplayer (.io) Web Game, Part 2
date: "2019-05-03T12:00:00.000Z"
template: "post"
draft: false
slug: "/blog/build-an-io-game-part-2/"
img: "https://victorzhou.com/media/io-game-post/screenshot.png"
isWeb: true
category: "Game Development"
tags:
  - "Game Development"
  - "Web Development"
  - "Javascript"
  - "Node.js"
  - "For Beginners"
description: A look into the backend server behind an .io game.
prev: "/blog/why-you-should-use-webpack/"
next: "/blog/how-i-became-a-programmer/"
discussLinkTwitter: https://twitter.com/victorczhou/status/1124325065326256128
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
<figcaption>On mobile, it works best fullscreen at <a href="https://example-io-game.victorzhou.com" target="_blank">https://example-io-game.victorzhou.com</a></figcaption>

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
3. [Server Game Objects](#3-server-game-objects): Implementing Players and Bullets.
4. [Collision Detection](#4-collision-detection): Finding Bullets that hit Players.

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

The `Game` class contains the most important server-side logic. It has two primary jobs: **managing players** and **simulating the game**.

Let's start with the first of those: managing players.

```js
// Header: game.js, Part 1
const Constants = require('../shared/constants');
const Player = require('./player');

class Game {
  constructor() {
    this.sockets = {};
    this.players = {};
    this.bullets = [];
    this.lastUpdateTime = Date.now();
    this.shouldSendUpdate = false;
    setInterval(this.update.bind(this), 1000 / 60);
  }

  addPlayer(socket, username) {
    this.sockets[socket.id] = socket;

    // Generate a position to start this player at.
    const x = Constants.MAP_SIZE * (0.25 + Math.random() * 0.5);
    const y = Constants.MAP_SIZE * (0.25 + Math.random() * 0.5);
    this.players[socket.id] = new Player(socket.id, username, x, y);
  }

  removePlayer(socket) {
    delete this.sockets[socket.id];
    delete this.players[socket.id];
  }

  handleInput(socket, dir) {
    if (this.players[socket.id]) {
      this.players[socket.id].setDirection(dir);
    }
  }

  // ...
}
```

Our convention for this game will be to identify players by the `id` field of their socket.io socket (refer back to `server.js` if you're confused). Socket.io takes care of assigning each socket a unique `id` for us, so we don't have to worry about it. I'll refer to this as a **player ID**.

With that in mind, let's go over the instance variables in the `Game` class:

- `sockets` is an object that maps a player ID to the socket associated with that player. This lets us access sockets by their player's ID in constant time.
- `players` is an object that maps a player ID to the `Player` object associated with that player. This lets us quickly access player objects by their player's ID.
- `bullets` is an array of `Bullet` objects in no particular order.
- `lastUpdateTime` is the timestamp when the last game update occurred. We'll see this used in a bit.
- `shouldSendUpdate` is a helper variable. We'll also see this used in a bit.

`js›addPlayer()`, `js›removePlayer()`, and `js›handleInput()` are pretty self-explanatory methods that are used in `server.js`. Scroll back up to review it if you need a reminder!

The last line of `js›constructor()` starts the **update loop** (at 60 updates / second) for the game:

```js
// Header: game.js, Part 2
const Constants = require('../shared/constants');
const applyCollisions = require('./collisions');

class Game {
  // ...

  update() {
    // Calculate time elapsed
    const now = Date.now();
    const dt = (now - this.lastUpdateTime) / 1000;
    this.lastUpdateTime = now;

    // Update each bullet
    const bulletsToRemove = [];
    this.bullets.forEach(bullet => {
      if (bullet.update(dt)) {
        // Destroy this bullet
        bulletsToRemove.push(bullet);
      }
    });
    this.bullets = this.bullets.filter(
      bullet => !bulletsToRemove.includes(bullet),
    );

    // Update each player
    Object.keys(this.sockets).forEach(playerID => {
      const player = this.players[playerID];
      const newBullet = player.update(dt);
      if (newBullet) {
        this.bullets.push(newBullet);
      }
    });

    // Apply collisions, give players score for hitting bullets
    const destroyedBullets = applyCollisions(
      Object.values(this.players),
      this.bullets,
    );
    destroyedBullets.forEach(b => {
      if (this.players[b.parentID]) {
        this.players[b.parentID].onDealtDamage();
      }
    });
    this.bullets = this.bullets.filter(
      bullet => !destroyedBullets.includes(bullet),
    );

    // Check if any players are dead
    Object.keys(this.sockets).forEach(playerID => {
      const socket = this.sockets[playerID];
      const player = this.players[playerID];
      if (player.hp <= 0) {
        socket.emit(Constants.MSG_TYPES.GAME_OVER);
        this.removePlayer(socket);
      }
    });

    // Send a game update to each player every other time
    if (this.shouldSendUpdate) {
      const leaderboard = this.getLeaderboard();
      Object.keys(this.sockets).forEach(playerID => {
        const socket = this.sockets[playerID];
        const player = this.players[playerID];
        socket.emit(
          Constants.MSG_TYPES.GAME_UPDATE,
          this.createUpdate(player, leaderboard),
        );
      });
      this.shouldSendUpdate = false;
    } else {
      this.shouldSendUpdate = true;
    }
  }

  // ...
}
```

The `js›update()` method contains arguably the most important server-side logic. Let's walk through what it does, in order:

1. Calculate how much time `dt` has passed since the last `js›update()`.
2. Update each bullet and destroy if needed. We'll see this implementation later - for now, we just need to know that `js›bullet.update()` **returns `true` if the bullet should be destroyed** (because it's out of bounds).
3. Update each player and create a bullet if needed. We'll also see this implementation later - `js›player.update()` **may return a `Bullet` object**.
4. Check for collisions between bullets and players using `js›applyCollisions()`, which returns an array of bullets that hit players. For each returned bullet, we increase the score of the player who fired it (via `js›player.onDealtDamage()`) and then remove the bullet from our `bullets` array.
5. Notify and remove any dead players.
6. Send a game update to all players **every other** time `js›update()` is called. The `shouldSendUpdate` helper variable mentioned earlier helps us track this. Since `js›update()` is called 60 times / second, we send game updates 30 times / second. Thus, our server's **tick rate** is 30 ticks / second (we discussed tick rate in [Part 1](/blog/build-an-io-game-part-1/#71-naive-client-state)).

> <span class="emph-special">**Why only send game updates _every other_ time?**</span> To save bandwidth. 30 game updates per second is plenty!

> <span class="emph-special">**Why not just call `js›update()` 30 times / second then?**</span> To improve the quality of the game simulation. The more times `js›update()` is called, the more precise the game simulation will be. We don't want to go too crazy with `js›update()` calls, though, because that'd be computationally expensive - 60 per second is good.

The remainder of our `Game` class consists of helper methods used in `js›update()`:

```js
// Header: game.js, Part 3
class Game {
  // ...

  getLeaderboard() {
    return Object.values(this.players)
      .sort((p1, p2) => p2.score - p1.score)
      .slice(0, 5)
      .map(p => ({ username: p.username, score: Math.round(p.score) }));
  }

  createUpdate(player, leaderboard) {
    const nearbyPlayers = Object.values(this.players).filter(
      p => p !== player && p.distanceTo(player) <= Constants.MAP_SIZE / 2,
    );
    const nearbyBullets = this.bullets.filter(
      b => b.distanceTo(player) <= Constants.MAP_SIZE / 2,
    );

    return {
      t: Date.now(),
      me: player.serializeForUpdate(),
      others: nearbyPlayers.map(p => p.serializeForUpdate()),
      bullets: nearbyBullets.map(b => b.serializeForUpdate()),
      leaderboard,
    };
  }
}
```

`js›getLeaderboard()` is pretty simple - it sorts the players by score, takes the top 5, and returns the username and score for each.

`js›createUpdate()` is used in `js›update()` to create game updates to send to players. It primarily operates by invoking the `js›serializeForUpdate()` methods implemented for the `Player` and `Bullet` classes. Notice also that it only sends data to any given player about **nearby** players and bullets - there's no need to include info about game objects far away from the player!

## 3. Server Game Objects

In our game, Players and Bullets are actually quite similar: both are ephemeral, circular, moving game objects. To take advantage of this similarity when implementing Players and Bullets, we'll start out with a base `Object` class:

```js
// Header: object.js
class Object {
  constructor(id, x, y, dir, speed) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.direction = dir;
    this.speed = speed;
  }

  update(dt) {
    this.x += dt * this.speed * Math.sin(this.direction);
    this.y -= dt * this.speed * Math.cos(this.direction);
  }

  distanceTo(object) {
    const dx = this.x - object.x;
    const dy = this.y - object.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  setDirection(dir) {
    this.direction = dir;
  }

  serializeForUpdate() {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
    };
  }
}
```

Nothing fancy here. This gives us a good starting point that can be extended. Let's see how the `Bullet` class uses `Object`:

```js
// Header: bullet.js
const shortid = require('shortid');
const ObjectClass = require('./object');
const Constants = require('../shared/constants');

class Bullet extends ObjectClass {
  constructor(parentID, x, y, dir) {
    super(shortid(), x, y, dir, Constants.BULLET_SPEED);
    this.parentID = parentID;
  }

  // Returns true if the bullet should be destroyed
  update(dt) {
    super.update(dt);
    return this.x < 0 || this.x > Constants.MAP_SIZE || this.y < 0 || this.y > Constants.MAP_SIZE;
  }
}
```

`Bullet`'s implementation is so short! The only extensions we add to `Object` are:

- Using the [shortid](https://www.npmjs.com/package/shortid) package to randomly generate an `id` for our bullet.
- Adding a `parentID` field so we can track which player created this bullet.
- Adding a return value to `js›update()` that's `js›true` if the bullet is out of bounds (remember talking about this in the previous section?).

Onwards to `Player`:

```js
// Header: player.js
const ObjectClass = require('./object');
const Bullet = require('./bullet');
const Constants = require('../shared/constants');

class Player extends ObjectClass {
  constructor(id, username, x, y) {
    super(id, x, y, Math.random() * 2 * Math.PI, Constants.PLAYER_SPEED);
    this.username = username;
    this.hp = Constants.PLAYER_MAX_HP;
    this.fireCooldown = 0;
    this.score = 0;
  }

  // Returns a newly created bullet, or null.
  update(dt) {
    super.update(dt);

    // Update score
    this.score += dt * Constants.SCORE_PER_SECOND;

    // Make sure the player stays in bounds
    this.x = Math.max(0, Math.min(Constants.MAP_SIZE, this.x));
    this.y = Math.max(0, Math.min(Constants.MAP_SIZE, this.y));

    // Fire a bullet, if needed
    this.fireCooldown -= dt;
    if (this.fireCooldown <= 0) {
      this.fireCooldown += Constants.PLAYER_FIRE_COOLDOWN;
      return new Bullet(this.id, this.x, this.y, this.direction);
    }
    return null;
  }

  takeBulletDamage() {
    this.hp -= Constants.BULLET_DAMAGE;
  }

  onDealtDamage() {
    this.score += Constants.SCORE_BULLET_HIT;
  }

  serializeForUpdate() {
    return {
      ...(super.serializeForUpdate()),
      direction: this.direction,
      hp: this.hp,
    };
  }
}
```

Players are more complex than bullets, so this class needs to store a couple extra fields. Its `js›update()` method does a few extra things, notably returning a newly fired bullet if there is no `fireCooldown` left (remember talking about this in the previous section?). It also extends the `js›serializeForUpdate()` method, since we need to inlude extra fields for a player in a game update.

**Having a base `Object` class is key for preventing code repetition**. For example, without the `Object` class, every game object would have the exact same implementation of `js›distanceTo()`, and it'd be a nightmare to keep all of those copy-pasted implementations in sync across different files. **This becomes especially important for larger projects**, as the number of classes extending `Object` grows.

## 4. Collision Detection

The only thing left to do is detect when bullets hit players! Recall this bit of code from the `js›update()` method in the `Game` class:

```js
// Header: game.js
const applyCollisions = require('./collisions');

class Game {
  // ...

  update() {
    // ...

    // Apply collisions, give players score for hitting bullets
    const destroyedBullets = applyCollisions( // highlight-line
      Object.values(this.players),
      this.bullets,
    );
    destroyedBullets.forEach(b => {
      if (this.players[b.parentID]) {
        this.players[b.parentID].onDealtDamage();
      }
    });
    this.bullets = this.bullets.filter(
      bullet => !destroyedBullets.includes(bullet),
    );

    // ...
  }
}

```

We need to implement an `js›applyCollisions()` method that returns all bullets that hit players. Luckily, this isn't too hard because

- All of our collidable objects are circles, which is the easiest shape to implement collision detection for.
- We already have a `js›distanceTo()` method that we implement in the `Object` class in the previous section.

Here's what our collision detection implementation looks like:

```js
// Header: collisions.js
const Constants = require('../shared/constants');

// Returns an array of bullets to be destroyed.
function applyCollisions(players, bullets) {
  const destroyedBullets = [];
  for (let i = 0; i < bullets.length; i++) {
    // Look for a player (who didn't create the bullet) to collide each bullet with.
    // As soon as we find one, break out of the loop to prevent double counting a bullet.
    for (let j = 0; j < players.length; j++) {
      const bullet = bullets[i];
      const player = players[j];
      if (
        bullet.parentID !== player.id &&
        player.distanceTo(bullet) <= Constants.PLAYER_RADIUS + Constants.BULLET_RADIUS
      ) {
        destroyedBullets.push(bullet);
        player.takeBulletDamage();
        break;
      }
    }
  }
  return destroyedBullets;
}
```

The math behind this simple collision detection is the fact that **two circles only "collide" if the distance between their centers is ≤ the sum of their radii**. Here's the case when the distance between two circle centers is exactly the sum of their radii:

![](/media/io-game-post/circles.svg)

There's a couple other things we have to be careful about here:

- Making sure a bullet cannot hit the player who created it. We achieve this by checking `js›bullet.parentID` against `js›player.id`.
- Making sure a bullet only "hits" once in the edge case when it collides with multiple players at the same time. We take care of this with the `js›break` statement: once a player that collides with the bullet is found, we stop looking and go on to the next bullet.

## The End

That's it! We've gone through everything you need to know to build an .io web game. What now? **Build your own .io game!**

All of the code for our example .io game is open-source on [Github](https://github.com/vzhou842/example-.io-game). Have questions or concerns? Leave a comment below or [tweet at me](https://twitter.com/victorczhou).

Happy Hacking!
