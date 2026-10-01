// The Minderwert is the mean of the BVSK and MFM results, rounded to the nearest full 50 €.
export const MINDERWERT_ROUNDING_STEP = 50

export const roundMinderwert = (value: number): number => {
  // Round to cents first so floating-point noise such as 1174.9999999 does not drop a value a step.
  const cents = Math.round(value * 100) / 100
  return Math.round(cents / MINDERWERT_ROUNDING_STEP) * MINDERWERT_ROUNDING_STEP
}
