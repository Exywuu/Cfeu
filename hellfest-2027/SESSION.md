# Session record — HELLFEST 2027 « Le Centième Feu »

Experiment log for the Live Experience 2027 challenge. Written in English per the project's
convention (product content stays in French; session records are in English).

---

## 1. System and environment

| Item | Value |
|---|---|
| Model | MiniMax-M3.1-Flash (MiniMax), knowledge cutoff February 2026 — exposed through the Qoder Desktop agent runtime |
| Agent runtime | Qoder Desktop, win32 build 10.0.26300, x64 |
| Shell | Git Bash (`C:\Program Files\Git\bin\bash.exe`) |
| Node.js | v24.19.0 |
| npm | 11.17.0 |
| Python | 3.13 (used only as a text-processing helper for source files) |
| Working directory | `C:\Users\I0\Documents\PROJETS\2026\AIEXPIM\Minimax` |
| Deliverable | `hellfest-2027/` (static site + `serve.js` + `README.md` + this file) |
| Web access | Yes — live HTTP GET/HEAD to the five candidate sites, Google Fonts CSS/WOFF2, and the local test server |
| Browser used for testing | The in-app Chromium instance driven over CDP via the `browser-use` MCP server (`visibilityState: hidden`; layout viewport reported as 831 × 785, but `take_screenshot` reported `NATIVE_BROWSER_VIEWPORT_UNAVAILABLE (viewport=0x0, visible=false)`) |
| Coding tools | Qoder built-in file/search/exec tools; `node --check` for syntax; `curl` for HTTP; a Python helper for bulk text edits |
| Visual creation tools | None external — **all visuals are generated in code** (CSS gradients, inline SVG, Canvas particle system). `ImageGen` was not used, deliberately: the brief forbids reproducing protected visuals, and procedural graphics are both safer and fully redistributable |
| Audio creation tools | None external — Web Audio synthesis at runtime (oscillators, biquad filters, shaped noise, dynamics compressor). No audio file was sampled or shipped |
| External assets | Three Google Fonts families (Rye, Oswald, Barlow), SIL OFL 1.1, latin subsets only, 169 KB total, vendored into `assets/fonts/` |
| Paid services / APIs | None |
| Code size | 2 721 lines total — `index.html` 88, `serve.js` 43, `main.css` 562, `data.js` 262, `audio.js` 164, `app.js` 667, `modes.js` 596, `README.md` 228, `SESSION.md` 111 |
| Runtime network calls | **Zero.** The only absolute URLs in the shipped source are the SVG XML namespace declarations, which are identifiers, not fetches |
| Cost | No paid service, no API key, no billing involved. **Token consumption and monetary cost cannot be measured precisely by the agent itself** — the runtime does not expose a reliable counter to me, so no figure is claimed here rather than an invented one |

## 2. Measured duration

| Phase | Measurement |
|---|---|
| First written artifact (vendored fonts) | 2026-10-27 17:40:52 |
| Final build (README + SESSION) | 2026-10-27 18:16:17 |
| **Measured build → test → polish window** | **35 min 25 s** |
| Research phase (before the first artifact) | Not independently measurable. The earlier record in this session placed the session start at ≈17:33, which puts the **total at ≈43 minutes** |

The brief's 90-minute ceiling was not reached, consistent with the instruction that the goal
is the best prototype possible, not filling the quota.

There is **no automatic execution limit** in this environment: work stopped on the agent's own
decision, not because the session was cut off. I report the measured figures and do not claim
more than that.

## 3. Research actually performed

Two parallel research agents fetched and read the official sites (plus encyclopedic and press
sources where a page was client-rendered or empty):

| Candidate | Accessible | Method | Key limitations found |
|---|---|---|---|
| Shen Yun | Partially | `shenyun.org` redirects; body copy client-rendered; extracted from official press releases, FAQ JSON and CSS tokens | 2027 programming returns "no results" |
| Cirque du Soleil | Partially | 217-URL sitemap, raw CSS tokens, show meta descriptions, official press kit | Show pages are marketing-thin |
| Country Jam | Yes (live) | Direct fetch; site still serves 2025 content | 2026 status flagged unverified against the official site |
| Hellfest | Yes | Direct fetch of `/en`, `/en/experience-1`, FAQ, CSS and logo PNGs | — |
| Lollapalooza Stockholm | No (live) | Live site is a holding page; design reconstructed from Wayback snapshots (2022, 2023, 2026) | No lineup, tickets or history to inspect |

### Mobile vs desktop inspection of the official site

The brief asks for the mobile and desktop versions to be examined when tooling allows. For
`hellfest.fr` the comparison was made **on structure, not on image**:

- The site serves **one single application**, byte-identical for mobile and desktop
  user agents (347 784 bytes in both cases). There is no separate mobile site.
- `entry.DRSX6o_s.css` contains 99 `@media` rules, with breakpoints at 768, 1 440 and
  1 500 px.
- That stylesheet contains **no `prefers-reduced-motion` rule at all** — the official site's
  animations cannot be switched off from the system setting. This is the concrete gap the
  prototype's own reduced-motion control answers.

