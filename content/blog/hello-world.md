---
title: Hello, world (again)
description: Why I rebuilt this site on Nuxt, and what I plan to write about here.
date: 2026-11-24
tags: [meta, nuxt]
---

This site used to be a single scrolling page. It's now a small Nuxt 4 app with room for two things I kept wanting to share: the apps I build, and what I learn building them.

## What to expect

- **Android.** Permission flows, device integrations, and the parts of the platform that only show up once real users install your app.
- **Full-stack work.** Nuxt and Vue on the front, Laravel and Firebase behind them, and the glue in between.
- **Off the clock.** The occasional note on a game or book that changed how I think about building things.

## How it's built

Everything on the site is a Markdown or JSON file under `content/`. A new post is a new file:

```bash
content/blog/my-next-post.md
```

I rebuilt it by pairing with a coding agent. I set the direction and reviewed every change; the agent read the old Astro code, planned the move, wrote the components and ran the type checks and builds. The replay on the home page is that session.

More soon.
