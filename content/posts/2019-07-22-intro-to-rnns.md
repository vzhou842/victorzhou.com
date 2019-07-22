---
title: "An Introduction to Recurrent Neural Networks for Beginners"
date: "2019-07-22T12:00:00.000Z"
template: "post"
usesKatex: true
draft: false
slug: "/blog/intro-to-rnns/"
img:
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
---

Recurrent Neural Networks (RNNs) are a kind of neural network that specialize in processing **sequences**. They're often used in [Natural Language Processing](/tag/natural-language-processing) (NLP) tasks because of their effectiveness in handling text. In this post, we'll build on a basic background knowledge of neural networks and **explore what RNNs are, understand how they work, and build a real one from scratch** (using only [numpy](https://www.numpy.org/)) in Python.

**This post assumes a basic knowledge of neural networks**. My [introduction to Neural Networks](/blog/intro-to-neural-networks/) covers everything you'll need to know, so I'd recommend reading that first.

Let's get into it!

## 1. The Why

One issue with vanilla neural nets (and also [CNNs](/blog/intro-to-cnns-part-1/)) is that they only work with pre-determined sizes: they take **fixed-size inputs** and produce **fixed-size outputs**. RNNs are useful because they let us have **variable-length sequences** both as inputs and outputs. Here are a few examples of what RNNs can look like:

![](./media-link/rnn-post/rnns.jpeg)
<figcaption>Inputs are red, the RNN itself is green, and outputs are blue. Source: <a href="http://karpathy.github.io/2015/05/21/rnn-effectiveness/" target="_blank" rel="nofollow">Andrej Karpathy</a></figcaption>

 This ability to process sequences makes RNNs very useful. For example:

- **Machine Translation** (e.g. Google Translate) is done with "many to many" RNNs. The original text sequence is fed into an RNN, which then produces translated text as output.
- **Sentiment Analysis** (e.g. _Is this a positive or negative review?_) is often done with "many to one" RNNs. The text to be analyzed is fed into an RNN, which then produces a single output classification (e.g. _This is a positive review_).

Later in this post, we'll build a "many to one" RNN from scratch to perform basic Sentiment Analysis. Onwards!

## 2. The How

Let's consider a "many to many" RNN with inputs $x_0, x_1, \ldots x_n$ that wants to produce outputs $y_0, y_1, \ldots y_n$. These $x_i$ and $y_i$ are **vectors** and can have arbitrary dimensions.

RNNs work by iteratively updating a hidden state $h$. At any given step $t$,

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

All the weights are applied using matrix multiplication, and the biases are added to the resulting products. We then use [tanh](https://en.wikipedia.org/wiki/Hyperbolic_function) as an activation function for the first equation (other activations like [sigmoid](https://en.wikipedia.org/wiki/Sigmoid_function) can also be used).

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
| i am not at all well | ❌ |
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
  'well': True,
  'not well': False,
  # ... more data
}
```

We'll have to do some pre-processing to get the data into a usable format. To start, we'll construct a **vocabulary** of all words that exist in our data:

```python
# Header: main.py
from data import *

# Create the vocabulary.
vocab = list(set([w for text in train_data.keys() for w in text.split(' ')]))
vocab_size = len(vocab)
print('%d unique words found' % vocab_size) # 19 unique words found
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

Finally, recall that each input $x_i$ to our RNN is a _vector_. We'll use **[one-hot](https://en.wikipedia.org/wiki/One-hot) vectors**, which contain all zeros except for a single one. The "one" in each one-hot vector will be **at the word's corresponding integer index.**

Since we have 19 unique words in our vocabulary, each $x_i$ will be a 19-dimensional one-hot vector.

```python
# Header: main.py
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


