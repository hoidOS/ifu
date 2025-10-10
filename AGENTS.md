# Repository Guidelines

## Project Structure & Module Organization
- `pages/` contains Next.js routes for analysis tools (`Stop`, `Const`, `VMT`, `Sonst`).
- `components/` hosts shared UI and calculators (e.g., `StepperInput`, `util*`).
- `hooks/` includes utilities such as `useScreenshot` for exports.
- `assets/` stores SVG formula renderings; `public/` holds static files.
- `styles/`, `tailwind.config.ts`, and `postcss.config.js` define styling.

## Build, Test, and Development Commands
- Target runtime: Node.js 22 LTS.
- `npm install` installs dependencies.
- `npm run dev` starts the Next.js dev server on `http://localhost:3000`.
- `npm run build` produces the optimized production bundle.
- `npm start` serves the production build.
- `npm run lint` executes ESLint with the Next.js configuration.

## Coding Style & Naming Conventions
- TypeScript throughout; prefer explicit types for props and exports.
- Components live in PascalCase files (`ConstDecel.tsx`), hooks in camelCase (`useScreenshot`).
- Follow Tailwind utility classes for layout; avoid inline styles unless necessary.
- Linting via `next lint`; run before committing to catch style violations.
- Tailwind defaults use OKLCH colors that break `html2canvas`; extend palettes with hex values in `tailwind.config.ts` and mirror them in `styles/globals.css` whenever you introduce new UI colors.

## Testing Guidelines
- Automated tests are not yet defined; validate calculators manually via sample inputs.
- When adding tests, colocate files next to the module (`*.test.tsx`) and integrate with Jest/React Testing Library.

## Commit & Pull Request Guidelines
- Commit messages use imperative mood (e.g., "Add Ausschervorgänge calculator").
- Keep commits scoped; separate refactors from features when possible.
- Pull requests should describe intent, list test runs (`npm run lint`), and include screenshots/GIFs for UI changes.
- Reference related issues in the PR body using `Fixes #ID` when applicable.

## Security & Configuration Tips
- Environment variables belong in `.env.local`; never commit secrets.
- For Docker workflows, sync `Dockerfile` and `docker-compose.yml` updates with dependency changes.

## Upcoming Work
- None currently scheduled; track new feature requests via issues.
