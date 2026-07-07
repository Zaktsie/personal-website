# Credits, attributions, and third-party notices

This file documents open-source dependencies, fonts, and how this site references game culture. **Nothing here is legal advice.**

## Open-source software

| Project | Use | License (see package / upstream) |
|--------|-----|----------------------------------|
| [Astro](https://astro.build/) | Static site generator | MIT |
| [Tailwind CSS](https://tailwindcss.com/) | Styling | MIT |
| [Three.js](https://threejs.org/) | Background particle field | MIT |
| [TypeScript](https://www.typescriptlang.org/) | Language | Apache-2.0 |

Exact versions are pinned in [`package.json`](package.json). Full license texts live in `node_modules/` after `npm install`.

## Fonts (served from Google Fonts)

| Font | Role | Source |
|------|------|--------|
| JetBrains Mono | Body / UI monospace | [JetBrains](https://www.jetbrains.com/lp/mono/) (SIL Open Font License 1.1) |
| Marcellus | Heading (Dune theme) | [Google Fonts](https://fonts.google.com/specimen/Marcellus) (Open Font License) |
| Orbitron | Heading (Arcade theme) | [Google Fonts — Orbitron](https://fonts.google.com/specimen/Orbitron) (SIL Open Font License) |

## Arcade theme and Easter eggs (homage, not endorsement)

The **Arcade** theme (`data-theme="arcade"`) is original CSS and typography: a cyberpunk HUD atmosphere with neon cyan/magenta accents and thin holographic scanlines. It does **not** include art, music, or executable content from any commercial game.

**Arcade mouse cursors** (`public/cursors/arcade-default.svg`, `arcade-pointer.svg`): original vector shapes (a neon-outlined arrow and a target-reticle pointer) drawn for this site — not derived from any third-party icon set.

Keyboard Easter eggs (e.g. typed phrases, classic cheat-code sequence) are **original UI responses** meant as a nod to common online-game culture. They intentionally **exclude** Nintendo-owned franchises (e.g. Pokémon, Mario, Zelda) from copy and prompts.

### Cultural / mechanic references (unofficial)

The following are **not** sponsors or licensors of this site. Names below identify inspiration only:

| Inspiration (genre / title family) | Rights holder (common) | Notes |
|-----------------------------------|-------------------------|--------|
| Tactical / competitive FPS culture (matchmaking, rounds, economy jokes) | [Valve Corporation](https://www.valvesoftware.com/) (*Counter-Strike* series) | Trademarks include e.g. Counter-Strike, CS2. |
| “Konami code” (↑↑↓↓←→←→BA) cheat sequence | [Konami Group Corporation](https://www.konami.com/) (popularized with *Contra* and many others) | Sequence is widely used as an Easter egg in software; this site implements an independent toast/visual only—**not** Nintendo-related. |

Cyberpunk-flavored copy (e.g. "netrunner," "flatline," "chromed," "Black ICE," "neural uplink") uses generic terminology that originates from cyberpunk fiction at large (e.g. William Gibson's *Neuromancer*) and recurs across many games and stories in the genre. It is not drawn from, or meant to evoke, any single title or publisher.

**Disclaimer:** This is an independent personal portfolio. It is **not** affiliated with, endorsed by, or sponsored by Valve, Konami, or any game publisher. All trademarks are the property of their respective owners.

If a rights holder prefers a specific credit line changed, open an issue or contact the site owner.

## Repository documentation

- Contributor-oriented overview: [`AGENTS.md`](AGENTS.md)
- This file: [`CREDITS.md`](CREDITS.md)
