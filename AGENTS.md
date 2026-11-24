# Repository Guidelines

## Project Structure

- **Framework**: Nuxt 4 + Nuxt Content 3 + Tailwind CSS v4 (`@tailwindcss/vite`) + `@nuxt/fonts`.
- **App code** lives in `app/` (Nuxt 4 layout): `pages/`, `components/`, `composables/`, `assets/css/main.css`, `app.vue`, `error.vue`.
- **Content** lives in `content/`: `apps/*.md` (showcase), `blog/*.md` (posts), `data/*.json` (experience, skills, shelf). Schemas are in `content.config.ts`; a bad field fails the build.
- **Static assets**: `public/`.
- **CI/CD**: `.github/workflows/deploy.yml` type-checks, statically generates (`NITRO_PRESET=github_pages npm run generate`) and deploys to GitHub Pages on every push to `main`. `quality.yml` runs lint, spellcheck and typecheck.

## Commands

- `npm run dev`: dev server with HMR.
- `npm run build`: production build to `.output/` (prerenders all content routes).
- `npm run preview`: serve the production build.
- `npm run check`: `nuxt typecheck`.

## Style

- Two-space indentation, `<script setup lang="ts">`, PascalCase components, kebab-case content files.
- Tailwind utilities first. Colour tokens (`bg`, `surface`, `ink`, `muted`, `line`, `accent`, `now`) are defined once in `main.css`, with light/dark values; never hard-code theme colours in components.
- Amber (`now`) is reserved for "currently building / playing / reading" signals.
- Copy is sentence case, plain and specific. No all-caps eyebrow labels and no arrow-suffixed links.

## Testing

- Run `npm run build` and `npm run check` before committing.
- Manual checks: light, dark and system theme; 390px mobile width; keyboard focus; `prefers-reduced-motion`.

## Commits

- Conventional Commits: `feat|fix|refactor|docs|chore|style|perf|test` with optional scope.
