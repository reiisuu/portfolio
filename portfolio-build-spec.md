# Build: Single-Page Developer Portfolio — "Nothing OS x Glassmorphism"

Build a one-page, scrollable developer portfolio. Follow this spec exactly —
it is derived from finished wireframes. Ask only if something is genuinely
ambiguous; otherwise scaffold the full project and implement every section
below.

## 1. Concept Summary

- **One scrollable page.** The hero (landing) is the first full-height view.
  Below it sits a sticky **glass "hotbar"** with tabs — About Me, Experience,
  Projects, Certifications, Education — that swap the content shown in a
  single content container beneath it (tab-panel behavior, not five separate
  giant sections you must scroll through one by one).
- **Theme:** "Nothing OS" (dot-matrix display type, circular glyph motifs,
  monochrome + one accent color, minimalist widget-style UI chrome) fused
  with **glassmorphism** (frosted translucent panels, blur, soft borders).
- **Colors (fixed, do not deviate):**
  - Background: `#150517`
  - Accent: `#dd72fd`
  - Neutral: `#ffffff`
  - Derive glass surfaces from these, e.g. panel fill `rgba(255,255,255,0.06)`,
    panel border `rgba(255,255,255,0.14)`, hover/active accent glow
    `rgba(221,114,253,0.35)`.

## 2. Tech Stack

- **Next.js 14+ (App Router)** + **TypeScript**
- **React Three Fiber** (`@react-three/fiber`) + **@react-three/drei** — for
  the 3D Tech Stack Rubik's Cube in the hero
- **Tailwind CSS** — all layout/styling, extended with the color tokens above
- **Framer Motion** — tab-panel transitions, hover/active states, carousel
  motion
- **lucide-react** — icon set (resume/LinkedIn/GitHub/mail, nav icons, etc.)
- **clsx** — conditional classNames
- A small carousel utility for the Projects section — either
  **embla-carousel-react** or a hand-rolled Framer Motion carousel (agent's
  choice; embla is recommended for touch/drag support)
- **No database.** All content (bio, experience, projects, certifications,
  education) lives in local TypeScript data files under `lib/`. Do **not**
  add MongoDB, Prisma, or any backend — there is no user-generated or
  dynamic data here.
- Deploy target: **Vercel**

## 3. Fonts

- **Display / dot-matrix font** (section headers like "ABOUT ME",
  "EXPERIENCE", and the big "NAME" glyph text in the hero): Google Font
  **`Silkscreen`** or **`DotGothic16`** (pick one, `Silkscreen` preferred) —
  these emulate the pixel/dot-matrix look of Nothing's glyph type without
  needing a custom font file.
- **Body / UI font:** **`Inter`** for nav labels, paragraph copy, buttons.
- **Status-bar / numeric font:** reuse `Inter` (tabular numbers) or
  `Space Mono` for the clock/date/weather capsule text — pick one and use it
  consistently in `StatusBar`.

## 4. Folder Structure

