# Fix the failing build (2 errors)

The last build failed for two unrelated reasons. Both are small.

## 1. Hero graphic depends on a missing 3D library

`src/components/HeroSphere.tsx` imports `three`, which is not installed in this project, so the build cannot resolve it.

Fix: replace the 3D canvas with a dependency-free animated orbital sphere built from CSS and SVG (rotating rings, glowing asset nodes, uses the existing theme tokens so it works in light and dark). Same visual intent on the homepage, no new package, smaller bundle, no SSR/browser-global risk.

Alternative if you specifically want real 3D: install `three` and its types instead. Heavier page weight; say the word and I'll do that version.

## 2. Type error in the homepage scroll-reveal helper

`src/routes/index.tsx` reads `entry.isIntersecting` from a destructured observer array, which TypeScript treats as possibly undefined.

Fix: guard the entry before reading it.

## After the fix

Re-run the build and typecheck to confirm both are clean, and check the homepage renders the hero correctly in light and dark.

Note: this covers only the build fix. The plug-in vehicle tracker (OBD-II telematics) work is still unstarted — I'll bring that plan back once the build is green.
