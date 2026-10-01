import { describe, expect, it } from 'vitest'

import {
  type MovementResult,
  type ValidMovementResult,
  calculateDecel,
  calculateDrive,
  calculateStop,
  toMs,
} from './utilWegzeit'

const expectValid = (result: MovementResult): ValidMovementResult => {
  if (result.status !== 'valid') {
    throw new Error(`expected a valid movement, got ${result.status}: ${result.message}`)
  }

  return result
}

describe('Anhalt movement', () => {
  const input = { vA: 50, vE: 10, tR: 0.8, tS: 0.2, am: 7.5 }

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

  it('rejects inconsistent value sets', () => {
    expect(calculateDecel({ vA: 60, vE: 10, a: 7.5, s: 12.35, t: 1.48 }).status).toBe('invalid')
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

  it('rejects inconsistent value sets', () => {
    expect(calculateDrive({ v: 60, s: 25, t: 1.8 }).status).toBe('invalid')
  })
})
