# Repository Audit Report

Date: 2026-06-23

Scope: Next.js Pages Router application, shared components, calculation helpers, screenshot/export hook, styling, package metadata, Docker setup, local build/lint/type checks, npm advisory check, and dependency freshness check.

Original audit constraint followed: no repository files were changed except this report during the audit pass.

## Executive Summary

The project is in good baseline shape for tooling: ESLint passes, TypeScript passes, and a production build succeeds when run from a temporary copy outside the repository. The main risk is not build health. The main risk is calculation correctness: several calculators accept zero, contradictory, or physically impossible inputs and then render `Infinity`, `-Infinity`, `NaN`, negative distances/times, or plausible-looking values for impossible scenarios.

The formula layer is also not covered by automated tests. For a forensic automotive calculator, this is the largest quality gap.

Post-audit implementation work has resolved F-02 and clarified the F-04 Kurvenradius behavior for the current UI requirement. F-01 remains open as the broader formula-domain validation issue.

## Verification Performed

- `git status --short`: clean before report creation.
- `npm run lint`: passed.
- `./node_modules/.bin/tsc --noEmit --incremental false`: passed.
- `npm run build`: passed in a `/tmp` copy of the repository so `.next/` in the repo was not touched.
- `npm audit --json`: completed with 4 advisories: 1 low, 3 moderate.
- `npm outdated --json`: completed and identified available patch/minor package updates.

The first sandboxed temp-copy build failed because Turbopack tried to spawn/bind an internal process and the sandbox returned `Operation not permitted`. The same temp-copy build passed when rerun with elevated execution. Build output stayed under `/tmp`.

## Post-Audit Updates

- 2026-06-23: F-02 is resolved in the current worktree. `components/utilConst.tsx:1-10` now formats square-root helper results through a shared guard that returns `ERROR` for negative radicands and non-finite outputs, and `components/utilConst.tsx:173-176` no longer masks the acceleration `vA` radicand with `Math.abs`. The const result tables render helper-level `ERROR` in red.
- 2026-06-23: F-04 is resolved for the clarified UI requirement. `Kurvenradius Ergebnisse` now shows the three entered values above the calculated outputs, and `isCurveError()` no longer rejects the table merely because `b` is present. The block remains an `h`/`s`-driven calculation; implementing all two-value solve combinations involving `b` would be a separate feature.
- Verification after the F-02 implementation: `npm run lint` passed and `./node_modules/.bin/tsc --noEmit --incremental false` passed.

## Findings

### F-01 High: Core calculators render invalid numeric results for accepted inputs

The UI accepts zero as a valid value in many places, and the solve logic uses `>= 0` checks before calling helpers that divide by speed, time, acceleration, or distance.

Evidence:

- `components/utilConst.tsx:2-13` divides by `t` and `v` in constant-drive formulas.
- `pages/const/const-drive.tsx:41-47` treats `v`, `s`, and `t` as set when they are `>= 0`.
- `pages/const/const-drive.tsx:89-142` permits `v=0`, `s=0`, and `t=0`.
- `components/utilConst.tsx:73-166` and `components/utilConst.tsx:227-320` contain multiple divisions by `s`, `t`, and `a`.
- `pages/const/const-decel.tsx:49-205` and `pages/const/const-accel.tsx:49-205` use `>= 0` as the domain gate.
- `components/utilStop.tsx:17-52` divides by `am`.
- `pages/stop.tsx:48-55` calculates all stop outputs unconditionally.
- `pages/stop.tsx:132-144` permits an end speed greater than the initial speed.
- `pages/stop.tsx:207-219` permits `am=0`.

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

### F-03 High: No automated tests cover the formula layer

Evidence:

- `package.json:5-10` has no `test` script.
- Formula helpers in `components/utilConst.tsx` and `components/utilStop.tsx` are pure enough to test directly.

Impact: formula regressions, unit mistakes, and edge-case behavior are currently only caught by manual validation.

