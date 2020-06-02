---
title: "An Introduction to Recurrent Neural Networks for Beginners"
date: "2019-07-24T12:00:00.000Z"
template: "post"
usesKatex: true
draft: false
slug: "/blog/intro-to-rnns/"
img: "https://victorzhou.com/media/rnn-post/bptt.png"
isML: true
category: "Machine Learning"
tags:
  - "Machine Learning"
  - "Neural Networks"
  - "Natural Language Processing"
  - "Python"
  - "For Beginners"
description: A simple walkthrough of what RNNs are, how they work, and how to build one from scratch in Python.
prev: "/blog/intro-to-cnns-part-1/"
next: "/blog/intro-to-random-forests/"
discussLinkTwitter: https://twitter.com/victorczhou/status/1154055678518054912?s=20
discussLinkHN: https://news.ycombinator.com/item?id=20524543
popularity: 30
---

Recurrent Neural Networks (RNNs) are a kind of neural network that specialize in processing **sequences**. They're often used in [Natural Language Processing](/tag/natural-language-processing) (NLP) tasks because of their effectiveness in handling text. In this post, we'll **explore what RNNs are, understand how they work, and build a real one from scratch** (using only [numpy](https://www.numpy.org/)) in Python.

**This post assumes a basic knowledge of neural networks**. My [introduction to Neural Networks](/blog/intro-to-neural-networks/) covers everything you'll need to know, so I'd recommend reading that first.

Let's get into it!

## 1. The Why

One issue with vanilla neural nets (and also [CNNs](/blog/intro-to-cnns-part-1/)) is that they only work with pre-determined sizes: they take **fixed-size inputs** and produce **fixed-size outputs**. RNNs are useful because they let us have **variable-length sequences** as both inputs and outputs. Here are a few examples of what RNNs can look like:

![](./media-link/rnn-post/rnns.jpeg)
<figcaption>Inputs are red, the RNN itself is green, and outputs are blue. Source: <a href="http://karpathy.github.io/2015/05/21/rnn-effectiveness/" target="_blank" rel="nofollow">Andrej Karpathy</a></figcaption>

 This ability to process sequences makes RNNs very useful. For example:

- **Machine Translation** (e.g. Google Translate) is done with "many to many" RNNs. The original text sequence is fed into an RNN, which then produces translated text as output.
- **Sentiment Analysis** (e.g. _Is this a positive or negative review?_) is often done with "many to one" RNNs. The text to be analyzed is fed into an RNN, which then produces a single output classification (e.g. _This is a positive review_).

Later in this post, we'll build a "many to one" RNN from scratch to perform basic Sentiment Analysis.

## 2. The How

Let's consider a "many to many" RNN with inputs $x_0, x_1, \ldots x_n$ that wants to produce outputs $y_0, y_1, \ldots y_n$. These $x_i$ and $y_i$ are **vectors** and can have arbitrary dimensions.

RNNs work by iteratively updating a hidden state $h$, which is a vector that can also have arbitrary dimension. At any given step $t$,

1. The next hidden state $h_t$ is calculated using the previous hidden state $h_{t-1}$ and the next input $x_t$.
2. The next output $y_t$ is calculated using $h_t$.

![A many to many RNN](/media/rnn-post/many-to-many.svg)

Here's what makes a RNN _recurrent_: **it uses the same weights for each step**. More specifically, a typical vanilla RNN uses only 3 sets of weights to perform its calculations:

<style>
.red-arrow {
  color: #c8281eff;
}
.blue-arrow {
  color: #2850c8ff;
}
.green-arrow {
  color: #466e32ff;
}
</style>

- $W_{xh}$, used for all $x_t$ <span class="red-arrow">→</span> $h_t$ links.
- $W_{hh}$, used for all $h_{t-1}$ <span class="green-arrow">→</span> $h_t$ links.
- $W_{hy}$, used for all $h_t$ <span class="blue-arrow">→</span> $y_t$ links.

We'll also use two biases for our RNN:

- $b_h$, added when calculating $h_t$.
- $b_y$, added when calculating $y_t$.

We'll represent the weights as <i>matrices</i> and the biases as <i>vectors</i>. These 3 weights and 2 biases make up the entire RNN!

**Here are the equations that put everything together:**

$$
h_t = \tanh (W_{xh} x_t + W_{hh} h_{t-1} + b_h)
$$
$$
y_t = W_{hy} h_t + b_y
$$
<figcaption>Don't skim over these equations. Stop and stare at this for a minute. Also, remember that the weights are <i>matrices</i> and the other variables are <i>vectors</i>.</figcaption>

All the weights are applied using matrix multiplication, and the biases are added to the resulting products. We then use [tanh](https://en.wikipedia.org/wiki/Hyperbolic_function) as an activation function for the first equation (but other activations like [sigmoid](https://en.wikipedia.org/wiki/Sigmoid_function) can also be used).

> No idea what an activation function is? Read my [introduction to Neural Networks](/blog/intro-to-neural-networks/) like I mentioned. Seriously.

## 3. The Problem

Let's get our hands dirty! We'll implement an RNN from scratch to perform a simple Sentiment Analysis task: **determining whether a given text string is positive or negative.**

Here are a few samples from the small [dataset](https://github.com/vzhou842/rnn-from-scratch/blob/master/data.py) I put together for this post:

| Text | Positive? |
| --- | --- |
| i am good | <span class="checkmark">✓</span> |
| i am bad | ❌ |
| this is very good | <span class="checkmark">✓</span> |
| this is not bad | <span class="checkmark">✓</span> |
| i am bad not good | ❌ |
| i am not at all happy | ❌ |
| this was good earlier | <span class="checkmark">✓</span> |
| i am not at all bad or sad right now | <span class="checkmark">✓</span> |

## 4. The Plan

Since this is a classification problem, we'll use a "many to one" RNN. This is similar to the "many to many" RNN we discussed earlier, but it only uses the final hidden state to produce the one output $y$:

![A many to one RNN](/media/rnn-post/many-to-one.svg)

Each $x_i$ will be a vector representing a word from the text. The output $y$ will be a vector containing two numbers, one representing positive and the other negative. We'll apply [Softmax](/blog/softmax/) to turn those values into probabilities and ultimately decide between positive / negative.

Let's start building our RNN!

## 5. The Pre-Processing

The [dataset](https://github.com/vzhou842/rnn-from-scratch/blob/master/data.py) I mentioned earlier consists of two Python dictionaries:

```python
# Header: data.py
train_data = {
  'good': True,
  'bad': False,
  # ... more data
}

test_data = {
  'this is happy': True,
  'i am good': True,
  # ... more data
}
```
<figcaption>True = Positive, False = Negative</figcaption>

We'll have to do some pre-processing to get the data into a usable format. To start, we'll construct a **vocabulary** of all words that exist in our data:

```python
# Header: main.py
from data import train_data, test_data

# Create the vocabulary.
vocab = list(set([w for text in train_data.keys() for w in text.split(' ')]))
vocab_size = len(vocab)
print('%d unique words found' % vocab_size) # 18 unique words found
```

`vocab` now holds a list of all words that appear in at least one training text. Next, we'll **assign an integer index** to represent each word in our vocab.

```python
# Header: main.py
# Assign indices to each word.
word_to_idx = { w: i for i, w in enumerate(vocab) }
idx_to_word = { i: w for i, w in enumerate(vocab) }
print(word_to_idx['good']) # 16 (this may change)
print(idx_to_word[0]) # sad (this may change)
```

We can now represent any given word with its corresponding integer index! This is necessary because RNNs can't understand words - we have to give them numbers.

Finally, recall that each input $x_i$ to our RNN is a _vector_. We'll use **[one-hot](/blog/one-hot/) vectors**, which contain all zeros except for a single one. The "one" in each one-hot vector will be **at the word's corresponding integer index.**

Since we have 18 unique words in our vocabulary, each $x_i$ will be a 18-dimensional one-hot vector.

```python
# Header: main.py
import numpy as np

def createInputs(text):
  '''
  Returns an array of one-hot vectors representing the words
  in the input text string.
  - text is a string
  - Each one-hot vector has shape (vocab_size, 1)
  '''
  inputs = []
  for w in text.split(' '):
    v = np.zeros((vocab_size, 1))
    v[word_to_idx[w]] = 1
    inputs.append(v)
  return inputs
```

We'll use `python›createInputs()` later to create vector inputs to pass in to our RNN.

## 6. The Forward Phase

It's time to start implementing our RNN! We'll start by initializing the 3 weights and 2 biases our RNN needs:

```python
# Header: rnn.py
import numpy as np
from numpy.random import randn

class RNN:
  # A Vanilla Recurrent Neural Network.

  def __init__(self, input_size, output_size, hidden_size=64):
    # Weights
    self.Whh = randn(hidden_size, hidden_size) / 1000
    self.Wxh = randn(hidden_size, input_size) / 1000
    self.Why = randn(output_size, hidden_size) / 1000

    # Biases
    self.bh = np.zeros((hidden_size, 1))
    self.by = np.zeros((output_size, 1))
```
<figcaption>Note: We're dividing by 1000 to reduce the initial variance of our weights. This is not the best way to initialize weights, but it's simple and works for this post.</figcaption>

We use [np.random.randn()](https://docs.scipy.org/doc/numpy/reference/generated/numpy.random.randn.html) to initialize our weights from the standard normal distribution.

Next, let's implement our RNN's forward pass. Remember these two equations we saw earlier?

$$
h_t = \tanh (W_{xh} x_t + W_{hh} h_{t-1} + b_h)
$$
$$
y_t = W_{hy} h_t + b_y
$$

Here are those same equations put into code:

```python
# Header: rnn.py
class RNN:
  # ...

  def forward(self, inputs):
    '''
    Perform a forward pass of the RNN using the given inputs.
    Returns the final output and hidden state.
    - inputs is an array of one-hot vectors with shape (input_size, 1).
    '''
    h = np.zeros((self.Whh.shape[0], 1))

    # Perform each step of the RNN
    for i, x in enumerate(inputs):
      h = np.tanh(self.Wxh @ x + self.Whh @ h + self.bh)

    # Compute the output
    y = self.Why @ h + self.by

    return y, h
```

Pretty simple, right? Note that we initialized $h$ to the zero vector for the first step, since there's no previous $h$ we can use at that point.

Let's try it out:

```python
# Header: main.py
# ...

def softmax(xs):
  # Applies the Softmax Function to the input array.
  return np.exp(xs) / sum(np.exp(xs))

# Initialize our RNN!
rnn = RNN(vocab_size, 2)

inputs = createInputs('i am very good')
out, h = rnn.forward(inputs)
probs = softmax(out)
print(probs) # [[0.50000095], [0.49999905]]
```
<figcaption>If you need a refresher on Softmax, read my <a href="/blog/softmax/">quick explanation of Softmax</a>.</figcaption>

Our RNN works, but it's not very useful yet. Let's change that...

> Liking this introduction so far? [Subscribe to my newsletter](/subscribe/?src=intro-to-rnns) to get notified about new Machine Learning posts like this one.

## 7. The Backward Phase

In order to train our RNN, we first need a loss function. We'll use **cross-entropy loss**, which is often paired with Softmax. Here's how we calculate it:

$$
L = -\ln (p_c)
$$

where $p_c$ is our RNN's predicted probability for the _correct_ class (positive or negative). For example, if a positive text is predicted to be 90% positive by our RNN, the loss is:

$$
L = -\ln(0.90) = 0.105
$$

> Want a longer explanation? Read the [Cross-Entropy Loss](/blog/intro-to-cnns-part-1/#52-cross-entropy-loss) section of my introduction to Convolutional Neural Networks (CNNs).

Now that we have a loss, we'll train our RNN using gradient descent to minimize loss. That means it's time to derive some gradients!

⚠️ **The following section assumes a basic knowledge of multivariable calculus**. You can skip it if you want, but I recommend giving it a skim even if you don't understand much. **We'll incrementally write code as we derive results**, and even a surface-level understanding can be helpful.

> If you want some extra background for this section, I recommend first reading the [Training a Neural Network](/blog/intro-to-neural-networks/#3-training-a-neural-network-part-1) section of my introduction to Neural Networks. Also, all of the code for this post is on [Github](https://github.com/vzhou842/rnn-from-scratch), so you can follow along there if you'd like.

Ready? Here we go.

### 7.1 Definitions

First, some definitions:

- Let $y$ represent the raw outputs from our RNN.
- Let $p$ represent the final probabilities: $p = \text{softmax}(y)$.
- Let $c$ refer to the true label of a certain text sample, a.k.a. the "correct" class.
- Let $L$ be the cross-entropy loss: $L = -\ln(p_c)$.
- Let $W_{xh}$, $W_{hh}$, and $W_{hy}$ be the 3 weight matrices in our RNN.
- Let $b_h$ and $b_y$ be the 2 bias vectors in our RNN.

### 7.2 Setup

Next, we need to edit our forward phase to cache some data for use in the backward phase. While we're at it, we'll also setup the skeleton for our backwards phase. Here's what that looks like:

```python
# Header: rnn.py
class RNN:
  # ...

  def forward(self, inputs):
    '''
    Perform a forward pass of the RNN using the given inputs.
    Returns the final output and hidden state.
    - inputs is an array of one-hot vectors with shape (input_size, 1).
    '''
    h = np.zeros((self.Whh.shape[0], 1))

    # highlight-start
    self.last_inputs = inputs
    self.last_hs = { 0: h }
    # highlight-end

    # Perform each step of the RNN
    for i, x in enumerate(inputs):
      h = np.tanh(self.Wxh @ x + self.Whh @ h + self.bh)
      self.last_hs[i + 1] = h # highlight-line

    # Compute the output
    y = self.Why @ h + self.by

    return y, h

# highlight-start
  def backprop(self, d_y, learn_rate=2e-2):
    '''
    Perform a backward pass of the RNN.
    - d_y (dL/dy) has shape (output_size, 1).
    - learn_rate is a float.
    '''
    pass
# highlight-end
```

> Curious about why we're doing this caching? Read my explanation in the [Training Overview](/blog/intro-to-cnns-part-2/#2-training-overview) of my introduction to CNNs, in which we do the same thing.

### 7.3 Gradients

It's math time! We'll start by calculating $\frac{\partial L}{\partial y}$. We know:

$$
L = -\ln(p_c) = -\ln(\text{softmax}(y_c))
$$

I'll leave the actual derivation of $\frac{\partial L}{\partial y}$ using the Chain Rule as an exercise for you 😉, but the result comes out really nice:

$$
\frac{\partial L}{\partial y_i} =
\begin{cases}
    p_i & \text{if $i \neq c$} \\
    p_i - 1 & \text{if $i = c$} \\
\end{cases}
$$

For example, if we have $p = [0.2, 0.2, 0.6]$ and the correct class is $c = 0$, then we'd get $\frac{\partial L}{\partial y} = [-0.8, 0.2, 0.6]$. This is also quite easy to turn into code:

```python
# Header: main.py
# Loop over each training example
for x, y in train_data.items():
  inputs = createInputs(x)
  target = int(y)

  # Forward
  out, _ = rnn.forward(inputs)
  probs = softmax(out)

  # Build dL/dy
  # highlight-start
  d_L_d_y = probs
  d_L_d_y[target] -= 1
  # highlight-end

  # Backward
  rnn.backprop(d_L_d_y) # highlight-line
```

Nice. Next up, let's take a crack at gradients for $W_{hy}$ and $b_y$, which are only used to turn the final hidden state into the RNN's output. We have:

$$
\frac{\partial L}{\partial W_{hy}} = \frac{\partial L}{\partial y} * \frac{\partial y}{\partial W_{hy}}
$$

$$
y = W_{hy} h_n + b_y
$$

where $h_n$ is the final hidden state. Thus,

$$
\frac{\partial y}{\partial W_{hy}} = h_n
$$
$$
\frac{\partial L}{\partial W_{hy}} = \boxed{\frac{\partial L}{\partial y} h_n}
$$

Similarly,

$$
\frac{\partial y}{\partial b_y} = 1
$$
$$
\frac{\partial L}{\partial b_y} = \boxed{\frac{\partial L}{\partial y}}
$$

We can now start implementing `python›backprop()`!

```python
# Header: rnn.py
class RNN:
  # ...

  def backprop(self, d_y, learn_rate=2e-2):
    '''
    Perform a backward pass of the RNN.
    - d_y (dL/dy) has shape (output_size, 1).
    - learn_rate is a float.
    '''
    n = len(self.last_inputs)

    # Calculate dL/dWhy and dL/dby.
    # highlight-start
    d_Why = d_y @ self.last_hs[n].T
    d_by = d_y
    # highlight-end
```

> Reminder: We created `python›self.last_hs` in `python›forward()` earlier.

Finally, we need the gradients for $W_{hh}$, $W_{xh}$, and $b_h$, which are used _every_ step during the RNN. We have:

$$
\frac{\partial L}{\partial W_{xh}} = \frac{\partial L}{\partial y} \sum_t \frac{\partial y}{\partial h_t} * \frac{\partial h_t}{\partial W_{xh}}
$$

because changing $W_{xh}$ affects _every_ $h_t$, which all affect $y$ and ultimately $L$. In order to fully calculate the gradient of $W_{xh}$, we'll need to backpropagate through _all_ timesteps, which is known as **Backpropagation Through Time** (BPTT):

![Backpropagation Through Time](/media/rnn-post/bptt.svg)

$W_{xh}$ is used for all $x_t$ <span class="red-arrow">→</span> $h_t$ forward links, so we have to backpropagate back to each of those links.

Once we arrive at a given step $t$, we need to calculate $\frac{\partial h_t}{\partial W_{xh}}$:

$$
h_t = \tanh (W_{xh} x_t + W_{hh} h_{t-1} + b_h)
$$

The derivative of $\tanh$ is well-known:

$$
\frac{d \tanh(x)}{dx} = 1 - \tanh^2(x)
$$

We use Chain Rule like usual:

$$
\frac{\partial h_t}{\partial W_{xh}} = \boxed{(1 - h_t^2) x_t}
$$

Similarly,

$$
\frac{\partial h_t}{\partial W_{hh}} = \boxed{(1 - h_t^2) h_{t-1}}
$$

$$
\frac{\partial h_t}{\partial b_h} = \boxed{(1 - h_t^2)}
$$

The last thing we need is $\frac{\partial y}{\partial h_t}$. We can calculate this recursively:

$$
\begin{aligned}
\frac{\partial y}{\partial h_t} &= \frac{\partial y}{\partial h_{t+1}} * \frac{\partial h_{t+1}}{\partial h_t} \\
&= \frac{\partial y}{\partial h_{t+1}} (1 - h_t^2) W_{hh} \\
\end{aligned}
$$

We'll implement BPTT starting from the last hidden state and working backwards, so we'll already have $\frac{\partial y}{\partial h_{t+1}}$ by the time we want to calculate $\frac{\partial y}{\partial h_t}$! The exception is the last hidden state, $h_n$:

$$
\frac{\partial y}{\partial h_n} = W_{hy}
$$

We now have everything we need to finally implement BPTT and finish `python›backprop()`:

```python
# Header: rnn.py
class RNN:
  # ...

  def backprop(self, d_y, learn_rate=2e-2):
    '''
    Perform a backward pass of the RNN.
    - d_y (dL/dy) has shape (output_size, 1).
    - learn_rate is a float.
    '''
    n = len(self.last_inputs)

    # Calculate dL/dWhy and dL/dby.
    d_Why = d_y @ self.last_hs[n].T
    d_by = d_y

    # Initialize dL/dWhh, dL/dWxh, and dL/dbh to zero.
    d_Whh = np.zeros(self.Whh.shape)
    d_Wxh = np.zeros(self.Wxh.shape)
    d_bh = np.zeros(self.bh.shape)

    # Calculate dL/dh for the last h.
    d_h = self.Why.T @ d_y

    # Backpropagate through time.
    for t in reversed(range(n)):
      # An intermediate value: dL/dh * (1 - h^2)
      temp = ((1 - self.last_hs[t + 1] ** 2) * d_h)

      # dL/db = dL/dh * (1 - h^2)
      d_bh += temp # highlight-line

      # dL/dWhh = dL/dh * (1 - h^2) * h_{t-1}
      d_Whh += temp @ self.last_hs[t].T # highlight-line

      # dL/dWxh = dL/dh * (1 - h^2) * x
      d_Wxh += temp @ self.last_inputs[t].T # highlight-line

      # Next dL/dh = dL/dh * (1 - h^2) * Whh
      d_h = self.Whh @ temp

    # Clip to prevent exploding gradients.
    for d in [d_Wxh, d_Whh, d_Why, d_bh, d_by]:
      np.clip(d, -1, 1, out=d)

    # Update weights and biases using gradient descent.
    self.Whh -= learn_rate * d_Whh
    self.Wxh -= learn_rate * d_Wxh
    self.Why -= learn_rate * d_Why
    self.bh -= learn_rate * d_bh
    self.by -= learn_rate * d_by
```

A few things to note:

- We've merged $\frac{\partial L}{\partial y} * \frac{\partial y}{\partial h}$ into $\frac{\partial L}{\partial h}$ for convenience.
- We're constantly updating a `d_h` variable that holds the most recent $\frac{\partial L}{\partial h_{t+1}}$, which we need to calculate $\frac{\partial L}{\partial h_t}$.
- After finishing BPTT, we [np.clip()](https://docs.scipy.org/doc/numpy/reference/generated/numpy.clip.html) gradient values that are below -1 or above 1. This helps mitigate the **exploding gradient** problem, which is when gradients become very large due to having lots of multiplied terms. [Exploding or vanishing gradients](https://en.wikipedia.org/wiki/Vanishing_gradient_problem) are quite problematic for vanilla RNNs - more complex RNNs like [LSTMs](https://en.wikipedia.org/wiki/Long_short-term_memory) are generally better-equipped to handle them.
- Once all gradients are calculated, we update weights and biases using **gradient descent**.

We've done it! Our RNN is complete.

## 8. The Culmination

It's finally the moment we been waiting for - let's test our RNN!

First, we'll write a helper function to process data with our RNN:

```python
# Header: main.py
import random

def processData(data, backprop=True):
  '''
  Returns the RNN's loss and accuracy for the given data.
  - data is a dictionary mapping text to True or False.
  - backprop determines if the backward phase should be run.
  '''
  items = list(data.items())
  random.shuffle(items)

  loss = 0
  num_correct = 0

  for x, y in items:
    inputs = createInputs(x)
    target = int(y)

    # Forward
    out, _ = rnn.forward(inputs)
    probs = softmax(out)

    # Calculate loss / accuracy
    loss -= np.log(probs[target])
    num_correct += int(np.argmax(probs) == target)

    if backprop:
      # Build dL/dy
      d_L_d_y = probs
      d_L_d_y[target] -= 1

      # Backward
      rnn.backprop(d_L_d_y)

  return loss / len(data), num_correct / len(data)
```

Now, we can write the training loop:

```python
# Header: main.py
# Training loop
for epoch in range(1000):
  train_loss, train_acc = processData(train_data)

  if epoch % 100 == 99:
    print('--- Epoch %d' % (epoch + 1))
    print('Train:\tLoss %.3f | Accuracy: %.3f' % (train_loss, train_acc))

    test_loss, test_acc = processData(test_data, backprop=False)
    print('Test:\tLoss %.3f | Accuracy: %.3f' % (test_loss, test_acc))
```

Running `main.py` should output something like this:

```
--- Epoch 100
Train:  Loss 0.688 | Accuracy: 0.517
Test:   Loss 0.700 | Accuracy: 0.500
--- Epoch 200
Train:  Loss 0.680 | Accuracy: 0.552
Test:   Loss 0.717 | Accuracy: 0.450
--- Epoch 300
Train:  Loss 0.593 | Accuracy: 0.655
Test:   Loss 0.657 | Accuracy: 0.650
--- Epoch 400
Train:  Loss 0.401 | Accuracy: 0.810
Test:   Loss 0.689 | Accuracy: 0.650
--- Epoch 500
Train:  Loss 0.312 | Accuracy: 0.862
Test:   Loss 0.693 | Accuracy: 0.550
--- Epoch 600
Train:  Loss 0.148 | Accuracy: 0.914
Test:   Loss 0.404 | Accuracy: 0.800
--- Epoch 700
Train:  Loss 0.008 | Accuracy: 1.000
Test:   Loss 0.016 | Accuracy: 1.000
--- Epoch 800
Train:  Loss 0.004 | Accuracy: 1.000
Test:   Loss 0.007 | Accuracy: 1.000
--- Epoch 900
Train:  Loss 0.002 | Accuracy: 1.000
Test:   Loss 0.004 | Accuracy: 1.000
--- Epoch 1000
Train:  Loss 0.002 | Accuracy: 1.000
Test:   Loss 0.003 | Accuracy: 1.000
```

Not bad from a RNN we built ourselves. 💯

**Want to try or tinker with this code yourself? [Run this RNN in your browser](https://repl.it/@vzhou842/A-RNN-from-scratch).** It's also available on [Github](https://github.com/vzhou842/rnn-from-scratch).

## 9. The End

That's it! In this post, we completed a walkthrough of Recurrent Neural Networks, including what they are, how they work, why they're useful, how to train them, and how to implement one. There's still much more you can do, though:

- Learn about [Long short-term memory](http://www.datastuff.tech/machine-learning/lstm-how-to-train-neural-networks-to-write-like-lovecraft/) networks, a more powerful and popular RNN architecture, or about [Gated Recurrent Units](https://en.wikipedia.org/wiki/Gated_recurrent_unit) (GRUs), a well-known variation of the LSTM.
- Experiment with bigger / better RNNs using proper ML libraries like [Tensorflow](https://www.tensorflow.org/), [Keras](https://keras.io/), or [PyTorch](https://pytorch.org/).
- Read the rest of my [Neural Networks from Scratch](/series/neural-networks-from-scratch/) series.
- Read about [Bidirectional RNNs](https://en.wikipedia.org/wiki/Bidirectional_recurrent_neural_networks), which process sequences both forwards and backwards so more information is available to the output layer.
- Try out [Word Embeddings](https://en.wikipedia.org/wiki/Word_embedding) like [GloVe](https://nlp.stanford.edu/projects/glove/) or [Word2Vec](https://en.wikipedia.org/wiki/Word2vec), which can be used to turn words into more useful vector representations.
- Check out the [Natural Language Toolkit](https://www.nltk.org/) (NLTK), a popular Python library for working with human language data.

I write a lot about [Machine Learning](/tag/machine-learning/), so [subscribe to my newsletter](/subscribe/?src=intro-to-rnns) if you're interested in getting future ML content from me.

Thanks for reading!
