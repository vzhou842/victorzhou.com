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

## 1. Building Blocks: Neurons

First, we'll start with neurons, the basic unit of a neural network. **A neuron takes inputs, does some math with them, and produces one output**. Here's what a 2-input neuron looks like:

![](/media/neural-network-post/perceptron.svg)

<style>
.inline-square {
    margin-left: 5px;
    width: 12px;
    height: 12px;
    display: inline-block;
}
</style>
3 things are happening here. First, each input is multiplied by a weight: <span class="inline-square" style="background-color: rgb(200, 0, 0);"></span>
$$
x_1 \rightarrow x_1 * w_1
$$
$$
x_2 \rightarrow x_2 * w_2
$$

Next, all the weighted inputs are added together with a bias: <span class="inline-square" style="background-color: #0f9640;"></span>
$$
(x_1 * w_1) + (x_2 * w_2) + b
$$

Finally, the sum is passed through an activation function: <span class="inline-square" style="background-color: rgb(255, 150, 0);"></span>
$$
y = f(x_1 * w_1 + x_2 * w_2 + b)
$$

The activation function is used to turn a possibly unbounded input into an output that has a nice, predictable form. A commonly used activation function is the [sigmoid](https://en.wikipedia.org/wiki/Sigmoid_function) function:

![](/media/neural-network-post/sigmoid.png)

The sigmoid function has the nice property that all of its outputs are numbers in the range $[0, 1]$. You can think of it as compressing $[-\infty, +\infty]$ to $[0, 1]$ - huge negative numbers become roughly $0$, and huge positive numbers become roughly $1$.

### A simple example
Assume we have a 2-input neuron that uses the sigmoid activation function and has the following parameters:

$$
w = [0, 1]
$$
$$
b = 4
$$

$w = [0, 1]$ is just a way of writing $w_1 = 0, w_2 = 1$ in vector form. Now, let's give the neuron an input of $x = [2, 3]$. We'll use the [dot product](https://simple.wikipedia.org/wiki/Dot_product) to write $(w_1 * x_1) + (w_2 * x_2)$ more concisely as $w \cdot x$:

$$
\begin{aligned}
w \cdot x + b &= (w_1 * x_1) + (w_2 * x_2) + b \\
&= 0 * 2 + 1 * 3 + 4 \\
&= 7 \\
\end{aligned}
$$
$$
y = f(w \cdot x + b) = f(7) = \boxed{0.999}
$$

The neuron outputs $0.999$ given the inputs $x = [2, 3]$. That's it!

### Coding a Neuron

Let's write some code to do a neuron's computations, also known as _feedforward_. We'll use [NumPy](http://www.numpy.org/), a popular and powerful computing library for Python, to help us do math.

```python
import numpy as np

def sigmoid(x):
  # f(x) = 1 / (1 + e^(-x))
  return 1 / (1 + np.exp(-x))

class Neuron:
  def __init__(self, weights, bias):
    self.weights = weights
    self.bias = bias

  def feedforward(self, inputs):
    total = np.dot(self.weights, inputs) + self.bias
    return sigmoid(total)

weights = np.array([0, 1])
bias = 4
n = Neuron(weights, bias)

x = np.array([2, 3])
print(n.feedforward(x)) # 0.9990889488055994
```

Recognize those numbers? That's the example we just did! We get the same answer of $0.999$.

## 2. Combining Neurons into a Neural Network

A neural network is nothing more than a bunch of neurons connected together. Here's what a simple neural network with 1 hidden layer looks like:
