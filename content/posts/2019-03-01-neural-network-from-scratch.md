---
title: "Machine Learning for Beginners: Building a Neural Network from Scratch in Python"
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
description: An introduction to what neural networks are and how they work.
prev: "/blog/better-profanity-detection-with-scikit-learn/"
next: "/blog/better-profanity-detection-with-scikit-learn/"
---

Here's something that might surprise you: **neural networks aren't that complicated!** The term "neural network" gets used as a buzzword a lot, but in reality they're often much simpler than people imagine.

**This post is intended for complete beginners and assumes ZERO prior knowledge of machine learning**. We'll walk through what a neural network is, understand how they work, and then implement one from scratch.

Let's get started!

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
3 things are happening here. First, each input is multiplied by a weight $w$: <span class="inline-square" style="background-color: rgb(200, 0, 0);"></span>
$$
x_1 \rightarrow x_1 * w_1
$$
$$
x_2 \rightarrow x_2 * w_2
$$

Next, all the weighted inputs are added together with a bias $b$: <span class="inline-square" style="background-color: #0f9640;"></span>
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

### A Simple Example
Assume we have a 2-input neuron that uses the sigmoid activation function and has the following parameters:

$$
w = [0, 1]
$$
$$
b = 4
$$

$w = [0, 1]$ is just a way of writing $w_1 = 0, w_2 = 1$ in vector form. Now, let's give the neuron an input of $x = [2, 3]$. We'll use the [dot product](https://simple.wikipedia.org/wiki/Dot_product) to write things more concisely:

$$
\begin{aligned}
(w \cdot x) + b &= ((w_1 * x_1) + (w_2 * x_2)) + b \\
&= 0 * 2 + 1 * 3 + 4 \\
&= 7 \\
\end{aligned}
$$
$$
y = f(w \cdot x + b) = f(7) = \boxed{0.999}
$$

The neuron outputs $0.999$ given the inputs $x = [2, 3]$. That's it! The process of passing inputs through the neuron to get an output is known as **feedforward**.

### Coding a Neuron

Let's write some code to implement a neuron. We'll use [NumPy](http://www.numpy.org/), a popular and powerful computing library for Python, to help us do math.

```python
import numpy as np

def sigmoid(x):
  # Our activation function: f(x) = 1 / (1 + e^(-x))
  return 1 / (1 + np.exp(-x))

class Neuron:
  def __init__(self, weights, bias):
    self.weights = weights
    self.bias = bias

  def feedforward(self, inputs):
    # Weight inputs, add bias, then use the activation function
    total = np.dot(self.weights, inputs) + self.bias
    return sigmoid(total)

weights = np.array([0, 1]) # w1 = 0, w2 = 1
bias = 4                   # b = 0
n = Neuron(weights, bias)

x = np.array([2, 3])       # x1 = 2, x2 = 3
print(n.feedforward(x))    # 0.9990889488055994
```

Recognize those numbers? That's the example we just did! We get the same answer of $0.999$.

## 2. Combining Neurons into a Neural Network

A neural network is nothing more than a bunch of neurons connected together. Here's what a simple neural network might look like:

![](/media/neural-network-post/network.svg)

This network has 2 inputs, a hidden layer with 2 neurons ($h_1$ and $h_2$), and an output layer with 1 neuron ($o_1$). Notice that the inputs for $o_1$ are the outputs from $h_1$ and $h_2$! That's what makes this a network.

### An Example: Feedfoward

Let's use the network pictured above and assume all neurons have the same weights $w = [0, 1]$, the same bias $b = 0$, and the same sigmoid activation function. Let $h_1, h_2, o_1$ denote the _outputs_ of the neurons they represent.

What happens if we pass in the input $x = [2, 3]$?

$$
\begin{aligned}
h_1 = h_2 &= f(w \cdot x + b) \\
&= f((0 * 2) + (1 * 3) + 0) \\
&= f(3) \\
&= 0.95257 \\
\end{aligned}
$$
$$
\begin{aligned}
o_1 &= f(w \cdot [h_1, h_2] + b) \\
&= f((0 * h_1) + (1 * h_2) + 0) \\
&= f(0.95257) \\
&= \boxed{0.7216} \\
\end{aligned}
$$

The output of the neural network for input $x = [2, 3]$ is $0.7216$. Pretty simple, right?

A neural network can have **any number of layers** with **any number of neurons** in those layers. The basic idea stays the same: feed the input(s) forward through the neurons in the network to get the output(s) at the end. For simplicity, we'll keep using the simple network pictured above for the rest of this post.

### Coding a Neural Network: Feedforward

Let's implement feedforward for our neural network. I'm including the image of the network again for reference:

![](/media/neural-network-post/network.svg)

```python
import numpy as np

# ... code from previous section here

class OurNeuralNetwork:
  '''
  A neural network with:
    - 2 inputs
    - a hidden layer with 2 neurons (h1, h2)
    - an output layer with 1 neuron (o1)
  Each neuron has the same weights and bias:
    - w = [0, 1]
    - b = 0
  '''
  def __init__(self):
    weights = np.array([0, 1])
    bias = 0

    # The Neuron class here is from the previous section
    self.h1 = Neuron(weights, bias)
    self.h2 = Neuron(weights, bias)
    self.o1 = Neuron(weights, bias)

  def feedforward(self, x):
    out_h1 = self.h1.feedforward(x)
    out_h2 = self.h2.feedforward(x)

    # The inputs for o1 are the outputs from h1 and h2
    out_o1 = self.o1.feedforward(np.array([out_h1, out_h2]))

    return out_o1

network = OurNeuralNetwork()
x = np.array([2, 3])
print(network.feedforward(x)) # 0.7216325609518421
```

We got $0.7216$ again! Looks like it works.

## 3. Evaluating a Neural Network

Let's say we had a couple human body measurements:

| Name | Weight (pounds) | Height (inches) | Gender |
| ---- | --------------- | --------------- | ------ |
| Alice | 120 | 63 | 1 |
| Bob | 155 | 69 | 0 |
| Charlie | 175 | 71 | 0 |
| Diana | 135 | 65 | 1 |
<figcaption>We're representing Male with a 0 and Female with a 1.</figcaption>

Let's train our network to predict someone's gender given their weight and height:

![](/media/neural-network-post/network2.svg)

### Loss

Before we train our network, we first need a way to quantify how "good" it's doing so that it can try to do "better". That's what the **loss** is.

We'll use the **mean squared error** (MSE) loss:

$$
\text{MSE} = \frac{1}{n} \sum_{i=1}^n (y_{true} - y_{pred})^2
$$

Let's break this down:

- $n$ is the number of samples, which is $4$ (Alice, Bob, Charlie, Diana).
- $y$ represents the variable being predicted, which is Gender.
- $y_{true}$ is the _true_ value of the variable (the "correct answer"). For example, $y_{true}$ for Alice would be $1$, which represents Female.
- $y_{pred}$ is the _predicted_ value of the variable. It's whatever our network outputs.

$(y_{true} - y_{pred})^2$ is known as the **squared error**. Our loss function is simply taking the average over all squared errors (hence the name _mean_ squared error). The better our predictions are, the lower our loss will be!

Better predictions = Lower loss.

**Training a network = trying to minimize its loss.**

### An Example Loss Calculation

Let's say our network outputs $0$ for every person - in other words, it's confident everyone is male. What would our loss be?

| Name | $y_{true}$ | $y_{pred}$ | $(y_{true} - y_{pred})^2$ |
| ---- | --------------- | --------------- | ------ |
| Alice | 1 | 0 | 1 |
| Bob | 0 | 0 | 0 |
| Charlie | 0 | 0 | 0 |
| Diana | 1 | 0 | 1 |

$$
\text{MSE} = \frac{1}{4} (1 + 0 + 0 + 1) = \boxed{0.5}
$$

### Code: MSE Loss

Let's throw together some code to calculate loss for us:

```python
import numpy as np

def mse_loss(y_true, y_pred):
  # y_true and y_pred are numpy arrays of the same length.
  return ((y_true - y_pred) ** 2).mean()

# [Alice, Bob, Charlie, Diana]
y_true = np.array([1, 0, 0, 1])
y_pred = np.array([0, 0, 0, 0])

print(mse_loss(y_true, y_pred)) # 0.5
```
<figcaption>If you don't understand why this code works, read the NumPy <a href="https://docs.scipy.org/doc/numpy/user/quickstart.html#basic-operations" target="_blank">quickstart</a> on array operations.</figcaption>

Nice. Onwards!

## 4. Training a Neural Network

