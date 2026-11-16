# Secret Hashes

A secret becomes a cryptographic hash; the hash becomes a random walk; the random walk becomes a scribble you can print and share.

Live site: https://shaunalynn.org/secret-hashes/

This project is a standalone continuation of [the original Secret Hashes project](https://github.com/shduff/favorite/tree/main/secret-hash).

## Use

Open the site, type a secret, and click **draw**. Click **redraw** for another visual variation of the same secret. Download the displayed image as SVG or PNG. The drawing uses a 1240 × 874 landscape canvas; SVG scales without loss.

## Privacy

Hashing and drawing happen locally in the browser. The secret is not sent to a remote generator or saved by the site. Like other unsalted hashes, short or guessable secrets could be vulnerable to dictionary attacks if someone obtains the hash or can infer it from the drawing. Do not treat this as encrypted messaging.

## Algorithm

The original Mathematica notebook uses SHA3-512, converts the digest to a decimal integer, then uses each decimal digit as a forward distance (digit × 100) and a random numeric angle from 1–360 in Mathematica's `AnglePath`. This version implements the process in browser JavaScript, interpreting numeric angles as radians. Each redraw samples fresh turns.

## Files

- `index.html` — published website, writing, layout, and controls
- `landing.js` — local SHA3-512, random-walk drawing, and SVG/PNG downloads
- `assets/` — illustration and product imagery

GitHub Pages publishes the root of the `main` branch.
