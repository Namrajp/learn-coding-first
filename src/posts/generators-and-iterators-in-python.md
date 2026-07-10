---
layout: "@layouts/Layout.astro"
title: "Generators and Iterators in Python"
date: 2025-08-21
tags:
  - python
  - essay
  - tutorial
---

Generator functions are functions that allow us to return multiple times using the yield keyword. This allows us to generate many values over time from a single function.

Awesome!

```
def gensquares(n):
    for num in range(n):
        yield num**2

for x in gensquares(10):
    print(x)
```

```
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

```
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

[generators-and-iterators-in-python](https://www.rithmschool.com/courses/python-fundamentals-part-2/lessons/python-generators-and-iterators/)
