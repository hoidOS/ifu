# Refactor Notes

## Stop Page – Schwellstrecke

- The Schwellstrecke helper (`components/utilStop.tsx:5`) still applies the following ramp distance (converted from km/h to m/s), which corresponds to a different braking profile than the documented linear ramp:

  $$
  s_s = v_0 \, t_s - \frac{1}{4} a \, t_s^{2}
  $$

- For a **linear increase** in deceleration from 0 to a across the Schwellzeit t_s, the accepted handbook reference (AnalyzerPro) states:

  $$
  s_s = v_0\, t_s - \frac{1}{6} a\, t_s^{2}
  $$

- Under the same ramp assumption, the velocity drop during the Schwellphase is:

  $$
  \Delta v = \frac{1}{2} a\, t_s
  $$

  and the end-of-phase speed becomes:

  $$
  v_1 = v_0 - \frac{1}{2} a\, t_s
  $$

- Compared with an idealised instant full brake, use the reference path:

  $$
  v_0 \, t - \frac{1}{2} a \, t^2
  $$

  The additional distance accumulated by the ramp is:

  $$
  \Delta s = s_s - \left(v_0 t_s - \frac{1}{2} a\, t_s^2\right) = \frac{1}{3} a\, t_s^{2}
  $$

  (cf. Leifi).

- Example with a = 7.5 m/s^2 and t_s = 0.2 s:

  $$
  \Delta s = \frac{1}{3} \cdot 7.5 \cdot 0.2^2 = 0.10\, \mathrm{m}
  $$

  $$
  s_s = 0.2\, v_0 - 0.05\, \mathrm{m}
  $$

  For example, v_0 = 50 km/h -> s_s ~ 2.73 m; v_0 = 100 km/h -> s_s ~ 5.51 m.

- Action items: update `getBreakDelay`/`getFullDistance` in `components/utilStop.tsx` to use the linear ramp term (`-a*t_s^2/6` instead of `-a*t_s^2/4`), refresh the rendered formulas in `assets/`, and re-check the stop-page outputs against the handbook examples.

## Konstantfahrt Solvers - Discriminant Handling

- `components/utilConst.tsx` uses `Math.abs` inside square roots for the acceleration-side helpers (`getaVA1`, `getaVE1`). This masks physically impossible input sets (for example `v_E^2 < 2*a*s` for `getaVA1`) and returns a real speed instead of flagging an error.
- Refactor to drop `Math.abs` and propagate invalid discriminants as `NaN`/false so the UI shows an error indicator rather than a fabricated velocity.
- After the change, verify the acceleration pages render `ERROR`/`-` for impossible combinations and still return the same values as before for valid input by spot-checking a few sample tuples.

- When refactoring, update the TypeScript helper, refresh the `assets/` SVG formula renderings, and re-run the manual calculator verification steps.
