# Driftile

Product page for the Driftile macOS screen saver. Freeware.

Public URL: `https://negativespace.works/driftile/`

Current build: **2.0.4**.

Download URL on the product pages:

`https://github.com/negativespaceworks/driftile/releases/download/v2.0.4/Driftile-v2.0.4.zip`

Do not host the zip in this site repo. The GitHub Release is the download target.

Chrome and type follow the studio site (`/assets/css/site.css`). Product-only layout lives in `assets/css/product.css`.

## Local preview

From the repository root:

```sh
python3 -m http.server
```

Open [http://localhost:8000/driftile/](http://localhost:8000/driftile/).

## Bumping the version

1. Publish the new `Driftile-vX.Y.Z.zip` on the Driftile GitHub Release
2. Update `data-version` / `data-download` in `index.html` and `ja/driftile/index.html`, plus version text and the Download button `href`
3. Recapture Options screenshots when the sheet changes
4. Update this README
