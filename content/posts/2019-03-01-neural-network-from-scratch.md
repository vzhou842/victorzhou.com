---
title: ML for Beginners - Building a Neural Network from Scratch in Python
date: "2019-03-01T12:00:00.000Z"
template: "post"
usesKatex: true
draft: false
slug: "/blog/neural-network-from-scratch/"
img: ""
category: "Machine Learning"
tags:
  - "Machine Learning"
  - "Python"
description: "A simple introduction to neural networks."
prev: "/blog/better-profanity-detection-with-scikit-learn/"
next: "/blog/better-profanity-detection-with-scikit-learn/"
---
intro blah blah

## Building Blocks: Neurons

First, we'll start with the basic unit of a neural network: a neuron. At a high level, a neuron just takes some inputs, does some math with them, and produces one output. Here's what a 2 input neuron looks like:

![](/media/neural-network-post/perceptron.svg)

3 things are happening here. First, each input is multiplied by a weight:
$$
x1 \rightarrow x1 \times w1
$$
$$
x2 \rightarrow x2 \times w2
$$

Next, all the weighted inputs are added together with a bias:
$$
(x1 \times w1) + (x2 \times w2) + b
$$

Finally, the sum is passed through an activation function:
$$
y = f(x1 \times w1 + x2 \times w2 + b)
$$

The activation function is used to turn a possibly unbounded input into an output that has a nice, predictable form. A commonly used activation function is the [sigmoid](https://en.wikipedia.org/wiki/Sigmoid_function) function:

![](/media/neural-network-post/sigmoid.png)

The sigmoid function has the nice property that all of its outputs are numbers in the range $[0, 1]$. You can think of it as compressing $[-\infty, +\infty]$ to $[0, 1]$. Huge negative numbers become roughly $0$, and huge positive numbers become roughly $1$.


