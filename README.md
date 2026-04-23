# A Great War Requiem — Companion Website

Interactive dissertation companion for **A Great War Requiem**, a Doctor of Arts composition by Kaylene Cypret, University of Northern Colorado, 2024.

The site adapts the dissertation into an immersive, web-native experience: chapter-by-chapter reading, a searchable bibliography, footnote popovers, dark / light theming, and an interactive seven-movement score viewer.

## What's in here

```
site/
├── index.html                 # Landing page with hero, chapter cards, movements grid
├── bibliography.html          # Searchable, filterable bibliography (107 entries)
├── chapters/
│   ├── chapter-1.html         # Prelude — goals, Requiem tradition, Fauré/Duruflé/Alain
│   ├── chapter-2.html         # Poets — Brittain, Letts, Cole, Peabody
│   ├── chapter-3.html         # Interactive score viewer (7 movements)
│   ├── chapter-4.html         # Analysis of A Great War Requiem
│   └── chapter-5.html         # Postlude / Summary
├── assets/
│   ├── css/main.css           # Cinematic design system (dark-first, poppy + brass)
│   ├── js/main.js             # Theme toggle, progress bar, footnote popovers, TOC
│   ├── js/score.js            # Interactive score viewer
│   ├── js/biblio.js           # Bibliography search + filter chips
│   ├── figures/               # Chapter figures & musical examples (PNG/JPG)
│   ├── score/                 # All 74 score pages rendered from the PDF
│   └── A-Great-War-Requiem.pdf  # Full dissertation PDF (for download button)
└── .nojekyll                  # Tell GitHub Pages to skip Jekyll processing
```

## Deploying to GitHub Pages

1. **Create a new repository** on GitHub (for example, `a-great-war-requiem`).
2. **Initialise this folder as a git repo** and push it:

   ```bash
   cd "site"
   git init
   git add .
   git commit -m "Initial site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/a-great-war-requiem.git
   git push -u origin main
   ```

3. **Enable GitHub Pages**: in the repository go to **Settings → Pages**.
   - Source: *Deploy from a branch*
   - Branch: `main` / root (`/`)
   - Save.

4. GitHub will publish the site at
   `https://<your-username>.github.io/a-great-war-requiem/`
   within a minute or two.

> The included `.nojekyll` file prevents GitHub Pages from running Jekyll, which would otherwise try to reinterpret folders that begin with an underscore.

### Using a custom domain

If you own a domain and want to use it, add a file named `CNAME` at the site root containing just your domain name (e.g. `requiem.kaylenecypret.com`) and configure DNS per GitHub's instructions.

## Features

- **Chapter navigation** with a live progress bar and sticky section TOC.
- **Footnote popovers**: click any superscripted footnote number to read it inline without losing your place. Press `Esc` or click outside to close.
- **Searchable bibliography** with filter chips (Books, Journals, Scores, Archives, Web, etc.). Press `/` to jump to the search box from anywhere.
- **Dark / light theme** toggle in the nav — the preference persists in `localStorage`.
- **Interactive score viewer** (Chapter III) for all seven movements: tabs, thumbnail rail, page controls, `←` / `→` keyboard navigation, click-to-zoom, deep-link via `?m=3&p=2`.
- **Keyboard navigation**: `←` / `→` paginate between chapters and score pages.
- **Responsive** layout — mobile menu, reflowed score grid, print styles.

## Local preview

Any static HTTP server will do. From the `site/` directory:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Regenerating content

The chapter and bibliography HTML files are generated from the source PDF by two Python scripts living next to the repository (`build_chapters2.py` and `build_biblio.py`). They read from `extracted/layout_pages/` (preserved-layout `pdftotext -layout` output) and write into `site/chapters/` and `site/bibliography.html`. Edit the scripts, not the generated HTML, if you want to adjust structure.

Requirements: Python 3.9+, no third-party libraries (the scripts use only the standard library).

## Credits

- Dissertation: **Kaylene Cypret**, D.A., University of Northern Colorado, 2024.
- Typography: Cormorant Garamond, Lora, and Inter via Google Fonts.
- Composed with care *in memoriam* Tammy Tallacksen Cypret and Wendall Cypret.
