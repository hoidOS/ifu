# STEINACKER - Forensic Automotive Analysis Suite

A comprehensive Next.js web application for automotive forensic analysis and accident reconstruction calculations. This tool provides specialized calculators for vehicle dynamics, braking analysis, constant speed calculations, and video measurement tools.

## Features

### Core Analysis Tools
- **Braking Analysis (Anhaltevorgang)** - Complete stopping distance calculations including reaction time, brake delay, and braking distance
- **Constant Speed Analysis (Konstantfahrt)** - Acceleration, deceleration, and constant velocity calculations
- **Video Measurement Tools (VMT)** - ESO and Riegl laser measurement beam divergence calculations
- **Value Assessment (Minderwert)** - Vehicle damage value assessment tools
- **Additional Calculations (Sonst)** - Curve radius calculations, percentage/angle conversions, and other utilities

### Additional Features
- **Screenshot & Export** - Generate high-quality PNG exports and copy results to clipboard
- **Session Storage** - Automatically saves input values across browser sessions
- **Responsive Design** - Works on desktop and mobile devices
- **Mobile Navigation** - Swipe-to-close drawer, keyboard shortcuts, and scroll locking for the menu overlay
- **Resource Links** - Quick access to maps, automotive databases, and crash test resources
- **Stepper Inputs** - Enhanced number inputs with increment/decrement buttons for precise value adjustment
- **Docker Support** - Containerized deployment with Docker and docker-compose

## Technology Stack

- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS
- **Screenshot**: html2canvas for generating images
- **State Management**: React useState with sessionStorage persistence

## Development Commands

Prerequisite: Node.js 22 LTS (or newer within the 22.x line).

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
# Starts development server at http://localhost:3000
```

### Build & Production
```bash
npm run build    # Build for production
npm start        # Start production server
```

### Code Quality
```bash
npm run lint     # Run ESLint
```

## Project Structure

```
nextjs-ppcavs-ifu/
├── assets/                 # SVG mathematical symbols and wrapper
│   ├── images/             # Formula renderings exported as SVG
│   └── svg.tsx             # Import map for formula assets
├── components/
│   ├── StepperInput.tsx    # Custom numeric input with +/- controls
│   ├── util.tsx            # DOM helpers
│   ├── utilConst.tsx       # Konstantfahrt calculation helpers
│   └── utilStop.tsx        # Braking distance calculations
├── hooks/
│   └── useScreenshot.ts    # html2canvas export + clipboard fallback
├── pages/
│   ├── _app.tsx            # Global layout wrapper
│   ├── Const/              # Konstantfahrt sub-pages
│   │   ├── ConstAccel.tsx
│   │   ├── ConstDecel.tsx
│   │   └── ConstDrive.tsx
│   ├── Const.tsx
│   ├── Footer.tsx
│   ├── index.tsx
│   ├── Layout.tsx
│   ├── Minderwert.tsx
│   ├── Navbar.tsx
│   ├── Sonst.tsx
│   ├── Stop.tsx
│   └── VMT.tsx
├── public/
│   ├── favicon.ico
│   ├── vA.svg
│   └── vercel.svg
├── styles/
│   ├── globals.css         # Tailwind layer + global styles
│   └── old.css             # Legacy styling (reference)
├── docker-compose.yml
├── Dockerfile
├── eslint.config.mjs       # Flat ESLint configuration
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## Calculation Functions

### Braking Analysis (utilStop.tsx)
- `getReaction()` - Reaction distance calculation
- `getBreakDelay()` - Brake delay distance
- `getFullSend()` - Velocity at full braking start
- `getBreakDistance()` - Actual braking distance
- `getBreakDuration()` - Braking time duration
- `getFullDistance()` - Total stopping distance
- `getFullTime()` - Total stopping time

### Constant Speed Analysis (utilConst.tsx)
- Deceleration functions (`getdVA1-4`, `getdVE1-4`, `getDecel1-4`)
- Braking functions (`getBD1-4`, `getBT1-4`)
- Acceleration functions (`getaVA1-4`, `getaVE1-4`, `getAccel1-4`)
- Distance/time calculations (`getAD1-4`, `getAT1-4`)

### Screenshot Hook (useScreenshot.ts)
- `handleScreenshot()` - Download element as PNG
- `handleClipboard()` - Copy element to clipboard with fallback
- `hideElements()` - Clean UI for screenshots
- `restoreElements()` - Restore UI after screenshot

## Usage

1. **Start the development server**: `npm run dev`
2. **Navigate to analysis tool**: Choose from Braking, Constant Speed, VMT, or Value Assessment
3. **Enter parameters**: Input vehicle data (speeds, times, distances, acceleration values)
4. **View results**: Calculations update in real-time
5. **Export results**: Use screenshot or clipboard buttons to save results

## Key Dependencies

### Core Dependencies
- `next`: 15.5.4 - React framework
- `react`: 19.2.0 - UI library
- `react-dom`: 19.2.0 - React DOM rendering
- `html2canvas`: 1.4.1 - Screenshot generation

### Development Dependencies
- `typescript`: 5.9.3 - Type safety
- `tailwindcss`: 4.1.14 - Styling framework
- `eslint`: 9.37.0 - Code linting
- `@tailwindcss/postcss`: 4.1.14 - Tailwind-integrated PostCSS preset

## Notes

- All calculations use metric units (m/s², km/h, meters, seconds)
- Input values are automatically saved to browser session storage
- Mathematical formulas are implemented according to forensic automotive standards
- The application includes German terminology for forensic automotive analysis
- Runtime standardized on Node.js 22 LTS; match local tooling before running builds.
- Tailwind CSS upgraded to v4.1.14 with configuration managed in `tailwind.config.ts`.
- Tailwind's default OKLCH color tokens break `html2canvas` screenshots; define new palette entries with hex values in both `tailwind.config.ts` and `styles/globals.css` to keep exports working.
- Some calculator tables (e.g. Anhaltevorgang) still overflow on phones; wrap new tables in `<div class="overflow-x-auto">` like the BVSK system block to restore horizontal scrolling.

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

### Vercel Deployment
For Vercel deployment, connect your GitHub repository to Vercel for automatic deployments.

## License

Distributed under the terms of the GNU General Public License v3.0 or any later version. See `LICENSE` for the full text and obligations when redistributing or modifying the software.
