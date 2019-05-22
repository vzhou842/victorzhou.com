---
title: "CNNs, Part 2: Training a Convolutional Neural Network"
date: "2019-05-27T12:00:00.000Z"
template: "post"
usesKatex: true
draft: false
slug: "/blog/intro-to-cnns-part-2/"
img:
category: "Machine Learning"
tags:
  - "Machine Learning"
  - "Neural Networks"
  - "Computer Vision"
  - "Python"
  - "For Beginners"
description: A simple walkthrough of deriving backpropagation for CNNs and implementing it from scratch in Python.
prev: "/blog/intro-to-cnns-part-1/"
next: "/blog/intro-to-random-forests/"
discussLinkTwitter:
discussLinkHN:
discussLinkReddit:
---

Obviously, we'd like our CNN to do better than 10% accuracy. Luckily, training a CNN is not so different from training any other neural network. Here's how we'll train our CNN to recognize handwritten digits:

- We'll use **backpropagation** (backprop) to efficiently calculate derivatives.
- We'll use [stochastic gradient descent](https://en.wikipedia.org/wiki/Stochastic_gradient_descent) (SGD) as our optimization method.
- We'll use **cross-entropy loss** to evaluate our CNN, as discussed previously.

> If you're not familiar with backprop, SGD, or the concept of loss, I'd recommend reviewing the [Training a Neural Network](/blog/intro-to-neural-networks/#4-training-a-neural-network-part-2) section of my introduction to Neural Networks.

**The following section assumes a basic understanding of backprop, SGD, loss, and multivariable calculus**. You can skip this section if you want, but I recommend reading it even if you don't understand all of it. We'll incrementally write code as we derive results, and it can be valuable to get even a surface-level understanding of how to implement training a CNN.

Buckle up! Let's get into it.

### 1. Training Overview

Training a neural network typically consists of two phases:

1. A **forward** phase, where the input is passed completely through the network.
2. A **backward** phase, where gradients are calculated (backprop!) and weights are updated.

We'll follow this pattern to train our CNN. There are also two major implementation-specific ideas we'll use:

- During the forward phase, each layer will **cache** any data (like inputs, intermediate values, etc) it'll need for the backward phase. This means that any backward phase must be preceded by a forward phase.
- During the backward phase, each layer will **receive a gradient** and also **return a gradient**. It will receive the gradient of loss with respect to its _outputs_ ($\frac{\partial L}{\partial \text{out}}$) and return the gradient of loss with respect to its _inputs_ ($\frac{\partial L}{\partial \text{in}}$).

These two ideas will help keep our training implementation clean and organized. To see why, imagine a network with two layers, A and B, in that order:

- During the forward phase, both layers will cache the data they need, so we don't have to pass in that data again for the backward phase.
- The output of A's forward phase is the input to B's forward phase. Similarly, the output of B's backward phase is the input to A's backward phase!

Looking at code is probably the best way to understand this. Training our CNN will ultimately look something like this:

```python
# Feed forward
out = conv.forward((image / 255) - 0.5)
out = pool.forward(out)
out = softmax.forward(out)

# Calculate initial gradient
gradient = np.zeros(10)
gradient[label] = -1 / out[label]

# Backprop
gradient = softmax.backprop(gradient)
gradient = pool.backprop(gradient)
gradient = conv.backprop(gradient)
```

See how nice and clean that looks? Now imagine building a network with 50 layers instead of 3. See why it's important to have good systems in place?

### 2. Backprop: Softmax

We'll start our way from the end and work our way towards the beginning, since that's how backprop works. First, recall the cross-entropy loss:

$$
L = -\ln(p_c)
$$

where $p_c$ is the predicted probability for the correct class $c$. The first thing we need to calculate is the input to the Softmax layer's backward phase, $\frac{\partial L}{\partial out_s}$. This is pretty easy, since only $p_i$ shows up in the loss equation:

$$
\frac{\partial L}{\partial out_s(i)} =
\begin{cases}
    0 & \text{if $i \neq c$} \\
    -\frac{1}{p_i} & \text{if $i = c$} \\
\end{cases}
$$

That's where this code you saw above comes from:

```python
# Calculate initial gradient
gradient = np.zeros(10)
gradient[label] = -1 / out[label]
```

Now that we have the initial gradient ready, it's time to implement our first backward phase.
