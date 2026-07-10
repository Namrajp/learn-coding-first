---
layout: "@layouts/Layout.astro"
title: "Part1: Containerize an application"
date: 2025-10-16
description: "We discuss this very important topic"
tags:
  - docker
  - news
  - tutorial
  - essay
---

For the rest of this guide, you'll be working with a simple todo list manager that runs on Node.js.

## Get the app

```
$ git clone https://github.com/docker/getting-started-app.git
```

## Build the app's image

To build the image, you'll need to use a Dockerfile. Docker uses this script to build a container image.

```
# syntax=docker/dockerfile:1

FROM node:lts-alpine
WORKDIR /app
COPY . .
RUN yarn install --production
CMD ["node", "src/index.js"]
EXPOSE 3000
```

```
In the terminal, make sure you're in the getting-started-app directory.

$ cd /path/to/getting-started-app
$ docker build -t getting-started .
```

The docker build command uses the Dockerfile to build a new image.
After Docker downloaded the image node:lts-alphine, the instructions from the Dockerfile copied in your application and used yarn to install your application's dependencies. The CMD directive specifies the default command to run when starting a container from this image.

Finally, the -t flag tags your image. Think of this as a human-readable name for the final image. Since you named the image getting-started, you can refer to that image when you run a container.

The . at the end of the docker build command tells Docker that it should look for the Dockerfile in the current directory.

## Start an app container

Now that you have an image, you can run the application in a container using the docker run command.

Run your container using the docker run command and specify the name of the image you just created:

```
$ docker run -d -p 127.0.0.1:3000:3000 getting-started
```

The -d flag (short for --detach) runs the container in the background. This means that Docker starts your container and returns you to the terminal prompt. Also, it does not display logs in the terminal.

Part 2: Update the application
Part 3: Share the application
Part 4: Persist the DB
Part 5: Use bind mounts
Part 5: Multi-container apps
Part 7: Use Docker Compose
Part 8: Image-building best practices
Part 9: What next
Educational resources

Link: docker official website docs.docker.com [Containerize an application](https://docs.docker.com/get-started/workshop/02_our_app/).
