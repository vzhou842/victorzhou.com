---
title: Random Forests for Complete Beginners
date: "2019-04-04T12:00:00.000Z"
template: "post"
usesKatex: true
draft: false
slug: "/blog/intro-to-random-forests/"
img: 
category: "Machine Learning"
tags:
  - "Machine Learning"
  - "For Beginners"
  - "Python"
  - "Decision Trees"
  - "Random Forests"
description: What they are, how they work, and how to implement one from scratch in Python.
prev: "/blog/intro-to-neural-networks/"
next: "/blog/better-profanity-detection-with-scikit-learn/"
---

After the positive feedback from my [introduction to Neural Networks for beginners](/blog/intro-to-neural-networks/), I'm even more convinced of the value of introductions to ML concepts that build from the ground up and implement simple versions of those concepts along the way.

This post will adopt the same strategy, meaning it's again **intended for complete beginners and assumes ZERO prior knowledge of machine learning**. We'll learn what Random Forests are and how they work while implementing one from scratch in Python.

## 1. Decision Trees 🌲

Look at the following dataset:

![The Dataset](/media/random-forest-post/dataset.svg)

<style>
.inline-point {
  margin: 2px 1px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  display: inline-block;
}
.inline-point.blue {
  background-color: #164BC5;
}
.inline-point.green {
  background-color: #0F9640;
}
.inline-point.red {
  background-color: red;
}
</style>

If I told you that there was a new point that had an $x$ coordinate of $1$, what color do you think it'd be?

Blue, right? <span class="inline-point blue" />

You just evaluated a decision tree in your head:

![](/media/random-forest-post/decision-tree.svg)

That's a simple decision tree with one **decision node** that tests $x < 2$. If the test passes ($ x < 2$), we take the left **branch** and pick Blue. If the test fails ($x \geq 2$), we take the right **branch** and pick Green.

![](/media/random-forest-post/dataset-split.svg)

Decision Trees are commonly used to answer that kind of question: given a **labelled** dataset, how do we **classify** new examples?

In case you haven't seen that terminology before:

- **Labelled**: Our dataset is _labelled_ because each point has a **class** (color): blue or green.
- **Classify**: To _classify_ a new datapoint is to assign a class (color) to it.

Here's a dataset that has 3 classes now instead of 2:

![The Dataset 2](/media/random-forest-post/dataset2.svg)

Our old decision tree doesn't work so well anymore. Given a new point $(x, y)$,

- If $x \geq 2$, we can still confidently classify it as green. <span class="inline-point green"></span>
- If $x < 2$, we can't immediately classify it as blue - it could be red, too. <span class="inline-point blue"></span> <span class="inline-point red"></span>

We need to add another **decision node** to our decision tree:

![](/media/random-forest-post/decision-tree2.svg)

![](/media/random-forest-post/dataset2-split.svg)

Pretty simple, right? That's all there is to decision trees.
