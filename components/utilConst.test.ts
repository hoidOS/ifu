import { describe, expect, it } from 'vitest'

import { getAT4, getaVA1, getdVA1 } from './utilConst'

describe('constant acceleration helpers', () => {
  it('calculates initial braking speed from end speed, deceleration, and distance', () => {
    expect(getdVA1(10, 5, 100)).toBe('114,28 km/h')
  })

  it('returns ERROR when solving acceleration initial speed would require a negative root', () => {
    expect(getaVA1(10, 5, 100)).toBe('ERROR')
  })

  it('returns ERROR when solving acceleration time would require a negative root', () => {
    expect(getAT4(10, 5, 100)).toBe('ERROR')
  })
})
