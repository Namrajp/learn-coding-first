---
layout: "@layouts/Layout.astro"
title: "Lifecycle and Template Refs"
date: 2025-05-10
tags:
  - essay
  - miscellaneous
  - news
  - vue
---

So far, Vue has been handling all the DOM updates for us, thanks to reactivity and declarative rendering. However, inevitably there will be cases where we need to manually work with the DOM.

We can request a template ref - i.e. a reference to an element in the template - using the special ref attribute:

template

<p ref="pElementRef">hello</p>
To access the ref, we need to declare a ref with matching name:

js
const pElementRef = ref(null)
Notice the ref is initialized with null value. This is because the element doesn't exist yet when <script setup> is executed. The template ref is only accessible after the component is mounted.

To run code after mount, we can use the onMounted() function:

js
import { onMounted } from 'vue'

onMounted(() => {
// component is now mounted.
})
This is called a lifecycle hook - it allows us to register a callback to be called at certain times of the component's lifecycle. There are other hooks such as onUpdated and onUnmounted. Check out the Lifecycle Diagram for more details.

Now, try to add an onMounted hook, access the <p> via pElementRef.value, and perform some direct DOM operations on it (e.g. changing its textContent
Awesome!
Lifecycle and Template Refs
[List of vue starter tutorials for official vue to my github](https://github.com/Namrajp/vue-project-test/tree/main/first-single-file-component)
