<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Vũ Trụ Task Vụ repository guide

## Project

- Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, and pnpm.
- The interface is Vietnamese with a neon/cyberpunk visual system.
- There is no `src/` directory: source code is in `app/`, `components/`, `libs/`, and `types/`.
- Use `@/*` for root-relative imports.

## Commands

```bash
pnpm dev
pnpm lint
pnpm build
pnpm start
```

Run `pnpm lint` after each change. Also run `pnpm build` after changing routes, shared components, metadata, or TypeScript types.

## Code map

| Location | Responsibility |
| --- | --- |
| `app/` | Routes, root layout, global CSS, sitemap, and robots. |
| `app/(site)/mission/play/` | Client-side multitasking game, engine, mini-games, summary, and audio. |
| `components/layout/` | Shared header, footer, and skip link mounted from the root layout. |
| `components/ui/` | Reusable neon primitives. |
| `components/features/media/` | Interactive Media Archive page implementations. |
| `libs/content/` | Typed campaign data. Update this before hard-coding reusable content in a page. |
| `libs/navigation.ts` | Primary navigation. |
| `types/content.ts` | Shared content models. |
| `public/` | Runtime static assets. `assets/` is reference material, not served by Next.js. |

## Routing

- The root layout owns the site shell. Every page must render exactly one `<main id="main-content">` for the shared skip link.
- `(site)` is a route group, not a URL segment.
- Article routes at `information/[slug]` use `libs/content/articles.ts`.
- Keep `app/sitemap.ts` and `app/robots.ts` aligned with public routes.

## Components and browser code

- Pages are server components by default. Use `"use client"` only for hooks, events, state, or browser APIs.
- `SiteLayout.tsx`, `MediaPages.tsx`, and mission gameplay are client components; do not import server-only code into them.
- Keep `window`, `AudioContext`, timers, and keyboard events in client components/effects; clean up subscriptions and listeners.
- Do not render non-deterministic values (`Date.now()`, `Math.random()`, locale-dependent values) in SSR output; they cause hydration mismatches.

## Content, design, and accessibility

- Preserve UTF-8 Vietnamese text; do not introduce mojibake or HTML escape sequences.
- Data ownership: `site.ts` for identity/contact, `articles.ts` for articles, `media.ts` for archive data, `mission.ts` for the quiz, and `navigation.ts` for the menu.
- Reuse `NeonButton`, `NeonCard`, `SectionHeading`, and `EmptyAssetFrame` before adding one-off components.
- Use color variables in `app/globals.css`; retain focus styles, semantic headings, alt text, touch targets, and reduced-motion support.
- `EmptyAssetFrame` is intentional until an asset is placed in `public/` and an `AssetRef.src` is supplied.

## Mission game

- Game IDs are fixed: `km`, `ht`, `nc`, and `px`; their shared labels/constants are in `mission/play/types.ts`.
- `useGameEngine` owns game score, levels, penalties, completion, and reset. Mini-games must report through its callbacks rather than duplicate score state.
- Test mouse/touch and documented keyboard controls, restart, penalties, completion, and summary when modifying the game.

## Change discipline

- Keep changes focused and do not reformat unrelated files.
- Never edit `.next/` or `node_modules/`. Do not update `pnpm-lock.yaml` unless dependencies change.
- Document new environment variables or external services in `README.md`.
