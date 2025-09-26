# Refactor Plan: Node 24 & Tailwind CSS 4 Migration

This document outlines the work needed to move the project from Node 18 / Tailwind 3.4 to the latest stable releases (Node 24.x, Tailwind CSS 4.x). Tackle Node upgrades first so the tooling is aligned before addressing Tailwind’s breaking changes.

---

## 1. Node / @types/node Upgrade (Target Node 24.x)

- **Runtime alignment**
  - Update all runtime references to Node 24: `Dockerfile`, CI workflows, local development instructions.
  - Confirm the hosting environment (e.g., Vercel, Docker images) supports Node 24.

- **Package updates**
  - Bump `@types/node` to `^24.x` in `package.json`.
  - Ensure `next`, ESLint configs, and other tooling remain compatible with Node 24 (upgrade if required).
  - Run `npm install` / `npm ci` to refresh lockfiles.

- **TypeScript compatibility**
  - Re-run `tsc --noEmit` to surface new Node type errors (expect stricter fs/path typings).
  - Update any code relying on deprecated Node APIs or changed type signatures.

- **Testing & validation**
  - Execute `npm run lint`, `npm run build`, and key runtime checks (e.g., `npm run dev`) under Node 24.
  - Update documentation (`README.md`, `REFACTOR.md`) with the new Node baseline.

## 2. Tailwind CSS 4.x Migration

Tailwind 4 introduces an entirely new configuration and build pipeline. Plan the migration carefully; there are no automatic codemods yet.

- **Dependencies**
  - Upgrade `tailwindcss` to `^4.x`. Tailwind 4 bundles PostCSS and Autoprefixer, so remove those dependencies if unused elsewhere.
  - Check for compatibility with Next.js (Next 15+) and whether additional plugins need updates or replacements.

- **Configuration overhaul**
  - Tailwind 4 uses a new `tailwind.config.ts` format with exportable tokens/utilities. Replace the existing `tailwind.config.js` with the new structure (see Tailwind 4 migration guides).
  - Ensure content paths include all app directories (`./pages`, `./components`, any future `app/`).
  - Recreate color palette, fonts, and other theme extensions using the new API (custom color palette currently defined under `theme.extend.colors.primary`).

- **Styles entry point**
  - Tailwind 4 consolidates the CSS entry setup. Update `styles/globals.css` to the new layer directives if required (Tailwind now ships a default layer preset).
  - Verify custom `@apply` usage (tables, inputs, scrollbars) still compiles; rewrite any utilities that Tailwind 4 drops.

- **PostCSS pipeline**
  - Tailwind 4 can run without a `postcss.config.js`. If the project relies on custom PostCSS transforms, reconfigure the pipeline using Tailwind’s new preset system or keep PostCSS explicitly.

- **Utility changes**
  - Review release notes for removed/renamed utilities. Adjust classes in JSX/TSX files accordingly (e.g., color tokens, gradients).
  - Confirm any third-party Tailwind plugins still work or find replacements.

- **Build & runtime validation**
  - Run `npm run Build` and the dev server to ensure styles compile without errors.
  - Visually regression-test key pages (tables, calculators, gradient headers) because Tailwind 4 may change default resets.

## 3. Documentation & Tooling Follow-Up

- Update `README.md` (and `AGENTS.md` if needed) to reflect new Node/Tailwind versions, install steps, and lint instructions.
- Document the Tailwind 4 configuration layout so future contributors understand the new structure.
- Consider adding a short migration summary to the project changelog or PR description when the upgrade lands.

---

### Checklist Snapshot

- [ ] Update runtime/config to Node 24.
- [ ] Upgrade `@types/node`, refresh lockfiles.
- [ ] Resolve any new TypeScript or ESLint issues under Node 24.
- [ ] Upgrade Tailwind CSS to 4.x and adopt new config format.
- [ ] Remove/adjust PostCSS & Autoprefixer dependencies if no longer needed.
- [ ] Validate custom styles and Tailwind utilities still behave as expected.
- [ ] Update documentation to reflect new baselines.
