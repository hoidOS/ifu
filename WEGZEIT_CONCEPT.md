# Weg-Zeit Diagram Concept

Status: concept page, unlinked route `/wegzeit/`.

This note captures the current intent and implementation context for the experimental collision-centered Weg-Zeit diagram in `pages/wegzeit.tsx`.

## Goal

Create a two-party Weg-Zeit diagram for accident-reconstruction comparison. Each side can choose its own movement model, and both movements are normalized into one collision-centered diagram.

The collision point is always:

- distance `s = 0 m`
- collision time `t = 0 s`

Left-side approaches use negative distance, right-side approaches use positive distance. A side toggle controls whether KL comes from left or right; BK automatically uses the opposite side.

## Current Movement Modes

Each card is a generic `KL` / `BK` input card with a segmented mode selector:

- `Anhalt`
- `konst. Verz.`
- `Konstantfahrt`

The concept currently loads with demo defaults for every mode so the diagram renders immediately after a page reload and after switching modes:

- Anhalt KL: `vA = 50 km/h`, `vE = 10 km/h`, `tR = 0,8 s`, `tS = 0,2 s`, `am = 7,5 m/s²`
- Anhalt BK: `vA = 45 km/h`, `vE = 5 km/h`, `tR = 0,8 s`, `tS = 0,2 s`, `am = 5,0 m/s²`
- konst. Verz. KL: `vA = 50 km/h`, `vE = 10 km/h`, `a = 7,5 m/s²`, `s = 12,35 m`, `t = 1,48 s`
- konst. Verz. BK: `vA = 45 km/h`, `vE = 5 km/h`, `a = 5,0 m/s²`, `s = 15,43 m`, `t = 2,22 s`
- Konstantfahrt KL: `v = 50 km/h`, `s = 25 m`, `t = 1,8 s`
- Konstantfahrt BK: `v = 45 km/h`, `s = 25 m`, `t = 2,0 s`

### Anhalt

Inputs:

- `vA`
- `vE`
- `tR`
- `tS`
- `am`

The plotted motion is piecewise:

- reaction phase: constant speed
- Schwellphase: linear buildup of deceleration
- full braking phase: constant deceleration

The Schwellphase uses the corrected linear-ramp distance term from `REFACTOR.md`:

```ts
rampDistance = vAms * tS - (am * tS ** 2) / 6
fullBrakeStartSpeed = vAms - 0.5 * am * tS
```

The curve reaches collision at the entered `vE`. If `vE > 0`, the visible curve continues after collision until theoretical standstill (`0 km/h`).

Current Anhalt annotations:

- `tR` point label at the start of the reaction segment
- `tS` point label at the start of Schwellzeit
- km/h tick marks through Schwellphase and full braking, extending back to the `tS` point, with numeric labels every `10 km/h`
- numeric values such as start speed and `am` are shown in the corresponding Bewegung card, not inside the SVG curve

### Konstante Verzögerung

Inputs:

- `vA`
- `vE`
- `a`
- `s`
- `t`

The solver accepts any consistent set of three or more values and resolves the complete tuple. Invalid or inconsistent combinations return a validation message instead of plotting.

The curve reaches collision at the resolved `vE`. If `vE > 0`, the visible curve continues after collision until theoretical standstill (`0 km/h`).

Current annotations:

- km/h tick marks along the full deceleration curve from `vA` down to `0 km/h`, with numeric labels every `10 km/h`
- numeric values such as `vA`, `vE`, `a`, `s`, and `t` are shown in the corresponding Bewegung card, not inside the SVG curve

### Konstantfahrt

Inputs:

- `v`
- `s`
- `t`

The solver accepts any two consistent values. The curve is linear and ends at collision. It is not extended after collision because no braking model exists in this mode.

Current annotation:

- one start tick with the initial speed label at the beginning dot

## Normalized Result Model

Each movement mode returns a normalized `MovementResult`.

Important fields:

- `duration`: elapsed movement time until collision
- `endDuration`: visible curve end time; for braking modes this can be after collision, when the vehicle reaches `0 km/h`
- `distance`: distance from movement start to collision
- `initialSpeedKmh`
- `finalSpeedKmh`
- `detailRows`: formatted card-only values that keep numeric annotations out of the SVG graph
- `points`: sampled visible curve points
- `distanceAtTime(elapsedTime)`: exact distance function used for markers/ticks
- `markers`: point labels such as `tR` and `tS`
- `speedTicks`: km/h ticks along deceleration phases

## Diagram Conventions

The diagram is CAD-inspired:

- white plot area
- light technical grid and thin plot border
- rounded meter and second bounds
- distance labels on top and bottom axes
- time labels mirrored on left and right
- central `0 s` axis has 1 m ruler ticks, longer every 5 m
- central `0 m` axis has 0.1 s ruler ticks, longer every 0.5 s

Internal time is relative to collision:

- before collision is negative internally
- after collision is positive internally

Display labels are flipped to match the CAD convention:

- above the `0 s` axis shows positive seconds before collision
- below the `0 s` axis shows negative seconds after collision

Velocity ticks:

- generated for deceleration phases only
- `Anhalt` ticks extend from the `tS` point through Schwellphase and full braking down to `0 km/h`
- `konst. Verz.` ticks extend from the start speed down to `0 km/h`
- `Konstantfahrt` renders only one start tick with the constant speed label
- one tick per `1 km/h`
- longer tick every `5 km/h`
- label every `10 km/h`
- labels use smaller/lighter type and are suppressed near the origin axes when cramped

Interaction affordance:

- each curve has a wide invisible click/hover target
- hovering a curve shows a subtle wider translucent stroke below the main line

## Time Comparison Guide

Interactive only. Guides are not shown by default.

When the user clicks a curve, the diagram snaps to the nearest sampled point on that curve and adds a guide. Multiple guides can be active at the same time. Each guide draws:

- a highlighted point on the clicked curve
- a vertical dotted line from the clicked point to the `0 s` axis
- if the same relative time exists on the other valid curve, a matching highlighted point there
- a horizontal dotted line between both curve points
- a vertical dotted line from the matching point to the `0 s` axis
- a compact readout chip in the blue diagram header with displayed time, signed KL/BK positions, and an `x` button to remove that guide

Clicking empty SVG space clears all guides.

## Current Scope Boundaries

- The page is intentionally unlinked from navigation.
- No screenshot/export controls yet.
- No sessionStorage persistence yet.
- No dedicated unit tests for this concept page yet.
- The concept page uses local formulas instead of changing existing calculator helpers.
- Existing production pages are not modified by this concept.

## Verification Commands

Run after edits:

```bash
npm run lint
npm test
./node_modules/.bin/tsc --noEmit --incremental false
```

The dev route is:

```text
http://localhost:3000/wegzeit/
```

## Open Follow-Ups

- Decide whether this concept should become a production route and receive a navbar link.
- Add focused tests for movement normalization and solver edge cases.
- Decide whether Anhalt should reuse or eventually replace the existing Bremsweg helper formulas after the Schwellstrecke refactor is settled.
- Add export controls once the diagram layout stabilizes.
- Consider presets/demo values so future visual checks can render curves without manual input.
