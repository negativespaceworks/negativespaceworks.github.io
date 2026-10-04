# Abstrora

Product page for the Abstrora macOS screen saver. Freeware.

Public URL: `https://negativespace.works/abstrora/`

Current build: **2.1.0** (`downloads/Abstrora-v2.1.0.zip`).

Download URL on the product pages: `/abstrora/downloads/Abstrora-v2.1.0.zip`
(after publish: `https://negativespace.works/abstrora/downloads/Abstrora-v2.1.0.zip`).

The zip is hosted in this site repo. The product GitHub repo is private, so do not use a GitHub Releases download URL on the public site.

This build is signed and notarized. The Install section describes the normal double-click install path.

Chrome and type follow the studio site (`/assets/css/site.css`). Product-only layout lives in `assets/css/product.css`.

## Local preview

From the repository root:

```sh
python3 -m http.server
```

Open [http://localhost:8000/abstrora/](http://localhost:8000/abstrora/).

## Bumping the version

1. Put the new `Abstrora-vX.Y.Z.zip` in `downloads/` and remove the old zip
2. Update `data-version` / `data-download` in `index.html` and `ja/abstrora/index.html`, plus version text and the Download button `href`
3. Recapture Options screenshots when the sheet changes
4. Update this README
