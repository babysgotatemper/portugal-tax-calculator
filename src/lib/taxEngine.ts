import { TAX_BRACKETS, DEDUCTION_RULES, getQuotientAtStep } from "./brackets"

export interface DeductionInputs {
  maritalStatus: "single" | "married" | "single_parent"
  mortgageInterest: number
  healthExpenses: number
  educationExpenses: number
  numChildren: number
}

export interface TaxInputs {
  grossAnnual: number
  activityYear: 1 | 2 | 3
  hasNHR: boolean
  coefficient: number
  nhrRate?: number
  deductions?: DeductionInputs
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
  totalDeduction: number
  familyQuotient: number
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

export function calcIRSWithQuotient(
  taxableBase: number,
  maritalStatus: "single" | "married" | "single_parent",
  numChildren: number
): number {
  const baseQ = getQuotientAtStep(maritalStatus, 0)
  let effectiveTax = calcIRS(taxableBase / baseQ) * baseQ

  for (let i = 0; i < numChildren; i++) {
    const prevQ = getQuotientAtStep(maritalStatus, i)
    const nextQ = getQuotientAtStep(maritalStatus, i + 1)
    const cap = i < 2 ? 300 : 150

    const taxBefore = calcIRS(taxableBase / prevQ) * prevQ
    const taxAfter = calcIRS(taxableBase / nextQ) * nextQ
    effectiveTax -= Math.min(taxBefore - taxAfter, cap)
  }

  return Math.max(0, effectiveTax)
}

export function calcAll(inputs: TaxInputs): TaxResult {
  const { grossAnnual, activityYear, hasNHR, coefficient, nhrRate = 0.2, deductions } = inputs

  const taxableBase = grossAnnual * coefficient
  const taxableBaseReduced = applyNewActivityDiscount(taxableBase, activityYear)

  // Compute collection deductions (applied to tax amount, not base)
  const {
    maritalStatus = "single",
    mortgageInterest = 0,
    healthExpenses = 0,
    educationExpenses = 0,
    numChildren = 0,
  } = deductions ?? {}

  const deductMortgage = Math.min(
    mortgageInterest * DEDUCTION_RULES.mortgage.rate,
    DEDUCTION_RULES.mortgage.cap
  )
  const deductHealth = Math.min(
    healthExpenses * DEDUCTION_RULES.health.rate,
    DEDUCTION_RULES.health.cap
  )
  const deductEducation = Math.min(
    educationExpenses * DEDUCTION_RULES.education.rate,
    DEDUCTION_RULES.education.cap
  )
  const perChildAmount = maritalStatus === "single_parent"
    ? DEDUCTION_RULES.perChildSingleParent
    : DEDUCTION_RULES.perChild
  const deductChildren = numChildren * perChildAmount
  const totalDeduction = deductMortgage + deductHealth + deductEducation + deductChildren

  // Apply family quotient to progressive IRS (freelancer mode only)
  const familyQuotient = getQuotientAtStep(maritalStatus, numChildren)
  const grossIRS = calcIRSWithQuotient(taxableBaseReduced, maritalStatus, numChildren)

  // Collection deductions applied to tax (not base)
  const irsFreelancer = Math.max(0, grossIRS - totalDeduction)
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
    totalDeduction,
    familyQuotient,
  }
}
