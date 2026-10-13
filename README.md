# Dance Institute of Denver

A custom, responsive dance-class website built with HTML, CSS and vanilla JavaScript. The design uses editorial typography, warm paper tones, a deep-red accent, real photography from the existing website, and restrained motion.

## Run

Open `index.html` directly, or serve this directory with any static web server. No build step, package installation, API key, or backend is required.

## Files

- `index.html` — page content, navigation, FAQ and accessible class dialog.
- `styles.css` — responsive layout, typography and reduced-motion support.
- `script.js` — class catalog, age/style filters, shareable filter URLs, dialog and mobile menu.

## Features

- Six visitor age groups and seven style filters, with a reset and empty state.
- Class details with real registration and schedule destinations.
- Placement-based programs explicitly ask visitors to confirm suitability.
- Adult-class shortcut, keyboard-accessible native modal and expandable FAQ.
- Mobile layouts, visible keyboard focus, skip link and reduced-motion behavior.
- No analytics, visitor storage, frameworks or invented reviews.

## Content and integrations

The program descriptions, studio address and telephone come from the existing Dance Institute website. The studio schedule and registration links remain external; Sawyer handles memberships and booking. Program offerings should be reviewed by the studio before launch because the source website includes older program descriptions.

Sources reviewed October 13, 2026:

- https://www.danceinstitutedenver.com/adult-kids-dance-classes/
- https://www.danceinstitutedenver.com/
- https://www.danceinstitutedenver.com/about/teachers/
- https://www.danceinstitutedenver.com/about/studio-policies/
- https://www.danceinstitutedenver.com/class-schedule/
- https://www.hisawyer.com/dance-institute-denver/schedules/membership-plans

Photographs currently load from the existing WordPress website, and fonts from Google Fonts with system fallbacks. Before replacing that host, copy the approved photographs into this repository and update their image paths so they survive the migration. The new typographic `di` mark is part of this redesign, not a reproduction of the current logo.

## Hosting

This folder can be hosted as a static site on Netlify or GitHub Pages. Set the publish directory to the repository root; no build command is needed. No deployment, domain or DNS change is performed by these source files. Retain the existing site until the replacement is approved and the remaining linked pages have a migration plan.

## Verification

JavaScript syntax, HTML references, CSS structure and the filter boundary logic were checked. A supported interactive browser was not available in the development environment, so visual layout and live booking should be reviewed on desktop and mobile before launch.
