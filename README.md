# STEINACKER - Forensic Automotive Analysis Suite

A comprehensive Next.js web application for automotive forensic analysis and accident reconstruction calculations. This tool provides specialized calculators for vehicle dynamics, braking analysis, constant speed calculations, and video measurement tools.

## 🚗 Features

### Core Analysis Tools
- **Braking Analysis (Anhaltevorgang)** - Complete stopping distance calculations including reaction time, brake delay, and braking distance
- **Constant Speed Analysis (Konstantfahrt)** - Acceleration, deceleration, and constant velocity calculations
- **Video Measurement Tools (VMT)** - ESO and Riegl laser measurement beam divergence calculations
- **Value Assessment (Minderwert)** - Vehicle damage value assessment tools

### Additional Features
- **Screenshot & Export** - Generate high-quality PNG exports and copy results to clipboard
- **Session Storage** - Automatically saves input values across browser sessions
- **Responsive Design** - Works on desktop and mobile devices
- **Resource Links** - Quick access to maps, automotive databases, and crash test resources

## 🛠️ Technology Stack

- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: React Icons (Font Awesome)
- **Screenshot**: html2canvas for generating images
- **State Management**: React useState with sessionStorage persistence

## 📋 Development Commands

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
│   └── utilStop.tsx     # Braking analysis calculations
├── hooks/
│   └── useScreenshot.ts # Screenshot and clipboard functionality
├── pages/               # Next.js pages
│   ├── index.tsx        # Homepage with resource links
│   ├── Stop.tsx         # Braking analysis page
│   ├── Const.tsx        # Constant speed analysis page
│   ├── VMT.tsx          # Video measurement tools
│   ├── Minderwert.tsx   # Value assessment page
│   ├── Navbar.tsx       # Navigation component
│   └── Layout.tsx       # Page layout wrapper
├── assets/              # SVG mathematical symbols and images
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

- `next`: ^15.4.6 - React framework
- `react`: ^19.1.1 - UI library
- `typescript`: ^5.9.2 - Type safety
- `tailwindcss`: ^3.0.24 - Styling
- `html2canvas`: ^1.4.1 - Screenshot generation
- `react-icons`: ^5.5.0 - Icon library

## 📝 Notes

- All calculations use metric units (m/s², km/h, meters, seconds)
- Input values are automatically saved to browser session storage
- Mathematical formulas are implemented according to forensic automotive standards
- The application includes German terminology for forensic automotive analysis

## 🚀 Deployment

The application can be deployed on any platform that supports Next.js:

```bash
npm run build
npm start
```

For Vercel deployment, connect your GitHub repository to Vercel for automatic deployments.
