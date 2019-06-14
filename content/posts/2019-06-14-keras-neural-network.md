---
title: "Keras for Beginners: Building Your First Neural Network"
date: "2019-06-14T12:00:00.000Z"
template: "post"
draft: false
slug: "/blog/keras-neural-network-tutorial/"
img: "https://victorzhou.com/media/keras-posts/keras-logo.png"
category: "Machine Learning"
tags:
  - "Machine Learning"
  - "Keras"
  - "Neural Networks"
  - "Python"
  - "For Beginners"
description: A beginner-friendly guide on using Keras to implement a simple Neural Network in Python.
prev: "/blog/intro-to-cnns-part-1/"
next: "/blog/intro-to-random-forests/"
---

![](./media-link/keras-posts/keras-logo.png)

[Keras](https://keras.io/) is a simple-to-use but powerful deep learning library for Python. In this post, we'll see how easy it is to build a feedforward neural network and train it to solve a real problem with Keras.

This post is intended for **complete beginners to Keras** but does assume a **basic background knowledge of neural networks**. My [introduction to Neural Networks](/blog/intro-to-neural-networks/) covers everything you need to know (and more) for this post - read that first if necessary.

Let's get started!

## The Problem: MNIST digit classification

We're going to tackle a classic machine learning problem: the [MNIST](http://yann.lecun.com/exdb/mnist/) handwritten digit classification problem. It's simple: given an image, classify it as a digit.

![Sample images from the MNIST dataset](./media-link/cnn-post/mnist-examples.png "Sample images from the MNIST dataset")

Each image in the MNIST dataset is 28x28 and contains a centered, grayscale digit. We'll flatten each 28x28 into a 784 dimensional vector, which we'll use as input to our neural network. Our output will be one of 10 possible classes: one for each digit.

## 1. Setup

I'm assuming you already have a basic Python installation ready (you probably do). Let's first install some packages we'll need:

```bash
$ pip install keras tensorflow numpy mnist
```

> Note: We need to install `tensorflow` because we're going to run Keras on a [TensorFlow](https://www.tensorflow.org/) backend (i.e. TensorFlow will power Keras).

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

We're ready to start building our neural network!

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

The last thing we always need to do is **tell Keras what our network's input will look like**. We can do that by specifying an `input_shape` to the first layer in the `Sequential` model:

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

## 4. Compiling the Model

Before we can begin training, we need to configure the training process. We decide 3 key factors during the compilation step:

- The **optimizer**. We'll stick with a pretty good default: the [Adam](https://arxiv.org/abs/1412.6980) gradient-based optimizer. Keras has [many other optimizers](https://keras.io/optimizers/) you can look into as well.
- The **loss function**. Since we're using a Softmax output layer, we'll use the Cross-Entropy loss. Keras distinguishes between `binary_crossentropy` (2 classes) and `categorical_crossentropy` (>2 classes), so we'll use the latter. [See all Keras losses](https://keras.io/losses/).
- A list of **metrics**. Since this is a classification problem, we'll just have Keras report on the **accuracy** metric.

Here's what that compilation looks like:

```python
model.compile(
  optimizer='adam',
  loss='categorical_crossentropy',
  metrics=['accuracy'],
)
```

Onwards!

## 5. Training the Model

Training a model in Keras literally consists only of calling `fit()` and specifying some parameters. There are [a lot of possible parameters](https://keras.io/models/sequential/#fit), but we'll only manually supply a few:

- The **training data** (images and labels), commonly known as X and Y, respectively.
- The **number of epochs** (iterations over the entire dataset) to train for.
- The **batch size** (number of samples per gradient update) to use when training.

Here's what that looks like:

```python
model.fit(
  train_images, # training data
  train_labels, # training targets
  epochs=5,
  batch_size=32,
)
```

This doesn't actually work yet, though - we overlooked one thing. Keras expects the training targets to be _10-dimensional vectors_, since there are 10 nodes in our Softmax output layer, but we're instead supplying a _single integer representing the class_ for each image.

Conveniently, Keras has a utility method that fixes this exact issue: [to_categorical](https://keras.io/utils/#to_categorical). It turns our array of class integers into an array of [one-hot](https://en.wikipedia.org/wiki/One-hot) vectors instead. For example, `2` would become `[0, 0, 1, 0, 0, 0, 0, 0, 0, 0]` (it's zero-indexed).

We can now put everything together to train our network:

```python
import numpy as np
import mnist
from keras.models import Sequential
from keras.layers import Dense
from keras.utils import to_categorical

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

# Compile the model.
model.compile(
  optimizer='adam',
  loss='categorical_crossentropy',
  metrics=['accuracy'],
)

# Train the model.
model.fit(
  train_images,
  to_categorical(train_labels),
  epochs=5,
  batch_size=32,
)
```

Running that code gives us something like this:

```
Epoch 1/5
60000/60000 [==============================] - 2s 35us/step - loss: 0.3772 - acc: 0.8859
Epoch 2/5
60000/60000 [==============================] - 2s 31us/step - loss: 0.1928 - acc: 0.9421
Epoch 3/5
60000/60000 [==============================] - 2s 31us/step - loss: 0.1469 - acc: 0.9536
Epoch 4/5
60000/60000 [==============================] - 2s 31us/step - loss: 0.1251 - acc: 0.9605
Epoch 5/5
60000/60000 [==============================] - 2s 31us/step - loss: 0.1079 - acc: 0.9663
```

We reached **96.6% training accuracy** after 5 epochs! This doesn't tell us much, though - we may be overfitting. The real challenge will be seeing how our model performs on our test data.

## 6. Testing the Model

Evaluating the model is pretty simple:

```python
model.evaluate(
  test_images,
  to_categorical(test_labels)
)
```

Running that gives us:

```
10000/10000 [==============================] - 0s 15us/step
[0.10821614159140736, 0.965]
```

[evaluate()](https://keras.io/models/sequential/#evaluate) returns an array containing the test loss followed by any metrics we specified. Thus, our model achieves a 0.108 test loss and **96.5%** test accuracy! Not bad for your first neural network.

## 7. Using the Model

Now that we have a working, trained model, let's put it to use. The first thing we'll do is save it to disk so we can load it back up anytime:

```python
model.save_weights('model.h5')
```

We can now reload the trained model whenever we want by rebuilding it and loading in the saved weights:

```python
from keras.models import Sequential
from keras.layers import Dense

# Build the model.
model = Sequential([
  Dense(64, activation='relu', input_shape=(784,)),
  Dense(64, activation='relu'),
  Dense(10, activation='softmax'),
])

# Load the model's saved weights.
model.load_weights('model.h5')
```

Using the trained model to make predictions is easy: we pass an array of inputs to `predict()` and it returns an array of outputs. Keep in mind that the output of our network is 10 probabilities (because of softmax), so we'll use [np.argmax()](https://docs.scipy.org/doc/numpy/reference/generated/numpy.argmax.html) to turn those into actual digits.

```python
# Predict on the first 5 test images.
predictions = model.predict(test_images[:5])

# Print our model's predictions.
print(np.argmax(predictions, axis=1)) # [7, 2, 1, 0, 4]

# Check our predictions against the ground truths.
print(test_labels[:5]) # [7, 2, 1, 0, 4]
```

## 8. Extensions

What we've covered so far was but a brief introduction - there's much more we can do to experiment with and improve this network. I've included a few examples below:

### Tuning Hyperparameters

A good hyperparameters to start with is the learning rate for the [Adam](https://keras.io/optimizers/#adam) optimizer. What happens when you increase or decrease it?

```python
from keras.optimizers import SGD # highlight-line

model.compile(
  optimizer=Adam(lr=0.005), # highlight-line
  loss='categorical_crossentropy',
  metrics=['accuracy'],
)
```

What about the batch size and number of epochs?

```python
model.fit(
  train_images,
  to_categorical(train_labels),
  epochs=10, # highlight-line
  batch_size=64, # highlight-line
)
```

### Network Depth

What happens if we remove or add more fully-connected layers? How does that affect training and/or the model's final performance?

```python
model = Sequential([
  Dense(64, activation='relu', input_shape=(784,)),
  Dense(64, activation='relu'),
  Dense(64, activation='relu'), # highlight-line
  Dense(64, activation='relu'), # highlight-line
  Dense(10, activation='softmax'),
])
```

### Activations

What if we use an activation other than ReLU, e.g. [sigmoid](https://en.wikipedia.org/wiki/Sigmoid_function)?

```python
model = Sequential([
  Dense(64, activation='sigmoid', input_shape=(784,)), # highlight-line
  Dense(64, activation='sigmoid'), # highlight-line
  Dense(10, activation='softmax'),
])
```

### Dropout

What if we tried adding [Dropout](https://keras.io/layers/core/#dropout) layers, which are known to prevent overfitting?

```python
from keras.layers import Dense, Dropout # highlight-line

model = Sequential([
  Dense(64, activation='relu', input_shape=(784,)),
  Dropout(0.5), # highlight-line
  Dense(64, activation='relu'),
  Dropout(0.5), # highlight-line
  Dense(10, activation='softmax'),
])
```

## Conclusion

You've implemented your first neural network with Keras! We achieved a test accuracy of **96.5%** on the MNIST dataset after 5 epochs, which is not bad for such a simple network. I'll include the full source code again below for your reference.

If you want to learn about more advanced techniques to approach MNIST, I recommend checking out my [introduction to Convolutional Neural Networks](/blog/intro-to-cnns-part-1/). In it, we see how to achieve **much higher (>99%) accuracies** on MNIST using more complex networks.

Thanks for reading! Here's the full code:

```python
# The full neural network code!
###############################
import numpy as np
import mnist
from keras.models import Sequential
from keras.layers import Dense
from keras.utils import to_categorical

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

# Compile the model.
model.compile(
  optimizer='adam',
  loss='categorical_crossentropy',
  metrics=['accuracy'],
)

# Train the model.
model.fit(
  train_images,
  to_categorical(train_labels),
  epochs=5,
  batch_size=32,
)

# Evaluate the model.
model.evaluate(
  test_images,
  to_categorical(test_labels)
)

# Save the model to disk.
model.save_weights('model.h5')

# Load the model from disk later using:
# model.load_weights('model.h5')

# Predict on the first 5 test images.
predictions = model.predict(test_images[:5])

# Print our model's predictions.
print(np.argmax(predictions, axis=1)) # [7, 2, 1, 0, 4]

# Check our predictions against the ground truths.
print(test_labels[:5]) # [7, 2, 1, 0, 4]
```
