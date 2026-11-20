# Dhruv Tanwar · Six Stones

A portfolio told in six stones. Every chapter of the site is guarded by one stone, and each stone is claimed in its own way. Collect all six and the snap unlocks.

| Stone | Chapter | How to claim it |
|---|---|---|
| Space | Origin (about) | Strike the cube in the opening scene three times |
| Mind | Arsenal (skills) | Wake three linked skills in the constellation |
| Reality | Creations (projects) | Shift reality (button or `R`), then find it |
| Power | Experience | Press and hold until it stops resisting |
| Time | Chronicle (open source + timeline) | Turn the dial one full revolution to open the brass reliquary |
| Soul | Contact | It comes only to someone carrying the other five |

Every stone you claim is seated live in the forged medallion (bottom right) and sends a power surge through the page: the screen quakes, light floods in, a shockwave bends space. The sixth stone sets off the biggest surge of all.

**The snap** turns exactly half of the page to ash. **Turn back time** restores it.
**Reality mode** (`R`) bends the background, flips every project card to show what is under the hood, and rewrites some of the copy.
In a hurry? Use **Skip, show me everything** on the first screen.

## How it is built

- Plain HTML, CSS and JavaScript (ES modules). No framework, no build step, no dependencies.
- `js/engine.js`: one WebGL fragment shader that renders the nebula, the raymarched glass cube with plasma inside, the six raw crystals (refraction, absorption, dispersion, inner fire), a lens streak, and the reality, time, power, surge and snap effects.
- `js/conduit.js`: the forged bronze medallion, raymarched live, with each claimed stone seated in its socket.
- `js/app.js`: page construction, the stone hunt, the time dial, the skill constellation, the snap.
- `js/fx.js`: synthesised sound (Web Audio), disintegration particles and text scrambling.
- `js/content.js`: **all the copy lives here.** Edit it to update projects, experience or skills.
- `assets/img/stones/*.png`: stone images rendered from the same shader (used in the HUD and as a no-WebGL fallback). Regenerate with `tools/render.html?stone=mind&size=256`.

All visuals are original and procedural. There are no film stills or studio artwork.

## Run locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

Add `?nointro` to the URL to skip the opening.

## Deploy

Pushing to `main` deploys to GitHub Pages through `.github/workflows/deploy.yml`, which uploads the repository as-is.
