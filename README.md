# Dance Institute of Denver

A complete static website using warm beige, dark forest green, dusty pink, maroon details and a restrained wood trim. The studio directory replaces the original landing-page redesign with compact pages and direct navigation.

## Pages

The original main navigation and child-page paths are preserved:

- Home — `/`
- Dance Classes — `/adult-kids-dance-classes/`
- About — `/about/`
  - Studio Policies — `/about/studio-policies/`
  - Teachers — `/about/teachers/`
  - Partners — `/about/partners/`
- Schedule (navigation group)
  - Dance Schedule — `/class-schedule/`
  - Summer Schedule — `/summer-schedule/`
- Nutcracker — `/nutcracker/`
- Register — `/registration/`
- Contact — `/contact/`
- Privacy Policy — `/privacy-policy/` (concise summary of the published SMS policy)
- Sitemap — `/sitemap/`

## Run and edit

No installation or production build is required. Serve this directory with any static host. The generated HTML files are already included and can be opened directly.

- `styles.css`: palette, navigation, responsive layouts.
- `script.js`: navigation and class filtering.
- `classes.json`: class directory data.
- `page-content.json`: supporting page copy.
- `build.py`: shared layout, Home and Dance Classes templates.
- `source-notes.json`: verified sources and known content gaps.

After editing templates or JSON, run `python build.py`. This uses only Python’s standard library and regenerates all 13 pages. All local paths are relative, including nested About pages, so the site also works under a GitHub Pages repository prefix.

## Functional behavior

Classes are rendered in HTML and remain readable without JavaScript. Filters combine age, style and search; class details expand in place. Combination classes appear under their individual dance styles. Unknown age/level programs have their own placement filter rather than being presented as age-eligible. Filter URLs are shareable. Mobile navigation and submenu controls use explicit expanded states, and the full navigation remains visible without JavaScript.

Sawyer handles real memberships, trials, payment and enrollment. Telephone and map links use the verified studio contact details. There is no simulated form submission or invented timetable.

## Before a domain migration

No hosting or DNS was changed by this update. The current studio contact form and original timetable still open on `danceinstitutedenver.com`; migrate these to a verified form backend and timetable asset before replacing that domain. Otherwise their links would resolve to the replacement pages themselves. Current class availability is also linked directly in Sawyer.

Photographs load from the existing WordPress site. Copy approved images locally before removing that host. Google Fonts has system-font fallbacks. Restore the studio-approved full privacy policy before production cutover; the included privacy page is a concise SMS-policy summary.

Published class information and tuition were reviewed against the current site; conflicting Nutcracker dates and outdated summer dates were omitted. Ask the studio to confirm current offerings before launch.

## Validation

Checked the generated page structure, local routes and assets, unique IDs, alternative text, JavaScript syntax, and interactive state with a DOM test harness. Verified mobile-menu state, age/style/search behavior, placement separation, empty results, reset and shareable query strings. Interactive browser rendering was unavailable in this environment, so visual browser verification remains outstanding.
