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