Recommendation: add focused unit tests for every helper and for representative UI solve paths. Include edge cases for zero denominators, impossible radicands, equal speeds, end speed greater than initial speed, negative monetary factors, and expected valid examples from known forensic reference calculations.

### F-04 Medium: Kurvenradius `b` behavior was ambiguous - resolved for current UI requirement

Status: resolved by clarification on 2026-06-23. The intended behavior is to show the entered `h`, `s`, and `b` values above the calculated outputs so the exported result table clearly documents the inputs. `b` is not currently intended to drive alternate solve paths.

Original finding: the Kurvenradius UI asked for Segmenthoehe `h`, Segmentlaenge `s`, and Bogenlaenge `b`:

- `pages/sonst.tsx:650-749`

The calculations still use `h` and `s`:

- `pages/sonst.tsx:177-207`

Current behavior:

- `pages/sonst.tsx:212-214` no longer errors merely because `b` is present.
- `pages/sonst.tsx:783-811` shows `h`, `s`, and `b` as input rows in the result table.
- `pages/sonst.tsx:813-845` shows calculated `R`, central angle, and computed bogenlaenge below those inputs.

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

- `pages/minderwert.tsx:306-318`

That then maps to the maximum AK factor through `calculateAKFactor()`:

- `pages/minderwert.tsx:330-337`

Impact: a reversed or invalid date pair can produce the same AK behavior as a zero-month-old vehicle rather than showing an error.

Recommendation: distinguish "unknown/invalid date" from "0 months old". Return a validation error for reversed or invalid dates and avoid calculating MFM until dates are coherent.

### F-07 Medium: Most calculator tables still lack mobile horizontal scroll wrappers

The README already documents this risk:

- `README.md:165`

Most current calculator tables are direct children of `.p-4` wrappers, for example:

- `pages/stop.tsx:91-92`
- `pages/const/const-drive.tsx:62-63`
- `pages/const/const-decel.tsx:220-221`
- `pages/const/const-accel.tsx:220-221`
- `pages/sonst.tsx:660-777`
- `pages/vmt.tsx:85-255`

Only the BVSK/MFM system tables consistently use `overflow-x-auto` wrappers:

- `pages/minderwert.tsx:1255`
- `pages/minderwert.tsx:1322`

Impact: narrow screens can clip inputs, formulas, and result cells, which is especially risky for calculator output review.

Recommendation: wrap all fixed-width or multi-column calculator tables in `overflow-x-auto`, matching the BVSK system-table pattern.

### F-08 Medium: Dependency advisories are present

`npm audit --json` reported:

- `@babel/core <=7.29.0`: low, arbitrary file read via sourceMappingURL comment, GHSA-4x5r-pxfx-6jf8.
- `js-yaml <=4.1.1`: moderate, quadratic-complexity DoS in merge-key handling, GHSA-h67p-54hq-rp68.
- `postcss <8.5.10`: moderate, CSS stringify XSS, GHSA-qx2v-qp2m-jg93.
- `next`: moderate because it bundles the affected `postcss` range.

`npm outdated --json` showed patch updates available for `next` and `eslint-config-next` from `16.2.6` to `16.2.9`, React from `19.2.6` to `19.2.7`, Tailwind packages from `4.3.0` to `4.3.1`, and type packages. It also showed major updates for ESLint 10 and TypeScript 6.

Impact: no critical/high advisories were reported, but the app is not advisory-clean.

Recommendation: try the patch updates first, especially `next`/`eslint-config-next`, then rerun `npm audit`, lint, typecheck, build, and manual screenshot export checks. Do not blindly follow npm's reported `next@9.3.3` fix suggestion; that appears to be an advisory-resolution artifact and would be a major downgrade.

### F-09 Low: Screenshot export mutates inline styles without preserving prior values

`useScreenshot` hides buttons and changes table/container inline styles, then restores them by assigning empty strings:

- `hooks/useScreenshot.ts:33-70`

