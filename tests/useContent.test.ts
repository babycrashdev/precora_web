import { describe, it, expect } from 'vitest'
import { isRadonSeason } from '../composables/useContent'
import contentData from '../server/data/content.json'

describe('isRadonSeason helper', () => {
  it('should return true for months in radon season (September through April)', () => {
    // September (Month index 8)
    expect(isRadonSeason(new Date(2026, 8, 15))).toBe(true)
    // October (Month index 9)
    expect(isRadonSeason(new Date(2026, 9, 10))).toBe(true)
    // December (Month index 11)
    expect(isRadonSeason(new Date(2026, 11, 25))).toBe(true)
    // January (Month index 0)
    expect(isRadonSeason(new Date(2026, 0, 5))).toBe(true)
    // April (Month index 3)
    expect(isRadonSeason(new Date(2026, 3, 30))).toBe(true)
  })

  it('should return false for months outside radon season (May through August)', () => {
    // May (Month index 4)
    expect(isRadonSeason(new Date(2026, 4, 1))).toBe(false)
    // June (Month index 5)
    expect(isRadonSeason(new Date(2026, 5, 15))).toBe(false)
    // July (Month index 6)
    expect(isRadonSeason(new Date(2026, 6, 20))).toBe(false)
    // August (Month index 7)
    expect(isRadonSeason(new Date(2026, 7, 31))).toBe(false)
  })
})

describe('Content Data Centralized Store (content.json)', () => {
  it('should contain expert information for Olivier Lacaton', () => {
    expect(contentData.company.expert).toBe('Olivier Lacaton')
    expect(contentData.company.phone).toBe('06 18 65 21 16')
    expect(contentData.company.email).toBe('contact@precora.fr')
  })

  it('should contain Qualianor and AXA accreditations', () => {
    const badges = contentData.company.accreditations.map(a => a.badge)
    expect(badges.some(b => b.includes('Qualianor'))).toBe(true)
    expect(badges.some(b => b.includes('AXA'))).toBe(true)
  })

  it('should contain valid agreement expiry dates (19/10/2027 and 31/03/2030)', () => {
    const expiries = contentData.agreements.map(a => a.expiryFormatted)
    expect(expiries).toContain('19/10/2027')
    expect(expiries).toContain('31/03/2030')
  })

  it('should contain primary zones Lot 46 and Corrèze 19, plus 6 limitrophe departments', () => {
    const primaryCodes = contentData.zones.primary.map(z => z.code)
    expect(primaryCodes).toContain('46')
    expect(primaryCodes).toContain('19')

    expect(contentData.zones.secondary).toHaveLength(6)
  })

  it('should contain active regulatory alert configuration', () => {
    expect(contentData.alert).toBeDefined()
    expect(contentData.alert.enabled).toBe(true)
    expect(contentData.alert.title).toContain('Alerte Réglementaire')
  })
})
