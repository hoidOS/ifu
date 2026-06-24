# Refactor Notes

## Bremsweg Page - Schwellstrecke

- The Schwellstrecke helper (`components/utilStop.tsx:5`) still applies the following ramp distance (converted from km/h to m/s), which corresponds to a different braking profile than the documented linear ramp:

  $$
  s_s = v_0 \, t_s - \frac{1}{4} a \, t_s^{2}
  $$

- For a **linear increase** in deceleration from 0 to a across the Schwellzeit t_s, the accepted handbook reference (AnalyzerPro) states:

  $$
  s_s = v_0\, t_s - \frac{1}{6} a\, t_s^{2}
  $$

- Under the same ramp assumption, the velocity drop during the Schwellphase is:

  $$
  \Delta v = \frac{1}{2} a\, t_s
  $$

  and the end-of-phase speed becomes:

  $$
  v_1 = v_0 - \frac{1}{2} a\, t_s
  $$

- Compared with an idealised instant full brake, use the reference path:

  $$
  v_0 \, t - \frac{1}{2} a \, t^2
  $$

  The additional distance accumulated by the ramp is:

  $$
  \Delta s = s_s - \left(v_0 t_s - \frac{1}{2} a\, t_s^2\right) = \frac{1}{3} a\, t_s^{2}
  $$

  (cf. Leifi).

- Example with a = 7.5 m/s^2 and t_s = 0.2 s:

  $$
  \Delta s = \frac{1}{3} \cdot 7.5 \cdot 0.2^2 = 0.10\, \mathrm{m}
  $$

  $$
  s_s = 0.2\, v_0 - 0.05\, \mathrm{m}
  $$

  For example, v_0 = 50 km/h -> s_s ~ 2.73 m; v_0 = 100 km/h -> s_s ~ 5.51 m.

- Action items: update `getBrakeDelay`/`getFullDistance` in `components/utilStop.tsx` to use the linear ramp term (`-a*t_s^2/6` instead of `-a*t_s^2/4`), refresh the rendered formulas in `assets/`, and re-check the Bremsweg outputs against the handbook examples.

## Export/Screenshot Cleanup

- Current state: all calculator export buttons go through `hooks/useScreenshot.ts`.
- Current export scale is `2`, not `4`, so clipboard/download images are smaller and easier to paste into documents.
- Export controls are marked with `data-screenshot-ignore="true"` and hidden in the `html2canvas` cloned document through `onclone`.
- The live DOM is no longer mutated for export; there is no hide/restore pass that strips table shadows, background styles, or container styles.
- `html2canvas` is configured with `backgroundColor: "#ffffff"` so pasted/downloaded PNGs stay on a clean white background.
- If future export-specific styling is needed, prefer scoped selectors on clone-only state rather than editing the visible document before capture.
- Keep `html2canvas` limitations in mind: collapsed table borders and rounded clipping can create small edge artifacts, especially around blue divider lines at table corners. Prefer preserving the visible table border/radius and avoid stripping table borders during export.

## Minderwert Styling Continuation

- Current design direction: BVSK uses Steinacker primary blue; MFM uses the darker orange accent (`orange-700`/`orange-800`) across headers, focus rings, result values, comparison markers, and system/reference tables.
- The MFM input card header should stay orange like `MFM System`, not blue, so the two valuation systems remain easy to distinguish.
- Minderwert input table shells are intentionally neutral (`border-slate-200`, `shadow-sm`) while system identity is carried by card headers, focus rings, output rows, result values, and reference/system tables.
- Minderwert export areas should avoid tiny dots, small vertical markers, and fragile badge geometry. Use larger color systems instead: row tinting, text color, top card accents, and horizontal comparison bars.
- `Minderwert Berechnungen` uses a compact neutral inner summary header, left-aligned formulas, right-aligned result values, and German euro formatting through `Intl.NumberFormat("de-DE")`.
- Minderwert is visually aligned now, but it is still structurally more bespoke than the standard calculator pages. A future cleanup could extract shared Minderwert table/card helpers instead of leaving all table colors inline.
- Native `<input type="date">` cannot reliably force German `TT.MM.JJJJ` display; browsers render it by locale. To force `TT.MM.JJJJ`, replace the two MFM date fields with text inputs, parse `DD.MM.YYYY`, store ISO `YYYY-MM-DD`, and show validation for invalid/reversed dates.

## Bremsweg Styling Continuation

- The Bremsweg input and result card headers now both use `calculator-card-header`; avoid reintroducing `calculator-card-header-compact` there unless a deliberately compact export view is added.
- The copied/downloaded Anhaltevorgang result table still has awkward inline SVG placement in the labels `Gesamtstrecke von vA bis vE` and `Gesamtdauer von vA bis vE`. Consider replacing those inline SVGs with plain text-style notation or constraining them to a smaller fixed height for export/readability.
