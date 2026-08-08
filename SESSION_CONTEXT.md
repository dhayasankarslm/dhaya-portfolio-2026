# Portfolio Project — Session Context

Personal portfolio site for **Dhayasankar Vasudevan** — UX/graphic/product designer, currently pursuing M.A. User Experience Design at Berlin School of Business & Innovation (BSBI), Hamburg. Physics background (B.Sc, PSG College of Arts & Science). Founder of D Magic Studios, Design Head at PY Robotics, ex-freelance graphic designer (VDS Designs), and composed music for 20+ short films.

## Tech stack
- **Next.js 16** (App Router), TypeScript, Tailwind CSS v4
- **GSAP** + `@gsap/react` (useGSAP) — primary animation engine, ScrollTrigger for scroll effects
- **Lenis** — smooth scroll, wired to GSAP ticker (`SmoothScrollProvider.tsx`)
- **three.js** + `@react-three/fiber` + `@react-three/drei` — installed, used minimally (was used for a 3D sphere `InfiniteMenu` that was later replaced)
- Dev server runs via `.claude/launch.json` config name `portfolio-dev`, port 3000

## Project structure
- All components in `src/components/` (flat, no subfolders)
- Single page at `src/app/page.tsx` assembling all sections in order
- Global styles/tokens in `src/app/globals.css`, fonts/background layers wired in `src/app/layout.tsx`
- User assets originally in `assets/` (with messy Instagram-export filenames), copied/renamed into `public/media/` subfolders for use:
  - `public/media/` — logo.png, sticker.png, profile.jpg, landing.mp4 (201MB — flagged as too heavy for production, needs compression)
  - `public/media/photography/` — photo-01.jpg … photo-34.jpg (all 34 of the user's own photos)
  - `public/media/logos/` — 8 real company/collaborator logos (loopzen, bsbi, py-robotics, club, ic, roshan-vlogs, vibe, f-logo)
  - `public/media/icons/` — 6 software tool icons (figma, photoshop, illustrator, premiere, lightroom, davinci)

## Design language (current state)
- Palette: cream background (`#f4f3ef` base, now a radial vignette gradient `#fbfaf6→#f4f3ef→#ece8dd`), near-black foreground (`#0d0d0b`), primary accent terracotta-orange (`#c9542f`), secondary accent deep teal (`#3d6b5e`) added for variety, muted gray (`#6f6d66`)
- Typography: **Clash Display** (headings/`.font-display`) + **General Sans** (body) — both loaded via Fontshare `<link>` in layout.tsx (NOT next/font — an earlier attempt to use `@import` inside globals.css broke Tailwind v4's CSS pipeline; must stay as a `<link>` tag)
- Background layers (fixed, stacked, in `layout.tsx`, back to front): `BackgroundPhoto` (photo + cream scrim, picsum.photos placeholder — **user will replace this image**) → `Aurora` (drifting blurred color blobs, pastel gold/rose/plum, low opacity ~0.14) → grain noise texture (CSS class `.grain` on body)
- "Glass" aesthetic partially applied: `SpotlightCard` (shared by Experience cards, etc.) defaults to frosted glass (`bg-white/45 backdrop-blur-xl`) via a `glass` prop — but **Featured Projects explicitly opts out** (`glass={false}`) to keep its original solid dark-card look. Nav header is a floating glass pill bar.
- Explicit user preference: **no ReactBits literal source code** — every "ReactBits-inspired" component in this project is an original implementation built to match the described visual/API, never the actual registry source (that's proprietary/licensed). This constraint has come up repeatedly and must continue.

## Page structure (src/app/page.tsx, top to bottom)
1. `Nav` — floating glass pill header, `PillNav` (desktop links) + `BubbleMenu` (hamburger → rotated circular bubble links)
2. `IntroReveal` — loading screen (`Loader`, name + % counter) → video centered small with name popping in → scroll-driven pin expands video to fullscreen → unpins into rest of site. Has `InteractiveGrid` (subtle mouse-reactive canvas dot grid) behind it.
3. `Hero` — badges (Physics→Design / MA UX / Open to opportunities), `ShinyText` sheen effect on "genuinely hard to forget", `TextType` typewriter cycling roles, `FloatingIcons` (6 software icons drifting randomly around, NOT orbiting), Magnetic CTA buttons
4. `Projects` (Featured Projects) — solid dark section (glass explicitly disabled), 4 real projects: Loopzen, BSBI Rebranding, Py Robotics, Bhunidhi — "Cover for X" placeholder color blocks (no real cover images yet)
5. `TextLoop` — curved/wave SVG text marquee band ("UX Design ✦ Brand Identity ✦ Motion ✦ Sound")
6. `About` — bio (verbatim from resume), `TiltedCard` photo (mouse-tilt, rotated accent backing card), `StickerPeel` (draggable sticker), `CircularText` (spinning badge), `CountUp` stats, `AnimatedList` interests
7. `Experience` — 4 real roles (D Magic Studios, PY Robotics, VDS Designs, Music Composer) as glass `SpotlightCard`s, alternating accent/accent-2 color on role labels, numbered badges were added then removed per user request
8. `Collaborators` — `LogoLoop`, black band, real logos, seamless infinite scroll (rebuilt multiple times — see "Known issues fixed" below)
9. `Services` ("What I Do") — 3 real capability categories (UI/UX Design, Graphic & Brand Design, Motion & Sound), simple pointer-drag horizontal scroll (NOT GSAP pin — that caused a bad collision bug, see below)
10. `SkillsEducation` — tools, code, languages, education (BSBI + PSG College; secondary education entry removed per request)
11. `Photography` ("Off the clock") — `CircularGallery` (curved horizontal drag gallery, portrait-oriented tiles, real photos), `GradualBlur` edge fades, "View all 34 photos" → `PhotoLightbox` (masonry modal, needed `data-lenis-prevent` to fix scroll)
12. `Cta` — "Got a project or an opportunity?" with real email/site link
13. `Faq` — personal Q&A (availability, project types, location, tools) — NOT the original agency/subscription FAQ
14. `PlayfulButton` — "this button does absolutely nothing" easter egg with `ClickSpark`
15. `Footer` — real contact info (dhayasankarinslm@gmail.com, dhayasankar.in), circular badge

## Content strategy decision (important)
Early in the session the site was built as a generic **design agency** template (pricing tiers, "why us" studio comparison, fake client testimonials, subscription-based FAQ). This was explicitly identified as wrong for an **individual job-seeking portfolio** and was cut/rewritten:
- **Removed entirely**: Pricing, WhyUs comparison, fabricated Reviews, agency-style Process (client-onboarding chat)
- **Kept/rebuilt with real content**: Experience (from actual resume), Skills & Education (from actual resume), Services reframed around real capabilities, FAQ rewritten as personal questions

## Component library built (all original implementations, ~40+ components in src/components/)
Text/reveal: `RevealText`, `BlurText`, `ShinyText`, `ScrambleText`, `TextType`, `SplitFlap`, `HighlightSweep` (built but currently unused — user reverted to ShinyText)
Layout/interaction: `Marquee`, `TextLoop`, `LogoLoop`, `FlowingMenu` (early version, superseded), `CircularGallery`, `CardStack`, `AnimatedList`, `Stepper`-style badges
Cards/surfaces: `SpotlightCard` (glass toggle), `TiltedCard`, `GlassSurface`, `ProgressiveBlur`, `GradualBlur`
Nav: `PillNav`, `BubbleMenu` (replaced an earlier custom Nav overlay)
Backgrounds/atmosphere: `Aurora`, `BackgroundPhoto`, `InteractiveGrid`, grain CSS
Playful/misc: `StickerPeel`, `CircularText`, `OrbitRing` (built, removed from Hero, replaced by `FloatingIcons`), `FloatingIcons`, `ClickSpark`, `FuzzyHover`, `CountUp`, `Magnetic`, `GlareHover`, `Loader`, `IntroReveal`, `PhotoLightbox`
Removed/superseded: `InfiniteMenu` (3D WebGL sphere, replaced by `CircularGallery` per user preference for the sketch-matched flat layout — file may still exist but unused), `WorkStrip`, `Showreel`, `Statement`, `Clients`, `WhyUs`, `Reviews`, `Pricing`, `Process` (all deleted)

## Known bugs fixed this session (useful if regressions reappear)
1. **CSS `@import` ordering** — Fontshare font `@import` inside globals.css broke Tailwind v4; fixed by loading fonts via `<link>` in layout.tsx head instead.
2. **Services/Experience scroll collision** — GSAP horizontal-pin ScrollTrigger computed scroll distance once at mount before layout settled (fonts/images), causing pin spacer mis-sizing and visible overlap with adjacent sections. Fixed by abandoning the pin technique entirely for Services — now a simple pointer-drag horizontal scroller (no ScrollTrigger pin).
3. **LogoLoop seamless loop + flicker + frozen animation** — went through several iterations:
   - Pixel-based `x` animation caused flicker at loop reset (sub-pixel mismatch) → switched to `xPercent`
   - Duplicating 4x with wrong duration math caused the animation to appear completely frozen (duration accidentally ~1111s) → fixed math
   - Final robust version: exactly 2 duplicated sets, `requestAnimationFrame`-driven constant-speed `translate3d`, wrap-by-exact-measured-set-width (not viewport-based) — this is the correct "seamless conveyor belt" pattern requested and should not be changed back to GSAP tweens.
4. **TextLoop crooked/clipped text** — SVG viewBox height (200) didn't match container height (86px) with `preserveAspectRatio="slice"`, causing inconsistent vertical cropping per letter. Fixed with `preserveAspectRatio="none"` and viewBox height = actual container height, amplitude clamped to fit.
5. **PhotoLightbox scroll not working** — Lenis captures wheel events globally and doesn't know about nested scrollable overlays. Fixed with `data-lenis-prevent` attribute (Lenis's documented escape hatch).
6. **IntroReveal video flash** — video frame briefly rendered fullscreen before GSAP set its small starting size. Fixed by setting initial size via inline `style` in JSX (first paint), not via a `gsap.set` that only ran after `ready` became true.
7. **Aurora background not moving** — `yoyo:true` + `repeat:-1` only picks one random target ever, so if the random draw was small the blob barely moved. Fixed with a self-rescheduling drift loop (same pattern as `FloatingIcons`/`CircularGallery`) that picks a fresh random target every cycle.
8. **Dynamic `as={Tag}` JSX components** (`RevealText`, `BlurText`) hit a TypeScript error (`children: never`) under stricter JSX typing — fixed by using `React.createElement(Tag, ...)` instead of JSX for the dynamic tag.
9. Recurring false alarm throughout the session: the browser console tool sometimes returns a **stale accumulated error buffer** referencing long-deleted components (Pricing, WhyUs, FlowingMenu, etc.) — always cross-check with a direct `curl` HTTP 200 check and/or `get_page_text` before trusting console errors as current.

## Explicit constraints/preferences from the user (must keep respecting)
- Never fetch/install ReactBits' actual registry source or run `npx shadcn add @react-bits/...` — always build original components matching the described behavior instead.
- Cannot scrape Instagram (no API access set up, ToS issue) — user manually uploads images to `assets/` instead.
- Landing video (`public/media/landing.mp4`, 201MB) still needs compression for production — no ffmpeg/image tool available in this environment; flagged but unresolved.
- Featured Projects section must stay non-glass (solid dark cards) even though `SpotlightCard` defaults to glass elsewhere.
- Background photo is a temporary picsum.photos placeholder — user said they'll provide a replacement image.

## Open items / likely next steps
- Real cover images for the 4 Featured Projects (currently colored placeholder blocks)
- Replace placeholder background photo with user's real image
- Compress landing.mp4 for production
- Possibly extend the glass treatment or hold as-is (last explicit instruction: keep Projects solid, rest of the glass rollout was accepted)
- Aurora/background tuning was last adjusted to: colors `["#f0cf8f", "#dba9bb", "#8d76a8"]` (pastel gold/rose/plum, no orange), `blend=0.14`, `amplitude=1.3`, `speed=2.2`
