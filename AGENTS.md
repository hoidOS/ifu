# Repository Guidelines

## Project Structure & Module Organization
- `pages/` contains Next.js routes for analysis tools (`bremsweg`, `konstantfahrt`, `vmt`, `sonstige`, `minderwert`).
- `components/` hosts shared UI (layout, navbar, footer) and calculators (e.g., `StepperInput`, `util*`).
- `hooks/` includes utilities such as `useScreenshot` for exports.
- `assets/` stores SVG formula renderings; `public/` holds static files.
- `styles/globals.css` contains the Tailwind v4 CSS-first theme tokens and shared classes; `tailwind.config.ts` mirrors palette/config values for tooling and legacy consumers; `postcss.config.js` wires Tailwind into PostCSS.

## Build, Test, and Development Commands
- Target runtime: Node.js 24 LTS.
- `.nvmrc` pins the local runtime to Node 24 for environment parity.
- `npm install` installs dependencies.
- `npm run dev` starts the Next.js dev server on `http://localhost:3000`.
- `npm run build` produces the optimized production bundle with Next.js 16's default Turbopack build pipeline.
- `npm start` serves the production build.
- `npm run lint` executes ESLint through the flat config in `eslint.config.mjs`.
- `npm test` runs the Vitest formula-helper test suite.

## Coding Style & Naming Conventions
- TypeScript throughout; prefer explicit types for props and exports.
- Components live in PascalCase files (`ConstDecel.tsx`), hooks in camelCase (`useScreenshot`), and route files stay lowercase for clean URLs.
- Follow Tailwind utility classes for layout; avoid inline styles unless necessary.
- Linting runs through `eslint .` with `eslint-config-next/core-web-vitals`; run `npm run lint` before committing.
- Next.js 16 uses the React automatic runtime; keep `tsconfig.json` aligned with `jsx: "react-jsx"`.
- Tailwind defaults use OKLCH colors that break `html2canvas`; add new UI colors as hex tokens in `styles/globals.css` and mirror them in `tailwind.config.ts` whenever you introduce new palette values.
- Use the shared calculator classes in `styles/globals.css` (`calculator-card`, `calculator-card-header`, `calculator-header-button`, `calculator-table`, `calculator-row`, `calculator-result-table`) for standard calculator screens. Keep header heights consistent with `calculator-card-header`; use `calculator-card-header-compact` only for deliberately compact special cases.
- `minderwert` intentionally uses system colors: BVSK stays on the Steinacker primary blue, while MFM uses the darker orange accent (`orange-700`/`orange-800`) across headers, focus rings, result values, comparison markers, and system/reference tables. Keep editable input table shells neutral so the fields remain the focus.
- Export controls should use `data-screenshot-ignore="true"` so `useScreenshot` can hide them in the cloned `html2canvas` document without mutating the live DOM.
- The flat ESLint config intentionally disables `react-hooks/set-state-in-effect` to preserve the current sessionStorage restore pattern used across calculators; avoid re-enabling it without refactoring those pages.
- Some legacy result tables lack horizontal scroll on mobile; match the BVSK system implementation by wrapping future tables in `<div class="overflow-x-auto">` to preserve usability on narrow screens.
- Layout-related components (`Layout`, `Navbar`, `Footer`) live in `components/`; keep `/pages` reserved for actual routes to avoid accidental public endpoints.

## Testing Guidelines
- Formula-helper tests use Vitest and should be colocated next to the module under test (`*.test.ts` or `*.test.tsx`).
- Prefer direct helper tests for formula edge cases before broad UI tests; manually validate calculator screens and exports for visual workflows.

## Commit & Pull Request Guidelines
- Commit messages use imperative mood (e.g., "Add Ausschervorgänge calculator").
- Keep commits scoped; separate refactors from features when possible.
- Pull requests should describe intent, list test runs (`npm run lint`), and include screenshots/GIFs for UI changes.
- Reference related issues in the PR body using `Fixes #ID` when applicable.

## Security & Configuration Tips
- Environment variables belong in `.env.local`; never commit secrets.
- For Docker workflows, sync `Dockerfile` and `docker-compose.yml` updates with dependency changes.

## Upcoming Work
- Track planned follow-up in issues and `AUDIT_REPORT.md`; keep this section current when work becomes scheduled.
