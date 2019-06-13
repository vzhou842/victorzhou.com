---
title: "Keras for Beginners: Building Your First Neural Network"
date: "2019-06-20T12:00:00.000Z"
template: "post"
draft: false
slug: "/blog/neural-networks-with-keras/"
img:
category: "Machine Learning"
tags:
  - "Machine Learning"
  - "Neural Networks"
  - "Python"
  - "For Beginners"
description: A beginner-friendly guide on using Keras to implement a simple Neural Network in Python.
prev: "/blog/intro-to-cnns-part-1/"
next: "/blog/intro-to-random-forests/"
discussLinkTwitter:
discussLinkHN:
discussLinkReddit:
---

[Keras](https://keras.io/) is a simple-to-use but powerful deep learning library for Python. In this post, we'll see how easy it is to build a feedforward neural network and train it to solve a real problem with Keras.

This post is intended for **complete beginners to Keras** but does assume a **basic background knowledge of neural networks**. My [introduction to Neural Networks]() covers everything you need to know (and more) for this post - read that first if necessary.

Let's get started!

## The Problem: MNIST digit classification

We're going to tackle a classic machine learning problem: the [MNIST](http://yann.lecun.com/exdb/mnist/) handwritten digit classification problem. It's simple: given an image, classify it as a digit.

![Sample images from the MNIST dataset](./media-link/cnn-post/mnist-examples.png "Sample images from the MNIST dataset")

Each image in the MNIST dataset is 28x28 and contains a centered, grayscale digit. We'll flatten each 28x28 into a 784 dimensional vector, which we'll use as input to our neural network. Our output will be one of 10 possible classes: one for each digit.

## 1. Setup

I'm assuming you already have a basic Python installation ready (you probably do). Let's first install some packages we'll need:

```bash
$ pip install keras numpy mnist
```

You should now be able to import these packages and poke around the MNIST dataset:

```python
import numpy as np
import mnist
import keras

# The first time you run this might be a bit slow, since the
# mnist package has to download and cache the data.
train_images = mnist.train_images()
train_labels = mnist.train_labels()

print(train_images.shape) # (60000, 28, 28)
print(train_labels.shape) # (60000,)
```

## 2. Preparing the Data

As mentioned earlier, we need to flatten each image before we can pass it into our neural network. We'll also normalize the pixel values from [0, 255] to [-0.5, 0.5] to make our network easier to train (using smaller, centered values is often better).

```python
import numpy as np
import mnist

train_images = mnist.train_images()
train_labels = mnist.train_labels()
test_images = mnist.test_images()
test_labels = mnist.test_labels()

# Normalize the images.
train_images = (train_images / 255) - 0.5
test_images = (test_images / 255) - 0.5

# Flatten the images.
train_images = train_images.reshape((-1, 784))
test_images = test_images.reshape((-1, 784))

print(train_images.shape) # (60000, 784)
print(test_images.shape)  # (10000, 784)
```

We're reading to start building our neural network!

## 3. Building the Model

Every Keras model is either built using the [Sequential](https://keras.io/models/sequential/) class, which represents a linear stack of layers, or the functional [Model](https://keras.io/models/model/) class, which is more customizeable. We'll be using the simpler `Sequential` model, since our network is indeed a linear stack of layers.

We start by instantiating a `Sequential` model:

```python
from keras.models import Sequential
from keras.layers import Dense

# WIP
model = Sequential([
  # layers...
])
```

The `Sequential` constructor takes an array of Keras [Layers](https://keras.io/layers/about-keras-layers/). Since we're just building a standard feedforward network, we only need the [Dense](https://keras.io/layers/core/#dense) layer, which is your regular fully-connected (dense) network layer.

Let's throw in 3 `Dense` layers:

```python
# Still a WIP
model = Sequential([
  Dense(64, activation='relu'),
  Dense(64, activation='relu'),
  Dense(10, activation='softmax'),
])
```

The first two layers have 64 nodes each and use the [ReLU](https://en.wikipedia.org/wiki/Rectifier_(neural_networks)) activation function. The last layer is a Softmax output layer with 10 nodes, one for each class.

> If you need a refresher, I [explained Softmax](http://localhost:8000/blog/intro-to-cnns-part-1/#5-softmax) in my introduction to CNNs.

The last thing we need to do is **tell Keras what our network's input will look like**. We do that by specifying an `input_shape` to the first layer in the `Sequential` model:

```python
model = Sequential([
  Dense(64, activation='relu', input_shape=(784,)),
  Dense(64, activation='relu'),
  Dense(10, activation='softmax'),
])
```

Once the input shape is specified, Keras will automatically infer the shapes of inputs for later layers. We've finished defining our model! Here's where we're at:

```python
import numpy as np
import mnist
from keras.models import Sequential
from keras.layers import Dense

train_images = mnist.train_images()
train_labels = mnist.train_labels()
test_images = mnist.test_images()
test_labels = mnist.test_labels()

# Normalize the images.
train_images = (train_images / 255) - 0.5
test_images = (test_images / 255) - 0.5

# Flatten the images.
train_images = train_images.reshape((-1, 784))
test_images = test_images.reshape((-1, 784))

# Build the model.
model = Sequential([
  Dense(64, activation='relu', input_shape=(784,)),
  Dense(64, activation='relu'),
  Dense(10, activation='softmax'),
])
```

## 4. Training the Model

