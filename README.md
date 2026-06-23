# STEINACKER - Forensic Automotive Analysis Suite

A comprehensive Next.js web application for automotive forensic analysis and accident reconstruction calculations. This tool provides specialized calculators for vehicle dynamics, braking analysis, constant speed calculations, and video measurement tools.

## Features

### Core Analysis Tools
- **Braking Analysis (Anhaltevorgang)** - Complete stopping distance calculations including reaction time, brake delay, and braking distance
- **Constant Speed Analysis (Konstantfahrt)** - Acceleration, deceleration, and constant velocity calculations
- **Video Measurement Tools (VMT)** - ESO and Riegl laser measurement beam divergence calculations
- **Value Assessment (Minderwert)** - Vehicle damage value assessment tools
- **Additional Calculations (Sonstige)** - Curve radius calculations, percentage/angle conversions, and other utilities

### Additional Features
- **Screenshot & Export** - Generate high-quality PNG exports and copy results to clipboard
- **Session Storage** - Automatically saves input values across browser sessions
- **Responsive Design** - Works on desktop and mobile devices
- **Mobile Navigation** - Swipe-to-close drawer, keyboard shortcuts, and scroll locking for the menu overlay
- **Resource Links** - Quick access to maps, automotive databases, and crash test resources
- **Stepper Inputs** - Enhanced number inputs with increment/decrement buttons for precise value adjustment
- **Docker Support** - Containerized deployment with Docker and docker-compose

## Technology Stack

- **Framework**: Next.js 16 with React 19 and TypeScript
- **Styling**: Tailwind CSS 4
- **Linting**: ESLint flat config via `eslint-config-next/core-web-vitals`
- **Testing**: Vitest for formula-helper unit tests
- **Screenshot**: `html2canvas` for PNG exports with clipboard-to-download fallback
- **State Management**: React `useState` with sessionStorage persistence

## Development Commands

Prerequisite: Node.js 24 LTS (or newer within the 24.x line).

### Installation
```bash
nvm use
npm install
```

### Development
```bash
npm run dev
# Starts development server at http://localhost:3000
```

### Build & Production
```bash
npm run build    # Build for production (Next.js 16 / Turbopack)
npm start        # Start production server
```

### Code Quality
```bash
npm run lint     # Run ESLint
npm test         # Run Vitest tests
```

## Project Structure

