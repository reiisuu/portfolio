Build a single self-contained HTML file (Three.js via CDN, vanilla JS, no build step) 
that is an interactive 3D Rubik's Cube used as a developer portfolio piece to showcase 
a tech stack.

CORE MECHANICS (real Rubik's Cube, not a decorative spinning cube):
- A proper 3x3x3 cube made of 27 individually meshed "cubies" (BoxGeometry ~0.92 
  units, spaced on a 1-unit grid at positions -1,0,1 on each axis).
- Dragging an empty part of the scene orbits the WHOLE cube (rotate a parent group 
  based on pointer delta).
- Dragging a sticker on the cube turns ONLY that 3x3 layer 90 degrees, in the 
  direction of the drag. Implementation approach:
  1. On pointerdown, raycast against the cubies. Record the intersection point, 
     the hit face's world-space normal, and a plane at that point/normal.
  2. On pointerup, raycast again onto that same plane to get the drag's end point; 
     compute dragVector = end - start (in the orbit group's LOCAL space, i.e. 
     un-rotate by the group's current quaternion first, so turns are correct 
     regardless of current camera/orbit angle).
  3. rotationAxisRaw = faceNormalLocal.cross(dragLocalVector). Whichever of x/y/z 
     has the largest absolute component is the rotation axis; its sign gives 
     direction.
  4. layerIndex = round(position[axis]) of the cubie that was grabbed.
  5. Animate: temporarily reparent the 9 affected cubies into a fresh pivot Group, 
     tween the pivot's quaternion 90 degrees on that axis (ease-in-out, ~250ms), 
     then reparent cubies back to the main group using Object3D.attach() (preserves 
     world transform), snap position to integers and snap the quaternion's Euler 
     angles to the nearest 90 degrees to prevent floating-point drift over many turns.
  6. Block new moves while a turn is animating.
- A "Shuffle" button that chains ~16 random legal turns (random axis/layer/direction) 
  back to back using the same rotateLayer function.
- A "Reset" button that returns the cube to solved (simplest: reload the page).

VISUAL / STICKER DESIGN:
- No classic Rubik's colors (no solid white/yellow/red/orange/blue/green faces). 
  Instead every sticker is a uniform frosted "glass" tile: a canvas-drawn texture 
  with a black plastic base, a rounded rect filled with a subtle diagonal white 
  gradient (rgba(255,255,255,0.05-0.16)) to fake a frosted-glass sheen, a thin 
  light border, and a small accent-color dot in one corner.
- Each sticker shows a tech-stack icon (drawn programmatically on canvas — simple 
  generic/stylized shapes that evoke each technology WITHOUT reproducing actual 
  trademarked logos: e.g. three overlapping ellipses for React, a hexagon outline 
  for Node.js, a leaf/teardrop for MongoDB, two overlapping circles for Python, 
  bracket/chevron shapes for Next.js, a triangle for a deploy tool, a branch/node 
  diagram for Git, wavy lines for Tailwind, "{ }" glyph for JS/TS, ascending bars 
  for data/pandas, a grid for SQL/DB, a cloud for hosting). Distribute ~10-12 
  distinct tech icons across the 54 outer stickers so adjacent stickers differ 
  (use a seeded index per face so the pattern looks intentional, not random noise).
- HOVER INTERACTION (desktop/mouse only): raycast on mousemove. When hovering a 
  sticker, swap its texture from the glass/monochrome version to a solid tile 
  filled with that technology's real/native brand color (e.g. React's cyan, 
  Node's green, MongoDB's green, Python's blue, Tailwind's sky blue, Git's 
  orange-red, JS's yellow, etc.), same icon on top. On mouseout, revert to the 
  glass texture. Also show a small floating tooltip near the cursor with the 
  tech's name and a color dot matching its brand color. Precompute one "brand" 
  texture per tech (reused across all its sticker instances) and one "glass" 
  texture per sticker slot; store both plus the name on each material's userData 
  so hover can toggle material.map and revert it cleanly.

UI / THEME — "glassmorphism + Nothing OS":
- Overall aesthetic: black background (auto light-mode variant too), a faint dot-
  grid background pattern (radial-gradient dots on a ~22px grid), monospace font 
  (e.g. Google Fonts "Space Mono"), uppercase text with wide letter-spacing, and 
  ONE accent color used sparingly — a signature red (~#ff3b30) — as small dots/
  highlights, never as a dominant fill.
- A title/instructions panel and Shuffle/Reset buttons styled as glass panels: 
  translucent background, border, backdrop-filter: blur(16-18px) saturate(150%), 
  soft drop shadow, pill/rounded shapes.
- Respect prefers-color-scheme for light/dark, and support safe-area insets 
  (env(safe-area-inset-*)) for mobile notches.

TECHNICAL CONSTRAINTS:
- Single HTML file, self-contained except Three.js loaded from a CDN 
  (r128 UMD build) and optionally one Google Fonts stylesheet — no other external 
  assets/images (draw everything as canvas textures/SVG).
- Support both mouse (drag to orbit / drag sticker to turn / hover to preview) 
  and touch (drag to orbit / drag sticker to turn — no hover state needed).
- Responsive to window resize; pinch/wheel to zoom within reasonable bounds.
- Keep performance sane: reuse geometries/materials where possible, ~27 meshes 
  total, each with up to 6 materials (plain dark plastic on inward faces, unique 
  canvas-textured "sticker" material only on outward faces).

Deliver one complete HTML file implementing all of the above.

DISREGARD ALL STYLING CHANGES AND FILE STRUCTURE CHANGES. 

USE THIS FILE TO MODIFY THE LOGIC ONLY AND MAKE THE RUBIK'S CUBE ANIMATION LOOK LIKE AN ACTUAL RUBIK'S CUBE