export const CDD_TABLE: Record<number, number> = {
  50: 0.17,
  70: 0.52,
  85: 0.73,
  100: 0.88,
  125: 0.93,
  150: 0.99,
  200: 1.70,
  250: 2.90,
  300: 4.80
}

/**
 * Calcule la valeur interpolated CDD (Couche de Déci-Transmission en mm Pb)
 * par interpolation linéaire continue selon le kV.
 */
export function getInterpolatedCdd(voltage: number): number {
  if (CDD_TABLE[voltage] !== undefined) {
    return CDD_TABLE[voltage]
  }

  const keys = Object.keys(CDD_TABLE)
    .map(Number)
    .sort((a, b) => a - b)

  if (voltage <= keys[0]) return CDD_TABLE[keys[0]]
  if (voltage >= keys[keys.length - 1]) return CDD_TABLE[keys[keys.length - 1]]

  let lowerKey = keys[0]
  let upperKey = keys[keys.length - 1]

  for (let i = 0; i < keys.length - 1; i++) {
    if (voltage >= keys[i] && voltage <= keys[i + 1]) {
      lowerKey = keys[i]
      upperKey = keys[i + 1]
      break
    }
  }

  const lowerVal = CDD_TABLE[lowerKey]
  const upperVal = CDD_TABLE[upperKey]

  return lowerVal + ((voltage - lowerKey) * (upperVal - lowerVal)) / (upperKey - lowerKey)
}

/**
 * Calcule le facteur fg.
 * Lève une exception si hmax === 0, c === 0 ou q === 0 (division par zéro).
 */
export function calculateFg(
  cg: number,
  w: number,
  f: number,
  t: number,
  hmax: number,
  c: number,
  q: number
): number {
  if (hmax === 0 || c === 0 || q === 0) {
    throw new Error('hmax, c et q ne peuvent pas être nuls (division par zéro).')
  }

  return (cg * w * f * t) / (hmax * c * c * q)
}

export function getConcreteRatio(kv: number): number {
  if (kv <= 50) return 108
  if (kv <= 100) return 108 + ((kv - 50) * (70 - 108)) / (100 - 50)
  if (kv <= 200) return 70 + ((kv - 100) * (100 - 70)) / (200 - 100)
  return 100
}

export function getPlasterRatio(kv: number): number {
  if (kv <= 50) return 200
  if (kv <= 75) return 200 + ((kv - 50) * (170 - 200)) / (75 - 50)
  if (kv <= 100) return 170 + ((kv - 75) * (160 - 170)) / (100 - 75)
  return 160
}

export interface ShieldingParams {
  cg: number
  w: number
  f: number
  t: number
  hmax: number
  c: number
  q: number
  kv: number
}

export interface ShieldingResult {
  leadMm: number
  fg: number
  concreteMm: number
  plasterMm: number
  plasterApplicable: boolean
}

/**
 * Calcule le blindage requis et ses équivalences matériaux.
 */
export function calculateShielding(
  cgOrParams: number | ShieldingParams,
  w?: number,
  f?: number,
  t?: number,
  hmax?: number,
  c?: number,
  q?: number,
  kv?: number
): ShieldingResult {
  let params: ShieldingParams

  if (typeof cgOrParams === 'object') {
    params = cgOrParams
  } else {
    params = {
      cg: cgOrParams,
      w: w!,
      f: f!,
      t: t!,
      hmax: hmax!,
      c: c!,
      q: q!,
      kv: kv!
    }
  }

  const fg = calculateFg(
    params.cg,
    params.w,
    params.f,
    params.t,
    params.hmax,
    params.c,
    params.q
  )

  if (fg >= 1) {
    return {
      leadMm: 0.0,
      fg,
      concreteMm: 0.0,
      plasterMm: 0.0,
      plasterApplicable: true
    }
  }

  const n = -Math.log10(fg)
  const cdd = getInterpolatedCdd(params.kv)
  const leadMm = n * cdd

  const concreteRatio = getConcreteRatio(params.kv)
  const plasterRatio = getPlasterRatio(params.kv)

  const concreteMm = leadMm * concreteRatio
  const plasterMm = leadMm * plasterRatio
  const plasterApplicable = plasterMm <= 300

  return {
    leadMm,
    fg,
    concreteMm,
    plasterMm,
    plasterApplicable
  }
}

export interface NfcPreset {
  id: string
  label: string
  kv: number
  cg: number
  w: number
  f: number
  t: number
  hmax: number
  c: number
  q: number
  description: string
}

export const PRESETS: NfcPreset[] = [
  {
    id: 'dentaire',
    label: 'Dentaire RX (70 kV)',
    kv: 70,
    cg: 1.0,
    w: 20.0,
    f: 1.0,
    t: 1.0,
    hmax: 0.02,
    c: 1.5,
    q: 0.5,
    description: 'Installation radiologique dentaire intra-orale classique (70 kV)'
  },
  {
    id: 'medical',
    label: 'Médical Radiologie (125 kV)',
    kv: 125,
    cg: 1.0,
    w: 250.0,
    f: 1.0,
    t: 1.0,
    hmax: 0.02,
    c: 3.0,
    q: 1.0,
    description: 'Salle de radiologie conventionnelle médicale (125 kV)'
  },
  {
    id: 'scanner',
    label: 'Scanner TDM (150 kV)',
    kv: 150,
    cg: 1.0,
    w: 1000.0,
    f: 1.0,
    t: 1.0,
    hmax: 0.02,
    c: 4.0,
    q: 2.0,
    description: 'TDM / Scanner corps entier à forte charge de travail (150 kV)'
  },
  {
    id: 'industrie',
    label: 'Industrie (200 kV)',
    kv: 200,
    cg: 1.0,
    w: 2000.0,
    f: 1.0,
    t: 1.0,
    hmax: 0.02,
    c: 5.0,
    q: 4.0,
    description: 'Contrôle non destructif / Radiographie industrielle (200 kV)'
  }
]

export const useNfc15160 = () => {
  return {
    CDD_TABLE,
    getInterpolatedCdd,
    calculateFg,
    calculateShielding,
    PRESETS
  }
}
