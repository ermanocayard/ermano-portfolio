# Ermano Cayard Portfolio

Public, static professional portfolio for Ermano D. Cayard.

Live site:
https://ermanocayard.github.io/ermano-portfolio/

## Overview

This repository contains a data-driven static portfolio built for GitHub Pages. The site is intentionally lightweight: plain HTML, CSS, JavaScript, and JSON data files. No framework or build step is required.

## Structure

- `index.html` - semantic page shell with section containers.
- `styles.css` - visual system for the quiet systems-thinking aesthetic.
- `script.js` - fetches JSON data and renders the page.
- `data/` - profile, projects, experience, and capabilities content.
- `projects/` - public-safe project notes and future case studies.
- `resume/README.md` - confirms that no resume file is published from this folder.

## Local Development

Because the page fetches local JSON files, use a small static server instead of opening `index.html` directly from the filesystem.

Example:

```powershell
cd C:\dev\ermano-portfolio
python -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

## Public Content Rules

- Do not publish phone numbers, PHI, employer-internal system names, or private notes.
- Keep resume exports ignored unless a deliberate public-safe version is created.
- Keep draft material in the private Career OS repo until it has been reviewed and cleared.
