---
title: Random Forests for Complete Beginners
date: "2019-04-10T12:00:00.000Z"
template: "post"
usesKatex: true
draft: false
slug: "/blog/intro-to-random-forests/"
img: "https://victorzhou.com/media/random-forest-post/random-forest.png"
isML: true
category: "Machine Learning"
tags:
  - "Machine Learning"
  - "For Beginners"
  - "Decision Trees"
  - "Random Forests"
description: The definitive guide to Random Forests and Decision Trees.
prev: "/blog/intro-to-neural-networks/"
next: "/blog/gini-impurity/"
discussLinkTwitter: https://twitter.com/victorczhou/status/1116006217581772801
discussLinkHN: https://news.ycombinator.com/item?id=19632052
discussLinkReddit: https://www.reddit.com/r/learnmachinelearning/comments/bbneto/random_forests_for_complete_beginners/
popularity: 46
---

In my opinion, most Machine Learning tutorials aren't beginner-friendly enough.

Last month, I wrote an [introduction to Neural Networks **for complete beginners**](/blog/intro-to-neural-networks/). This post will adopt the same strategy, meaning it again **assumes ZERO prior knowledge of machine learning**. We'll learn what Random Forests are and how they work from the ground up.

Ready? Let's dive in.

## 1. Decision Trees 🌲

A Random Forest 🌲🌲🌲 is actually just a bunch of Decision Trees 🌲 bundled together (ohhhhh that's why it's called a _forest_). We need to talk about trees before we can get into forests.

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

If I told you that there was a new point with an $x$ coordinate of $1$, what color do you think it'd be?

Blue, right? <span class="inline-point blue" />

You just evaluated a decision tree in your head:

![](/media/random-forest-post/decision-tree.svg)

That's a simple decision tree with one **decision node** that **tests** $x < 2$. If the test passes ($ x < 2$), we take the left **branch** and pick Blue. If the test fails ($x \geq 2$), we take the right **branch** and pick Green.

![The Dataset, split at x=2](/media/random-forest-post/dataset-split.svg)

Decision Trees are often used to answer that kind of question: given a **labelled** dataset, how should we **classify** new samples?

> **Labelled**: Our dataset is _labelled_ because each point has a **class** (color): blue or green.

> **Classify**: To _classify_ a new datapoint is to assign a class (color) to it.

Here's a dataset that has 3 classes now instead of 2:

![The Dataset v2](/media/random-forest-post/dataset2.svg)

Our old decision tree doesn't work so well anymore. Given a new point $(x, y)$,

- If $x \geq 2$, we can still confidently classify it as green. <span class="inline-point green"></span>
- If $x < 2$, we can't immediately classify it as blue - it could be red, too. <span class="inline-point blue"></span> <span class="inline-point red"></span>

We need to add another **decision node** to our decision tree:

![](/media/random-forest-post/decision-tree2.svg)

![](/media/random-forest-post/dataset2-split.svg)

Pretty simple, right? That's the basic idea behind decision trees.

## 2. Training a Decision Tree

Let's start training a decision tree! We'll use the 3 class dataset again:

![The Dataset v2](/media/random-forest-post/dataset2.svg)

### 2.1 Training a Decision Tree: The Root Node

Our first task is to determine the root decision node in our tree. Which feature ($x$ or $y$) will it test on, and what will the test threshold be? For example, the root node in our tree from earlier used the $x$ feature with a test threshold of $2$:

![](/media/random-forest-post/decision-tree2-root.svg)

Intuitively, we want a decision node that makes a "good" split, where "good" can be loosely defined as **separating different classes as much as possible**. The root node above makes a "good" split: _all_ the greens are on the right, and _no_ greens are on the left.

Thus, our goal is now to pick a root node that gives us the "best" split possible. **But how do we quantify how good a split is?** It's complicated. I wrote [an entire blog post about one way to do this using a metric called Gini Impurity](/blog/gini-impurity/). **← I recommend reading it right now** before you continue - we'll be using those concepts later in this post.

---

Welcome back!

> Hopefully, you just read [my Gini Impurity post](/blog/gini-impurity/). If you didn't, here's a very short TL;DR: We can use Gini Impurity to calculate a value called **Gini Gain** for any split. **A better split has higher Gini Gain**.

Back to the problem of determining our root decision node. Now that we have a way to evaluate splits, all we have to do to is find the best split possible! For the sake of simplicity, we're just going to **try every possible split** and use the best one (the one with the highest Gini Gain). **This is not the fastest way to find the best split**, but it is the easiest to understand.

