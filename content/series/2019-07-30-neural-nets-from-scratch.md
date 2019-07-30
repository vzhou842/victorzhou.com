---
title: "Neural Networks From Scratch"
date: "2019-07-30T12:00:00.000Z"
template: "post"
isSeries: true
isML: true
slug: "/series/neural-networks-from-scratch/"
seriesSlugs:
  - "/blog/intro-to-neural-networks/"
  - "/blog/intro-to-rnns/"
  - "/blog/intro-to-cnns-part-1/"
  - "/blog/intro-to-cnns-part-2/"
category: "Series"
tags:
  - "Series"
  - "Neural Networks"
  - "Machine Learning"
  - "Python"
  - "For Beginners"
img: "https://victorzhou.com/media/rnn-post/bptt.png"
description: "A 4-post series that provides a fundamentals-oriented approach towards understanding Neural Networks."
---

This 4-post series, written especially with beginners in mind, provides a **fundamentals-oriented** approach towards understanding Neural Networks. We’ll start with an introduction to **classic Neural Networks** for complete beginners before delving into two popular variants: **Recurrent Neural Networks** (RNNs) and **Convolutional Neural Networks** (CNNs).

For each of each these types of networks, we’ll:

- See the **structure** of the network.
- Understand the **motivation** behind using that type of network.
- Introduce a **real-world problem** that can be solved using that network.
- **Manually derive the gradients** needed to train our problem-specific network.
- **Implement a fully-functioning network completely from scratch** (using only [numpy](https://numpy.org/)) in Python.

## Background

**This series requires ZERO prior knowledge of Machine Learning** or Neural Networks. However, background in the following topics may be helpful:

- **Multivariable Calculus**, used when deriving the gradients needed to train our networks. These gradient derivations can be skipped if you don’t have the background.
- **Linear Algebra**, specifically Matrix algebra - matrices are often the best way to represent weights for Neural Networks.
- **Python 3**, because the Python implementations in these posts are a major part of their educational value. A baseline proficiency in Python is enough.

## The Series

Ready to get started? Here we go:
