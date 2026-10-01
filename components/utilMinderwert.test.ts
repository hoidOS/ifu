import { describe, expect, it } from 'vitest'

import { roundMinderwert } from './utilMinderwert'

describe('roundMinderwert', () => {
  it('rounds to the nearest full 50 €', () => {
    expect(roundMinderwert(1160)).toBe(1150)
    expect(roundMinderwert(1180)).toBe(1200)
    expect(roundMinderwert(187.04)).toBe(200)
  })

  it('rounds a value exactly halfway between two steps up', () => {
    expect(roundMinderwert(1175)).toBe(1200)
  })

  it('keeps values that are already a multiple of 50 €', () => {
    expect(roundMinderwert(1150)).toBe(1150)
    expect(roundMinderwert(0)).toBe(0)
  })

  it('ignores floating-point noise below one cent', () => {
    expect(roundMinderwert(1174.9999999)).toBe(1200)
  })
})