**Not done**: no visual comparison of the official rendering on mobile or desktop. The
verification browser exposed no visible surface for capture, so only file-level measurements
were possible. This is stated in the product itself, in "La Colonne" → *inaccessible*.

**What I did not access** (declared in the product itself, page "La Colonne"): internal
organisation data, the detailed official 2027 lineup, reconciled attendance figures, and any
visual inspection on a physical mobile device or a browser other than the one used here.

## 4. Tests actually executed

All tests were run against the local server (`node serve.js 4177`) in the CDP-driven browser.

### 4.1 Build and content integrity

| Test | Method | Result |
|---|---|---|
| Syntax | `node --check` on all five scripts | Pass |
| Foreign-script contamination | `grep -P "[\x{4E00}-\x{9FFF}\x{0400}-\x{04FF}]"` over all source | No CJK or Cyrillic fragment remains |
| External requests | grep for absolute URLs in shipped source | Only the SVG XML namespace (an identifier, not a fetch) |
| Font loading | `document.fonts` | 6 of 7 faces `loaded`; `Barlow:500` stays `unloaded` until text in that weight appears (`font-display: swap`) |
| CSS parse | `document.styleSheets[0].cssRules.length` | 285 rules — no silent parse failure |

### 4.2 Navigation and routing

| Test | Method | Result |
|---|---|---|
| Six routes render | Programmatic sweep of `/`, `/descente`, `/archives`, `/pratique`, `/programme`, `/colonne` | All render, `document.title` correct, `aria-current` correct on all five nav items (including La Descente) |
| Default route | Load with no hash | Home renders (regression caught and fixed during this pass) |
| Route + anchor | `#/pratique#faq`, `#/pratique#lieux` | Page renders **and** scrolls to the section, focus moves to the target |
| In-page anchor | `#faq` clicked inside Pratique | Scrolls and focuses without re-rendering the view |
| Sticky-header clearance | Measured target top vs `.site-head` bottom | All seven Pratique sections land at 128–129 px, below the 114 px sticky header |
| Bad anchor | `#/pratique#zzz` | No exception, page stays rendered |
| Revisit of a view | Visit each route twice in sequence | Content rebuilt correctly every time (regression caught and fixed during this pass) |
| Escape from La Descente | Dispatch `Escape` | Overlay closes, route returns to `#/` |

### 4.3 The three modes

| Test | Method | Result |
|---|---|---|
| Mode A — full rite chain | Scripted clicks: scanner → 3 beacons → 3 flyers → 5 breaths → 3 rhythm strikes → 5 candles | 6/6 sparks; progress bar 100 %, six ember dots lit; Fosse unlocks and renders the six-scene recap |
| Mode A — rhythm rite under rAF suspension | Hit detection computed from the clock at strike time | Lands in 26 tries; a fixed-target variant serves reduced-motion users (3 spaced hits) |
| Mode A — Fosse lock | Entry attempted at 5 sparks | Refused with "Il manque 1 étincelle", button stays disabled |
| Mode A — progress semantics | `aria-valuenow` on the `role="progressbar"` | Now tracks the spark count (defect found and fixed during this pass: the attribute was being written to the bar fill instead) |
| Mode A — modal focus | Tab/Shift+Tab inside the overlay | Focus is trapped in the dialog; `Escape` closes it |
| Mode B — structure | DOM query | 8 chapters, 8 generated SVG emblems |
| Mode B — keyboard traversal | Real `End` / `Home` / `ArrowRight` key presses | Chapter 8 → chapter 1 → chapter 2, progress bar follows |
| Mode B — sound toggle | Click | `aria-pressed` flips, meter animates, profile switches |
| Mode B — local wall | Submit form, then clear | Fragment stored in `localStorage`, rendered, no network request; the clear button is `disabled` while the wall is empty |
| Mode C — passes and basket | Click passes, validate, clear | Basket total computed, "simulation" label present, no transaction |
| Mode C — venues | DOM query | Ten fictional places render in the new "Les lieux" section |
| Programme — days and filters | Click each day, then each scene chip | 14 / 18 / 21 / 15 slots per day (68 total); scene filter narrows to 2–3 slots; the note line updates |
| Programme — planner | Click "ajouter", then "Vider" | Item listed, count updates, persisted locally, cleared on demand |
| Colonne — prefs | Click reduced / contrast / sound | `data-reduced="1"`, `data-contrast="1"`, sound toggle respected and persisted |

### 4.4 Accessibility

| Test | Method | Result |
|---|---|---|
| Accessible names | Scan every `button` and `a[href]` | No button or link without an accessible name |
| Images and SVG | Scan `img[alt]` and unlabelled `svg` | 0 images without alt, 0 unlabelled SVG |
| Toggle state | Scan every `aria-pressed` | Present and correct on chips, pass buttons, planner buttons and comfort toggles |
| Live regions | Scan `role="status"` / `aria-live` | Progress counter and toast are polite live regions |
| Skip link | Focus programmatically | Hidden off-screen (−69 px) until focused, then fully visible at the top with a 3 px outline |
| Focus visibility | Real `Tab` press | 3 px solid amber outline, 3 px offset |
| Reduced motion | Toggle the app-level control | `data-reduced="1"`, transitions collapse to 0.000001 s, the rhythm rite switches to its fixed variant and still completes |
| Touch target size | Measured at 390 px | Beacons enlarged from 16 px to 22 px (defect found and fixed during this pass: 23 × 23 px effective, below the 24 px minimum) |
| Mobile navigation | Iframe at 390 px | The toggle appears, opens, updates `aria-expanded` and `aria-label`, and closes on link activation |

