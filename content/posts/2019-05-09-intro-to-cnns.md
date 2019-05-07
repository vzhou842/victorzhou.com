---
title: Convolutional Neural Networks Explained for Beginners
date: "2019-05-09T12:00:00.000Z"
template: "post"
draft: false
slug: "/blog/intro-to-cnns/"
img:
category: "Machine Learning"
tags:
  - "Machine Learning"
  - "Neural Networks"
  - "Python"
  - "For Beginners"
description: A complete introduction to CNNs.
prev: "/blog/better-profanity-detection-with-scikit-learn/"
next: "/blog/intro-to-random-forests/"
discussLinkTwitter:
discussLinkHN:
discussLinkReddit:
---

There's been a lot of buzz about Convolution Neural Networks (CNNs) in the past few years, especially because of how they've revolutionized the field of [Computer Vision](https://en.wikipedia.org/wiki/Computer_vision). In this post, we'll build on a basic background knowledge of neural networks and explore what CNNs are, understand how they work, and build a real one from scratch (using only [NumPy](https://www.numpy.org/)) in Python.

**This post assumes only a basic knowledge of neural networks**. My [introduction to Neural Networks](/blog/intro-to-neural-networks/) covers everything you'll need to know, so you might want to read that first.

Ready? Let's jump in.

## 1. Motivation

A classic use case of CNNs is to perform image classification, e.g. looking at an image of a pet and deciding whether it's a cat or a dog. It's a seemingly simple task - **why not just use a normal Neural Network?**

Good question.

### Reason 1: Images are Big

Images used for Computer Vision problems nowadays are often 224x224 or larger. Imagine building a neural network to process 224x224 color images: including the 3 color channels (RGB) in the image, that comes out to 224 x 224 x 3 = **150,528** input features! A typical hidden layer in such a network might have 1000 nodes, so we'd have to train 150,528 x 1000 = **over 150 million weights for the first layer alone**. Our network would be _huge_ and nearly impossible to train.

It's not like we need that many weights, either. The nice thing about images is that we know **pixels are most useful in the context of their neighbors**. Objects in images are made up of small, _localized_ features, like the circular iris of an eye or the square corner of a piece of paper. Doesn't it seem wasteful for _every_ node in the first hidden layer to look at _every_ pixel?

### Reason 2: Positions can change

If you trained a network to detect dogs, you'd want it to be able to a detect a dog _regardless of where it appears in the image_. Imagine training a network that works well on a certain dog image, but then feeding it a slightly shifted version of the same image. The dog would not activate the same neurons, so **the network would react completely differently!**

We'll see soon how a CNN can help us mitigate these problems.

## 2. Dataset

In this post, we'll tackle the "Hello, World!" of Computer Vision: the [MNIST](http://yann.lecun.com/exdb/mnist/) handwritten digit classification problem. It's simple: given an image, classify it as a digit.

![Sample images from the MNIST dataset](./media-link/cnn-post/mnist-examples.png "Sample images from the MNIST dataset")

Each image in the MNIST dataset is 28x28 and contains a centered, grayscale digit.

Truth be told, a normal neural network would actually work just fine for this problem. You could treat each image as a 28 x 28 = 784-dimensional vector, feed that to a 784-dim input layer, stack a few hidden layers, and finish with an output layer of 10 nodes, 1 for each digit.

This would only work because the MNIST dataset contains **small** images that are **centered**, so we wouldn't run into the aforementioned issues of size or shifting. Keep in mind throughout the course of this post, however, that **most real-world image classification problems aren't this easy.**

Enough buildup. Let's get into CNNs!

## 3. Convolutions

The C in CNN stands for Convolutional.
