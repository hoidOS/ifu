# Weg-Zeit Diagram Concept

Status: concept page, unlinked route `/wegzeit/`.

This note captures the current intent and implementation context for the experimental collision-centered Weg-Zeit diagram in `pages/wegzeit.tsx`.

## Goal

Create a two-party Weg-Zeit diagram for accident-reconstruction comparison. Each side can choose its own movement model, and both movements are normalized into one collision-centered diagram.

The collision point is always:

- distance `s = 0 m`
- collision time `t = 0 s`

Left-side approaches use negative distance, right-side approaches use positive distance. A side toggle controls whether Bewegung 1 comes from left or right; Bewegung 2 automatically uses the opposite side.

## Current Movement Modes

Each card is a generic `Bewegung 1` / `Bewegung 2` input card with a segmented mode selector:

- `Anhalt`
- `konst. Verz.`
- `Konstantfahrt`

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
- start speed label, e.g. `50 km/h`, opposite the `tR` label across the line
- `tS` point label at the start of Schwellzeit
- numeric deceleration label at the start of full braking, e.g. `-5,0 m/s²`
- km/h tick marks on the full braking phase

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

- start speed label at the beginning of the line
- curve-following label `a = -… m/s²`
- km/h tick marks along the deceleration curve

### Konstantfahrt

Inputs:

- `v`
- `s`
- `t`

The solver accepts any two consistent values. The curve is linear and ends at collision. It is not extended after collision because no braking model exists in this mode.

## Normalized Result Model

Each movement mode returns a normalized `MovementResult`.

Important fields:

- `duration`: elapsed movement time until collision
- `endDuration`: visible curve end time; for braking modes this can be after collision, when the vehicle reaches `0 km/h`
- `distance`: distance from movement start to collision
- `initialSpeedKmh`
- `finalSpeedKmh`
- `points`: sampled visible curve points
- `distanceAtTime(elapsedTime)`: exact distance function used for markers/ticks
- `markers`: point labels such as `tR`, `tS`, and `-5,0 m/s²`
- `labels`: curve-following text labels using SVG `textPath`
- `speedTicks`: km/h ticks along deceleration phases

## Diagram Conventions

The diagram is CAD-inspired:

- white plot area
- thin technical grid and plot border
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
- cover `20` down to `0 km/h`
- one tick per `1 km/h`
- longer tick every `5 km/h`
- label every `10 km/h`

## Time Comparison Guide

When both movements are valid and have different collision durations, the later-starting movement is used as reference. The diagram draws dotted guide lines showing where the earlier-starting movement was at the same relative time.

The summary text says:

```text
Zeitvergleich: Bei Start Bewegung X war Bewegung Y bei … m.
```

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