The selector also interpolates `elementId` directly into CSS selectors:

- `hooks/useScreenshot.ts:35-37`
- `hooks/useScreenshot.ts:55-57`

Impact: current IDs are safe, but future IDs with CSS-special characters would break selectors. Future inline styles on target elements would be lost after export.

Recommendation: use `CSS.escape(elementId)`, store previous inline style values before mutation, or toggle a scoped export class instead of editing inline styles.

### F-10 Low: Duplicate button IDs appear in repeated export controls

Examples:

- `pages/stop.tsx:237-246`
- `pages/minderwert.tsx:949-958`
- `pages/minderwert.tsx:1111-1120`

Impact: duplicate IDs violate HTML uniqueness and can confuse tests, accessibility tooling, and future DOM queries. The current screenshot selector scopes under the target container, so this is not currently breaking export.

Recommendation: replace repeated IDs with classes or data attributes, or generate unique IDs per export section.

### F-11 Low: Tooltip behavior is mouse-only and not accessible to keyboard/touch users

The `Tooltip` component shows content only on mouse enter/leave and positions it with mouse-derived coordinates:

- `pages/minderwert.tsx:20-43`

Impact: keyboard and touch users cannot reliably access the explanatory content.

Recommendation: add focus/blur support, ARIA linkage, Escape dismissal, and a tap/click path for touch devices.

### F-12 Low: Docker image is single-stage and keeps build-time dependencies

The Dockerfile installs all dependencies, copies the full source, builds, and runs in the same image:

- `Dockerfile:1-27`

Impact: production images include dev dependencies and source files, increasing image size and attack surface.

Recommendation: use a multi-stage build. Build with dev dependencies in a builder stage, then copy `.next`, public assets, package metadata, and production dependencies into a smaller runtime stage. Consider `COPY --chown=app:app` for copied files and set `NEXT_TELEMETRY_DISABLED=1` in build/runtime.

### F-13 Low: Documentation and config have small drift

Examples:

- `README.md:137-149` lists package versions that no longer match `package.json:11-27`.
- `README.md:162` says Tailwind was upgraded to `4.2.2`, while `package.json:18` and `package.json:26` use `4.3.0`.
- `.eslintrc.json:1-3` remains tracked even though the active lint path is `eslint.config.mjs:1-12`.

Impact: low operational risk, but it creates friction during upgrades and onboarding.

Recommendation: refresh README version claims or remove exact versions from prose, and remove the legacy `.eslintrc.json` if the flat config is canonical.

## Positive Observations

- The worktree was clean before report creation.
- TypeScript is strict and includes `strictNullChecks`, `noUncheckedIndexedAccess`, `noImplicitReturns`, and `noFallthroughCasesInSwitch`.
- `eslint-config-next/core-web-vitals` is active through flat config.
- Main layout components live under `components/`, keeping `/pages` reserved for routes.
- Hex Tailwind palettes are mirrored in `tailwind.config.ts` and `styles/globals.css`, matching the html2canvas compatibility note.
- The production build succeeds with Next.js 16.2.6 and React 19.2.6.

## Recommended Remediation Order

1. Finish remaining formula-domain validation from F-01, especially zero denominators, impossible non-root relationships, stop-page non-finite outputs, and negative times/distances.
2. Add formula-helper unit tests before broad UI refactors.
3. Tighten Minderwert date and factor validation.
4. Decide whether Kurvenradius should remain `h`/`s`-driven with `b` as a documented comparison input, or expand it into a full solver for combinations involving `b`.
5. Apply safe dependency patch updates and rerun the checks.
6. Wrap calculator tables for mobile overflow.
7. Clean up screenshot export selectors, duplicate IDs, Docker image shape, docs drift, and tooltip accessibility.

## Residual Risk

I did not validate the formulas against external forensic references or legal/technical standards. This audit identifies implementation risks and code-level correctness hazards, but the actual equations and default values should still be reviewed by a domain expert.
