# brainfreeze

A guessing game similar to heads-up.

## Local development

```bash
npm install
npm run dev
```

This will serve the app at `http://localhost:3000` (or another port printed by `serve`).

## Deploying to Netlify

This repo is now a Node-based static app configured for Netlify.

1. Push this repo to GitHub/GitLab/Bitbucket.
2. In Netlify, create a new site from your repo.
3. Set the build settings:
   - **Build command**: (leave blank)
   - **Publish directory**: `.`

Netlify will publish `index.html`, `app.js`, `style.css`, and `items.json` as a static site.
