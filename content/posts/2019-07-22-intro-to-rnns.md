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

## 1. Why?

One issue with vanilla neural nets (and also [CNNs](/blog/intro-to-cnns-part-1/)) is that they only work with pre-determined sizes: they take **fixed-size inputs** and produce **fixed-size outputs**. RNNs are useful because they let us have **variable-length sequences** both as inputs and outputs. Here are a few examples of what RNNs can look like:

![](./media-link/rnn-post/rnns.jpeg)
<figcaption>Inputs are red, the RNN itself is green, and outputs are blue. Source: <a href="http://karpathy.github.io/2015/05/21/rnn-effectiveness/" target="_blank" rel="nofollow">Andrej Karpathy</a></figcaption>

 This ability to process sequences makes RNNs very useful. For example:

- **Machine Translation** (e.g. Google Translate) is done with "many to many" RNNs. The original text sequence is fed into an RNN, which then produces translated text as output.
- **Sentiment Analysis** (e.g. _Is this a positive or negative review?_) is often done with "many to one" RNNs. The text to be analyzed is fed into an RNN, which then produces a single output classification (e.g. _This is a positive review_).

Later in this post, we'll build a "many to one" RNN from scratch to perform basic Sentiment Analysis. Onwards!

## 2._Recurrent_ Neural Nets

The _Recurrent_ in _R_NN refers to its recursive structure: **it uses the same weights for every element** in a sequence. The easiest way to understand this is with a picture:

