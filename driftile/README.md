# Driftile

Product page for the Driftile macOS screen saver. Freeware.

Public URL: `https://negativespace.works/driftile/`

Current build: **2.0.4** (`downloads/Driftile-v2.0.4.zip`).

Download URL on the product pages: `/driftile/downloads/Driftile-v2.0.4.zip`
(after publish: `https://negativespace.works/driftile/downloads/Driftile-v2.0.4.zip`).

The zip is hosted in this site repo. The Driftile GitHub repo is private, so do not use a GitHub Releases download URL on the public site.

This build is signed and notarized. The Install section describes the normal double-click install path.

Chrome and type follow the studio site (`/assets/css/site.css`). Product-only layout lives in `assets/css/product.css`.

## Local preview

From the repository root:

```sh
python3 -m http.server
```

Open [http://localhost:8000/driftile/](http://localhost:8000/driftile/).

## Bumping the version

1. Put the new `Driftile-vX.Y.Z.zip` in `downloads/` and remove the old zip
2. Update `data-version` / `data-download` in `index.html` and `ja/driftile/index.html`, plus version text and the Download button `href`
3. Recapture Options screenshots when the sheet changes
4. Update this README
