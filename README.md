# Secret Hashes

A secret becomes a cryptographic hash; the hash becomes a random walk; the random walk becomes a scribble you can print and share.

This is a standalone restoration of the original project from [shduff/favorite/secret-hash](https://github.com/shduff/favorite/tree/main/secret-hash).

## Use

Open `index.html` or publish this repository with GitHub Pages (Settings → Pages → Deploy from a branch → main → /root). Type a secret, click **draw** (or **redraw** for a new variation), and download **SVG** or **PNG**. Both exports are 1748 × 2480, matching the original portrait greeting-card dimensions. SVG can scale without loss.

## Privacy

Hashing and drawing happen entirely in your browser; the secret is not sent to a remote generator or saved. As with any unsalted hash, short or guessable secrets may be susceptible to dictionary attacks if someone obtains the hash or can infer it from a drawing. Do not treat this as encrypted messaging.

## Algorithm

The original Mathematica notebook uses SHA3-512, converts the digest to a decimal integer, then uses each decimal digit as a forward distance (digit × 100) and a random numeric angle from 1–360 in Mathematica's `AnglePath`. This version implements that in browser JavaScript, with numeric angles interpreted as radians as in Mathematica. Each redraw samples fresh turns. Paths are centered and fitted into a 1748 × 2480 SVG.

## Files

- `index.html` — original prose, layout, and controls
- `script.js` — local SHA3-512, random walk, preview, downloads, story interactions
- `assets/*.svg` — original example illustrations

The original card collage currently loads from the archived `favorite` repository. No Wolfram Cloud or Prodigi account is required for drawing or downloading.

## Future work

- Offer a print ordering workflow with a provider supporting per-customer uploads.
- Optionally copy the original card collage into this repository.
- Add automated browser-based regression tests.