```
src/
  app/
    layout.tsx              # fonts, metadata, global providers
    page.tsx                # assembles Hero + HotNav + SectionContainer
    globals.css
  components/
    layout/
      StatusBar.tsx           # top glyph-widget bar (date/time/weather/location)
      HotNav.tsx               # sticky glass pill nav with tabs
      SectionContainer.tsx     # renders active tab's section w/ transition
    hero/
      Hero.tsx                 # "Hi, I am {NAME}" + LinksSection + TechCube
      LinksSection.tsx         # resume / LinkedIn / GitHub / mail icon grid
    cube/
      TechCube.tsx              # R3F canvas + cube logic (see §6.3)
      cubeData.ts                # TECHS: {name, icon, color}[]
      cubeIcons.ts                # canvas/SVG icon draw functions per tech
      useCubeInteraction.ts        # orbit-drag / layer-turn-drag / hover hook
    sections/
      about/
        AboutMe.tsx
      experience/
        Experience.tsx
        ExperienceCard.tsx        # one role entry
        DotMatrixLogo.tsx         # renders a company logo as a dot-matrix halftone
      projects/
        Projects.tsx
        ProjectCarousel.tsx        # center-focused scaling carousel
        ProjectCard.tsx
      certifications/
        Certifications.tsx
        CertFolder.tsx             # circular "Nothing folder" cluster
        CertFolderModal.tsx        # expanded view of one category
      education/
        Education.tsx
        GlyphMeter.tsx              # vertical segmented glyph bar
    ui/
      GlassPanel.tsx              # reusable frosted-glass container
      DotMatrixText.tsx            # wraps text in the display font + tracking
      Highlight.tsx                 # inline accent-colored text span
      IconButton.tsx
  lib/
    data.ts                     # ALL portfolio content lives here
    types.ts                     # Project, ExperienceEntry, Certification, EducationStage, LinkItem
  styles/
    theme.ts                    # exported color tokens, shared by Tailwind config + cube materials
tailwind.config.ts              # register #150517 / #dd72fd / #ffffff as theme colors + font families
```

## 5. Global Layout (`app/page.tsx`)

```
<StatusBar />                    (hero-only, top of viewport)
<Hero />                         (full viewport height: cube + "Hi, I am NAME" + links)
<HotNav activeTab={tab} onChange={setTab} />   (becomes sticky once Hero scrolls out of view)
<SectionContainer activeTab={tab}>
  {tab === 'about'         && <AboutMe />}
  {tab === 'experience'    && <Experience />}
  {tab === 'projects'      && <Projects />}
  {tab === 'certifications'&& <Certifications />}
  {tab === 'education'     && <Education />}
</SectionContainer>
```

- `activeTab` is simple `useState` in `page.tsx` (or a tiny context if you
  prefer), default `'about'`.
- Clicking a `HotNav` tab: (1) updates `activeTab`, (2) smooth-scrolls the
  `SectionContainer` into view if the user hasn't scrolled to it yet.
- Wrap the tab swap in Framer Motion `AnimatePresence` with a fade + slight
  vertical slide (~150ms) so switching tabs feels like changing an app view,
  not a page reload.
- `HotNav` should visually match the wireframes exactly: a single pill-shaped
  glass bar, tabs laid out horizontally, active tab has a subtle accent
  highlight/underline.

## 6. Component Specs

### 6.1 StatusBar

A row of separate glass capsules mimicking a Nothing OS status/glyph widget:

1. **Date/time capsule:** `SAT [15] [AUG] [EST] 10:53` — day-of-week text,
   then day/month/timezone each in their own small rounded badge, then the
   live time. Use the visitor's local time (`Intl.DateTimeFormat`) updated
   every second/minute via `useEffect` + `setInterval`. Timezone abbreviation
   via `Intl.DateTimeFormat().resolvedOptions().timeZone` (format as needed).
2. **Weather capsule:** an icon, temperature, a small weather-icon, and a
   condition pill (e.g. "SUNNY"). Keep this simple and reusable: accept
   `temperatureF`, `condition` as props with sensible static defaults so it
   works with zero config; optionally wire it to a no-API-key weather source
   (e.g. Open-Meteo) using the browser's geolocation, gracefully falling back
   to the static defaults if location/weather fetch fails or is denied.
