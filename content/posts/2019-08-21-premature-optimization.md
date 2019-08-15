---
title: "Why You Should Avoid Premature Optimization"
date: "2019-08-21T12:00:00.000Z"
template: "post"
draft: false
slug: "/blog/avoid-premature-optimization/"
img:
category: "Best Practices"
tags:
  - "Best Practices"
  - "Performance"
description: A personal story that illuminates why premature optimization is the root of all evil.
prev: "/blog/properly-size-images/"
next: "/blog/minify-svgs/"
---

[Donald Knuth](https://en.wikipedia.org/wiki/Donald_Knuth) once famously said:

> The real problem is that programmers have spent far too much time worrying about efficiency in the wrong places and at the wrong times; **premature optimization is the root of all evil (or at least most of it) in programming.**

Here's my story of learning to avoid premature optimization the hard way...

## GeoArena Online

A few years ago, I was working on a web game called GeoArena Online (I've since sold it, and the new owners rebranded to <a rel="nofollow" href="https://geoarena.io">geoarena.io</a>). It was a multiplayer game where players controlled ships in last-man-standing style 1v1 battles:

<style>
    .shadow-next-img + * {
        box-shadow: 0 0 15px gray;
    }
</style>

<div class="shadow-next-img"></div>

![](./media-link/premature-opt-post/geoarena1.png)

<div class="shadow-next-img"></div>

![](./media-link/premature-opt-post/geoarena2.png)

As you can imagine, running a fast-paced game with lots of particles and special effects is rather computationally expensive. 