```
nextjs-ppcavs-ifu/
├── assets/                 # SVG mathematical symbols and wrapper
│   ├── images/             # Formula renderings exported as SVG
│   └── svg.tsx             # Import map for formula assets
├── components/
│   ├── Footer.tsx          # Shared site footer
│   ├── Layout.tsx          # Page wrapper
│   ├── Navbar.tsx          # Global navigation
│   ├── StepperInput.tsx    # Custom numeric input with +/- controls
│   ├── const/              # Konstantfahrt calculator sections
│   │   ├── ConstAccel.tsx
│   │   ├── ConstDecel.tsx
│   │   └── ConstDrive.tsx
│   ├── util.tsx            # DOM helpers
│   ├── utilConst.tsx       # Konstantfahrt calculation helpers
│   └── utilStop.tsx        # Braking distance calculations
├── hooks/
│   └── useScreenshot.ts    # html2canvas export + clipboard fallback
├── pages/
│   ├── _app.tsx            # Global layout wrapper
│   ├── _document.tsx       # Root document attributes for Next.js/browser behavior
│   ├── index.tsx
│   ├── bremsweg.tsx
│   ├── konstantfahrt.tsx
│   ├── minderwert.tsx
│   ├── sonstige.tsx
│   └── vmt.tsx
├── public/
│   └── favicon.ico
├── styles/
│   └── globals.css         # Tailwind layer + global styles
├── docker-compose.yml
├── Dockerfile
├── eslint.config.mjs       # Flat ESLint configuration
├── next.config.js
├── .nvmrc                  # Local Node.js runtime pin (24)
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## Calculation Functions

### Braking Analysis (utilStop.tsx)
- `getReaction()` - Reaction distance calculation
- `getBrakeDelay()` - Brake delay distance
- `getFullSend()` - Velocity at full braking start
- `getBrakeDistance()` - Actual braking distance
- `getBrakeDuration()` - Braking time duration
- `getFullDistance()` - Total stopping distance
- `getFullTime()` - Total stopping time

### Constant Speed Analysis (utilConst.tsx)
- Deceleration functions (`getdVA1-4`, `getdVE1-4`, `getDecel1-4`)
- Braking functions (`getBD1-4`, `getBT1-4`)
- Acceleration functions (`getaVA1-4`, `getaVE1-4`, `getAccel1-4`)
- Distance/time calculations (`getAD1-4`, `getAT1-4`)

### Screenshot Hook (useScreenshot.ts)
- `handleScreenshot()` - Download element as PNG
- `handleClipboard()` - Copy element to clipboard with automatic download fallback
- `hideElements()` - Clean UI for screenshots
- `restoreElements()` - Restore UI after screenshot

## Usage

1. **Start the development server**: `npm run dev`
2. **Navigate to analysis tool**: Choose from Bremsweg, Konstantfahrt, VMT, Minderwert, or Sonstige
3. **Enter parameters**: Input vehicle data (speeds, times, distances, acceleration values)
4. **View results**: Calculations update in real-time
5. **Export results**: Use screenshot or clipboard buttons to save results

## Key Dependencies

### Core Dependencies
- `next` - React framework
- `react` / `react-dom` - UI rendering
- `html2canvas` - Screenshot generation

### Development Dependencies
- `typescript` - Type safety
- `tailwindcss` / `@tailwindcss/postcss` - Styling pipeline
- `eslint` / `eslint-config-next` - Code linting
- `vitest` - Formula-helper unit tests
- `@types/node`, `@types/react`, `@types/react-dom` - Type definitions

Exact package versions are maintained in `package.json` and `package-lock.json`.

## Notes

- All calculations use metric units (m/s², km/h, meters, seconds)
- Input values are automatically saved to browser session storage
- Mathematical formulas are implemented according to forensic automotive standards
- The application includes German terminology for forensic automotive analysis
- Runtime standardized on Node.js 24 LTS; match local tooling before running builds.
- `.nvmrc` pins local development to Node 24 for parity with Docker and team tooling.
- Production builds use Next.js 16's default Turbopack pipeline.
- ESLint is configured through `eslint.config.mjs` using `eslint-config-next/core-web-vitals`.
- The flat ESLint config includes a targeted `react-hooks/set-state-in-effect` override to preserve the existing sessionStorage restore pattern used by calculators.
- Tailwind CSS v4 is configured through `tailwind.config.ts`.
- Tailwind's default OKLCH color tokens break `html2canvas` screenshots; define new palette entries with hex values in both `tailwind.config.ts` and `styles/globals.css` to keep exports working.
- The screenshot/export flow still depends on `html2canvas@1.4.1`; runtime alignment changes should not replace it without manual browser verification.
- `pages/_document.tsx` sets `data-scroll-behavior="smooth"` on `<Html>` to acknowledge intentional global smooth scrolling in Next.js 16.
- Formula SVGs rendered through `next/image` should keep both dimensions automatic (`h-auto w-auto`) when constrained with `max-w-full` to avoid browser aspect-ratio warnings.
- Some calculator tables (e.g. Anhaltevorgang) still overflow on phones; wrap new tables in `<div class="overflow-x-auto">` like the BVSK system block to restore horizontal scrolling.
- Layout, navbar, and footer now live under `components/` so they can be shared without accidentally creating extra pages in the `/pages` router.

## Deployment

### Standard Deployment
The application can be deployed on any platform that supports Next.js:

```bash
npm run build
npm start
```

### Docker Deployment
The project includes Docker support for containerized deployment:

```bash
# Build and run with docker-compose
docker-compose up --build

# Or build manually
docker build -t nextjs-ifu .
docker run -p 3000:3000 nextjs-ifu
```

The Docker image targets Node 24 LTS via `node:24-alpine` and uses a multi-stage build so the runtime image keeps only production dependencies and built Next.js output.

### Vercel Deployment
For Vercel deployment, connect your GitHub repository to Vercel for automatic deployments.

## License

Distributed under the terms of the GNU General Public License v3.0 or any later version. See `LICENSE` for the full text and obligations when redistributing or modifying the software.
