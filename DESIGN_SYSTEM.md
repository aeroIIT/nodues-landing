# NoDues Landing — Design System

The single source of truth for this landing page's look & feel. **Follow this; do not
re-invent the design each change.** It captures the state the user signed off on.

North star: **simplicity, class, elegance** — like smallest.ai. Minimal, airy, editorial.
When in doubt, remove rather than add.

---

## Brand & tone

- **Product:** NoDues — the **Voice-AI-powered agentic OS / infrastructure** for debt
  collection. It **decides who to target, when, and how**, then orchestrates execution
  at portfolio scale.
- **It is NOT** "an AI agent" we sell. Voice / WhatsApp / SMS / email are **execution
  channels**, not the product.
- **Audience:** big enterprise lenders & collection teams. Page's job = **join the
  waitlist**.
- Hero headline (exact, 3 lines): **"The OS for / Intelligent Collection / at Scale"**
  with only **"OS"** in accent blue.
- Hero description starts with **"Voice AI powered…"** and stays to ~1 sentence.

---

## Color

| Token | Value | Use |
|---|---|---|
| Accent | `#070094` (`--accent`, util `accent`) | **Sparingly:** section icons, the single "OS" accent word, data-viz, outgoing chat bubble, focus rings. |
| Black | `#000` (`text-black`, `bg-black`, `bg-foreground`) | Headlines, **all buttons**, footer. |
| White | `#fff` | Backgrounds, text on dark. |
| Grays | `gray-50/100/200/300/400/500/600/800` | `gray-600` body text, `gray-400` muted/icons-in-problem, `gray-200` borders/hairlines. |
| Success | `green-50` bg / `green-700` text | **Only** semantic status pills in product snippets (e.g. "Partial payment received"). |

### Accent rules (the user has corrected this repeatedly — respect it)
- **Buttons are BLACK, never blue.** (`btn-primary`, nav CTA `bg-black`.)
- **Eyebrows are gray** (`text-gray-600`), never accent.
- **No blue section backgrounds, no blue buttons.** Sections are white. No alternating
  gray section bands.
- Blue appears in **exactly**: icons (Platform/Why/Compliance), the "OS" word, charts,
  outgoing chat bubble, input focus rings. That's it.

---

## Typography

- **Serif (headings):** Crimson Text — applied globally to `h1–h6` via `font-serif`.
- **Sans (body):** Inter.
- All headings use **`tracking-tight`** (slightly negative letter-spacing) for an
  editorial, original feel.

| Role | Class / size |
|---|---|
| Hero `h1` | `.headline-serif` → `text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tight` |
| Section headers (`h2`, non-hero) | `.heading-section` → `text-3xl md:text-4xl leading-tight tracking-tight` |
| Feature-row sub-headings (`h3`) | `font-serif text-xl md:text-2xl tracking-tight` |
| Feature-grid card titles | `font-medium text-black mb-2` (Problem & Platform match) |
| Eyebrow / kicker | `text-sm text-gray-600 uppercase tracking-wide` |
| Body / supporting | `text-lg text-gray-600 leading-relaxed` (intro), `text-gray-600` (in-card) |

Only the **hero** uses the big `headline-serif`. Everything below it uses
`heading-section`. Keep that hierarchy.

---

## Buttons (in `index.css` `@layer components`)

- `.btn-primary` — `px-6 py-3 rounded-lg bg-foreground text-background` (black). Primary CTA.
- `.btn-secondary` — `px-6 py-3 rounded-lg border border-foreground` (outline). Secondary.
- `.btn-accent` — blue; **avoid on this page** (kept for completeness only).
- Nav CTA uses shadcn `<Button className="bg-black text-white hover:bg-gray-800">`.
- Primary CTAs say **"Join the Waitlist"** and scroll to `#waitlist`.

---

## Surfaces & layout

- **Radius:** `--radius: 0.5rem` → `rounded-lg` everywhere. Product snippet cards use
  `rounded-xl`.
- `.card-minimal` — `border border-border p-8 rounded-lg`. Used for the **waitlist form**
  and **compliance cert tiles** only — NOT for the Problem/Platform feature grids.
- **Snippet cards** — `rounded-xl border border-gray-200 bg-white shadow-sm` (soft,
  floating; see `components/Snippets.tsx`).
- `.container` — centered, max-width ~1200px, responsive padding.
- `.section-spacing` — `py-16 md:py-24 lg:py-32`.
- **No section dividers** (no `border-b` between sections). Separation = whitespace only.
- **Background texture:** a faint accent dot-grid is painted **directly on the page
  wrapper background** via `.page-bg` (~10% `#070094` dots, 20px grid + a `linear-gradient`
  that fades them out below 80% of page height). It scrolls with the page.
  ⚠️ Do NOT put it on a `-z-10` child of a wrapper that has its own background — the
  parent's background paints over it and it vanishes. Element-background is the reliable
  way. The hero adds a soft radial accent **glow** + a large faint **`₹` watermark**
  (`text-black/[0.05]`), in a `-z-10` layer that works because the hero is `isolate`d;
  clipped by `overflow-hidden`. Solid surfaces (nav, snippet cards, the waitlist panel
  `bg-white`, footer) sit cleanly on top.
- **Section intro pattern:** centered `eyebrow` + `heading-section` + supporting `<p>`.

---

## Component patterns

- **FAQ** — two columns (`md:grid-cols-3`): heading **left** (`heading-section`),
  accordion **right** (`md:col-span-2`). Rows separated by `border-y` hairlines,
  `py-5`. Toggle = **`Plus` icon rotating 45° → ×** (not a chevron). Stacks on mobile.
- **Feature showcase** — alternating two-column rows (`md:grid-cols-2`, swap with
  `md:order-1/2`): text on one side, a **mini product "screenshot" snippet** on the
  other. The three canonical snippets: **daily call-volume chart**, **build-trust note
  card**, **real-time WhatsApp negotiation chat**.
- **Feature grid (Problem / Platform)** — identical layout: `md:grid-cols-3 gap-8`,
  `text-center` cards, **no box outline**. Each item: icon `h-8 w-8 mx-auto mb-4`, title
  `font-medium text-black mb-2`, desc `text-sm text-gray-600`. Only the icon **color**
  differs — Problem `text-gray-400`, Platform `text-accent`. Keep them mirrored.
- **Icons** — `lucide-react`, `h-8 w-8`. Original set only (Phone, Users, TrendingUp,
  BarChart3, Shield, CreditCard, Settings, MessageSquare). Accent color in
  Platform/Why/Compliance; `text-gray-400` in the Problem grid. **Don't swap in a new
  icon family** (no Target/Brain/Workflow/etc.).
- **Waitlist form** — lives in the hero's right column (`#waitlist`). Inputs:
  `border border-gray-300 rounded-lg`, focus ring **black** (not blue). Submit =
  `.btn-primary w-full` (black). Success state = black check in a circle + confirmation.
  TODO: not yet wired to a backend/provider.

---

## Stack

React 19 + Vite + TypeScript, Tailwind v4 (`@theme` tokens in `index.css`),
`lucide-react`, `wouter`. Pure static SPA. `pnpm dev` on :3000, `pnpm build` → `dist`.
