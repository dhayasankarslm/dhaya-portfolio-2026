# Portfolio Plan — Notes & Analysis

## 1. References breakdown

### Design inspiration
- **[benorth.studio](https://benorth.studio/es)** — Spanish brand studio site. Bold, oversized typography ("we build bold brands"), collage-style imagery mixing photography + illustration, a showreel video, playful interactive touches (visitors can drop a sticker on the homepage), bilingual toggle. North star for *personality*: confident, editorial, a little playful — not a generic dev-portfolio grid.
- **[Awwwards — Portfolio category](https://www.awwwards.com/websites/portfolio/)** — the broader genre benorth.studio belongs to: big type, unconventional grids, heavy scroll storytelling, custom cursors, page transitions, sometimes WebGL. Browse to pin down which flavor (minimal/editorial vs. maximalist/experimental vs. 3D-heavy) fits.

### Component / animation toolkits
- **[GSAP](https://gsap.com/)** — the actual animation engine. ScrollTrigger for scroll-driven reveals/pinning, timelines for choreographed sequences, SplitText for text-reveal animations. Backbone of almost every Awwwards-tier site.
- **[Skiper UI](https://skiper-ui.com/components)** — React/Tailwind animated component library (shadcn-style, copy-paste blocks: heroes, marquees, cards). Good for scaffolding sections fast.
- **[Motion Primitives](https://motion-primitives.com/docs/progressive-blur)** — React + Motion(Framer Motion) primitives. Progressive Blur = gradient-blur mask, useful for fading images/content at edges, glassmorphic overlays.
- **[ui.watermelon.sh](https://ui.watermelon.sh/home)** — same category, prebuilt animated component sets (site returned 403 on fetch, worth checking manually).
- **[Haikei](https://haikei.app/generators/)** — generates organic SVG backgrounds: Blob, Wave, Blurry Gradient, Circle Scatter, Blob Scene, Layered/Stacked Waves, Low Poly Grid, Layered/Stacked Peaks, Polygon Scatter, Layered/Stacked Steps, Symbol Scatter. Good for a distinctive hero/section background without custom illustration or WebGL.

## 2. What's realistically possible

Combining these gets you: big editorial typography, GSAP-driven scroll storytelling (pinned sections, reveal-on-scroll text/images), smooth transitions, an organic Haikei-generated background for texture, and polish details like progressive blur on images and hover-driven cards from the component libraries. This is achievable and does **not** require full WebGL/Three.js to look "Awwwards-good" — benorth.studio itself is mostly 2D + smooth motion, not 3D.

## 3. Recommended plan

1. **Pin down the flavor first** — browse more Awwwards portfolios (see shortlist below) and decide which 2-3 to emulate. This changes the tech stack materially.
2. **Stack**: Next.js/React + Tailwind + GSAP (ScrollTrigger + SplitText) as the core. Skiper/Motion Primitives as copy-paste starting points, not hard dependencies.
3. **Content architecture before animation** — hero, about, selected work (case studies), contact. Get layout/type system right in static form first, then layer scroll animation on top section by section.
4. **Visual texture** — one or two Haikei-generated SVGs for hero/section backgrounds instead of stock imagery.
5. **Build in passes**: static layout → typography system → scroll animations → micro-interactions (cursor, hover states, progressive blur) → performance/reduced-motion pass.

## 4. Chosen direction (locked in from picks)

Specific elements picked out, per reference:

- **[By-Kin](https://www.awwwards.com/sites/kin-2)** — overall restraint: confident editorial typography, weighted smooth scroll, transitions that never call attention to themselves but make the page feel like one continuous surface. Won Awwwards SOTD + Developer Award. Stack: **Next.js + GSAP + Strapi** (headless CMS — relevant for section 5 below).
- **[Komma Komma](https://www.awwwards.com/sites/komma-komma)** — project/work section specifically: bespoke case-study presentation, strong visual system, smooth motion per project entry.
- **[Partizan](https://www.awwwards.com/sites/partizan)** — top nav + typography: a scannable grid-style nav (mixes label/category/title like an insider directory), fullscreen media on click, strict 2-color (black/white) palette, functional hierarchy over decoration.
- **[TRIONN](https://www.awwwards.com/sites/trionn-2)** — animation + 3D-object-centric design + project display: built with **Next.js, GSAP, ScrollTrigger, Three.js, Lenis** (smooth scroll). Each project treated like a spotlit 3D installation rather than a flat image grid.

**Synthesis**: this combination points toward an editorial-but-technical direction — restrained typography and navigation (By-Kin/Partizan) as the *frame*, with a 3D/motion-forward project showcase (TRIONN/Komma Komma) as the *centerpiece*. Not full-maximalist WebGL everywhere — reserve the 3D/heavy motion budget for the work/project section specifically, keep nav, about, and text sections closer to By-Kin/Partizan's restraint. That contrast (calm shell, energetic showcase) is what makes sites like this read as premium rather than noisy.

**Additional references worth a look**, in the same register (3D-centric, engineering-led, Awwwards-recent):
- **OFF+BRAND** — *Steven.com* (Awwwards SOTD + Developer Award, 2026)
- **Unseen Studio** — *Hubtown* (Awwwards SOTD + Developer Award, 2026)
- **Vide Infra** — *Springs* (Awwwards SOTD + Developer Award, 2026)
- **Iventions** — Three.js scene treating each project like a spotlit installation, GSAP-paced reveals — very close to what TRIONN is doing
- **Lusion** — known for unusually fluid motion work, a common reference point for this whole category

## 5. Recommended tech stack (given the above)

Confirmed by what the actual reference sites are built with: **Next.js + GSAP (ScrollTrigger, SplitText) + Lenis (smooth scroll) + Three.js/React Three Fiber** for the project showcase's 3D pieces. This isn't a stretch goal — it's literally the stack TRIONN and By-Kin ship in production.

## 6. Content management / easy project upload system (LAST — after the site itself is built)

Goal: add/edit portfolio projects without touching code each time.

**Is a custom CMS "too hard"? No — for a single content type (projects), it's genuinely feasible, not a big undertaking.** A minimal custom admin is: one Postgres table (title, description, cover image, gallery images, tags, links, order/featured flag), Supabase for Auth + Storage + DB, and one protected `/admin` route in Next.js with a form to create/edit/delete/reorder projects. That's a well-trodden CRUD pattern, roughly a **1–3 day build**, not a multi-week one — most of the complexity in "building a CMS" comes from supporting arbitrary content types and multiple users, which doesn't apply here since it's just you managing project entries.

**Decision: go with the custom admin.** Given it's feasible, this is the better call for a portfolio specifically — full control over the exact fields the project cards/case-study layout needs (including whatever the 3D showcase requires, e.g. a model URL or hotspot data per project), no third-party dependency/pricing tier to manage, and it doubles as a legitimate "I built my own CMS" talking point in the portfolio itself.

**Stack for it**: Supabase (Postgres + Auth + Storage bucket for images/models) + a Next.js `/admin` route gated behind Supabase Auth (email/password or magic link, just for you) + server actions or API routes for create/update/delete/reorder. Public site pages fetch published projects server-side at request/build time — no separate API layer needed since it's the same Next.js app.

Middle-ground alternative, for reference: **Strapi** (self-hosted headless CMS, open source) — what By-Kin itself uses. Gives you an admin UI out of the box without building the CRUD forms yourself, at the cost of running/hosting a separate service. Worth knowing about, but the Supabase custom-admin route is leaner for a single-content-type use case like this.
