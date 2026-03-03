# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static HTML/CSS/JS website for **Association Coeurs et Sourires**, a French non-profit that collects donations to buy gifts for long-term hospitalized children. Founded by Cathia ETESSE.

No build system, no framework, no package manager. Files are served directly — deploy as-is to any static host (Vercel preset: **Other**, no build command).

## File Structure

```
/
├── index.html                   # Home page
├── nous-connaitre.html          # About / founder page
├── nos-actions.html             # Actions & beneficiaries
├── faire-un-don.html            # Donation page
├── contact.html                 # Contact form
├── politique-cookies.html       # Cookie policy (RGPD/CNIL)
├── mentions-legales.html        # Legal notices (LCEN)
├── politique-confidentialite.html # Privacy policy (RGPD)
├── css/style.css                # Single stylesheet (all pages)
├── js/main.js                   # Single script (all pages)
└── images/
    ├── Logo_détouré.png         # Main logo (used in nav, hero, footer)
    └── affiche.jpeg             # Brand reference (colors/tone)
```

## Architecture

### CSS Design System (`css/style.css`)

All styles live in one file, structured in order:
1. CSS variables (`:root`) — colors, shadows, radii, gradients, fonts
2. Reset & base — typography, layout primitives (`.container`, `.section`, `.grid-*`)
3. Component blocks — navbar, hero, stats, cards, forms, footer, cookie banner
4. Page-specific blocks — `.founder-grid`, `.actions-grid`, `.donation-amounts`, `.legal-content`, etc.
5. **Mobile overrides** (appended at the end) — all `@media` queries for responsiveness, grid utilities

**Key CSS variables** (defined in `:root`):
- `--primary: #1a1473` (deep navy), `--secondary: #00c8f8` (cyan), `--pink: #e91e8c`, `--gold: #ffd700`
- `--rainbow` gradient used as decorative accent bars
- `--gradient-hero` for the navy hero background

**Grid utilities** (`.grid-2`, `.grid-3`, `.grid-4`) are defined at the bottom of the CSS with mobile breakpoints. Always use these classes instead of inline `style="display:grid..."` — inline grids have no mobile breakpoints.

### JavaScript (`js/main.js`)

Single script included on all pages. Key responsibilities:
- **Dynamic header positioning** — `updateHeaderPositions()` runs on load and resize; sets navbar `top` and mobile nav-links `top` based on the actual height of the alert banner (which varies by screen width). Never hardcode `top:44px` on `.navbar` in HTML.
- Navbar scroll effect (`.scrolled` class)
- Mobile nav toggle (hamburger ↔ X animation)
- Active nav link detection from `window.location.pathname`
- Scroll animations via `IntersectionObserver` (`.fade-in` → `.visible`)
- Animated stat counters (`data-count`, `data-suffix` attributes)
- FAQ accordion
- Donation amount selector
- Cookie banner logic (localStorage key: `cs_cookie_consent`)
- Contact form front-end simulation (no backend yet)
- Back-to-top button

### Page Layout Pattern

Every page follows the same structure:
```html
<alert-banner>       <!-- pages with "en cours de validation" notice -->
<nav class="navbar"> <!-- transparent (index) or .solid (inner pages) -->
<section class="hero"> or <section class="page-hero">
... content sections ...
<footer>
<div class="cookie-banner" id="cookieBanner">
<button id="backTop">
<script src="js/main.js">
```

Inner pages use `.page-hero` (compact) instead of the full-height `.hero`. The navbar on inner pages has class `.solid` (always dark background) rather than transparent-then-scrolled.

## Placeholders to Fill

Many `[PLACEHOLDER]` markers exist throughout the HTML. Key ones:
- `[EMAIL CONTACT]` — official contact email
- `[ADRESSE SIÈGE SOCIAL]` — registered office address
- `[NUMÉRO DE TÉLÉPHONE]` — contact phone
- `[PLACEHOLDER — N° RNA]` — association registration number
- `[PLACEHOLDER — Numéro SIRET]` — SIRET number
- `[PLACEHOLDER — Date officielle de création]` — official founding date
- `[PLACEHOLDER — Photo de Cathia ETESSE]` — founder photo in `nous-connaitre.html`
- `[PLACEHOLDER — Histoire détaillée]` — founder's biography text
- `[PLACEHOLDER — Widget HelloAsso]` — payment widget iframe in `faire-un-don.html`
- `[NOM DE L'HÉBERGEUR]` — web host name/address (required for legal pages)
- `[PLACEHOLDER — Réseaux sociaux]` — Facebook, Instagram, LinkedIn URLs (3 locations per page footer)
- `[Partenaire 1–5]` — partner logos on `index.html`
- Gallery photos in `nos-actions.html`

## Important Conventions

- **No inline grid styles** — use `.grid-2`, `.grid-3`, `.grid-4` CSS classes instead.
- **No hardcoded `top:44px` on `.navbar`** — the JS computes this dynamically from the alert banner height.
- **No hardcoded `margin-top:44px` on `.hero` / `.page-hero`** — also set by JS.
- Font Awesome 6.5 and Google Fonts (Playfair Display + Nunito) are loaded via CDN.
- All pages are in French; the lang attribute is `fr`.
- Form inputs must use `font-size: 16px` on mobile to prevent iOS Safari auto-zoom (already handled in the mobile CSS block).
