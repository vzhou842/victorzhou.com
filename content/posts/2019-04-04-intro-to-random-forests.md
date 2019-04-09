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

A Random Forest 🌲🌲🌲 is actually just a bunch of Decision Trees 🌲 bundled together (ohhhhh 💡 that's why it's called a _forest_). Before we talk about forests, we need to first go over trees. 

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

That's a simple decision tree with one **decision node** that **tests** $x < 2$. If the test passes ($ x < 2$), we take the left **branch** and pick Blue. If the test fails ($x \geq 2$), we take the right **branch** and pick Green.

![](/media/random-forest-post/dataset-split.svg)

Decision Trees are commonly used to answer that kind of question: given a **labelled** dataset, how do we **classify** new examples?

In case you haven't seen that terminology before:

- **Labelled**: Our dataset is _labelled_ because each point has a **class** (color): blue or green.
- **Classify**: To _classify_ a new datapoint is to assign a class (color) to it.

Here's a dataset that has 3 classes now instead of 2:

![The Dataset v2](/media/random-forest-post/dataset2.svg)

Our old decision tree doesn't work so well anymore. Given a new point $(x, y)$,

- If $x \geq 2$, we can still confidently classify it as green. <span class="inline-point green"></span>
- If $x < 2$, we can't immediately classify it as blue - it could be red, too. <span class="inline-point blue"></span> <span class="inline-point red"></span>

We need to add another **decision node** to our decision tree:

![](/media/random-forest-post/decision-tree2.svg)

![](/media/random-forest-post/dataset2-split.svg)

Pretty simple, right? That's all there is to decision trees.

## 2. Training a Decision Tree

Let's use the 3 class dataset again and write out numeric values for each datapoint:

![The Dataset v2](/media/random-forest-post/dataset2.svg)

| X | Y | Color |
| - | - | ----- |
| 0.5 | 0.5 | <span class="inline-point blue"/> |
| 1 | 1.5 | <span class="inline-point blue"/> |
| 1.5 | 1 | <span class="inline-point blue"/> |
| 3 | 1 | <span class="inline-point green"/> |
| 2.2 | 2 | <span class="inline-point green"/> |
| 2.5 | 3 | <span class="inline-point green"/> |
| 0.2 | 2.8 | <span class="inline-point red"/> |
| 1 | 2.5 | <span class="inline-point red"/> |
| 1.3 | 2.3 | <span class="inline-point red"/> |

Let's start training a decision tree from this data!

### 2.1 Training a Decision Tree: The Root Node

Our first task is to determine the root decision node in our tree. Which feature ($x$ or $y$) will it test on, and what will the test threshold be? For example, the root decision node in our tree from earlier used the $x$ feature with a test threshold of $2$:

![](/media/random-forest-post/decision-tree2-root.svg)

Intuitively, we want a decision node that makes a "good" split, where "good" can be loosely defined as **separating different classes as much as possible**. The root decision node above makes a "good" split: _all_ the greens are on the right, and _no_ greens are on the left.

Thus, our goal is now to pick a root node that gives us the "best" split possible. **But how do we quantify how good a split is?** It's complicated. I wrote [an entire blog post about a common way to do this using a metric called Gini Impurity](/blog/gini-impurity/). **← I recommend reading it right now** before you continue.

---

Welcome back!

> Hopefully, you just read [my Gini Impurity post](/blog/gini-impurity/). If you didn't, here's a very short TL;DR: We can use Gini Impurity to calculate a value called **Gini Gain** for any split. **A better split has higher Gini Gain**.

Back to the problem of determining our root decision node. Now that we have a way to evaluate splits, all we have to do to is find the best split possible! For the sake of simplicity, we're just going to **try every possible split** and use the best one (the one with the highest Gini Gain). **This is not the best way to find the best split**, but it is the easiest to understand and still works.

Trying every split means trying

- Every feature ($x$ or $y$).
- All unique threshold. For a given feature, **we only need to try thresholds that produce different splits.**

For example, here are the thresholds we might try if we wanted to use the $x$ coordinate:

![](/media/random-forest-post/dataset2-thresholds.svg)

After trying all threshold for both $x$ and $y$, we'd see that the $x = 2$ split has the highest Gini Gain, so we'd make our root decision node use the $x$ feature with a threshold of $2$. We did it! Here's what we've got:

![](/media/random-forest-post/decision-tree2-build1.svg)

### 2.2: Training a Decision Tree: The Second Node

Time to make our second decision node. Let's (arbitrarily) decide to use the left branch. **We're now only dealing with the datapoints that would take the left branch**, specifically the 3 blues and 3 reds. <span class="inline-point blue"></span> <span class="inline-point blue"></span> <span class="inline-point blue"></span> <span class="inline-point red"></span> <span class="inline-point red"></span> <span class="inline-point red"></span>

To build our second decision node, **we just do the same thing!** We try every possible split for the 6 datapoints we have and realize that $y = 2$ is the best split. We make that into a decision node and now have this:

![](/media/random-forest-post/decision-tree2-build2.svg)

### 2.3 Training a Decision Tree: When to Stop?

Let's keep it going and try to make a third decision node. We'll use the right branch from the root node this time. The only datapoints in that branch are the 3 greens. <span class="inline-point green"></span> <span class="inline-point green"></span> <span class="inline-point green"></span>

Again, we try all the possible splits, but they all

- Are equally good.
- Have a Gini Gain of 0 because the Gini Impurity was already 0 and can't go any lower.

> Confused about what I just said? I told you you should've read [my Gini Impurity post](/blog/gini-impurity/). It'll explain all of this Gini stuff.

It doesn't makes sense to add a decision node here because doing so wouldn't improve our decision tree. Thus, we'll make this node a **leaf node** and slap the Green label on it. This means that **we'll label any datapoint that reaches this node in our tree as Green**.

If we continue to the 2 remaining nodes, the same thing will happen: we'll make the bottom left node our Blue leaf node, and we'll make the bottom right node our Red leaf node. That brings us to the final result:

![](/media/random-forest-post/decision-tree2.svg)

**Once all possible branches in our decision tree end in leaf nodes, we're done.** We've trained a decision tree!