3. **Location capsule:** a location-dot icon, city name (e.g. "SAN
   FRANCISCO"), and a small arrow icon. Static prop by default; can be wired
   to geolocation + reverse-geocoding later.

All three are glass pills (`GlassPanel`-style), laid out left/center/right
(or wrapped on mobile). This component only renders inside `Hero`, not
globally.

### 6.2 Hero

- Large "Hi, I am" label, then the person's **NAME** rendered huge in the
  dot-matrix display font, accent color (`#dd72fd`).
- `LinksSection`: a 2x2 icon grid — Resume (opens `/resume.pdf`), LinkedIn,
  GitHub, Mail (`mailto:`) — each a glass `IconButton`. Use `lucide-react`
  icons (`FileText`/`Linkedin`/`Github`/`Mail`).
- The `TechCube` fills the left/majority of the hero on desktop, stacks above
  the text on mobile.
- All hero content (name, tagline, link URLs) comes from `lib/data.ts` — no
  hardcoded strings in the component.

### 6.3 TechCube (Rubik's Cube tech-stack widget)

Port this exact interaction model into an R3F component:

- Real 3x3x3 cube — 27 individually meshed cubies (`BoxGeometry`, ~0.92
  units, on a 1-unit grid at positions -1/0/1 per axis).
- **Orbit:** dragging empty space rotates the whole cube (rotate a parent
  `Group` based on pointer delta).
- **Layer turn:** dragging a sticker turns only that layer 90°:
  1. `pointerdown` → raycast cubies; record intersection point, the hit
     face's world normal, and a `Plane` through that point/normal.
  2. `pointerup` → raycast the same plane again for the drag's end point;
     `dragVector = end − start`, converted into the orbit group's *local*
     space (un-rotate by the group's current quaternion) so turns stay
     correct at any camera angle.
  3. `axisRaw = faceNormalLocal.cross(dragVectorLocal)`; the axis with the
     largest absolute component is the rotation axis, its sign gives
     direction.
  4. `layerIndex = round(grabbedCubie.position[axis])`.
  5. Animate by reparenting the 9 affected cubies into a temporary pivot
     `Group`, tweening its quaternion 90° over ~250ms (ease-in-out), then
     reparenting back with `Object3D.attach()` (preserves world transform),
     snapping position/quaternion to exact grid values to avoid
     floating-point drift. Block new moves while animating.
- **Sticker look:** no classic Rubik's colors. Every outward sticker is a
  frosted-glass tile (canvas texture: black plastic base, rounded rect with a
  subtle white gradient sheen, thin light border, small accent-color
  `#dd72fd` corner dot) showing a **generic, stylized tech icon** (not a
  literal trademarked logo) — inner faces are plain dark plastic.
- **Hover (desktop only):** raycast on `pointermove`; swap the hovered
  sticker's texture to a solid tile in that tech's real brand color, same
  icon, plus a floating tooltip with the tech's name near the cursor. Revert
  on mouse-out.
- **Controls:** a "Shuffle" button chains ~16 random legal turns; a "Reset"
  button returns to solved (simplest: remount the component / reload).
- Put the tech list in `cubeData.ts` as `{ name, icon, color }[]`, seeded
  with this person's stack (see `lib/data.ts` for the authoritative list) so
  it can be edited without touching 3D logic.

### 6.4 About Me

- Left: a photo (use a placeholder image initially, swappable via
  `lib/data.ts`).
- Right: a short bio as 3–4 lines/paragraph. Support inline emphasis: one
  phrase can render in the accent color via the `<Highlight>` component
  (e.g. `<p>I build <Highlight>full-stack web apps</Highlight> and...</p>`).
- Section header "ABOUT ME" via `DotMatrixText`.

### 6.5 Experience

- List of `ExperienceCard`s, each with:
  - **Left:** `DotMatrixLogo` — a circular halftone/dot-matrix rendering of
    the company or org's logo (sample the source image on a `<canvas>`,
    threshold to monochrome, draw as a dot grid inside a circle — pure
    white dots on a dark circular background, emulating the Nothing Phone
    glyph ring). Accept `src` and `size` props so any logo can be dropped in.
  - **Right:** position/role title, company name, date range, and a bullet
    list of achievements.
- Section header "EXPERIENCE" via `DotMatrixText`.

### 6.6 Projects

- `ProjectCarousel`: a horizontally scrollable/draggable row of
  `ProjectCard`s where the centered/active card is visually larger
  (scale + elevation) than its neighbors, and hovering/focusing the active
  card reveals a play/expand icon overlay (for a demo video or case-study
  link).
- **Restyle to the site's theme** — the cards must look like the rest of the
  site (dark glass panel, `#dd72fd` accent highlights, subtle border/glow on
  the active card) — do **not** use unrelated card-game art styling; that
  was only a layout reference for the "centered card is bigger + has a play
  affordance" interaction, not a visual style to copy.
- Each `ProjectCard` shows: title, short description, tech-stack badges,
  and links to live demo / repo when available.
- Section header "PROJECTS" via `DotMatrixText`.

### 6.7 Certifications

- Certifications are grouped into named categories (e.g. "Software Dev",
  "Cybersecurity", "Microsoft").
- Each category renders as a `CertFolder`: a large circular glass "module"
  containing several small circular icon badges arranged around it (visually
  like a Nothing Phone camera module / Nothing OS app folder), with the
  category name labeled underneath.
- Clicking a `CertFolder` opens `CertFolderModal`, listing the individual
  certifications in that category (name, issuer, date earned, credential
  link if available).
- Section header "CERTIFICATIONS" via `DotMatrixText`.

### 6.8 Education

- `GlyphMeter`: a vertical pill divided into segments — one segment per
  education stage (e.g. College, Senior High School, High School, etc.),
  styled after the Nothing Phone (4a)'s vertical glyph light strip. The
  active/selected segment lights up in the accent color; others stay dim.
- Hovering or clicking a segment shows that stage's details (school name,
  degree/strand, years attended) beside the meter.
