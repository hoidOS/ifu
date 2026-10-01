import { describe, expect, it } from 'vitest'

import {
  DISTANCE_GRID_STEPS,
  type MovementResult,
  TIME_GRID_STEPS,
  type ValidMovementResult,
  calculateDecel,
  calculateDrive,
  calculateStop,
  layoutAxis,
  toMs,
} from './utilWegzeit'

const expectValid = (result: MovementResult): ValidMovementResult => {
  if (result.status !== 'valid') {
    throw new Error(`expected a valid movement, got ${result.status}: ${result.message}`)
  }

  return result
}

describe('Anhalt movement', () => {
  const input = { vA: 50, vE: 10, tR: 0.8, tS: 0.2, am: 7.5, t: NaN }

  it('combines reaction, Schwellphase, and full braking up to the collision speed', () => {
    const result = expectValid(calculateStop(input))

    expect(result.duration).toBeCloseTo(2.3815, 3)
    expect(result.distance).toBeCloseTo(24.833, 2)
    expect(result.endDuration).toBeCloseTo(0.8 + 0.2 + (toMs(50) - 0.75) / 7.5, 6)
  })

  it('keeps the distance curve continuous across phase boundaries', () => {
    const result = expectValid(calculateStop(input))
    const vAms = toMs(50)

    expect(result.distanceAtTime(0.8)).toBeCloseTo(vAms * 0.8, 6)
    expect(result.distanceAtTime(1)).toBeCloseTo(vAms * 0.8 + vAms * 0.2 - (7.5 * 0.2 ** 2) / 6, 6)
    expect(result.distanceAtTime(result.duration)).toBeCloseTo(result.distance, 6)
  })

  it('places the collision inside the Schwellphase when vE is above the full-braking start speed', () => {
    const result = expectValid(calculateStop({ ...input, vE: 48 }))
    const rampTime = Math.sqrt((2 * 0.2 * (toMs(50) - toMs(48))) / 7.5)

    expect(result.duration).toBeCloseTo(0.8 + rampTime, 6)
    expect(result.distance).toBeCloseTo(toMs(50) * (0.8 + rampTime) - (7.5 * rampTime ** 3) / (6 * 0.2), 6)
    expect(result.detailRows).toContainEqual({ label: 'Kollision in', value: 'Schwellphase' })
  })

  it('asks for tges when vE equals vA because the collision lies before braking starts', () => {
    const result = calculateStop({ ...input, vE: 50 })

    expect(result.status).toBe('empty')
    expect(result.status !== 'valid' && result.message).toContain('tges')
  })

  it('places the collision inside the reaction time from tges', () => {
    const result = expectValid(calculateStop({ ...input, vE: 50, t: 0.5 }))

    expect(result.duration).toBe(0.5)
    expect(result.distance).toBeCloseTo(toMs(50) * 0.5, 6)
    expect(result.finalSpeedKmh).toBeCloseTo(50, 6)
    expect(result.markers.map(marker => marker.label)).toEqual(['tR'])
    expect(result.detailRows).toContainEqual({ label: 'Kollision in', value: 'Reaktionszeit' })
  })

  it('derives vE from tges alone', () => {
    const result = expectValid(calculateStop({ ...input, vE: NaN, t: 2.3815 }))

    expect(result.finalSpeedKmh).toBeCloseTo(10, 1)
  })

  it('rejects vE and tges that do not describe the same moment', () => {
    expect(calculateStop({ ...input, vE: 10, t: 1.5 }).status).toBe('invalid')
  })

  it('rejects tges beyond standstill', () => {
    expect(calculateStop({ ...input, vE: NaN, t: 5 }).status).toBe('invalid')
  })

  it('lets slow vehicles stop inside the Schwellphase', () => {
    const result = expectValid(calculateStop({ ...input, vA: 2, vE: 0, tS: 0.5 }))
    const rampStopTime = Math.sqrt((2 * 0.5 * toMs(2)) / 7.5)

    expect(result.duration).toBeCloseTo(0.8 + rampStopTime, 6)
    expect(result.endDuration).toBeCloseTo(result.duration, 6)
    expect(result.distance).toBeCloseTo(toMs(2) * 0.8 + (2 / 3) * toMs(2) * rampStopTime, 6)
  })

  it('omits the tR marker when there is no reaction time', () => {
    const result = expectValid(calculateStop({ ...input, tR: 0 }))

    expect(result.markers.map(marker => marker.label)).toEqual(['tS'])
  })
})

