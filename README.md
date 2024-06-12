## Introduction

Zlicx is an link management tool for modern marketing teams to create, share, and track short links.

## Local Development 

To develop Zlicx locally, you will need to modify this repository and set up all the env vars outlined in the [`.env.example` file]
Once that's done, you can use the following commands to run the app locally:

```
pnpm i
pnpm build
pnpm dev
```

We're planning to add a proper, well-documented self-hosting guide for Zlicx soon – stay tuned!

## Tinybrd Initial Configuration

To setup Zlicx tinybird, you need setup the below cofiguration

BUILD LOCAL IMAGE SETTING YOUR PROJECT PATH

```
docker run -v ~/Documents/web/poc/zli:/mnt/data -it tinybirdco/tinybird-cli-docker
cd mnt/data

tb auth -i  #Then you have to select the region from your browser. select us-east region
tb auth --token <your token> #Copy token from token menu

tb init
tb push

tb push pipes/*.pipe

```