- Section header "EDUCATION" via `DotMatrixText`.

## 7. Data Layer

`lib/types.ts` — define at least:

```ts
export interface LinkItem { label: string; href: string; icon: 'resume' | 'linkedin' | 'github' | 'mail'; }
export interface ExperienceEntry { id: string; company: string; logoSrc: string; role: string; period: string; achievements: string[]; }
export interface Project { slug: string; title: string; description: string; stack: string[]; image: string; liveUrl?: string; repoUrl?: string; videoUrl?: string; }
export interface Certification { name: string; issuer: string; date: string; credentialUrl?: string; icon?: string; }
export interface CertCategory { name: string; certifications: Certification[]; }
export interface EducationStage { label: string; school: string; detail: string; period: string; }
```

`lib/data.ts` exports the actual content: `name`, `tagline`, `bio`, `links:
LinkItem[]`, `experience: ExperienceEntry[]`, `projects: Project[]`,
`certCategories: CertCategory[]`, `education: EducationStage[]`, and the
`TECHS` list feeding the cube. Leave clearly-marked placeholders
(`"TODO: fill in"`) wherever real content isn't provided yet.

## 8. Reusability Guidelines

- Every section component (`AboutMe`, `Experience`, `Projects`,
  `Certifications`, `Education`) takes its data as props or imports directly
  from `lib/data.ts` — never hardcode content inline.
- To add a **new tab/section** later: (1) add an entry to a single
  `NAV_ITEMS` config array (used by both `HotNav` and `SectionContainer`),
  (2) create the new section component under `components/sections/`, (3)
  add its data shape to `lib/types.ts` and its content to `lib/data.ts`.
- Shared visual primitives (`GlassPanel`, `DotMatrixText`, `Highlight`,
  `IconButton`) should be used everywhere rather than one-off styled divs, so
  the whole site stays visually consistent as sections are added.
- Keep the `TechCube` fully decoupled from portfolio content — it should only
  need `cubeData.ts` edited to reflect a different stack.

## 9. Build Steps (execute in order)

1. Scaffold: `npx create-next-app@latest portfolio --typescript --tailwind --app --src-dir --eslint`
2. Install deps: `npm install three @react-three/fiber @react-three/drei framer-motion lucide-react clsx embla-carousel-react` and `npm install -D @types/three`
3. Register the color tokens (`#150517`, `#dd72fd`, `#ffffff`) and font
   families (`Silkscreen`/`DotGothic16`, `Inter`) in `tailwind.config.ts` and
   `app/layout.tsx` (via `next/font/google`).
