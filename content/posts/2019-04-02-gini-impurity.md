---
title: A Simple Explanation of Gini Impurity
date: "2019-04-02T12:00:00.000Z"
template: "post"
usesKatex: true
draft: false
slug: "/blog/gini-impurity/"
img:
category: "Machine Learning"
tags:
  - "Machine Learning"
  - "Python"
  - "Random Forests"
  - "For Beginners"
description: A beginner's guide to Gini Impurity, Gini Gain, and how they're used to train Decision Trees.
prev: "/blog/intro-to-neural-networks/"
next: "/blog/better-profanity-detection-with-scikit-learn/"
---

If you look at the documentation for the [DecisionTreeClassifier](https://scikit-learn.org/stable/modules/generated/sklearn.tree.DecisionTreeClassifier.html) class in [scikit-learn](https://scikit-learn.org), you'll see something like this for the `criterion` parameter:

![](/media/gini-impurity-post/scikit-learn.png)

The default criterion is "gini" for the **Gini Impurity**. What is that?!

## Decision Trees 🌲

Training a decision tree consists of iteratively splitting the current dataset into two parts. Say we had the following datapoints:

![](/media/gini-impurity-post/dataset.svg)

<style>
.inline-point {
  margin: 0 2px;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  display: inline-block;
}
.inline-point.blue {
  background-color: #164BC5;
}
.inline-point.green {
  background-color: #0F9640;
}
</style>
Right now, we have 1 group with 5 blues and 5 greens. <span class="inline-point blue"></span> <span class="inline-point blue"></span> <span class="inline-point blue"></span> <span class="inline-point blue"></span> <span class="inline-point blue"></span> <span class="inline-point green"></span> <span class="inline-point green"></span> <span class="inline-point green"></span> <span class="inline-point green"></span> <span class="inline-point green"></span>

Let's make a split at $$x = 2$$:

![](/media/gini-impurity-post/dataset-perfect-split.svg)

This is a **perfect** split! It breaks our dataset into two groups:

- Left group, with 5 blues. <span class="inline-point blue"></span> <span class="inline-point blue"></span> <span class="inline-point blue"></span> <span class="inline-point blue"></span> <span class="inline-point blue"></span>
- Right group, with 5 greens. <span class="inline-point green"></span> <span class="inline-point green"></span> <span class="inline-point green"></span> <span class="inline-point green"></span> <span class="inline-point green"></span>

What if we'd made a split at $$x = 1.5$$ instead?

![](/media/gini-impurity-post/dataset-imperfect-split.svg)

This imperfect split breaks our dataset into these groups:

- Left group, with 4 blues. <span class="inline-point blue"></span> <span class="inline-point blue"></span> <span class="inline-point blue"></span> <span class="inline-point blue"></span>
- Right group, with 1 blue and 5 greens. <span class="inline-point blue"></span> <span class="inline-point green"></span> <span class="inline-point green"></span> <span class="inline-point green"></span> <span class="inline-point green"></span> <span class="inline-point green"></span>

It's obvious that this split is worse, but how can we quantify that?

## Gini Impurity

Gini Impurity is a metric that's used to **measure the quality of a split**.

Suppose we randomly pick a datapoint in our dataset. Now, let's **randomly classify it according to the class distribution in the dataset**. For our dataset, we'd give it a $\frac{5}{10}$ chance of being blue and a $\frac{5}{10}$ chance of being green, since we have 5 of each color. **What's the probability we classify it incorrectly?** Gini Impurity is the answer to that question.

### Example 1: The Whole Dataset

Let's calculate the Gini Impurity of our entire dataset. If we randomly pick a datapoint, it's either blue (50%) or green (50%).

Now, we randomly classify our datapoint according to the class distribution. Since we have 5 of each color, we classify it as blue 50% of the time and as green 50% of the time.

What's the probability we classify our datapoint **incorrectly**?

| Event | Probability |
| ----- | ----------- |
| Pick Blue, Classify Blue | 25% |
| Pick Blue, Classify Green | 25% |
| Pick Green, Classify Blue | 25% |
| Pick Green, Classify Green | 25% |

We only classify it incorrectly when we Pick Blue, Classify Green or Pick Green, Classify Blue. Thus, our total probability is 25% + 25% = 50%, so the Gini Impurity is $\boxed{0.5}$.

### The Formula

If we have $C$ total classes and $p(i)$ is the probability of picking a datapoint with class $i$, then the Gini Impurity is calculated as

$$
G = \sum_{i=1}^C p(i) * (1 - p(i))
$$

For the example above, we have $C = 2$ and $p(1) = p(2) = 0.5$, so

$$
\begin{aligned}
G &= p(1) * (1 - p(1)) + p(2) * (1 - p(2)) \\
&= 0.5 * (1 - 0.5) + 0.5 * (1 - 0.5) \\
&= \boxed{0.5} \\
\end{aligned}
$$

which matches with what we calculated!

### Example 2: A Perfect Split

Let's go back to the perfect split we had. What are the Gini Impurities of the two groups after the split?

![](/media/gini-impurity-post/dataset-perfect-split.svg)

Left Group has only blues, so its Gini Impurity is

$$
G_{left} = 1 * (1 - 1) + 0 * (1 - 0) = \boxed{0}
$$

Right Group has only greens, so its Gini Impurity is

$$
G_{right} = 0 * (1 - 0) + 1 * (1 - 1) = \boxed{0}
$$

Both groups have $0$ impurity! The perfect split turned a dataset with $0.5$ impurity into 2 groups with $0$ impurity.

**A Gini Impurity of 0 is the lowest and best possible impurity**. It can only be achieved when everything is the same class (e.g. only blues or only greens).

### Example 3: An Imperfect Split

Finally, let's go back to our imperfect split.

![](/media/gini-impurity-post/dataset-imperfect-split.svg)

Left Group has only blues, so we know that $G_{left} = \boxed{0}$.

Right Group has 1 blue and 5 greens, so

$$
\begin{aligned}
G_{right} &= \frac{1}{6} * (1 - \frac{1}{6}) + \frac{5}{6} * (1 - \frac{5}{6}) \\
&= \frac{5}{18} \\
&= \boxed{0.278} \\
\end{aligned}
$$

## Gini Gain