describe('konstante Verzögerung movement', () => {
  it('resolves distance and duration from vA, vE, and a', () => {
    const result = expectValid(calculateDecel({ vA: 50, vE: 10, a: 7.5, s: NaN, t: NaN }))

    expect(result.duration).toBeCloseTo(1.4815, 3)
    expect(result.distance).toBeCloseTo(12.346, 3)
  })

  it('resolves vA and vE from a, s, and t', () => {
    const result = expectValid(calculateDecel({ vA: NaN, vE: NaN, a: 5, s: 15.43, t: 2.22 }))

    expect(result.initialSpeedKmh).toBeCloseTo(45, 0)
    expect(result.finalSpeedKmh).toBeCloseTo(5, 0)
  })

  it('rejects inconsistent value sets and asks to clear extra fields', () => {
    const result = calculateDecel({ vA: 60, vE: 10, a: 7.5, s: 12.35, t: 1.48 })

    expect(result.status).toBe('invalid')
    expect(result.status !== 'valid' && result.message).toContain('überzählige Felder leeren')
  })

  it('places one speed tick per km/h above standstill', () => {
    const result = expectValid(calculateDecel({ vA: 50, vE: 10, a: 7.5, s: NaN, t: NaN }))

    expect(result.speedTicks).toHaveLength(50)
    expect(result.speedTicks.filter(tick => tick.label).map(tick => tick.label)).toEqual(['50', '40', '30', '20', '10'])
  })
})

describe('Konstantfahrt movement', () => {
  it('resolves the duration from speed and distance', () => {
    const result = expectValid(calculateDrive({ v: 45, s: 25, t: NaN }))

    expect(result.duration).toBeCloseTo(2, 6)
    expect(result.endDuration).toBe(result.duration)
  })

  it('rejects inconsistent value sets and asks to clear the extra field', () => {
    const result = calculateDrive({ v: 60, s: 25, t: 1.8 })

    expect(result.status).toBe('invalid')
    expect(result.status !== 'valid' && result.message).toContain('überzähliges Feld leeren')
  })
})

describe('diagram axis layout', () => {
  it('gives each side its own bound and keeps 1 m ruler ticks for short scenes', () => {
    const axis = layoutAxis({ below: 28.6, above: 30.7, length: 770, gridSteps: DISTANCE_GRID_STEPS, minLabelSpacing: 80 })

    expect(axis).toEqual({ min: -30, max: 40, gridStep: 10, rulerStep: 1, rulerMajorEvery: 5 })
  })

  it('widens the grid step so long approaches keep readable labels', () => {
    const axis = layoutAxis({ below: 287.5, above: 17.3, length: 770, gridSteps: DISTANCE_GRID_STEPS, minLabelSpacing: 80 })

    expect(axis.min).toBe(-300)
    expect(axis.max).toBe(50)
    expect(axis.gridStep).toBe(50)
    expect((770 * axis.gridStep) / (axis.max - axis.min)).toBeGreaterThanOrEqual(80)
    expect(axis.rulerStep).toBe(5)
  })

  it('keeps one grid step on an empty side', () => {
    const axis = layoutAxis({ below: 3.5, above: 0, length: 410, gridSteps: TIME_GRID_STEPS, minLabelSpacing: 24 })

    expect(axis).toEqual({ min: -4, max: 1, gridStep: 1, rulerStep: 0.1, rulerMajorEvery: 5 })
  })

  it('switches to coarser time steps for long movements', () => {
    const axis = layoutAxis({ below: 32.3, above: 3.1, length: 410, gridSteps: TIME_GRID_STEPS, minLabelSpacing: 24 })

    expect(axis.gridStep).toBe(5)
    expect(axis.min).toBe(-35)
    expect(axis.max).toBe(5)
  })
})
