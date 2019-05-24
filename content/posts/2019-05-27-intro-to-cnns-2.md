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

In this post, we're going to do a deep-dive on something most introductions to Convolutional Neural Networks (CNNs) lack: **how to train a CNN**, including deriving gradients, implementing backprop _from scratch_ (using only [numpy](https://www.numpy.org/)), and ultimately building a full training pipeline!

**This post assumes a basic knowledge of CNNs**. My [introduction to CNNs](/blog/intro-to-cnns-part-1/) (Part 1 of this series) covers everything you need to know, so I'd highly recommend reading that first. If you're here because you've already read Part 1, welcome back!

**Parts of this post also assume a basic knowledge of multivariable calculus**. You can skip those sections if you want, but I recommend reading them even if you don't understand everything. We'll incrementally write code as we derive results, and even a surface-level understanding can be helpful.

Buckle up! Time to get into it.

## 1. Setting the Stage

We'll pick back up where [Part 1](/blog/intro-to-cnns-part-1/) of this series left off. We were using a CNN to tackle the [MNIST](http://yann.lecun.com/exdb/mnist/) handwritten digit classification problem:

![Sample images from the MNIST dataset](./media-link/cnn-post/mnist-examples.png "Sample images from the MNIST dataset")

Our (simple) CNN consisted of a Conv layer, a Max Pooling layer, and a Softmax layer. Here's that diagram of our CNN again:

![Our CNN takes a 28x28 grayscale MNIST image and outputs 10 probabilities, 1 for each digit.](/media/cnn-post/cnn-dims-3.svg)

We'd written 3 classes, one for each layer: `Conv3x3`, `MaxPool`, and `Softmax`. Each class implemented a `forward()` method that we used to build the forward pass of the CNN:

```python
# Header: cnn.py
conv = Conv3x3(8)                  # 28x28x1 -> 26x26x8
pool = MaxPool2()                  # 26x26x8 -> 13x13x8
softmax = Softmax(13 * 13 * 8, 10) # 13x13x8 -> 10

def forward(image, label):
  '''
  Completes a forward pass of the CNN and calculates the accuracy and
  cross-entropy loss.
  - image is a 2d numpy array
  - label is a digit
  '''
  # We transform the image from [0, 255] to [-0.5, 0.5] to make it easier
  # to work with. This is standard practice.
  out = conv.forward((image / 255) - 0.5)
  out = pool.forward(out)
  out = softmax.forward(out)

  # Calculate cross-entropy loss and accuracy. np.log() is the natural log.
  loss = -np.log(out[label])
  acc = 1 if np.argmax(out) == label else 0

  return out, loss, acc
```

You can **view the code or [run the CNN in your browser](https://repl.it/@vzhou842/A-CNN-from-scratch-Part-1)**. It's also available on [Github](https://github.com/vzhou842/cnn-from-scratch/tree/master).

Here's what the output of our CNN looks like right now:

```
MNIST CNN initialized!
[Step 100] Past 100 steps: Average Loss 2.302 | Accuracy: 11%
[Step 200] Past 100 steps: Average Loss 2.302 | Accuracy: 8%
[Step 300] Past 100 steps: Average Loss 2.302 | Accuracy: 3%
[Step 400] Past 100 steps: Average Loss 2.302 | Accuracy: 12%
```

Obviously, we'd like to do better than 10% accuracy... let's teach this CNN a lesson.

## 2. Training Overview

Training a neural network typically consists of two phases:

1. A **forward** phase, where the input is passed completely through the network.
2. A **backward** phase, where gradients are backpropagated (backprop) and weights are updated.

We'll follow this pattern to train our CNN. There are also two major implementation-specific ideas we'll use:

- During the forward phase, each layer will **cache** any data (like inputs, intermediate values, etc) it'll need for the backward phase. This means that any backward phase must be preceded by a forward phase.
- During the backward phase, each layer will **receive a gradient** and also **return a gradient**. It will receive the gradient of loss with respect to its _outputs_ ($\frac{\partial L}{\partial \text{out}}$) and return the gradient of loss with respect to its _inputs_ ($\frac{\partial L}{\partial \text{in}}$).

These two ideas will help keep our training implementation clean and organized. The best way to see why is probably by looking at code. Training our CNN will ultimately look something like this:

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

See how nice and clean that looks? Now imagine building a network with 50 layers instead of 3 - it's even more valuable then to have good systems in place.

### 2. Backprop: Softmax

We'll start our way from the end and work our way towards the beginning, since that's how backprop works. First, recall the cross-entropy loss:

$$
L = -\ln(p_c)
$$

where $p_c$ is the predicted probability for the correct class $c$.

> Want a longer explanation? Read the [Cross-Entropy Loss](/blog/intro-to-cnns-part-1/#52-cross-entropy-loss) section of Part 1 of my CNNs series.

The first thing we need to calculate is the input to the Softmax layer's backward phase, $\frac{\partial L}{\partial out_s}$. This is pretty easy, since only $p_i$ shows up in the loss equation:

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
