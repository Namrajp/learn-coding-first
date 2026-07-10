---
layout: "@layouts/Layout.astro"
title: "Getting Started with NumPy"
date: 2026-02-22
tags:
  - python
  - numpy
  - tutorial
---

# Getting Started with NumPy
### A Minimal, Practical Guide for Python & C Developers

---

> **NumPy** is the foundational numerical computing library for Python. It provides the `ndarray` — a fast, fixed-type, n-dimensional array — and a rich set of vectorized math operations. Nearly every scientific Python library (pandas, PyTorch, scikit-learn) is built on top of it.

---

## Installation

```bash
pip install numpy
```

---

## The Core Idea: `ndarray`

Unlike Python lists, NumPy arrays are:
- **Fixed type** — all elements share one `dtype`
- **Fixed size** — reshaping creates a new array
- **Vectorized** — math operations apply element-wise with no Python loops

```python
import numpy as np
```

---

## Creating Arrays

```python
np.array([1, 2, 3])            # from list → 1D
np.array([[1, 2], [3, 4]])     # 2D matrix

np.zeros((3, 4))               # 3×4 of 0.0
np.ones((2, 3))                # 2×3 of 1.0
np.eye(3)                      # 3×3 identity matrix
np.full((2, 2), 7)             # filled with a constant

np.arange(0, 10, 2)            # [0 2 4 6 8]  — like range()
np.linspace(0, 1, 5)           # [0. .25 .5 .75 1.] — evenly spaced

np.random.rand(3, 3)           # uniform random [0, 1)
np.random.randn(3, 3)          # standard normal distribution
```

---

## Array Properties

```python
a = np.array([[1, 2, 3], [4, 5, 6]])

a.shape    # (2, 3)
a.ndim     # 2
a.size     # 6  — total element count
a.dtype    # int64
```

---

## Indexing & Slicing

```python
a = np.array([10, 20, 30, 40, 50])

a[0]       # 10
a[-1]      # 50
a[1:4]     # [20 30 40]
a[::2]     # [10 30 50]  — every 2nd element

# 2D indexing
m = np.array([[1, 2, 3], [4, 5, 6]])
m[0, 1]    # 2   — row 0, col 1
m[:, 1]    # [2 5]   — entire column 1
m[1, :]    # [4 5 6] — entire row 1
```

---

## Vectorized Math

No loops. Operations apply to the whole array at once:

```python
a = np.array([1, 2, 3])
b = np.array([4, 5, 6])

a + b       # [5 7 9]
a * b       # [4 10 18]
a ** 2      # [1 4 9]
a + 10      # [11 12 13]  — scalar broadcast

np.sqrt(a)
np.exp(a)
np.log(a)
np.sin(a)
```

---

## Broadcasting

Operations between arrays of different shapes work if dimensions are compatible — NumPy stretches size-`1` dimensions automatically:

```python
m = np.ones((3, 3))
v = np.array([1, 2, 3])

m + v
# [[2. 3. 4.]
#  [2. 3. 4.]
#  [2. 3. 4.]]
```

> **Rule:** dimensions are compared right-to-left. A dimension of size `1` expands to match the other.

---

## Aggregations

```python
a = np.array([[1, 2, 3], [4, 5, 6]])

a.sum()           # 21   — total
a.sum(axis=0)     # [5 7 9]   — per column
a.sum(axis=1)     # [6 15]    — per row

a.mean()
a.min() / a.max()
a.argmin() / a.argmax()   # index of min / max
np.std(a)
```

---

## Reshaping

```python
a = np.arange(12)

a.reshape(3, 4)    # 3 rows, 4 cols
a.reshape(2, -1)   # -1 = "infer this dimension" → (2, 6)
a.flatten()        # always a copy → 1D
a.ravel()          # view if possible → 1D

a[:, np.newaxis]   # insert axis: (12,) → (12, 1)
```

---

## Boolean Masking

```python
a = np.array([10, 25, 3, 47, 8])

a[a > 10]          # [25 47]
a[a > 10] = 0      # set matching elements to 0
```

---

## Linear Algebra

```python
A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])

A @ B                       # matrix multiply (preferred syntax)
np.dot(A, B)                # equivalent

np.linalg.inv(A)            # inverse
np.linalg.det(A)            # determinant
vals, vecs = np.linalg.eig(A)  # eigenvalues & eigenvectors
```

---

## Stacking & Splitting

```python
a = np.array([1, 2, 3])
b = np.array([4, 5, 6])

np.vstack([a, b])           # [[1 2 3], [4 5 6]]
np.hstack([a, b])           # [1 2 3 4 5 6]
np.concatenate([a, b])      # general-purpose

np.split(a, 3)              # split into 3 equal parts
```

---

## ⚠️ Copies vs. Views

This is the most common gotcha, especially coming from C:

```python
a = np.array([1, 2, 3])

b = a           # NOT a copy — shares memory
b = a.copy()    # real independent copy

s = a[1:]       # slice is a VIEW — modifying s modifies a
```

> When in doubt, call `.copy()` explicitly.

---

## Mental Model (coming from C)

| C | NumPy |
|---|---|
| `int arr[N]` | `np.array([...], dtype=np.int32)` |
| `for` loop over array | vectorized op: `a * 2` |
| `malloc` + fixed size | fixed after creation, but reshape is cheap |
| pointer arithmetic | slicing — but it's a **view**, not a pointer |
| `memcpy` | `a.copy()` |

---

## Key Takeaway

> **Stop writing loops.** If you're iterating over array elements, there's almost always a NumPy vectorized equivalent that's 10–100× faster. Internalize vectorization and broadcasting, and everything else follows naturally.

---

*Next steps: **pandas** builds DataFrames on top of NumPy arrays. **PyTorch** tensors are conceptually identical to NumPy arrays but run on GPU. Learning NumPy well makes both significantly easier.*
