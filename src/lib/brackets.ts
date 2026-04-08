export const TAX_BRACKETS = [
  { min: 0,     max: 8059,     rate: 0.13 },
  { min: 8060,  max: 12160,    rate: 0.165 },
  { min: 12161, max: 17233,    rate: 0.22 },
  { min: 17234, max: 22306,    rate: 0.25 },
  { min: 22307, max: 28400,    rate: 0.32 },
  { min: 28401, max: 41629,    rate: 0.35 },
  { min: 41630, max: 44987,    rate: 0.43 },
  { min: 44988, max: 80000,    rate: 0.45 },
  { min: 80001, max: Infinity, rate: 0.48 },
]

export const ACTIVITY_COEFFICIENTS = [
  { label: "IT / консалтинг / дизайн", value: 0.75, cae: "62010, 62020" },
  { label: "Загальні послуги",          value: 0.35, cae: "—" },
  { label: "Продаж товарів / e-commerce", value: 0.15, cae: "—" },
  { label: "Крипто-трейдинг",           value: 0.15, cae: "—" },
  { label: "Крипто-майнінг",            value: 0.95, cae: "—" },
]

export const DEDUCTION_RULES = {
  mortgage:  { rate: 0.15, cap: 296 },    // 15% of interest, max €296
  health:    { rate: 0.15, cap: 1000 },   // 15% of expenses, max €1000
  education: { rate: 0.30, cap: 800 },    // 30% of expenses, max €800
  perChild:  600,                         // €600 flat per dependent child
  perChildSingleParent: 726,              // €726 for single parent households
} as const

export function getQuotientAtStep(
  maritalStatus: "single" | "married" | "single_parent",
  n: number  // number of children included
): number {
  if (maritalStatus === "single") return 1.0
  if (maritalStatus === "married") return 2.0 + n * 0.15
  // single_parent: base 1.0, +0.34 first child, +0.20 each next
  if (n === 0) return 1.0
  return 1.0 + 0.34 + Math.max(0, n - 1) * 0.2
}
