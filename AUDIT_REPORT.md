# Repository Audit Report

Created: 2026-06-23
Last updated: 2026-06-24

Scope: Next.js Pages Router application, shared components, calculation helpers, screenshot/export hook, styling, package metadata, Docker setup, local build/lint/type checks, npm advisory check, and dependency freshness check.

Original audit constraint followed: no repository files were changed except this report during the audit pass.

## Executive Summary

The project is in good baseline shape for tooling: ESLint passes, TypeScript passes, and a production build succeeds when run from a temporary copy outside the repository. The main risk is not build health. The main risk is calculation correctness: several calculators accept zero, contradictory, or physically impossible inputs and then render `Infinity`, `-Infinity`, `NaN`, negative distances/times, or plausible-looking values for impossible scenarios.

The formula layer is still only lightly covered by automated tests. For a forensic automotive calculator, this remains the largest quality gap after the first Vitest slice.

Post-audit implementation work has resolved F-02, clarified the F-04 Kurvenradius behavior for the current UI requirement, resolved F-09, resolved F-10, resolved F-12, and resolved the F-13 documentation/config drift. F-03 and F-08 are partially addressed. F-01 remains open as the broader formula-domain validation issue.

## Initial Verification Performed

- `git status --short`: clean before report creation.
- `npm run lint`: passed.
- `./node_modules/.bin/tsc --noEmit --incremental false`: passed.
- `npm run build`: passed in a `/tmp` copy of the repository so `.next/` in the repo was not touched.
- `npm audit --json`: completed with 4 advisories: 1 low, 3 moderate.
- `npm outdated --json`: completed and identified available patch/minor package updates.

The first sandboxed temp-copy build failed because Turbopack tried to spawn/bind an internal process and the sandbox returned `Operation not permitted`. The same temp-copy build passed when rerun with elevated execution. Build output stayed under `/tmp`.

## Post-Audit Updates

- 2026-06-23: F-02 is resolved in the current worktree. `components/utilConst.tsx:1-10` now formats square-root helper results through a shared guard that returns `ERROR` for negative radicands and non-finite outputs, and `components/utilConst.tsx:173-176` no longer masks the acceleration `vA` radicand with `Math.abs`. The const result tables render helper-level `ERROR` in red.
- 2026-06-23: F-03 is partially addressed. `vitest` is installed, `npm test` runs the test suite, and `components/utilConst.test.ts` covers the known valid braking example plus the negative-root acceleration cases from F-02. Broader formula-helper coverage is still needed.
- 2026-06-23: F-04 is resolved for the clarified UI requirement. `Kurvenradius Ergebnisse` now shows the three entered values above the calculated outputs, and `isCurveError()` no longer rejects the table merely because `b` is present. The block remains an `h`/`s`-driven calculation; implementing all two-value solve combinations involving `b` would be a separate feature.
- 2026-06-23: F-08 is partially addressed. Stable direct updates were applied for Next, React, React DOM, Tailwind, `eslint-config-next`, and React/Node type packages. `npm audit fix` removed the transitive `@babel/core` and `js-yaml` advisories. The remaining audit result is the Next-bundled PostCSS advisory, where npm still suggests the unsafe `next@9.3.3` downgrade.
- 2026-06-23: F-12 is resolved. The Docker image now builds through separate dependency, builder, and runtime stages, and the runtime image contains production dependencies plus the built Next.js output.
- 2026-06-23: F-13 is resolved. README and repository guidelines now reflect the renamed routes, Vitest setup, current Docker shape, and dependency-version policy. The legacy `.eslintrc.json` file was removed because `eslint.config.mjs` is the canonical lint configuration.
- 2026-06-23: The calculator card/table styling was normalized across the active pages. Standard calculator screens now use the shared flat `calculator-card-header` treatment, the Bremsweg result card no longer uses the compact header variant, and Minderwert uses a deliberate BVSK primary-blue / MFM darker-orange color system across headers, focus rings, result accents, and system/reference tables while keeping editable input table shells neutral. This was a visual consistency pass; it does not close the remaining formula validation findings.
- 2026-06-24: F-09 is resolved. `hooks/useScreenshot.ts` no longer mutates/restores the live DOM for exports; export controls are hidden in the cloned document via `[data-screenshot-ignore="true"]`, and PNG captures use an explicit white background.
- 2026-06-24: F-10 is resolved. Repeated export-control IDs were removed in favor of the shared `data-screenshot-ignore="true"` marker.
- 2026-06-24: The Minderwert page received a visual/export polish pass. Input table shells now stay neutral, output summary values use German euro formatting, the BVSK/MFM output areas avoid small marker geometry that rendered poorly in screenshots, and the `Minderwert Berechnungen` summary table uses a compact neutral header with left-aligned formulas and right-aligned results.
- Verification after the F-02/F-03/F-08 implementation: `npm test`, `npm run lint`, `./node_modules/.bin/tsc --noEmit --incremental false`, and `npm run build` passed. The production build required elevated execution because Turbopack's internal process/bind step is blocked by the sandbox.

