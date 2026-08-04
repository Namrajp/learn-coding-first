---
title: "Getting Started with Pandas"
slug: "pandas-guide"
date: 2026-08-04
description: "Complete Pandas guide: DataFrames, data manipulation, filtering, grouping, and file I/O for Python data analysis."
category: "tutorial"
tags: ["python", "pandas", "data analysis"]
status: published
---

# Getting Started with Pandas

### A Minimal, Practical Guide for Python Developers

---

> **Pandas** is the go-to Python library for working with structured, tabular data — think spreadsheets, CSVs, or SQL tables, but in code. It sits at the heart of most data science and machine learning workflows.

---

## Installation

```bash
pip install pandas
```

---

## Core Data Structures

Pandas has two primary building blocks:

| Structure   | Dimensions | Analogy         |
| ----------- | ---------- | --------------- |
| `Series`    | 1D         | A single column |
| `DataFrame` | 2D         | A full table    |

### Series

```python
import pandas as pd

s = pd.Series([10, 20, 30], index=['a', 'b', 'c'])
print(s['b'])  # 20
```

### DataFrame

```python
df = pd.DataFrame({
    'name':  ['Alice', 'Bob', 'Charlie'],
    'age':   [25, 30, 35],
    'score': [88.5, 92.0, 79.5]
})
```

---

## Selecting Data

```python
df['name']            # single column → Series
df[['name', 'age']]  # multiple columns → DataFrame

df.loc[0]             # row by label / index
df.iloc[1]            # row by integer position

df[df['age'] > 28]    # filter rows by condition
```

---

## Exploring a DataFrame

```python
df.head(2)       # first N rows
df.tail(2)       # last N rows
df.shape         # (rows, cols)
df.dtypes        # column data types
df.describe()    # statistical summary
```

---

## Common Operations

```python
df['age'].mean()
df['score'].max()

# Group and aggregate
df.groupby('name')['score'].mean()
```

---

## Adding & Modifying Columns

```python
# Derive a new column
df['grade'] = df['score'].apply(lambda x: 'A' if x >= 90 else 'B')

# Modify in place
df['age'] = df['age'] + 1
```

---

## Handling Missing Data

```python
df.isnull().sum()   # count NaNs per column
df.dropna()         # drop rows containing any NaN
df.fillna(0)        # replace NaN with a default value
```

---

## Gotcha: Chained Assignment

```python
df[df['age'] > 28]['score'] = 100   # may not do what you expect
```

This selects a subset first, then assigns into it. Pandas cannot always tell whether that subset is a view or a copy, so the write may land on a temporary object and never reach `df`. You will usually see a `SettingWithCopyWarning` when this happens.

Do it in one step with `.loc` instead:

```python
df.loc[df['age'] > 28, 'score'] = 100
```

The same rule applies when you slice a DataFrame and keep working on the result — call `.copy()` if you want the slice to be independent of its parent.

---

## Reading & Writing Files

```python
# Reading
df = pd.read_csv('data.csv')
df = pd.read_json('data.json')
df = pd.read_excel('data.xlsx')

# Writing
df.to_csv('output.csv', index=False)
```

---

## Sorting & Merging

```python
# Sort
df.sort_values('score', ascending=False)

# SQL-style JOIN
merged = pd.merge(df1, df2, on='id', how='inner')  # also: left, right, outer

# Stack rows
combined = pd.concat([df1, df2], ignore_index=True)
```

---

## Mental Model (coming from C / plain Python)

| C / Python        | Pandas Equivalent |
| ----------------- | ----------------- |
| `array[i]`        | `df.iloc[i]`      |
| `struct.field`    | `df['column']`    |
| `for` loop filter | `df[condition]`   |
| manual stats      | `df.describe()`   |

---

## Key Takeaway

> Think **column-first and vectorized**. Avoid Python `for` loops over rows — instead, let pandas operate on entire columns at once. It's faster, more readable, and more idiomatic.

---

_Next step: pair pandas with **NumPy** for numerical computing, or feed your cleaned DataFrames into **PyTorch** / **scikit-learn** for machine learning._
