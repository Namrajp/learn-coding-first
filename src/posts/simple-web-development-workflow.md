---
title: "Simple Web development workflow"
date: 2026-07-23
tags: ["Web Development"]
status: draft
---

# The folder structure

Any development work needs some organised plans.In my project I am  up files in a new folder starts with creating folder and files before coding for web development, in my case it looks like this. 
## Project folder
* images
* app
 + style.scss
 + script.js
* dist
 + style.css
* index.html


![Product-landing](https://github.com/Namrajp/Product-Landing/blob/master/images/vscode-folderStructure.png?raw=true)
## Customizing and Plugins in Visual code
 Changing default Settings in order to customize visual studio code is easy.To do that, I go to bottom left in settings, I choose `font-size` to be large enough to see clearly so I chose it `18px`, You may choose different depending on your needs. The `tabs-size 2` instead of default of 4, and _word wrap to yes_.
Installing plugins from *Extensions Marketplace*
The basic plugins are *Live server* and *Sass live serve*. The *javascript snippets for Html css and Js* plugins is also helpful.



![vscode-settings] (https://github.com/Namrajp/Product-Landing/blob/master/images/vscode-settings.png?raw=true)

## Common shortcuts and buttons 
* Shift-Alt-DOWN which copies whole line down
* CTRL-D which selects similar tags in between lines
* CTRL-B hide sidebar
* CTRL-p search files or Alt-Tab
* CTRL-R to browse between folders
* Shift-CTRL-p opens control pallete for shortcuts keys or settings project workspace or any plugins.
* Go Live button to open live server
* Watch Sass to enable watch sass to convert to css
 


![shortcutKeys](https://github.com/Namrajp/Product-Landing/blob/master/images/vscode-shortcutKeys.png?raw=true )
##  Pulling together files for build
I usually setup a app folder for sass files and dist folder for style-sheets file. The live sass compiler compiles the sass files and generate the `style.css` in dist folder. The app folder contains style.sass as main sass file which pulls together other sass partial files like `_globals.sass`, `_variables.sass`, `_mixins.sass`, _typography.sass and other sass files.The _debugging in google chrome_ is very helpful to see if the final style.css file is working.


# Conclusion
These settings help me a lot to get started, I hope It helps someone to learn using the tools and get started in the journey. All the best.