### 4.5 Layout and health

| Test | Method | Result |
|---|---|---|
| Responsive overflow | Iframe harness at 390 / 768 / 1440 px across five routes | **No page-level horizontal overflow** anywhere. The only elements wider than the viewport are the horizontal track inside `.arch-scroll`, which is a scroll container by design |
| Console health | `window.onerror` + `console.error`/`warn` capture across the full route sweep and every interaction | **0 errors, 0 warnings** (after the scoping fix described in §5) |
| Dead-button audit | Click every button on every view, compare a DOM/state signature before and after | 0 dead buttons. The only two non-reactive ones are conditionally inert: the submit button is blocked by native form validation when the field is empty, and the clear button is now explicitly `disabled` on an empty wall |
| Event-scope isolation | Click a beacon while the programme view is not mounted | No cross-view handler fires (defect found and fixed during this pass) |

**Not tested / not verifiable here**: physical smartphone or tablet rendering; Safari,
Firefox or Edge rendering; actual screen-reader output (only structural semantics were
checked); real audio output through speakers (the Web Audio graph was verified by state,
not by listening); visual appearance via screenshots — the in-app browser exposed no visible
surface for capture, so **no screenshot-based visual review was performed**. One environment
constraint shaped the method rather than the product: the page runs with
`visibilityState: hidden`, which throttles `setTimeout` and suspends smooth-scroll
animations, so scroll positions were asserted with instant scrolling and geometry
measurements instead of by watching an animation.

## 5. Defects found and fixed during the session

1. **Rhythm rite depended on `requestAnimationFrame`** for hit detection. In a background tab
   rAF is suspended, so the rite became unplayable. Rewritten to compute the marker position
   from the clock at the moment of the strike — the game is now correct regardless of
   animation state, and a fixed-target variant was added for reduced-motion users.
2. **Escape / close button navigation** initially pushed history without re-rendering the
   router, which could leave an empty view. Now routed through the hash and verified.
3. **Schedule grid** placed five children in a three-column grid, pushing the add button onto
   a second row. Grid corrected to four columns with a mobile override.
4. **Tab semantics** on the day switcher were incomplete (`role="tab"` without tabpanels);
   converted to a button group with `aria-pressed`.
5. Several corrupted characters in generated source text (CJK/Cyrillic fragments and English
   leftovers in French copy) were detected by automated grep and removed.

The final audit and polish pass added six more, all found by testing rather than by reading:

6. **The router rendered nothing for the default route.** A hash-parsing rewrite made the
   empty hash fall through to the intra-page-anchor branch, leaving `<main>` empty on a plain
   load. The default route is now handled explicitly.
7. **In-page anchors were broken.** Clicking a section link re-routed to the home page, and
   route + anchor links (`#/pratique#faq`) rendered the right page but did not scroll. The
   router now distinguishes `#/route`, `#/route#anchor` and bare `#id`, and transfers focus
   to the target.
8. **The Archives view only ever mounted once.** Its `mounted` flag survived navigation, so
   the second visit to `#/archives` produced a blank page. The module now keys off the DOM
   instead of a flag and rebuilds on return.
9. **View queries were global, not scoped.** `document.querySelectorAll('[data-scene]')` in
   the programme view also matched `<body data-scene>` and the descent stage, so *any* click
   anywhere re-ran the programme's paint and threw a `TypeError` once that view was gone.
   All view queries are now scoped to `#main`.
10. **The progress bar's `aria-valuenow` was written to the bar fill**, so assistive
    technology always announced "0". It is now set on the `role="progressbar"` element.
11. **The Archives frise advertised keyboard navigation that did not exist.** Arrow keys,
    `Home` and `End` now move chapter by chapter, with the current chapter announced.
12. **The ember canvas leaked a `requestAnimationFrame` loop and a resize listener on every
    home render**, and kept animating after leaving the home view. Both are now cancelled.

Two smaller polish items: the beacon buttons were below the 24 px minimum target size (now
22 px, ≈ 31 px effective), and the "clear my fragments" button is now disabled while the
local wall is empty.

## 6. Known limitations of the deliverable

- Ticketing is a **simulation**: no payment, no account, no data leaves the browser.
- The soundtrack is an **abstract synthesis**, not a rendering of the real festival ambience.
- The programme is **invented** and carries no relation to any real lineup.
- The rhythm rite remains a timing game; the reduced-motion variant removes movement but keeps
  the "three blows" rhythm, which may still be less comfortable for some users than the other five rites.
- No visual review was possible in this environment (no visible browser surface). The layout
  was validated through geometry measurements and computed styles rather than by eye.
- The official site's mobile/desktop comparison covers structure only; no visual comparison of
  the official rendering was performed.
