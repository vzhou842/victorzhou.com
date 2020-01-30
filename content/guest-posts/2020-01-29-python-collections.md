---
title: "An Introduction to Python's Collections module"
date: "2020-01-29T12:00:00.000Z"
template: "post"
guestAuthor: "Pankaj Kumar"
guestAuthorLink: https://twitter.com/JournalDev
slug: "/posts/python-collections-module/"
img: "https://victorzhou.com/media/laptop-code.jpg"
category: "Python"
tags:
  - "Python"
  - "For Beginners"
description: An overview of 5 important container objects from the collections module.
prev: "/blog/better-profanity-detection-with-scikit-learn/"
next: "/blog/keras-neural-network-tutorial/"
---

Python provides a lot of built-in data structures, such as `list`, `set`, `dict`, and `tuple`. The [collections module](https://docs.python.org/3.8/library/collections.html) provides a set of special containers that extends the functionalities of these basic data structures.

Let’s look into some of the important container objects from the collections module.

## Table of Contents

1. [NamedTuple](#1-namedtuple)
2. [OrderedDict](#2-ordereddict)
3. [Counter](#3-counter)
4. [Deque](#4-deque)
5. [ChainMap](#5-chainmap)

## 1. NamedTuple

Python tuples contain a list of immutable values. The [namedtuple()](https://docs.python.org/3.8/library/collections.html#collections.namedtuple) function is used to create a NamedTuple, where the values are attached to a key.

Let’s see how to create a named tuple.

```python
from collections import namedtuple

Employee = namedtuple('Employee', 'id name role')

john = Employee(id=10, name='John', role='Software Engineer')

# Employee(id=10, name='John', role='Software Engineer')
print(john)
```

We can access named tuple values via index as well as by key name.

```python
# 10
print(john.id)

# John
print(john.name)

# John
print(john[1])

# Software Engineer
print(john[2])
```

Just like tuples, named tuples are also immutable. Let’s see what happens when we try to change the values of a named tuple.

```python
# AttributeError: can't set attribute
john.name='John Doe'
```

### When should I use NamedTuple?

When your tuple object has a lot of elements, using NamedTuple is advisable because you can access elements through their key, which is less confusing than accessing elements with index numbers.

Another case would be when you want to have an object similar to a dictionary but immutable - NamedTuple would be perfect in that scenario.

## 2. OrderedDict

The [OrderedDict](https://docs.python.org/3.8/library/collections.html#collections.OrderedDict) extends the functionality of dict. It maintains the order of insertion, so that the elements are retrieved in the same order.

If we insert an item with an existing key, the value is updated but the insertion position remains unchanged.

```python
from collections import OrderedDict

employees = OrderedDict({1: 'John', 2: 'David'})

# OrderedDict([(1, 'John'), (2, 'David')])
print(employees)

# 1 John
# 2 David
for id, name in employees.items():
  print(id, name)

# adding a new item
employees[3] = 'Lisa'

# updating an existing key
employees[1] = 'Mary'

# OrderedDict([(1, 'Mary'), (2, 'David'), (3, 'Lisa')])
print(employees)

# 1 Mary
# 2 David
# 3 Lisa
for id, name in employees.items():
  print(id, name)
```

### When should I use OrderedDict?

Sometimes, we want to process dictionary items in a certain order. OrderedDict is useful for iterating the `dict` elements in the order of their insertion.

## 3. Counter

The [Counter](https://docs.python.org/3.8/library/collections.html#collections.Counter) object allows us to count the keys in a sequence. It’s a subclass of dict where the key is the sequence elements and value are their count.

```python
from collections import Counter

nums = [1, 2, 3, 2, 2, 4, 5, 1]

c = Counter(nums)

# Counter({2: 3, 1: 2, 3: 1, 4: 1, 5: 1})
print(c)
```

### When should I use Counter?

When you quickly want to get some idea about the elements in the sequence. For example, how many unique elements there are, which element is present most number of times, etc.

## 4. Deque

[deque](https://docs.python.org/3.8/library/collections.html#collections.deque) is a double-ended queue implementation that supports adding and removing elements from both ends.

We can pass an iterable object to the `deque()` method to populate the deque.

```python
from collections import deque

nums = deque('12345')

# deque(['1', '2', '3', '4', '5'])
print(nums)

nums.append(6)

# deque(['1', '2', '3', '4', '5', 6])
print(nums)

nums.appendleft(0)

# deque([0, '1', '2', '3', '4', '5', 6])
print(nums)

# 7
print(len(nums))

# 6
print(nums.pop())

# 0
print(nums.popleft())

# deque(['1', '2', '3', '4', '5'])
print(nums)

nums.reverse()

# deque(['5', '4', '3', '2', '1'])
print(nums)
```

### When should I use Deque?

Whenever you need a double-ended queue data structure created from a sequence, you can use Deque. For example: if you are creating a playing cards game where the players can pick cards from either the top or the bottom of the deck.

## 5. ChainMap

A [ChainMap](https://docs.python.org/3.8/library/collections.html#collections.ChainMap) object allows us to create a group from multiple dict-like objects. It’s useful when we have to work with multiple dicts. The ChainMap contains the maps in a list and they are backed by the original maps. So, if the value in the underlying map change, then the ChainMap value will also change.

When searching for an element, ChainMap searches for the key in all the maps and returns the first found value.

```python
from collections import ChainMap

d1 = {1: "One", 2: "Two"}
d2 = {1: "ONE", 2: "TWO", 3: "THREE"}

cm = ChainMap(d1, d2)

# ChainMap({1: 'One', 2: 'Two'}, {1: 'ONE', 2: 'TWO', 3: 'THREE'})
print(cm)

# List of Keys: [1, 2, 3]
print(f'List of Keys: {list(cm)}')

# One
print(cm[1])

# THREE
print(cm[3])
```

### When should I use ChainMap?

When you are working with multiple dictionaries and you have to search for elements from them, you should use ChainMap instead of writing multiple lines of code to look through the dicts one-by-one.

> Author Bio: Pankaj has over 14 years of IT experience and loves working in Python. You can follow him on [Twitter](https://twitter.com/JournalDev) to get in touch with him, or learn more by going through his [Python tutorials](https://www.journaldev.com/python-tutorial).
