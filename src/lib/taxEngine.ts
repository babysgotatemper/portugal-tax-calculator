import { TAX_BRACKETS } from "./brackets"

export interface TaxInputs {
  grossAnnual: number
  activityYear: 1 | 2 | 3
  hasNHR: boolean
  coefficient: number
  nhrRate?: number
}

export interface TaxResult {
  grossAnnual: number
  taxableBase: number
  taxableBaseReduced: number
  irsFreelancer: number
  irsNHR: number
  solidarityFL: number
  solidarityNHR: number
  totalTaxFL: number
  totalTaxNHR: number
  socialSecurity: number
  netFreelancer: number
  netNHR: number
  netMonthlyFL: number
  netMonthlyNHR: number
  effectiveRateFL: number
  effectiveRateNHR: number
  bestMode: "freelancer" | "nhr"
  bestNet: number
  bestNetMonthly: number
}

export function applyNewActivityDiscount(taxableBase: number, activityYear: 1 | 2 | 3): number {
  if (activityYear === 1) return taxableBase * 0.5
  if (activityYear === 2) return taxableBase * 0.75
  return taxableBase
}

export function calcIRS(taxableIncome: number): number {
  let tax = 0
  let remaining = taxableIncome

  for (const bracket of TAX_BRACKETS) {
    if (remaining <= 0) break
    const bracketSize = bracket.max === Infinity
      ? remaining
      : Math.min(remaining, bracket.max - bracket.min + 1)
    const taxableInBracket = Math.min(remaining, bracketSize)
    tax += taxableInBracket * bracket.rate
    remaining -= taxableInBracket
  }

  return tax
}

export function calcIRS_NHR(taxableBase: number, nhrRate = 0.2): number {
  return taxableBase * nhrRate
}

export function calcSolidaritySurcharge(taxableIncome: number): number {
  let surcharge = 0
  if (taxableIncome > 250000) {
    surcharge += (taxableIncome - 250000) * 0.05
    surcharge += (250000 - 80000) * 0.025
  } else if (taxableIncome > 80000) {
    surcharge += (taxableIncome - 80000) * 0.025
  }
  return surcharge
}

export function calcSocialSecurity(grossAnnual: number, coefficient: number, activityYear: 1 | 2 | 3): number {
  if (activityYear === 1) return 0
  return grossAnnual * coefficient * 0.214
}

export function calcAll(inputs: TaxInputs): TaxResult {
  const { grossAnnual, activityYear, hasNHR, coefficient, nhrRate = 0.2 } = inputs

  const taxableBase = grossAnnual * coefficient
  const taxableBaseReduced = applyNewActivityDiscount(taxableBase, activityYear)

  const irsFreelancer = calcIRS(taxableBaseReduced)
  const irsNHR        = calcIRS_NHR(taxableBase, nhrRate)

  const solidarityFL  = calcSolidaritySurcharge(taxableBaseReduced)
  const solidarityNHR = calcSolidaritySurcharge(taxableBase)

  const socialSecurity = calcSocialSecurity(grossAnnual, coefficient, activityYear)

  const totalTaxFL  = irsFreelancer + solidarityFL
  const totalTaxNHR = irsNHR + solidarityNHR

  const netFreelancer = grossAnnual - totalTaxFL - socialSecurity
  const netNHR        = grossAnnual - totalTaxNHR - socialSecurity

  const bestMode = (hasNHR && netNHR > netFreelancer) ? "nhr" : "freelancer"
  const bestNet  = bestMode === "nhr" ? netNHR : netFreelancer

  return {
    grossAnnual,
    taxableBase,
    taxableBaseReduced,
    irsFreelancer,
    irsNHR,
    solidarityFL,
    solidarityNHR,
    totalTaxFL,
    totalTaxNHR,
    socialSecurity,
    netFreelancer,
    netNHR,
    netMonthlyFL:  netFreelancer / 12,
    netMonthlyNHR: netNHR / 12,
    effectiveRateFL:  grossAnnual > 0 ? totalTaxFL  / grossAnnual : 0,
    effectiveRateNHR: grossAnnual > 0 ? totalTaxNHR / grossAnnual : 0,
    bestMode,
    bestNet,
    bestNetMonthly: bestNet / 12,
  }
}
