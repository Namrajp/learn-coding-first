---
title: "Part1: Containerize an application"
slug: "docker-containerize-app"
date: 2026-07-29
description: "Learn how to containerize applications with Docker: Dockerfile creation, image building, container management, and deployment best practices."
category: "tools"
tags: ["docker", "containers", "deployment"]
status: draft
---

For the rest of this guide, you'll be working with a simple todo list manager that runs on Node.js.

## Get the app

```bash
$ git clone https://github.com/docker/getting-started-app.git
```

## Build the app's image

To build the image, you'll need to use a Dockerfile. Docker uses this script to build a container image.

```dockerfile
# syntax=docker/dockerfile:1

FROM node:lts-alpine
WORKDIR /app
COPY . .
RUN yarn install --production
CMD ["node", "src/index.js"]
EXPOSE 3000
```

## Add a .dockerignore

Before you build, create a `.dockerignore` file next to the Dockerfile:

```
node_modules
.git
```

Everything in the directory you point `docker build` at gets sent to the Docker daemon as the build context. A local `node_modules` directory can be hundreds of megabytes, and copying it in would only be overwritten by the dependencies installed inside the image. Excluding it makes the build faster and the image smaller.

## A Note on Layer Caching

The Dockerfile above copies the whole project before installing dependencies. That works, but editing any source file then invalidates the cache and reinstalls everything from scratch. Copying the manifest first is much faster on rebuilds:

```dockerfile
COPY package.json yarn.lock ./
RUN yarn install --production
COPY . .
```

Docker caches each instruction as a layer and reuses it while its inputs are unchanged. With the manifest copied first, editing `src/index.js` only invalidates the final `COPY`.

In the terminal, make sure you're in the getting-started-app directory.

```bash
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

```bash
$ docker run -d -p 127.0.0.1:3000:3000 getting-started
```

The -d flag (short for --detach) runs the container in the background. This means that Docker starts your container and returns you to the terminal prompt. Also, it does not display logs in the terminal.

## Check that it's running

Because -d returns immediately, a failed container looks much like a successful one. Confirm it started:

```bash
$ docker ps
```

That lists running containers with their IDs, names, and port mappings. If yours isn't listed, it exited. Find it with docker ps -a and read what it printed on the way out:

```bash
$ docker logs <container-id>
```

Once it's up, open http://localhost:3000 to see the todo list app.

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
