# STEINACKER - Forensic Automotive Analysis Suite

A comprehensive Next.js web application for automotive forensic analysis and accident reconstruction calculations. This tool provides specialized calculators for vehicle dynamics, braking analysis, constant speed calculations, and video measurement tools.

## 🚗 Features

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
- **Resource Links** - Quick access to maps, automotive databases, and crash test resources
- **Stepper Inputs** - Enhanced number inputs with increment/decrement buttons for precise value adjustment
- **Docker Support** - Containerized deployment with Docker and docker-compose

## 🛠️ Technology Stack

- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: React Icons (Font Awesome)
- **Screenshot**: html2canvas for generating images
- **State Management**: React useState with sessionStorage persistence

## 📋 Development Commands

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

## 📁 Project Structure

```
nextjs-ifu/
├── components/           # Utility functions and components
│   ├── util.tsx         # Generic utilities
│   ├── utilConst.tsx    # Constant speed calculations
│   ├── utilStop.tsx     # Braking analysis calculations
│   └── StepperInput.tsx # Stepper input component with +/- buttons
├── hooks/
│   └── useScreenshot.ts # Screenshot and clipboard functionality
├── pages/               # Next.js pages
│   ├── index.tsx        # Homepage with resource links
│   ├── Stop.tsx         # Braking analysis page
│   ├── Const.tsx        # Constant speed analysis page
│   │   ├── ConstAccel.tsx   # Acceleration calculations
│   │   ├── ConstDecel.tsx   # Deceleration calculations
│   │   └── ConstDrive.tsx   # Constant drive calculations
│   ├── VMT.tsx          # Video measurement tools
│   ├── Minderwert.tsx   # Value assessment page
│   ├── Sonst.tsx        # Additional calculations (curves, percentages)
│   ├── Navbar.tsx       # Navigation component
│   ├── Footer.tsx       # Footer component
│   └── Layout.tsx       # Page layout wrapper
├── assets/              # SVG mathematical symbols and images
│   ├── images/          # Mathematical formula SVG files
│   └── svg.tsx          # SVG component wrapper
├── public/              # Static assets
└── styles/             # Global styles
```

## 🧮 Calculation Functions

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

## 🎯 Usage

1. **Start the development server**: `npm run dev`
2. **Navigate to analysis tool**: Choose from Braking, Constant Speed, VMT, or Value Assessment
3. **Enter parameters**: Input vehicle data (speeds, times, distances, acceleration values)
4. **View results**: Calculations update in real-time
5. **Export results**: Use screenshot or clipboard buttons to save results

## 🔧 Key Dependencies

### Core Dependencies
- `next`: ^15.4.6 - React framework
- `react`: ^19.1.1 - UI library
- `react-dom`: ^19.1.1 - React DOM rendering
- `html2canvas`: ^1.4.1 - Screenshot generation

### Development Dependencies
- `typescript`: ^5.9.2 - Type safety
- `tailwindcss`: ^4.1.13 - Styling framework
- `react-icons`: ^5.5.0 - Icon library
- `eslint`: ^9.33.0 - Code linting
- `@tailwindcss/postcss`: ^4.1.13 - Tailwind-integrated PostCSS preset

## 📝 Notes

- All calculations use metric units (m/s², km/h, meters, seconds)
- Input values are automatically saved to browser session storage
- Mathematical formulas are implemented according to forensic automotive standards
- The application includes German terminology for forensic automotive analysis
- Runtime standardized on Node.js 22 LTS; match local tooling before running builds.
- Tailwind CSS upgraded to v4.1.13; see `REFACTOR.md` for the migration playbook.

## 🚀 Deployment

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
