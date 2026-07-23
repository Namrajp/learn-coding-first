---
title: "Responsive grid layout"
date: 2026-07-23
tags: ["CSS"]
status: draft
---

## Introduction

Responsive design involves Writing code that targets different screen sizes with @media rule. A web page may have a menu on top right with a logo on left for a simplest form which looks cool on desktop or laptop. Responsive design cares about how same menu looks on a smaller screens like iPad or mobile on resize.Bootstrap provides convenient classes like .sm-col-6, or .md-col-8 to specify width of element on small or medium devices.

'''css
@media only screen and (max-width:601) {
.logo, .nav li {
display: block;
Width: 100%
}
}
'''

In css grid, we have different grid-template-areas property that allows to define areas in the page that can be applied to individual div containers like header,#main-content or footer like,
#main-content {
grid: content