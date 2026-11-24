# Isaac Tsienyane, personal site

Portfolio, apps showcase and blog for a senior full-stack and Android developer. Built with [Nuxt 4](https://nuxt.com/), [Nuxt Content](https://content.nuxt.com/) and [Tailwind CSS](https://tailwindcss.com/) v4.

## Quick start

```bash
npm ci
npm run dev      # http://localhost:3000
```

Other scripts: `npm run build`, `npm run preview`, `npm run check` (type checking). Node 22.5+ is required (Nuxt Content uses the built-in `node:sqlite`).

## Repository layout

| Path | Purpose |
|------|---------|
| `app/pages/` | Routes: `/`, `/apps`, `/apps/[slug]`, `/blog`, `/blog/[slug]`; `app/error.vue` handles 404s |
| `app/components/` | Phone launcher, live demo lab (`AndroidLab.vue`), home-screen widgets (`widgets/`), header, footer |
| `app/assets/css/main.css` | Design tokens (light/dark) and article typography |
| `content/` | Everything editable: apps, posts and data |
| `content.config.ts` | Collection schemas (validated at build time) |
| `public/` | Static files served as-is (images, manifest, robots.txt) |

## Editing content

### Add an app to the showcase

Create `content/apps/<slug>.md`:

```markdown
---
title: My Android App
description: One or two sentences for search results and link previews.
tagline: The one-line pitch shown in lists.
platforms: [android]          # android | ios | web | backend
status: in-development        # in-development | shipped | archived
stack: [Kotlin, Jetpack Compose, Firebase]
role: Solo developer          # optional
year: 2026                    # optional
featured: true                # optional, pins it on the home page
order: 1                      # lower shows first
color: "#2f5bea"              # icon colour when there's no icon image
icon: /images/apps/my-app/icon.png             # optional
playStore: https://play.google.com/store/apps/details?id=...   # optional
github: https://github.com/Zaktsie/...           # optional
url: https://...                                 # optional
screenshots:                                     # optional, phone-shaped images
  - /images/apps/my-app/1.png
---

Write the case study here in Markdown.
```

### Write a blog post

Create `content/blog/<slug>.md` with `title`, `description`, `date` and optional `tags` and `draft: true`.

### Games and books

Edit `content/data/shelf.json`. Each item has `kind` (`game` or `book`), `title`, `by`, `status` (`now` or `favourite`), a `color`, and an optional `platform` and `note`. The `now` game and book drive the "Now playing" and "Reading now" widgets on the home page.

### Experience and skills

`content/data/experience.json` and `content/data/skills.json`.

## Deployment

The site runs on any Nitro host. Content pages are prerendered at build time.

- **Vercel / Netlify:** import the repo. The preset is detected automatically and the build command is `npm run build`.
- **Firebase App Hosting:** connect the repo in the Firebase console. For classic Firebase Hosting + Functions, build with `NITRO_PRESET=firebase npm run build`.

Point the `isaactsienyane.co.za` DNS at the new host, then remove `public/CNAME` (it was only used by GitHub Pages).

## Credits

See [`CREDITS.md`](CREDITS.md).