4. Build the shared UI primitives first: `GlassPanel`, `DotMatrixText`,
   `Highlight`, `IconButton`.
5. Build `StatusBar` and `LinksSection`.
6. Build `TechCube` (§6.3) as its own isolated, content-agnostic component;
   verify orbit-drag, layer-turn-drag, hover-reveal, shuffle, and reset all
   work before moving on.
7. Assemble `Hero` (`StatusBar` + name/tagline + `LinksSection` + `TechCube`).
8. Build `HotNav` and `SectionContainer` with tab-switch state + Framer
   Motion transitions; wire sticky behavior on scroll past `Hero`.
9. Build `AboutMe`.
10. Build `DotMatrixLogo`, then `ExperienceCard`, then `Experience`.
11. Build `ProjectCard`, then `ProjectCarousel`, then `Projects`.
12. Build `CertFolder`, `CertFolderModal`, then `Certifications`.
13. Build `GlyphMeter`, then `Education`.
14. Populate `lib/data.ts` with real content where provided, clearly-marked
    placeholders elsewhere.
15. Responsive pass: verify hero/cube stack correctly on mobile, `HotNav`
    tabs wrap or scroll horizontally on small screens, carousel is
    touch-swipeable.
16. Deploy to Vercel.

## 10. Acceptance Checklist

- [ ] Single scrollable page; hero is full-height with `StatusBar` + cube +
      name + links
- [ ] `HotNav` becomes sticky after scrolling past the hero and correctly
      swaps the visible section on tab click
- [ ] Cube: orbit-drag, layer-turn-drag, hover brand-color reveal + tooltip,
      shuffle, reset all function
- [ ] About Me, Experience, Projects, Certifications, Education all render
      from `lib/data.ts`, not hardcoded content
- [ ] Experience shows dot-matrix circular company glyphs
- [ ] Certifications render as circular "folder" clusters by category,
      expandable on click
- [ ] Education renders as a segmented vertical glyph meter
- [ ] Color palette matches exactly: `#150517` / `#dd72fd` / `#ffffff`
- [ ] Section headers use the dot-matrix display font; body copy uses `Inter`
- [ ] Fully responsive (mobile, tablet, desktop)
- [ ] No database/backend included



To fix:
1. Focus on making the application responsive. Currently, it doesn't respond properly in phone dimensions. Most of the site visitors will be on their phones so tailor it so the overall application is responsive. To do this, the structure of the phone format goes like this: 1. The top part of the phone will have the basic details scaled down: The timer, weather, and my location which is 'MANILA, PH'. 2. Scale down the Rubik's cube so that it is at the center of the mobile phone. Below that should be the details like Linkedin, Github, Email and Resume. 3. Ensure that upon opening the website, the first three components: Top Navbar, Rubik's Cube Hero Section, and Links Section can be seen instantly upon opening the site. 4. Make the bottom part responsive to mobile devices. The visitors should still be able to see the different tabs. Use a vertical stack so that the information not crowded into the container and scale it down to fit mobile devices. 5. Do necessary adjustments to ensure that containers do not break at all in any devices. Keep it consistent and responsive so that the overall website experience will be amazing.
2. At the very bottom left of the website page (the very bottom portion), there is an inconsistency with the color. There is a rectangle that is a little bit lighter than the rest of the background. Adjust it so it is consistent with the website's background and it won't destroy the essence of the website.
3. Experiences logos does not load. Use the image links inside the experiences / organizations in data.ts to display the company / organization image. Before outputting it, make sure to remove the background and have a consistent size with the icons to ensure that it is uniform.
4. Projects should be clicked and have a popup containing a more detailed description of the project. The popup should have an image preview of the project, more details about the description including client / stakeholder, problem, solution, etc. (include things that are necessary). Make the animation smooth and seamless and it should blur the background a little bit upon opening of the popup. 
5. Inside the project popup, it should have a link in the data so that if the user clicks that particular project channel, he / she gets redirected to the deployed website. 