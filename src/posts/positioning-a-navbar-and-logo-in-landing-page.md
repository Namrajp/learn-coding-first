---
title: "Positioning a navbar and logo in Landing Page"
date: 2026-07-23
tags: ["CSS"]
status: draft
---

## Introduction 
Positioning is often overlooked property in CSS. This may be because the elements normally follow the flow of the document and positioning is not always needed.The elements of an HTML document can be either block elements like p,div or h1 that spans through entire line or inline elements like span or images which fills the surrounding space in a container.There are four basic positioning properties that are static, relative, absolute and fixed. 
## Static and Fixed 
The static is dafault positioning which is normal flow of elements.The fixed positioning places an element at a certain position which remains unchanged on scroll or resizing the browser window.Fixed positioning removes an element from the normal flow of the document, which is similar to absolute positioning.In example, an unordered list is positioned fixed at bottom of browser window with 20px pixels from right.

```css
ul {
    position: fixed;
    bottom: 0px;
    right: 20px;
}
```

## Relative positioning
 The other two positioning that needs more illustrations are relative and absolute positioning. The relative positioning is basically moves an element from the original position(normal flow of document) to a new position specifically dictated by values of left, right, bottom and top  properties. Relative positioning does not affect the surrounding elements or parent elements.

```css
.nav-bar {
    position: relative;
    top: 0px;
    right: 0px;
}
```
In above code, lets assume a menu with class .nav-bar is pushed from normal flow to top-right corner from its usual position.

## Absolute positioning
In contrast, the below code places the element  shifted with coordinates (20px, 25px) from the left corner of the browser window.Coordinates for absolute elements are always relative to the closest container that is a positioned element. 

```css
.logo {
    position: absolute;
    top: 25px;
    left: 20px;
}
```
So, if we change .logo's parent element which may be a header element to be relatively positioned, it should appear in the position 25px from top and 20px  from the left of its parent element instead the browser window.


![Free Web Learning Background animation](https://freeweblearning.com/wp-content/uploads/2019/10/Css-Background-Animation.jpg)