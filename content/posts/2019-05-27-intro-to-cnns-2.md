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

## 3. Backprop: Softmax

We'll start our way from the end and work our way towards the beginning, since that's how backprop works. First, recall the cross-entropy loss:

$$
L = -\ln(p_c)
$$

where $p_c$ is the predicted probability for the correct class $c$ (in other words, what digit our current image _actually_ is).

> Want a longer explanation? Read the [Cross-Entropy Loss](/blog/intro-to-cnns-part-1/#52-cross-entropy-loss) section of Part 1 of my CNNs series.

The first thing we need to calculate is the input to the Softmax layer's backward phase, $\frac{\partial L}{\partial out_s}$, where $out_s$ is the output from the Softmax layer: a vector of 10 probabilities.  This is pretty easy, since only $p_i$ shows up in the loss equation:

$$
\frac{\partial L}{\partial out_s(i)} =
\begin{cases}
    0 & \text{if $i \neq c$} \\
    -\frac{1}{p_i} & \text{if $i = c$} \\
\end{cases}
$$
<figcaption>Reminder: c is the correct class.</figcaption>

That's where this code you saw above comes from:

```python
# Calculate initial gradient
gradient = np.zeros(10)
gradient[label] = -1 / out[label]
```

Now that we have the initial gradient ready, it's time to implement our first backward phase. To start, let's implementing the forward phase caching we discussed earlier:

```python
# Header: softmax.py
class Softmax:
  # ...

  def forward(self, input):
    '''
    Performs a forward pass of the softmax layer using the given input.
    Returns a 1d numpy array containing the respective probability values.
    - input can be any array with any dimensions.
    '''
    self.last_input_shape = input.shape # highlight-line

    input = input.flatten()
    self.last_input = input # highlight-line

    input_len, nodes = self.weights.shape

    totals = np.dot(input, self.weights) + self.biases
    self.last_totals = totals # highlight-line

    exp = np.exp(totals)
    return exp / np.sum(exp, axis=0)
```

We cache 3 things here that will be useful for implementing the backward phase:

- The `input`'s shape _before_ we flatten it.
- The `input` _after_ we flatten it.
- The **totals**, which are the values passed in to the softmax activation.

With that out of the way, we can start deriving the gradients for the backprop phase. We've already derived the input to the Softmax backward phase: $\frac{\partial L}{\partial out_s}$. One fact we can use about $\frac{\partial L}{\partial out_s}$ is that _it's only nonzero for $c$, the correct class_. That means that we can ignore everything but $out_s(c)$!

First, let's calculate the gradient of $out_s(c)$ with respect to the totals (the values passed in to the softmax activation). Let $t_i$ be the total for class $i$. Then we can write $out_s(c)$ as:

$$
out_s(c) = \frac{e^{t_c}}{\sum_i e^{t_i}} = \frac{e^{t_c}}{S}
$$

where $S = \sum_i e^{t_i}$. Now, consider some class $k$ such that $k \neq c$. We can rewrite $out_s(c)$ as:

$$
out_s(c) = e^{t_c} S^{-1}
$$

and use Chain Rule to derive:

$$
\begin{aligned}
\frac{\partial out_s(c)}{\partial t_k} &= -e^{t_c} S^{-2} (\frac{\partial S}{\partial t_k}) \\
&= -e^{t_c} S^{-2} (e^{t_k}) \\
&= \boxed{\frac{-e^{t_c} e^{t_k}}{S^2}} \\
\end{aligned}
$$

Remember, that was assuming $k \neq c$. Now let's do the derivation for $c$, this time using [Quotient Rule](https://en.wikipedia.org/wiki/Quotient_rule):

$$
\begin{aligned}
\frac{\partial out_s(c)}{\partial t_c} &= \frac{S e^{t_c} - e^{t_c} \frac{\partial S}{\partial t_c}}{S^2} \\
&= \frac{Se^{t_c} - e^{t_c}e^{t_c}}{S^2} \\
&= \boxed{\frac{e^{t_c} (S - e^{t_c})}{S^2}} \\
\end{aligned}
$$

Phew. That was the hardest bit of calculus - it gets easier from here! Let's start implementing this:

```python
# Header: softmax.py
class Softmax:
  # ...

  def backprop(self, d_L_d_out):
    # We know only 1 element of d_L_d_out will be nonzero
    for i, gradient in enumerate(d_L_d_out):
      if gradient == 0:
        continue

      # e^totals
      t_exp = np.exp(self.last_totals)

      # Sum of all e^totals
      S = np.sum(t_exp)

      # Gradients of out[i] against totals
      d_out_d_t = -t_exp[i] * t_exp / (S ** 2)
      d_out_d_t[i] = t_exp[i] * (S - t_exp[i]) / (S ** 2)

      # ... to be continued
```

Remember how $\frac{\partial L}{\partial out_s}$ is only nonzero for the correct class, $c$? We start by looking for $c$ by looking for a nonzero gradient in `d_L_d_out`. Once we find that, we calculate the gradient $\frac{\partial out_s(i)}{\partial t}$ (`d_out_d_totals`) using the results we derived above:

$$
\frac{\partial out_s(k)}{\partial t} =
\begin{cases}
    \frac{-e^{t_c} e^{t_k}}{S^2} & \text{if $k \neq c$} \\
    \frac{e^{t_c} (S - e^{t_c})}{S^2} & \text{if $k = c$} \\
\end{cases}
$$

Let's keep going. We ultimately want the gradients of loss against weights, biases, and input:

- We'll use the weights gradient, $\frac{\partial L}{\partial w}$, to update our layer's weights.
- We'll use the biases gradient, $\frac{\partial L}{\partial b}$, to update our layer's biases.
- We'll return the input gradient, $\frac{\partial L}{\partial input}$, from our `backprop()` method so the next layer can use it. This is the return gradient we talked about in the Training Overview section!

To calculate those 3 loss gradients, we first need to derive 3 more results: the gradients of _totals_ against weights, biases, and input. The relevant equation here is:

$$
t = w * input + b
$$

These gradients are easy!

$$
\frac{\partial t}{\partial w} = input
$$
$$
\frac{\partial t}{\partial b} = 1
$$
$$
\frac{\partial t}{\partial input} = w
$$

Putting everything together:

$$
\frac{\partial L}{\partial w} = \frac{\partial L}{\partial out} * \frac{\partial out}{\partial t} * \frac{\partial t}{\partial w}
$$

$$
\frac{\partial L}{\partial b} = \frac{\partial L}{\partial out} * \frac{\partial out}{\partial t} * \frac{\partial t}{\partial b}
$$

$$
\frac{\partial L}{\partial input} = \frac{\partial L}{\partial out} * \frac{\partial out}{\partial t} * \frac{\partial t}{\partial input}
$$

Putting this into code is a little less straightforward:

```python
# Header: softmax.py
class Softmax:
  # ...

  def backprop(self, d_L_d_out):
    # We know only 1 element of d_L_d_out will be nonzero
    for i, gradient in enumerate(d_L_d_out):
      if gradient == 0:
        continue

      # e^totals
      t_exp = np.exp(self.last_totals)

      # Sum of all e^totals
      S = np.sum(t_exp)

      # Gradients of out[i] against totals
      d_out_d_t = -t_exp[i] * t_exp / (S ** 2)
      d_out_d_t[i] = t_exp[i] * (S - t_exp[i]) / (S ** 2)

      # highlight-start
      # Gradients of totals against weights/biases/input
      d_t_d_w = self.last_input
      d_t_d_b = 1
      d_t_d_inputs = self.weights
 
      # Gradients of loss against totals
      d_L_d_t = gradient * d_out_d_t
 
      # Gradients of loss against weights/biases/input
      d_L_d_w = d_t_d_w[np.newaxis].T @ d_L_d_t[np.newaxis]
      d_L_d_b = d_L_d_t * d_t_d_b
      d_L_d_inputs = d_t_d_inputs @ d_L_d_t
      # highlight-end
```

First, we pre-calculate `d_L_d_t` since we'll use it several times. Then, we calculate each gradient:

- **`d_L_d_w`**: We need 2d arrays to do matrix multiplication (`@`), but `d_t_d_w` and `d_L_d_t` are 1d arrays. [np.newaxis](https://docs.scipy.org/doc/numpy-1.13.0/reference/arrays.indexing.html#numpy.newaxis) lets us easily create a new axis of length one, so we end up multiplying matrices with dimensions (`input_len`, 1) and (1, `nodes`). Thus, the final result for `d_L_d_w` will have shape (`input_len`, `nodes`), which is the same as `python›self.weights`!
- **`d_L_d_b`**: This one is straightforward, since `d_t_d_b` is 1.
- **`d_L_d_inputs`**: We multiply matrices with dimensions (`input_len`, `nodes`) and (`nodes`, 1) to get a result with length `input_len`.

> Try working through small examples of the calculations above, especially the matrix multiplications for `d_L_d_w` and `d_L_d_inputs`. That's the best way to understand why this code correctly computes the gradients.

With all the gradients computed, all that's left is to actually train the Softmax layer! We'll update the weights and bias using Stochastic Gradient Descent (SGD) just like we did in my [introduction to Neural Networks](/blog/intro-to-neural-networks/#training-stochastic-gradient-descent) and then return `d_L_d_inputs`:

```python
# Header: softmax.py
class Softmax
  # ...

  def backprop(self, d_L_d_out, learn_rate): # highlight-line
    # We know only 1 element of d_L_d_out will be nonzero
    for i, gradient in enumerate(d_L_d_out):
      if gradient == 0:
        continue

      # e^totals
      t_exp = np.exp(self.last_totals)

      # Sum of all e^totals
      S = np.sum(t_exp)

      # Gradients of out[i] against totals
      d_out_d_t = -t_exp[i] * t_exp / (S ** 2)
      d_out_d_t[i] = t_exp[i] * (S - t_exp[i]) / (S ** 2)

      # Gradients of totals against weights/biases/input
      d_t_d_w = self.last_input
      d_t_d_b = 1
      d_t_d_inputs = self.weights

      # Gradients of loss against totals
      d_L_d_t = gradient * d_out_d_t

      # Gradients of loss against weights/biases/input
      d_L_d_w = d_t_d_w[np.newaxis].T @ d_L_d_t[np.newaxis]
      d_L_d_b = d_L_d_t * d_t_d_b
      d_L_d_inputs = d_t_d_inputs @ d_L_d_t

      # highlight-start
      # Update weights / biases
      self.weights -= learn_rate * d_L_d_w
      self.biases -= learn_rate * d_L_d_b
 
      return d_L_d_inputs.reshape(self.last_input_shape)
      # highlight-end
```

Notice that we added a `learn_rate` parameter that controls how fast we update our weights. Also, we have to `reshape()` before returning `d_L_d_inputs` because we flattened the input during our forward pass:

```python
# Header: softmax.py
class Softmax:
  # ...

  def forward(self, input):
    '''
    Performs a forward pass of the softmax layer using the given input.
    Returns a 1d numpy array containing the respective probability values.
    - input can be any array with any dimensions.
    '''
    self.last_input_shape = input.shape

    input = input.flatten() # highlight-line
    self.last_input = input

    # ...
```

Reshaping to `last_input_shape` ensures that this layer returns gradients for its input in the same format that the input was originally given to it.

### Test Drive: Softmax Backprop

We've finished our first backprop implementation! Let's quickly test it to see if it's any good. We'll start implementing a `python›train()` method in our `cnn.py` file from [Part 1](/blog/intro-to-cnns-part-1/):

```python
# Header: cnn.py
# Imports and setup here
# ...

def forward(image, label):
  # Implementation excluded
  # ...

def train(im, label, lr=.005):
  '''
  Completes a full training step on the given image and label.
  Returns the cross-entropy loss and accuracy.
  - image is a 2d numpy array
  - label is a digit
  - lr is the learning rate
  '''
  # Forward
  out, loss, acc = forward(im, label)

  # Calculate initial gradient
  gradient = np.zeros(10)
  gradient[label] = -1 / out[label]

  # Backprop
  gradient = softmax.backprop(gradient, lr)
  # TODO: backprop MaxPool2 layer
  # TODO: backprop Conv3x3 layer

  return loss, acc

print('MNIST CNN initialized!')

# Train!
loss = 0
num_correct = 0
for i, (im, label) in enumerate(zip(train_images, train_labels)):
  if i > 0 and i % 99 == 0:
    print(
      '[Step %d] Past 100 steps: Average Loss %.3f | Accuracy: %d%%' %
      (i + 1, loss / 100, num_correct)
    )
    loss = 0
    num_correct = 0

  l, acc = train(im, label)
  loss += l
  num_correct += acc
```

Running this gives results similar to:

```
MNIST CNN initialized!
[Step 100] Past 100 steps: Average Loss 2.239 | Accuracy: 18%
[Step 200] Past 100 steps: Average Loss 2.140 | Accuracy: 32%
[Step 300] Past 100 steps: Average Loss 1.998 | Accuracy: 48%
[Step 400] Past 100 steps: Average Loss 1.861 | Accuracy: 59%
[Step 500] Past 100 steps: Average Loss 1.789 | Accuracy: 56%
[Step 600] Past 100 steps: Average Loss 1.809 | Accuracy: 48%
[Step 700] Past 100 steps: Average Loss 1.718 | Accuracy: 63%
[Step 800] Past 100 steps: Average Loss 1.588 | Accuracy: 69%
[Step 900] Past 100 steps: Average Loss 1.509 | Accuracy: 71%
[Step 1000] Past 100 steps: Average Loss 1.481 | Accuracy: 70%
```

The loss is going down and the accuracy is going up - our CNN is already learning!

## 4. Backprop: Max Pooling
