# Schwellstrecke (Brake Build-Up Distance) Refactor Notes

## Why This Document Exists
The `Anhaltevorgang` calculator (`pages/stop.tsx`) reports the brake build-up distance (`Schwellstrecke`) using the helper `getBreakDelay` in `components/utilStop.tsx`. A review of the physics behind the calculation shows the implemented equation underestimates the distance that is travelled while the brake force ramps up. This document records the finding and the mathematically correct formula so the fix can be applied confidently.

## Current Behaviour
- Source: `components/utilStop.tsx`, `getBreakDelay`.
- Implemented formula:

  \[
  s_\text{S, current} = v_0 \cdot t_S - \frac{1}{2}\left(\frac{a_m}{2}\right) t_S^2 = v_0 \cdot t_S - \frac{a_m \cdot t_S^2}{4}
  \]

  where `v0 = vA / 3.6` converts the initial speed from km/h to m/s.
- Consequence: the term that subtracts the speed lost during brake build-up uses a coefficient of 1/4. That corresponds to assuming the deceleration ramps up instantaneously to `a_m / 2`, rather than linearly from 0 to `a_m`.

## Physically Correct Model
Accident reconstruction literature models the brake build-up as a **constant jerk** (linear rise in deceleration) phase:

1. Deceleration grows linearly: \( a(t) = \frac{a_m}{t_S} t \).
2. Integrate once for speed: \( v(t) = v_0 - \frac{a_m}{2 t_S} t^2 \).
3. Integrate again for distance:

   \[
   s_\text{S, correct} = \int_0^{t_S} v(t)\, dt = v_0 \cdot t_S - \frac{a_m}{6} t_S^2
   \]

   or, expressed like the current code,

   \[
   s_\text{S, correct} = v_0 \cdot t_S - \frac{1}{3}\left(\frac{a_m}{2}\right) t_S^2
   \]

This is the form cited in Brach & Brach, *Vehicle Accident Analysis and Reconstruction Methods*, §5.4, and other reconstruction manuals.

## Impact Example
Using the route defaults (`vA = 50 km/h`, `tS = 0.2 s`, `a_m = 7.5 m/s²`):

| Formula | Result (m) | Rounded |
|---------|------------|---------|
| Current implementation | 2.702778 | 2.70 |
| Physically correct | 2.727778 | 2.73 |
| Absolute difference | 0.025000 | 0.03 |

The shortfall scales with the square of `tS`; the error is the same 0.025 m if the initial speed doubles to 100 km/h.

## Recommended Code Change
- File: `components/utilStop.tsx`.
- Update the build-up term in `getBreakDelay` (and the identical inline term inside `getFullDistance`) from:

  ```ts
  0.5 * (am / 2) * Math.pow(tS, 2)  // ⇒ (am * tS^2) / 4
  ```

  to:

  ```ts
  (am / 2) * Math.pow(tS, 2) / 3  // ⇒ (am * tS^2) / 6
  ```

- After adjusting `getBreakDelay`, reuse that helper in `getFullDistance` to avoid duplicating the expression (optional but reduces drift risk).

## Validation Plan
1. Update the formulas in `components/utilStop.tsx`.
2. Re-run `npm run lint`.
3. Manually verify UI outputs with known values:
   - Compare against the analytical formula above.
   - Check regression cases where `tS = 0` (should reduce to purely reaction + braking distance).
4. Consider adding unit tests for `getBreakDelay` and `getFullDistance` to lock in the physics.

Capturing these notes in the repository ensures the reasoning is visible during the refactor and future reviews.