## Findings

### F-01 High: Core calculators render invalid numeric results for accepted inputs

The UI accepts zero as a valid value in many places, and the solve logic uses `>= 0` checks before calling helpers that divide by speed, time, acceleration, or distance.

Evidence:

- `components/utilConst.tsx:2-13` divides by `t` and `v` in constant-drive formulas.
- `components/const/ConstDrive.tsx:40-47` treats `v`, `s`, and `t` as set when they are `>= 0`.
- `components/const/ConstDrive.tsx:88-142` permits `v=0`, `s=0`, and `t=0`.
- `components/utilConst.tsx:73-166` and `components/utilConst.tsx:227-320` contain multiple divisions by `s`, `t`, and `a`.
- `components/const/ConstDecel.tsx:49-205` and `components/const/ConstAccel.tsx:49-205` use `>= 0` as the domain gate.
- `components/utilStop.tsx:17-52` divides by `am`.
- `pages/bremsweg.tsx:48-55` calculates all stop outputs unconditionally.
- `pages/bremsweg.tsx:132-144` permits an end speed greater than the initial speed.
- `pages/bremsweg.tsx:207-219` permits `am=0`.

Original observed representative output:

```json
{"speed":"Infinity","time":"Infinity","bd":"-Infinity","masked":"113.40","unmasked":"NaN"}
```

Impact: users can receive apparently formatted forensic outputs that are mathematically undefined or physically impossible.

Recommendation: add explicit domain validation before every formula path. Require positive denominators, enforce physical relationships such as `vA >= vE` for braking, reject negative radicands, and render a specific validation message instead of formatting non-finite numbers. Add a shared result type such as `{ ok: true, value, unit } | { ok: false, reason }` and block formatting unless `Number.isFinite(value)`.

### F-02 High: Acceleration formulas hide impossible radicands with `Math.abs` - resolved in current worktree

Status: resolved on 2026-06-23. The acceleration helper now rejects negative radicands with `ERROR` instead of using `Math.abs`, and the const tables render that state in red.

Original evidence: the acceleration helper used `Math.abs` inside square roots:

- `components/utilConst.tsx:171-174`
- `components/utilConst.tsx:199-202`

Example: an initial velocity solve from `vE=10 km/h`, `a=5 m/s^2`, `s=100 m` has a negative radicand and should be invalid. Before the fix, `Math.abs` formatted a plausible-looking `113.40 km/h`.

Impact: impossible inputs are converted into plausible results instead of being rejected.

Recommendation: complete for the identified `Math.abs` masking. Keep this behavior covered when automated formula tests are added under F-03.

### F-03 High: Formula-layer test coverage is still too narrow - partially addressed

Status: partially addressed on 2026-06-23. `vitest` is now available through `npm test`, and `components/utilConst.test.ts` covers the first three `utilConst` examples.

Original evidence:

- `package.json:5-10` has no `test` script.
- Formula helpers in `components/utilConst.tsx` and `components/utilStop.tsx` are pure enough to test directly.

Remaining impact: most formula regressions, unit mistakes, and edge-case behavior are still only caught by manual validation.

Recommendation: continue adding focused unit tests for every helper and representative UI solve paths. Include edge cases for zero denominators, impossible radicands, equal speeds, end speed greater than initial speed, negative monetary factors, and expected valid examples from known forensic reference calculations.

### F-04 Medium: Kurvenradius `b` behavior was ambiguous - resolved for current UI requirement

Status: resolved by clarification on 2026-06-23. The intended behavior is to show the entered `h`, `s`, and `b` values above the calculated outputs so the exported result table clearly documents the inputs. `b` is not currently intended to drive alternate solve paths.

Original finding: the Kurvenradius UI asked for Segmenthoehe `h`, Segmentlaenge `s`, and Bogenlaenge `b`:

- `pages/sonstige.tsx:650-749`

The calculations still use `h` and `s`:

- `pages/sonstige.tsx:177-207`

Current behavior:

- `pages/sonstige.tsx:212-214` no longer errors merely because `b` is present.
- `pages/sonstige.tsx:783-811` shows `h`, `s`, and `b` as input rows in the result table.
- `pages/sonstige.tsx:813-845` shows calculated `R`, central angle, and computed bogenlaenge below those inputs.

Impact: the original ambiguity is resolved for the current workflow because the table now separates entered inputs from derived outputs.