Trying every split means trying

- Every feature ($x$ or $y$).
- All "unique" thresholds. **We only need to try thresholds that produce different splits.**

For example, here are the thresholds we might select if we wanted to use the $x$ coordinate:

![x Thresholds](/media/random-forest-post/dataset2-thresholds-x.svg)

Let's do an example Gini Gain calculation for the $x = 0.4$ split.

| Split | Left Branch | Right Branch |
| --- | --- | --- |
| $x = 0.4$ | <span class="inline-point red"></span> | <span class="inline-point blue"></span> <span class="inline-point blue"></span> <span class="inline-point blue"></span> <span class="inline-point red"></span> <span class="inline-point red"></span> <span class="inline-point green"></span> <span class="inline-point green"></span> <span class="inline-point green"></span> |

First, we calculate the Gini Impurity of the whole dataset:

$$
\begin{aligned}
G_{initial} &= \sum_{i=1}^3 p(i) * (1 - p(i)) \\
&= 3 * (\frac{1}{3} * \frac{2}{3}) \\
&= \boxed{\frac{2}{3}} \\
\end{aligned}
$$

Then, we calculate the Gini Impurities of the two branches:

$$
G_{left} = 0 * 1 + 1 * 0 + 0 * 1 = \boxed{0}
$$

$$
\begin{aligned}
G_{right} &= \frac{3}{8} * \frac{5}{8} + \frac{2}{8} * \frac{6}{8} + \frac{3}{8} * \frac{5}{8} \\
&= \boxed{\frac{21}{32}} \\
\end{aligned}
$$

Finally, we calculate Gini Gain by subtracting the weighted branch impurities from the original impurity:

$$
\begin{aligned}
\text{Gain} &= G_{initial} - \frac{1}{9} G_{left} - \frac{8}{9} G_{right} \\
&= \frac{2}{3} - \frac{1}{9} * 0 - \frac{8}{9} * \frac{21}{32} \\
&= \boxed{0.083} \\
\end{aligned}
$$

> Confused about what just happened? I told you you should've read [my Gini Impurity post](/blog/gini-impurity/). It'll explain all of this Gini stuff.

We can calculate Gini Gain for every possible split in the same way:

| Split | Left Branch | Right Branch | Gini Gain |
| --- | --- | --- | --- |
| $x = 0.4$ | <span class="inline-point red"></span> | <span class="inline-point blue"></span> <span class="inline-point blue"></span> <span class="inline-point blue"></span> <span class="inline-point red"></span> <span class="inline-point red"></span> <span class="inline-point green"></span> <span class="inline-point green"></span> <span class="inline-point green"></span> | $0.083$ |
| $x = 0.8$ | <span class="inline-point blue"></span> <span class="inline-point red"></span> | <span class="inline-point blue"></span> <span class="inline-point blue"></span> <span class="inline-point red"></span> <span class="inline-point red"></span> <span class="inline-point green"></span> <span class="inline-point green"></span> <span class="inline-point green"></span> | $0.048$ |
| $x = 1.1$ | <span class="inline-point blue"></span> <span class="inline-point blue"></span> <span class="inline-point red"></span> <span class="inline-point red"></span> | <span class="inline-point blue"></span> <span class="inline-point red"></span> <span class="inline-point green"></span> <span class="inline-point green"></span> <span class="inline-point green"></span> | $0.133$ |
| $x = 1.3$ | <span class="inline-point blue"></span> <span class="inline-point blue"></span> <span class="inline-point red"></span> <span class="inline-point red"></span> <span class="inline-point red"></span> | <span class="inline-point blue"></span> <span class="inline-point green"></span> <span class="inline-point green"></span> <span class="inline-point green"></span> | $0.233$ |
| $x = 2$ | <span class="inline-point blue"></span> <span class="inline-point blue"></span> <span class="inline-point blue"></span> <span class="inline-point red"></span> <span class="inline-point red"></span> <span class="inline-point red"></span> | <span class="inline-point green"></span> <span class="inline-point green"></span> <span class="inline-point green"></span> | $0.333$ |
| $x = 2.4$ | <span class="inline-point blue"></span> <span class="inline-point blue"></span> <span class="inline-point blue"></span> <span class="inline-point red"></span> <span class="inline-point red"></span> <span class="inline-point red"></span> <span class="inline-point green"></span> | <span class="inline-point green"></span> <span class="inline-point green"></span> | $0.191$ |
| $x = 2.8$ | <span class="inline-point blue"></span> <span class="inline-point blue"></span> <span class="inline-point blue"></span> <span class="inline-point red"></span> <span class="inline-point red"></span> <span class="inline-point red"></span> <span class="inline-point green"></span> <span class="inline-point green"></span> | <span class="inline-point green"></span> | $0.083$ |
| $y = 0.8$ | <span class="inline-point blue"> | </span> <span class="inline-point blue"></span> <span class="inline-point blue"></span> <span class="inline-point red"></span> <span class="inline-point red"></span> <span class="inline-point red"></span> <span class="inline-point green"></span> <span class="inline-point green"></span> <span class="inline-point green"></span> | $0.083$ |
| $y = 1.2$ | <span class="inline-point blue"></span> <span class="inline-point blue"></span> <span class="inline-point green"></span> | </span> <span class="inline-point blue"></span> <span class="inline-point red"></span> <span class="inline-point red"></span> <span class="inline-point red"></span> <span class="inline-point green"></span> <span class="inline-point green"></span> | $0.111$ |
| $y = 1.8$ | <span class="inline-point blue"></span> </span> <span class="inline-point blue"></span> <span class="inline-point blue"></span> <span class="inline-point green"></span> | <span class="inline-point red"></span> <span class="inline-point red"></span> <span class="inline-point red"></span> <span class="inline-point green"></span> <span class="inline-point green"></span> | $0.233$ |
| $y = 2.1$ | <span class="inline-point blue"></span> </span> <span class="inline-point blue"></span> <span class="inline-point blue"></span> <span class="inline-point green"></span> <span class="inline-point green"></span> | <span class="inline-point red"></span> <span class="inline-point red"></span> <span class="inline-point red"></span> <span class="inline-point green"></span> | $0.233$ |
| $y = 2.4$ | <span class="inline-point blue"></span> </span> <span class="inline-point blue"></span> <span class="inline-point blue"></span> <span class="inline-point red"></span> <span class="inline-point green"></span> <span class="inline-point green"></span> | <span class="inline-point red"></span> <span class="inline-point red"></span> <span class="inline-point green"></span> | $0.111$ |
| $y = 2.7$ | <span class="inline-point blue"></span> </span> <span class="inline-point blue"></span> <span class="inline-point blue"></span> <span class="inline-point red"></span> <span class="inline-point red"></span> <span class="inline-point green"></span> <span class="inline-point green"></span> | <span class="inline-point red"></span> <span class="inline-point green"></span> | $0.048$ |
| $y = 2.9$ | <span class="inline-point blue"></span> </span> <span class="inline-point blue"></span> <span class="inline-point blue"></span> <span class="inline-point red"></span> <span class="inline-point red"></span> <span class="inline-point red"></span> <span class="inline-point green"></span> <span class="inline-point green"></span> | <span class="inline-point green"></span> | $0.083$ |

![All Thresholds](/media/random-forest-post/dataset2-thresholds.svg)

After trying all thresholds for both $x$ and $y$, we've found that the $x = 2$ split has the highest Gini Gain, so we'll make our root decision node use the $x$ feature with a threshold of $2$. Here's what we've got so far:

![](/media/random-forest-post/decision-tree2-build1.svg)

Making progress!

### 2.2: Training a Decision Tree: The Second Node

Time to make our second decision node. Let's (arbitrarily) go to the left branch. **We're now only using the datapoints that would take the left branch** (i.e. the datapoints satisfying $x < 2$), specifically the 3 blues and 3 reds. <span class="inline-point blue"></span> <span class="inline-point blue"></span> <span class="inline-point blue"></span> <span class="inline-point red"></span> <span class="inline-point red"></span> <span class="inline-point red"></span>

To build our second decision node, **we just do the same thing!** We try every possible split for the 6 datapoints we have and realize that $y = 2$ is the best split. We make that into a decision node and now have this:

![](/media/random-forest-post/decision-tree2-build2.svg)

Our decision tree is almost done...

### 2.3 Training a Decision Tree: When to Stop?

Let's keep it going and try to make a third decision node. We'll use the right branch from the root node this time. The only datapoints in that branch are the 3 greens. <span class="inline-point green"></span> <span class="inline-point green"></span> <span class="inline-point green"></span>

Again, we try all the possible splits, but they all

