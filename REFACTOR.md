# Refactor Playbook: Upgrade to Node 22 & Tailwind CSS 4

This document captures the concrete steps required to move the project from **Node 18 / Tailwind 3.4** to the latest major releases (**Node 22.x** and **Tailwind CSS 4.x**). Follow the steps in order; each section assumes the previous one has completed successfully.

### Current Status
- ✅ Node runtime updated to Node.js 22 LTS (Docker base image, docs, and `@types/node` refreshed; lint/tsc run clean).
- ⏳ Tailwind CSS remains on v3.0.24 pending migration to v4.

---

## 0. Prep & Verification

- Ensure local tooling (Node, npm) can run Node 22 builds. Install Node 22 (e.g., via `nvm`) so you can test before pushing.
- Create a feature branch; keep the existing mainline runnable on Node 18 / Tailwind 3 until the migration is complete.
- Gather baseline outputs: `npm run lint`, `npm run build`, and a few manual screenshots so you can compare after the upgrade.

---

## 1. Upgrade the Node Runtime (target Node 22.x)

1. **Align runtime images & docs** *(Completed)*
   - Update `Dockerfile` base image from `node:20-alpine` to the latest Node 22 Alpine tag.
   - If an `.nvmrc`, CI workflow, or deployment config appears later, update it to `22.x` as well.
   - Document the new minimum Node version in `README.md` / developer guides so contributors know to upgrade.

2. **Refresh dependencies** *(Completed)*
   - Bump `@types/node` to `^22.x` in `package.json` and regenerate `package-lock.json` (`npm install`).
   - Confirm that top-level tooling (`next`, `eslint`, `typescript`) still supports Node 22. If any peer warnings appear, upgrade those packages in the same pull request.

3. **TypeScript & linting pass** *(Completed)*
   - Run `npm run lint` and `tsc --noEmit` (or `npx tsc --noEmit`) to surface new type errors. Expect tighter Node typings (e.g., `fs` APIs return `Buffer` instead of `any`). Fix issues inline.

4. **Runtime verification** *(Completed)*
   - Run `npm run dev` under Node 22 and exercise core flows (calculators, screenshot exports) to ensure nothing depends on Node 18-specific behavior.
   - Build the production bundle (`npm run build && npm start`).
   - Update documentation to note the upgrade is done.

---

## 2. Migrate to Tailwind CSS 4.x

Tailwind 4 introduces a new configuration format, bundled PostCSS, and changes to utility generation. Handle the migration methodically:

1. **Install new packages**
   - Upgrade `tailwindcss` to `^4.x` in `package.json` and rerun `npm install`.
   - Remove direct dependencies on `postcss` and `autoprefixer` unless other tooling needs them; Tailwind 4 bundles its own pipeline.
   - Review any Tailwind plugins (none are currently installed, but confirm your dependency list stays clean).

2. **Recreate Tailwind config**
   - Replace `tailwind.config.js` with the new Tailwind 4 `tailwind.config.ts` format. Define content globs (include `./pages/**/*`, `./components/**/*`, `./hooks/**/*`) and migrate the existing theme extensions (primary color palette) into the new API.
   - Tailwind 4 expects tokens/utilities declared via exported objects/functions; map the current `theme.extend.colors.primary` to the new structure.

3. **CSS entry point adjustments**
   - Tailwind 4 ships with a new preset for the base layers. Update `styles/globals.css` to match the recommended directives (e.g., use `@import "tailwindcss/base"` style if required). Re-apply custom `@layer base` rules for tables, inputs, and scrollbars, verifying the syntax still compiles.
   - Remove legacy comments or Tailwind 3-specific utilities if they conflict with the new preset.

4. **Utility sweep**
   - Audit JSX/TSX files for class names that may have changed semantics (e.g., color tokens, gradient helpers). Validate the gradient headers (`bg-gradient-to-r from-[#0059a9] ...`) still render; Tailwind 4 may warn about arbitrary colors if not enabled.
   - Confirm `@apply` statements in `globals.css` still work; Tailwind 4 may enforce stricter ordering.

5. **Build & visual regression**
   - Run `npm run build` and `npm run dev` to ensure Tailwind compilation succeeds.
   - Visually inspect the main calculators (`Stop`, `Const`, `VMT`, `Sonst`) to ensure spacing and typography match expectations, especially tables and buttons where `@apply` was used.

6. **Cleanup & documentation**
   - If `postcss.config.js` becomes unnecessary, remove it and update documentation accordingly.
   - Document any new Tailwind patterns (e.g., how to extend tokens in `tailwind.config.ts`) so future contributors understand the layout.

---

## 3. Final Verification Checklist

- [x] Docker image, local tooling, and docs show Node 22.x.
- [x] `@types/node` upgraded; `npm run lint`, `npm run build`, and `npm run dev` succeed under Node 22.
- [ ] Tailwind 4 config in place; no orphaned Tailwind 3 files remain.
- [ ] Custom styling (`globals.css`, tables, gradients) renders correctly after the Tailwind upgrade.
- [ ] PostCSS/Autoprefixer dependencies removed or justified.
- [ ] README / contributor docs updated with new requirements and migration notes.

Following this sequence minimizes churn: upgrade the runtime first so type checks reflect the target environment, then tackle Tailwind’s configuration overhaul once Node 22 is stable.
