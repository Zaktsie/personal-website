# Design notes

**Subject:** a senior full-stack and Android developer's site, for recruiters, peers and potential collaborators. Its job is to show credible, shipped work quickly and leave room for personality (games and books).

## Tokens

| Token | Light | Dark | Use |
|---|---|---|---|
| `bg` | `#eef0f4` | `#0e1626` | Page |
| `surface` | `#ffffff` | `#16213a` | Raised panels, hover rows |
| `ink` | `#15213b` | `#e6eaf2` | Text |
| `muted` | `#57617a` | `#98a3bb` | Secondary text |
| `line` | `#d5dae4` | `#26324d` | Rules, borders |
| `accent` | `#2f5bea` | `#8aa6ff` | Links, primary actions |
| `now` | `#a86c0a` | `#f2b85b` | Only "in development / playing / reading now" |
| `field` | `#2141d0` | `#1a33a8` | Hero and footer colour fields |
| `band` | `#0f1a33` | `#16213a` | Shelf and blog header bands |

**Type:** Bricolage Grotesque for UI and headings (heavy, tight display sizes); Source Serif 4 for long-form articles (about 68ch, 1.7 leading).

## Principles

- **The whole site is the phone's operating system.** The hero phone is a working launcher; every other section borrows from Android: home-screen widgets (about, now playing, reading, clock, featured app, stack folder, hackathons, agent session), quick-settings tiles as filters, notifications for experience, Play Store listings for apps, a Discover feed for posts, and a share sheet in the footer.
- **Proof over adjectives.** "See the work running" recreates three shipped Blink features (runtime permissions across Android 9 to 13, live maintenance mode via Firebase and Nuxt middleware, FCM/HMS push with deep links) next to the code behind them.
- **Material You surfaces:** tonal containers (primary, amber, pink, tint) at a 2rem radius, no drop shadows on widgets. Post covers are generated from the phone's wallpaper shapes (`Cover.vue`), deterministic per post.
- **Motion:** icons pop in once when the phone boots; the agent replay plays once when scrolled into view. Everything else responds to the visitor, and reduced motion is respected.
- Copy is sentence case, first person and specific. No all-caps eyebrows or arrow-suffixed links.