- Are equally good.
- Have a Gini Gain of 0 (the Gini Impurity was already 0 and can't go any lower).

It doesn't makes sense to add a decision node here because doing so wouldn't improve our decision tree. Thus, we'll make this node a **leaf node** and slap the Green label on it. This means that **we'll classify any datapoint that reaches this node as Green**.

If we continue to the 2 remaining nodes, the same thing will happen: we'll make the bottom left node our Blue leaf node, and we'll make the bottom right node our Red leaf node. That brings us to the final result:

![](/media/random-forest-post/decision-tree2.svg)

**Once all possible branches in our decision tree end in leaf nodes, we're done.** We've trained a decision tree!

## 3. Random Forests 🌲🌳🌲🌳🌲

We're finally ready to talk about Random Forests. Remember what I said earlier?

> A Random Forest is actually just a bunch of Decision Trees bundled together.

That's true, but is a bit of a simplification.

### 3.1 Bagging

Consider the following algorithm to train a bundle of decision trees given a dataset of $n$ points:

1. Sample, **with replacement**, $n$ training examples from the dataset.
2. Train a decision tree on the $n$ samples.
3. Repeat $t$ times, for some $t$.

To make a prediction using this model with $t$ trees, we aggregate the predictions from the individual decision trees and either

- Take the **majority vote** if our trees produce class labels (like colors).
- Take the **average** if our trees produce numerical values (e.g. when predicting temperature, price, etc).

This technique is called **bagging**, or [**b**ootstrap **agg**regating](https://en.wikipedia.org/wiki/Bootstrap_aggregating). The sampling with replacement we did is known as a [bootstrap](https://en.wikipedia.org/wiki/Bootstrapping_(statistics)) sample.

![Bagged Decision Trees predicting color](/media/random-forest-post/random-forest.svg)

Bagged decision trees are very close to Random Forests - they're just missing one thing...

### 3.2 Bagging → Random Forest

Bagged decision trees have only one parameter: $t$, the number of trees.

Random Forests have a second parameter that controls **how many features to try when finding the best split**. Our simple dataset for this tutorial only had $2$ features ($x$ and $y$), but most datasets will have far more (hundreds or thousands).

Suppose we had a dataset with $p$ features. Instead of trying all features every time we make a new decision node, we **only try a subset of the features**, usually of size $\sqrt{p}$ or $\frac{p}{3}$. We do this primarily to inject randomness that makes individual trees more unique and **reduces correlation between trees**, which improves the forest's performance overall. This technique is sometimes referred to as **feature bagging**.

## 4. Now What?

That's a beginner's introduction to Random Forests! A quick recap of what we did:

- Introduced **decision trees**, the building blocks of Random Forests.
- Learned how to train decision trees by iteratively making the best split possible.
- Defined [Gini Impurity](/blog/gini-impurity/), a metric used to quantify how "good" a split is.
- Saw that **a random forest = a bunch of decision trees.**
- Understood how **bagging** combines predictions from multiple trees.
- Learned that **feature bagging** is the difference between bagged decision trees and a random forest.

A few things you could do from here:

- Read about [Information Gain](/blog/information-gain/), a metric similar to Gini Impurity that can also be used to quantify how "good" a split is.
- Experiment with scikit-learn's [DecisionTreeClassifier](https://scikit-learn.org/stable/modules/generated/sklearn.tree.DecisionTreeClassifier.html) and [RandomForestClassifier](https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.RandomForestClassifier.html) classes on real datasets.
- Try writing a simple Decision Tree or Random Forest implementation from scratch. I'm happy to give guidance or code review! Just [tweet at me](https://twitter.com/victorczhou) or [email me](mailto:vzhou842@gmail.com).
- Read about [Gradient Boosted Decision Trees](https://en.wikipedia.org/wiki/Gradient_boosting#Gradient_tree_boosting) and play with [XGBoost](http://www.datastuff.tech/machine-learning/xgboost-predicting-life-expectancy-with-supervised-learning/), a powerful gradient boosting library.
- Read about [ExtraTrees](https://en.wikipedia.org/wiki/Random_forest#ExtraTrees), an extension of Random Forests, or play with scikit-learn's [ExtraTreesClassifier](https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.ExtraTreesClassifier.html) class.

That concludes this tutorial. I like [writing about Machine Learning](/tag/machine-learning) (but also other topics), so **[subscribe](/subscribe/?src=intro-to-random-forests) if you want to get notified about new posts.**

Thanks for reading!
