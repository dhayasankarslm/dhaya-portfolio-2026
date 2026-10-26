# V5 — Personal desktop, continuous workspace

Current implementation uses the supplied footer compositions: large direct contact links, an original waving illustration, a copyright strip, and oversized personal lettering. Only Dhaya’s public email, Instagram and CV are used; the references’ contact information, names and brands are not copied. There is no game.

The earlier folder-tab scroll stack and six-icon quick-access panel are removed from the rendered page. The layout now uses a left-aligned introduction, independent glass tools, interactive project folders, a personal story and one continuous fixed scenic layer. Background motion pauses outside the opening workspace, while dialogs are active and when the document is hidden; the same frame remains behind the page. A still image is used for reduced motion. Content panels provide contrast without different section backgrounds.

## macOS comparison

Apple’s current [macOS 27 overview](https://www.apple.com/os/macos/) and [AppKit design updates](https://developer.apple.com/videos/play/wwdc2026/289/) were consulted, including the official updated toolbar image. The web treatment follows clear/tinted glass, stronger readable foregrounds, consistent toolbar surfaces and concentric control shapes. It is a web approximation, not a native macOS component package. Control Center changes this workspace’s appearance, scene brightness and actual music volume.

[Air](https://air.inc/) was inspected for background continuity. The site retains the existing scenic asset behind all content, with a soft sky/cream wash rather than separate opaque scene blocks. The earlier V4 background provenance remains recorded in `dist/assets/macos/sources.json`.

## React Bits Folder

Exact registry: https://reactbits.dev/r/Folder-TS-CSS.json

Saved to `src/components/Folder/registry.json`; exact upstream `Folder.tsx` and `Folder.css` are colocated. The registry lists zero dependencies and zero registry dependencies, so no extra package was needed. The existing esbuild setup compiles TSX directly; no shadcn scaffold or alias was introduced. Source-content equality was verified against the saved registry.

Brand and UX folders open the corresponding real projects; the blue glass book opens actual photographs. The project index provides an additional keyboard-friendly route into every project. Upstream reduced-motion and event-driven animation behavior are retained. The shared React Bits MIT license remains in `src/components/REACT-BITS-LICENSE.md`.

## Additional tools and motion

- Spotlight: Ctrl/⌘K, project/page filtering, arrow-key selection and Return to open.
- Control Center: day/night, glass tint, background brightness and shared music volume, with saved appearance preferences.
- Focus: 25/5-minute modes, real countdown, pause and reset.
- World Clock: Hamburg and Chennai using actual time zones.
- Photos memory widget: all 34 images, previous/next, open viewer and full-library link.
- Original SVG companion and route: see `MASCOT-ROUTE.md`. The supplied video references were inspected as contact sheets in `../output/animation-references/`.

The original static sprite is no longer active. The vector rig permits independent expressions and eliminates the generated-avatar texture. No hard refresh-rate promise is made; actual frame rate depends on hardware, browser, display and page workload.
