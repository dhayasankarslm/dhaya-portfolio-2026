# Dhayasankar — portfolio

A personal portfolio presented as a calm, tactile desktop: UX and brand projects, street and landscape photography, music I’m listening to, and a little about me.

## Run locally

```sh
npm install
npm run build
npm run dev
```

Then open http://localhost:4173/.

## Build and hosting

`npm run build` bundles the React app into `dist/`. Netlify builds the same command, publishes `dist/`, and routes `/api/weather` to the function in `netlify/functions/weather.mjs`. The weather card uses Open-Meteo for Hamburg; the site also shows Hamburg local time.

## Content

The project folders include Vero Cafe, NON E, VARKAH, Host and Taste, and Hamburg research. Case-study previews are clearly marked where project material still needs to be added. The photo library contains 34 photographs, and the music area links to Apple Music previews for the songs Dhaya shared.

The main entry point is `src/mac/main.jsx`; the portfolio layout is in `src/mac/App.jsx`. The supplied CV and visual assets are served from `dist/assets/`.
