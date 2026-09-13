# Driftile profile media

Built-in Profile 6 件のカード用素材。`kinetic.html` の capture モード（seed `20260902`）から 1280×720 で生成。

| ファイル | Profile |
|----------|---------|
| `abstractMotion.png` / `.mp4` | Abstract Motion |
| `classicComposition.png` / `.mp4` | Classic Composition |
| `minimalDrift.png` / `.mp4` | Minimal Drift |
| `greatWave.png` / `.mp4` | Great Wave |
| `nighthawks.png` / `.mp4` | Nighthawks |
| `colorField.png` / `.mp4` | Color Field |

MP4 は H.264、音声なし、`+faststart`。Safari 向け。

## ホバー再生の使い方

カードは poster PNG を常時表示し、ホバーで同じ id の MP4 を再生する。

```html
<article class="profile-card">
  <img src="assets/profiles/classicComposition.png" alt="Classic Composition" width="1280" height="720">
  <video
    muted
    loop
    playsinline
    preload="none"
    poster="assets/profiles/classicComposition.png"
    data-src="assets/profiles/classicComposition.mp4">
  </video>
</article>
```

```js
card.addEventListener('mouseenter', () => {
  const v = card.querySelector('video');
  if (!v.src) v.src = v.dataset.src;
  v.play();
});
card.addEventListener('mouseleave', () => {
  const v = card.querySelector('video');
  v.pause();
  v.currentTime = 0;
});
```

- Hero は `assets/hero/catch.mp4` / `catch.png`（長尺）。最初から `src` をセットして `autoplay muted loop playsinline`。Profile カードは従来どおり `data-src`。
- `prefers-reduced-motion: reduce` では video を出さず PNG のみ。
- タッチは tap で play/pause トグル。
- 同時に `src` を張るのは最大 1 本（他は `data-src` のまま）。

再生成は driftile リポで `cd saver && make profile-media`。
