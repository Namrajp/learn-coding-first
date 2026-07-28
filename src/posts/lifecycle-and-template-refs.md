---
title: "Lifecycle and Template Refs in Vue"
slug: "lifecycle-and-template-refs"
date: 2026-05-09
description: "Understand Vue.js component lifecycle hooks and template refs: mounted, updated, destroyed, and accessing DOM elements directly."
category: "web-development"
tags: ["vue", "javascript", "dom"]
status: published
---

# Template refs

So far, Vue has been handling all the DOM updates for us, thanks to reactivity and declarative rendering. However, inevitably there will be cases where we need to manually work with the DOM.

We can request a template ref - i.e. a reference to an element in the template - using the special ref attribute:

```html
<p ref="pElementRef">hello</p>
```

To access the ref, we need to declare a ref with matching name:

```js
const pElementRef = ref(null);
```

Notice the ref is initialized with `null` value. This is because the element doesn't exist yet when `<script setup>` is executed. The template ref is only accessible after the component is mounted.

To run code after mount, we can use the `onMounted()` function:

```js
import { onMounted } from "vue";

onMounted(() => {
  // component is now mounted.
});
```

This is called a lifecycle hook - it allows us to register a callback to be called at certain times of the component's lifecycle. There are other hooks such as `onUpdated` and `onUnmounted`. Check out the Lifecycle Diagram for more details.

Now, try to add an `onMounted` hook, access the `<p>` via `pElementRef.value`, and perform some direct DOM operations on it, e.g. changing its `textContent`.

Awesome!

## A complete example

Here is the whole thing as one component:

```vue
<script setup>
import { ref, onMounted } from "vue";

const pElementRef = ref(null);

onMounted(() => {
  pElementRef.value.textContent = "mounted!";
});
</script>

<template>
  <p ref="pElementRef">hello</p>
</template>
```

After mount, `pElementRef.value` holds the real `<p>` DOM node. Anything you would do with a normal element works on it — reading `offsetHeight`, calling `focus()`, attaching a listener.

## The null gotcha

The mistake almost everyone makes once is reading the ref at the top level of `<script setup>`:

```js
const pElementRef = ref(null);
pElementRef.value.textContent = "hello"; // TypeError
```

That throws `Cannot set properties of null`. `<script setup>` runs before the template is rendered, so there is nothing to reach yet. DOM access has to happen inside `onMounted` or later.

The same applies to elements behind `v-if`. If the element is not rendered, its ref stays `null` even after mount, and it goes back to `null` when the condition flips to false again.

## Cleaning up with onUnmounted

If you attach a listener or start a timer in `onMounted`, remove it in `onUnmounted`. Otherwise it keeps running after the component is gone:

```js
import { ref, onMounted, onUnmounted } from "vue";

const boxRef = ref(null);
let el = null;

function onScroll() {
  console.log(el.scrollTop);
}

onMounted(() => {
  el = boxRef.value;
  el.addEventListener("scroll", onScroll);
});

onUnmounted(() => {
  el?.removeEventListener("scroll", onScroll);
});
```

Copying the element into a plain variable matters here. By the time `onUnmounted` runs the component has already been torn down, so reading `boxRef.value` at that point is not reliable.

## When to reach for a ref

Most of the time you should not. If the change can be expressed as reactive state, do that instead and let Vue update the DOM. Template refs are for the cases declarative rendering cannot cover: focusing an input, measuring an element, controlling media playback, or handing a DOM node to a third-party library such as a chart or a map.

Lifecycle and Template Refs
[List of vue starter tutorials for official vue to my github](https://github.com/Namrajp/vue-project-test/tree/main/first-single-file-component)
