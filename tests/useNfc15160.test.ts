import { describe, it, expect } from 'vitest'
import {
  getInterpolatedCdd,
  calculateFg,
  calculateShielding
} from '../composables/useNfc15160'

describe('useNfc15160 - Moteur de calcul blindage NFC 15-160', () => {
  describe('Interpolation du CDD (Couche de Déci-Transmission)', () => {
    it('retourne la valeur exacte pour 70kV', () => {
      expect(getInterpolatedCdd(70)).toBe(0.52)
    })

    it('retourne la valeur exacte pour 100kV', () => {
      expect(getInterpolatedCdd(100)).toBe(0.88)
    })

    it('interpole correctement à 60kV (entre 50kV:0.17 et 70kV:0.52)', () => {
      // 0.17 + (60 - 50) * (0.52 - 0.17) / (70 - 50) = 0.17 + 10 * 0.0175 = 0.345
      expect(getInterpolatedCdd(60)).toBeCloseTo(0.345, 4)
    })

    it('interpole correctement à 90kV (entre 85kV:0.73 et 100kV:0.88)', () => {
      // 0.73 + (90 - 85) * (0.88 - 0.73) / (100 - 85) = 0.73 + 5 * 0.01 = 0.78
      expect(getInterpolatedCdd(90)).toBeCloseTo(0.78, 4)
    })

    it('interpole correctement à 110kV (entre 100kV:0.88 et 125kV:0.93)', () => {
      // 0.88 + (110 - 100) * (0.93 - 0.88) / (125 - 100) = 0.88 + 10 * 0.002 = 0.90
      expect(getInterpolatedCdd(110)).toBeCloseTo(0.90, 4)
    })

    it('retourne la valeur de la borne inférieure pour tension < 50kV (ex: 40kV)', () => {
      expect(getInterpolatedCdd(40)).toBe(0.17)
    })

    it('retourne la valeur de la borne supérieure pour tension > 300kV (ex: 350kV)', () => {
      expect(getInterpolatedCdd(350)).toBe(4.80)
    })
  })

  describe('Calcul du facteur fg', () => {
    it('lève une exception si hmax est 0', () => {
      expect(() => calculateFg(1, 100, 1, 1, 0, 2, 1)).toThrow(
        'hmax, c et q ne peuvent pas être nuls (division par zéro).'
      )
    })

    it('lève une exception si c est 0', () => {
      expect(() => calculateFg(1, 100, 1, 1, 0.02, 0, 1)).toThrow(
        'hmax, c et q ne peuvent pas être nuls (division par zéro).'
      )
    })

    it('lève une exception si q est 0', () => {
      expect(() => calculateFg(1, 100, 1, 1, 0.02, 2, 0)).toThrow(
        'hmax, c et q ne peuvent pas être nuls (division par zéro).'
      )
    })

    it('calcule correctement fg pour des paramètres valides', () => {
      // (1 * 100 * 1 * 1) / (0.02 * 2^2 * 1) = 100 / 0.08 = 1250
      expect(calculateFg(1, 100, 1, 1, 0.02, 2, 1)).toBe(1250)
    })
  })

  describe('Calcul du blindage (calculateShielding)', () => {
    it('retourne 0.0 mm Pb et plasterApplicable true si fg >= 1', () => {
      // fg = 1250 >= 1
      const result = calculateShielding({
        cg: 1.0,
        w: 100.0,
        f: 1.0,
        t: 1.0,
        hmax: 0.02,
        c: 2.0,
        q: 1.0,
        kv: 70
      })

      expect(result.fg).toBeGreaterThanOrEqual(1)
      expect(result.leadMm).toBe(0.0)
      expect(result.concreteMm).toBe(0.0)
      expect(result.plasterMm).toBe(0.0)
      expect(result.plasterApplicable).toBe(true)
    })

    it('calcule l\'épaisseur de plomb pour fg < 1', () => {
      // Paramètres avec un faible Hmax / forte charge pour avoir fg < 1
      // fg = (1 * 0.001 * 1 * 1) / (0.02 * 2^2 * 100) = 0.001 / 8 = 0.000125
      const result = calculateShielding({
        cg: 1.0,
        w: 0.001,
        f: 1.0,
        t: 1.0,
        hmax: 0.02,
        c: 2.0,
        q: 100.0,
        kv: 70
      })

      expect(result.fg).toBeLessThan(1)
      expect(result.leadMm).toBeGreaterThan(0)
    })

    it('évalue correctement la limite d\'applicabilité du plâtre à 300mm', () => {
      // Résultat où le plâtre dépasse 300mm (ex: fg très faible => N grand => Pb > 1.5mm => Plâtre > 300mm)
      const highLeadResult = calculateShielding({
        cg: 1.0,
        w: 0.00000001, // 1e-8
        f: 1.0,
        t: 1.0,
        hmax: 1.0,
        c: 10.0,
        q: 100.0,
        kv: 50
      })

      expect(highLeadResult.plasterMm).toBeGreaterThan(300)
      expect(highLeadResult.plasterApplicable).toBe(false)
    })
  })
})
