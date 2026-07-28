---
title: "Generators and Iterators in Python"
slug: "generators-and-iterators-in-python"
date: 2026-04-23
description: "Master Python generators and iterators: yield keyword, memory-efficient sequences, and the next() function with practical examples."
category: "tutorial"
tags: ["python", "generators", "iterators"]
status: published
---

Generator functions are functions that allow us to return multiple times using the yield keyword. This allows us to generate many values over time from a single function.

Awesome!

```python
def gensquares(n):
    for num in range(n):
        yield num**2

for x in gensquares(10):
    print(x)
```

```python
def fib_with_generator(n):
    a = 1
    b = 1
    for i in range(n):
        yield a
        # a,b = b, a+b -> tuple unpacking instead of the three lines below!
        temp = a
        a = b
        b = temp+b

for num in fib_with_generator(10):
    print(num)
```

Using the next function
Given a generator, you can obtain the next value by calling a special function called next and passing in the generator. Here’s an example:

```python
def use_next():
    for x in range(10):
        yield x

gen = use_next()
print(next(gen)) # 0
print(next(gen)) # 1
print(next(gen)) # 2
```

Iterators
To make something an iterable (i.e. something you can iterate over) we call the iter function on it. For example, if we wanted strings to be iterators, we could do:

```str = "hello"
str_iter = iter(str)
next(str_iter) # h
next(str_iter) # e
next(str_iter) # l
next(str_iter) # l
next(str_iter) # o
next(str_iter) # StopIteration Error!
```

## The iterator protocol

`iter` and `next` are not magic. They call two methods on the object: `__iter__` returns an iterator, and `__next__` returns the following value or raises `StopIteration` when there is nothing left. Anything with both is an iterator, so you can write one by hand:

```python
class Countdown:
    def __init__(self, start):
        self.current = start

    def __iter__(self):
        return self

    def __next__(self):
        if self.current <= 0:
            raise StopIteration
        self.current -= 1
        return self.current + 1

for n in Countdown(3):
    print(n)  # 3, 2, 1
```

A generator function gives you all of that for free. `yield` is the reason you rarely need the class version.

Two words get used interchangeably and should not be. A list is iterable — you can call `iter()` on it — but it is not an iterator, because it has no `__next__`. Same with the string above: `"hello"` is iterable, `str_iter` is the iterator.

## Generators are consumed once

An iterator keeps its position and never rewinds:

```python
gen = gensquares(3)
print(list(gen))  # [0, 1, 4]
print(list(gen))  # []
```

The second call gets nothing because the generator is exhausted. If you need the values twice, store them in a list or call the generator function again.

## Generator expressions

For a one-off generator you do not need `def` and `yield` at all:

```python
squares = (x * x for x in range(10))
```

That looks like a list comprehension with parentheses. `[x * x for x in range(10)]` builds all ten values immediately and keeps them in memory; the generator expression builds nothing until you iterate, then produces one value at a time.

## Where this actually saves you

The clearest case is a large file. Reading it into a list means the whole thing is resident:

```python
lines = open("huge.log").readlines()  # entire file in memory
```

A file object is already an iterator over its lines, so looping it directly keeps memory flat:

```python
with open("huge.log") as f:
    errors = sum(1 for line in f if "ERROR" in line)
```

That is the rule of thumb. If you only need one pass over the data, a generator is cheaper. If you need indexing, `len()`, or repeated passes, build the list.
