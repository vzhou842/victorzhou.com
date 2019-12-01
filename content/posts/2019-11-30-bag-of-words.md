---
title: A Simple Explanation of the Bag-of-Words Model
date: "2019-11-30T12:00:00.000Z"
template: "post"
draft: false
slug: "/blog/bag-of-words/"
img: "https://victorzhou.com/media/laptop-code.jpg"
isML: true
category: "Machine Learning"
tags:
  - "Machine Learning"
  - "For Beginners"
  - "Natural Language Processing"
  - "Python"
description: A quick, easy introduction to the Bag-of-Words model and how to implement it in Python.
prev: "/blog/softmax/"
next: "/blog/intro-to-rnns/"
---

The **bag-of-words** (BOW) model is a representation that turns arbitrary text into **fixed-length vectors** by counting how many times each word appears. This process is often referred to as **vectorization**.

Let's understand this with an example. Suppose we wanted to vectorize the following:
- _the cat sat_
- _the cat sat in the hat_
- _the cat with the hat_

We'll refer to each of these as a text **document**.

### Step 1: Determine the Vocabulary

We first define our **vocabulary**, which is the set of all words found in our document set. The only words that are found in the 3 documents above are: `the`, `cat`, `sat`, `in`, `the`, `hat`, and `with`.

### Step 2: Count

To vectorize our documents, all we have to do is **count how many times each word appears**:

| Document | `the` | `cat` | `sat` | `in` | `hat` | `with` |
| --- | --- | --- | --- | --- | --- | --- |
| _the cat sat_ | 1 | 1 | 1 | 0 | 0 | 0 |
| _the cat sat in the hat_ | 2 | 1 | 1 | 1 | 1 | 0 |
| _the cat with the hat_ | 2 | 1 | 0 | 0 | 1 | 1 |

Now we have length-6 vectors for each document!
- _the cat sat_: `[1, 1, 1, 0, 0, 0]`
- _the cat sat in the hat_: `[2, 1, 1, 1, 1, 0]`
- _the cat with the hat_: `[2, 1, 0, 0, 1, 1]`

Notice that we lose contextual information, e.g. where in the document the word appeared, when we use BOW. It's like a literal **bag**-of-words: it only tells you _what_ words occur in the document, not _where_ they occurred.

## Implementing BOW in Python

Now that you know what BOW is, I'm guessing you'll probably need to implement it. Here's my preferred way of doing it, which uses [Keras's Tokenizer class](https://keras.io/preprocessing/text/):

```python
from keras.preprocessing.text import Tokenizer

docs = [
  'the cat sat',
  'the cat sat in the hat',
  'the cat with the hat',
]

## Step 1: Determine the Vocabulary
tokenizer = Tokenizer()
tokenizer.fit_on_texts(docs)
print(f'Vocabulary: {list(tokenizer.word_index.keys())}')

## Step 2: Count
vectors = tokenizer.texts_to_matrix(docs, mode='count')
print(vectors)
```

Running that code gives us:
```
Vocabulary: ['the', 'cat', 'sat', 'hat', 'in', 'with']
[[0. 1. 1. 1. 0. 0. 0.]
 [0. 2. 1. 1. 1. 1. 0.]
 [0. 2. 1. 0. 1. 0. 1.]]
```

Notice that the vectors here have length 7 instead of 6 because of the extra `0` element at the beginning. This is an inconsequential detail - Keras reserves index `0` and never assigns it to any word.

## How is BOW useful?

Despite being a relatively basic model, BOW is often used for [Natural Language Processing](/tag/natural-language-processing/) (NLP) tasks like Text Classification. Its strengths lie in its simplicity: it's inexpensive to compute, and sometimes simpler is better when positioning or contextual info aren't relevant.

I've written [a blog post that uses BOW for profanity detection](/blog/better-profanity-detection-with-scikit-learn/) - check it out if you're curious to see BOW in action!