Recommendation: no further action is required unless `b` should become a true solve input. If that requirement changes, implement and test the intended two-input combinations involving `b`.

### F-05 Medium: Minderwert calculators accept out-of-range monetary and factor inputs

The BVSK and MFM formulas accept raw input values without enforcing the ranges shown in the UI/tooltips:

- `pages/minderwert.tsx:402-412`
- `pages/minderwert.tsx:486-592`
- `pages/minderwert.tsx:636-740`
- `pages/minderwert.tsx:882-930`

Examples of unguarded values include negative WBW/VW/NP/RK, negative or excessive K-Faktor, negative Prozentwert/M-Wert, SU outside `0.2-1.0`, FM outside `0.6-1.4`, and FV outside `0.2-1.0`.

Impact: users can produce negative or materially inflated diminished-value outputs.

Recommendation: apply `min`, `max`, and validation state to every bounded parameter, and centralize BVSK/MFM validation before computing. Do not silently calculate when required values are missing or outside method bounds.

### F-06 Medium: MFM date validation silently treats invalid age as a new vehicle

`calculateVehicleAgeMonths()` returns `0` when either date is missing, invalid, or when the end date is before the start date:

- `pages/minderwert.tsx:311-323`

That then maps to the maximum AK factor through `calculateAKFactor()`:

- `pages/minderwert.tsx:336-342`

Impact: a reversed or invalid date pair can produce the same AK behavior as a zero-month-old vehicle rather than showing an error.

Recommendation: distinguish "unknown/invalid date" from "0 months old". Return a validation error for reversed or invalid dates and avoid calculating MFM until dates are coherent.

### F-07 Medium: Most calculator tables still lack mobile horizontal scroll wrappers

The README already documents this risk:

- `README.md:165`

Most current calculator tables are direct children of `.p-4` wrappers, for example:

- `pages/bremsweg.tsx:91-92`
- `components/const/ConstDrive.tsx:61-62`
- `components/const/ConstDecel.tsx:223-224`
- `components/const/ConstAccel.tsx:223-224`
- `pages/sonstige.tsx:660-777`
- `pages/vmt.tsx:85-255`

Only the BVSK/MFM system tables consistently use `overflow-x-auto` wrappers:

- `pages/minderwert.tsx:1323`
- `pages/minderwert.tsx:1390`

Impact: narrow screens can clip inputs, formulas, and result cells, which is especially risky for calculator output review.

Recommendation: wrap all fixed-width or multi-column calculator tables in `overflow-x-auto`, matching the BVSK system-table pattern.

### F-08 Medium: Dependency advisories are present - partially addressed

Status: partially addressed on 2026-06-23. Stable direct dependency updates were applied:

- `next` and `eslint-config-next`: `16.2.6` to `16.2.9`
- `react` and `react-dom`: `19.2.6` to `19.2.7`
- `tailwindcss` and `@tailwindcss/postcss`: `4.3.0` to `4.3.1`
- `@types/react`: `19.2.15` to `19.2.17`
- `@types/node`: `24.12.4` to `24.13.2`

`npm audit fix` also updated compatible transitive packages and removed the previous `@babel/core` and `js-yaml` advisories. The current audit result is 2 moderate advisories tied to Next's bundled `postcss <8.5.10`. npm still proposes `next@9.3.3` via `npm audit fix --force`, which is a breaking downgrade and should not be used.

Original `npm audit --json` reported:

- `@babel/core <=7.29.0`: low, arbitrary file read via sourceMappingURL comment, GHSA-4x5r-pxfx-6jf8.
- `js-yaml <=4.1.1`: moderate, quadratic-complexity DoS in merge-key handling, GHSA-h67p-54hq-rp68.
- `postcss <8.5.10`: moderate, CSS stringify XSS, GHSA-qx2v-qp2m-jg93.
- `next`: moderate because it bundles the affected `postcss` range.

`npm outdated --json` showed patch updates available for `next` and `eslint-config-next` from `16.2.6` to `16.2.9`, React from `19.2.6` to `19.2.7`, Tailwind packages from `4.3.0` to `4.3.1`, and type packages. It also showed major updates for ESLint 10 and TypeScript 6.

Impact: no critical/high advisories are reported, but the app is still not advisory-clean because of the remaining Next/PostCSS audit path.

Recommendation: keep the current stable updates, avoid `npm audit fix --force`, and update Next again when a stable release resolves the bundled PostCSS advisory. Continue running `npm audit`, lint, typecheck, tests, build, and manual screenshot export checks after dependency changes.

### F-09 Low: Screenshot export mutates inline styles without preserving prior values - resolved

