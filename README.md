# Echo — Marketing Website

A self-contained, production-ready static website for the **Echo** game. No build step, no dependencies, no framework — just open or upload.

## Structure

```
echo-web/
├── index.html          # Landing page (hero, how-it-plays, features, heroes, download, footer)
├── privacy.html        # Privacy Policy (full content)
├── terms.html          # Terms of Use (full content)
├── 404.html            # Themed not-found page
├── robots.txt
├── README.md
└── assets/
    ├── css/styles.css  # Design system ("Cube Command" — mirrors the in-game theme)
    ├── js/main.js      # Nav, scroll reveal, parallax (vanilla JS)
    └── img/            # Logo + cube-hero renders reused from the game
```

## Deploy

It's plain static files — host it anywhere:

- **Drag & drop:** Netlify Drop, Cloudflare Pages, Vercel, GitHub Pages, Firebase Hosting, or any classic web host (S3, Nginx, Apache). Upload the **contents** of `echo-web/` to your web root.
- **Local preview:** open `index.html` directly, or run `python3 -m http.server` inside this folder and visit `http://localhost:8000`.

## Before launch — two quick edits

1. **Store links.** In `index.html`, search for `href="#"` in the Download section and replace with your App Store / Google Play URLs.
2. **(Optional) Social image / domain.** Update the `og:image` and add a `<link rel="canonical">` domain in each page's `<head>` once your domain is live.

## Notes

- **Fonts:** Poppins via Google Fonts (with a system rounded fallback). Works offline-gracefully.
- **Performance:** no JS libraries; images are lazy-loaded; animations are transform/opacity-based and respect `prefers-reduced-motion`.
- **Branding:** colors, radii, typography and the cube motifs match the game's theme tokens. Hero/character art is reused from the game's asset catalog.
- **Legal pages:** Privacy Policy and Terms of Use are complete and tailored to the game (Sign in with Apple, leaderboard, ads, in-app purchase, account deletion). Review with your own counsel before publishing.
