# REX ENGINEERING — portfolio website

Static website (plain HTML / CSS / JavaScript, no build tools needed to *view* it, no external fonts or libraries).

```
site/                      <- the website; upload THIS folder to any static host
  index.html projects.html services.html faq.html tools.html about.html contact.html 404.html
  projects/<id>.html       <- one generated page per project (do not edit by hand)
  sitemap.xml robots.txt   <- generated
  js/config.js             <- firm name, contact, Fiverr stats, testimonials, codes, software  (EDIT THIS FIRST)
  js/projects-data.js      <- generated; do not edit by hand
  assets/projects/         <- generated sheet images (privacy-processed WebP)
tools/
  projects_src.py          <- project text, categories, which PDF pages to publish (EDIT to add/change projects)
  render_sheets.py         <- PDF pages -> website images + projects-data.js
  make_src_images.py       <- crops archive screenshots (e.g. a STAAD.Pro model) into tools/_src/*.pdf for use as `extra`
  build_pages.py           <- static project pages, sitemap.xml, robots.txt, cache-busting stamps
  audit_text.py            <- scans published pages' text for names / phones / e-mails that survived
  review_montage.py        <- contact sheets so you can eyeball every published sheet
```

## Preview
Double-click `site/index.html`, or run `python -m http.server 5500 --directory site` and open http://localhost:5500.

## Before you publish (placeholders to replace in `site/js/config.js`)
* `email` (set to sureshankiya9982@gmail.com), `phone`, `credentials` (licence info — the box stays hidden while empty)
* `siteUrl` — now https://sureshankiya.github.io/rex (change if you add a custom domain), then re-run `python tools/build_pages.py` (used by sitemap / share links)
* optional `formEndpoint` (e.g. a Formspree URL) — the contact form then sends directly, with drawing uploads
* `principal` — the name shown on the About page (set `""` to hide)

## Add or change a project
1. Edit `tools/projects_src.py` (copy an existing entry: `pdf`, `cover`, `sheets` + captions, `redact` street / client words;
   extra PDFs via `extra` + `'alias:page'`; `strip` = crop of the title block; `cover_clip` to crop a cover;
   a sheet can be `(page, caption, (x0, y0, x1, y1))` to publish just part of a page; `thicken` darkens hairline
   CAD exports, `no_thicken` lists `extra` aliases that are screenshots).
2. `pip install pymupdf pillow` (once)
3. `python tools/render_sheets.py`  then  `python tools/build_pages.py`
4. `python tools/audit_text.py` and `python tools/review_montage.py all` — check nothing sensitive is visible.
   Pages flagged "raster images" or "no text layer" must be checked by eye (text masking can't see inside pictures).

## Privacy rules built into the renderer
* The right-hand title block of every drawing sheet is cropped off (addresses, client names, drafter logos / phones).
* Words listed in `redact` (plus phone numbers and e-mails found in the PDF text) are blacked out.
* Full PDFs are never copied into `site/`; each project has a "Request full drawing set" button.
* Do not publish a set whose sheets carry another firm's name or seal.