Status: resolved on 2026-06-24. `useScreenshot` now relies on `html2canvas` clone handling and hides only `[data-screenshot-ignore="true"]` elements in the cloned document. The live DOM is not edited before capture.

Original finding: `useScreenshot` hid buttons and changed table/container inline styles, then restored them by assigning empty strings:

- `hooks/useScreenshot.ts:33-70`

The selector also interpolates `elementId` directly into CSS selectors:

- `hooks/useScreenshot.ts:35-37`
- `hooks/useScreenshot.ts:55-57`

Impact: resolved for the live-DOM mutation path. Export controls now use an attribute marker instead of selector interpolation.

Recommendation: keep using `data-screenshot-ignore="true"` for controls that should be hidden during export, and prefer clone-scoped export styling if new screenshot-only adjustments are needed.

### F-10 Low: Duplicate button IDs appear in repeated export controls - resolved

Status: resolved on 2026-06-24. Repeated export-control IDs were removed and the export hook now uses the shared `data-screenshot-ignore="true"` marker.

Original examples:

- `pages/bremsweg.tsx:237-246`
- `pages/minderwert.tsx:949-958`
- `pages/minderwert.tsx:1111-1120`

Impact: resolved for the known duplicate export button IDs.

Recommendation: continue using data attributes or classes for repeated export controls rather than IDs.

### F-11 Low: Tooltip behavior is mouse-only and not accessible to keyboard/touch users

The `Tooltip` component shows content only on mouse enter/leave and positions it with mouse-derived coordinates:

- `pages/minderwert.tsx:10-43`

Impact: keyboard and touch users cannot reliably access the explanatory content.

Recommendation: add focus/blur support, ARIA linkage, Escape dismissal, and a tap/click path for touch devices.

### F-12 Low: Production Docker image includes only runtime artifacts - resolved

Status: resolved on 2026-06-23. The Dockerfile now uses `deps`, `builder`, and `runner` stages. The runner installs only production dependencies with `npm ci --omit=dev`, sets `NEXT_TELEMETRY_DISABLED=1` and `NODE_ENV=production`, runs as the non-root `app` user, and copies only `.next`, `public`, `next.config.js`, and package metadata from the build context/build output.

Original finding: the Dockerfile installed all dependencies, copied the full source, built, and ran in the same image:

- `Dockerfile:1-27`

Impact: resolved for the production image. Build-time dependencies and source files remain only in intermediate build stages.

Recommendation: keep Docker and dependency changes synchronized. If the app later moves to Next standalone output, simplify the runner further by copying `.next/standalone` and `.next/static`.

### F-13 Low: Documentation and config have small drift - resolved

Status: resolved on 2026-06-23. README and repository guidelines now describe the current route names, Vitest test command, Docker image shape, and dependency-version policy. The legacy `.eslintrc.json` was removed because `eslint.config.mjs` is the active flat ESLint configuration.

Original examples:

- README duplicated exact package versions outside `package.json` and `package-lock.json`.
- README carried an outdated Tailwind version note.
- The legacy `.eslintrc.json` remained tracked even though `eslint.config.mjs` is the active lint path.

Impact: resolved for the known stale docs/config entries.

Recommendation: keep exact dependency versions in `package.json` and `package-lock.json` instead of duplicating them in prose.

## Positive Observations

- The worktree was clean before report creation.
- TypeScript is strict and includes `strictNullChecks`, `noUncheckedIndexedAccess`, `noImplicitReturns`, and `noFallthroughCasesInSwitch`.
- `eslint-config-next/core-web-vitals` is active through flat config.
- Main layout components live under `components/`, keeping `/pages` reserved for routes.
- Hex Tailwind palettes are mirrored in `tailwind.config.ts` and `styles/globals.css`, matching the html2canvas compatibility note.
- The production build succeeds with the current Next.js 16.2.9 and React 19.2.7 package set.

## Recommended Remediation Order

1. Finish remaining formula-domain validation from F-01, especially zero denominators, impossible non-root relationships, stop-page non-finite outputs, and negative times/distances.
2. Expand formula-helper unit tests before broad UI refactors.
3. Tighten Minderwert date and factor validation.
4. Decide whether Kurvenradius should remain `h`/`s`-driven with `b` as a documented comparison input, or expand it into a full solver for combinations involving `b`.
5. Monitor Next for a stable PostCSS advisory fix; do not use npm's forced `next@9.3.3` downgrade.
6. Wrap calculator tables for mobile overflow.
7. Improve tooltip accessibility.

## Residual Risk

I did not validate the formulas against external forensic references or legal/technical standards. This audit identifies implementation risks and code-level correctness hazards, but the actual equations and default values should still be reviewed by a domain expert.
