# 🇵🇹 Португалія — Логіка розрахунку податків для Freelancer / NHR (2025)

> Документ для розробки веб-калькулятора.  
> Всі формули перевірені на основі португальського податкового кодексу (CIRS 2025).

---

## Зміст

1. [Вхідні дані (Inputs)](#1-вхідні-дані)
2. [Крок 1 — Taxable Base (оподатковувана база)](#2-taxable-base)
3. [Крок 2 — IRS знижка для нової активності](#3-irs-знижка-нової-активності)
4. [Крок 3 — Розрахунок IRS (Freelancer режим)](#4-розрахунок-irs-freelancer)
5. [Крок 4 — Розрахунок IRS (NHR режим)](#5-розрахунок-irs-nhr)
6. [Крок 5 — Солідарний збір](#6-солідарний-збір)
7. [Крок 6 — Segurança Social (соціальні внески)](#7-segurança-social)
8. [Крок 7 — Net результат](#8-net-результат)
9. [Зворотній розрахунок](#9-зворотній-розрахунок)
10. [Шкала ставок IRS 2025](#10-шкала-ставок-irs-2025)
11. [Повний приклад розрахунку](#11-повний-приклад)
12. [Типи сценаріїв для UI](#12-сценарії-для-ui)
13. [Обмеження та застереження](#13-обмеження)

---

## 1. Вхідні дані

| ID | Назва | Тип | Діапазон | За замовч. | Опис |
|----|-------|-----|----------|-----------|------|
| `grossAnnual` | Gross дохід на рік | `number` | 10 000–500 000 | 80 000 | Сума яку ти виставляєш клієнту |
| `activityYear` | Рік активності | `1 \| 2 \| 3` | 1–3 | 1 | 1 = перший рік відкриття ФОП |
| `hasNHR` | Наявність NHR | `boolean` | — | true | true = маєш NHR статус (20% flat) |
| `coefficient` | Коефіцієнт Category B | `number` | 0.15–0.95 | 0.75 | IT/консалтинг = 0.75 |
| `nhrRate` | Ставка NHR | `number` | — | 0.20 | Фіксована: 20% |

### Коефіцієнти за типом активності

```
IT / консалтинг / дизайн / право    → 0.75   (найпоширеніший)
Загальні послуги (прибирання тощо)  → 0.35
Продаж товарів / e-commerce         → 0.15
Крипто-трейдинг                     → 0.15
Крипто-майнінг                      → 0.95
```

> **Для frontend / fullstack розробника:** завжди `0.75` (CAE 62010 або 62020)

---

## 2. Taxable Base

Португалія не оподатковує 100% твого доходу. Держава застосовує коефіцієнт, який визначає яка частина вважається "прибутком".

```
taxableBase = grossAnnual × coefficient
```

**Приклад:**
```
grossAnnual  = 80 000 €
coefficient  = 0.75
taxableBase  = 80 000 × 0.75 = 60 000 €
```

Решта 25% (= 20 000 €) вважається "assumed expenses" і **не оподатковується**.

> ⚠️ Але: якщо реальні витрати менше 15% від gross — різниця додається до taxable base.  
> Для спрощення калькулятора: припускаємо що витрати ≥ 15% (тобто знижка повна).

---

## 3. IRS знижка нової активності

Для тих, хто **вперше** реєструє самозайнятість у Португалії, діє знижка на IRS-базу:

```
Year 1: taxableBaseReduced = taxableBase × (1 - 0.50) = taxableBase × 0.50
Year 2: taxableBaseReduced = taxableBase × (1 - 0.25) = taxableBase × 0.75
Year 3+: taxableBaseReduced = taxableBase (без знижки)
```

**Псевдокод:**
```js
function applyNewActivityDiscount(taxableBase, activityYear) {
  if (activityYear === 1) return taxableBase * 0.50
  if (activityYear === 2) return taxableBase * 0.75
  return taxableBase
}
```

**Умови для знижки (обов'язково перевірити):**
- Не можна мати зарплату (Category A) у тому ж році
- Не можна мати пенсію (Category H) у тому ж році
- Не закривав аналогічну активність в Португалії за останні 5 років

> Калькулятор може показувати знижку, але попереджати що вона є умовною.

---

## 4. Розрахунок IRS (Freelancer режим)

Застосовуємо **прогресивну шкалу** до `taxableBaseReduced`.

### Шкала ставок IRS 2025

| Від (€) | До (€) | Ставка |
|---------|--------|--------|
| 0 | 8 059 | 13.00% |
| 8 060 | 12 160 | 16.50% |
| 12 161 | 17 233 | 22.00% |
| 17 234 | 22 306 | 25.00% |
| 22 307 | 28 400 | 32.00% |
| 28 401 | 41 629 | 35.00% |
| 41 630 | 44 987 | 43.00% |
| 44 988 | 80 000 | 45.00% |
| 80 001 | ∞ | 48.00% |

### Алгоритм (маргінальне оподаткування)

```js
const TAX_BRACKETS = [
  { min: 0,      max: 8059,      rate: 0.1300 },
  { min: 8060,   max: 12160,     rate: 0.1650 },
  { min: 12161,  max: 17233,     rate: 0.2200 },
  { min: 17234,  max: 22306,     rate: 0.2500 },
  { min: 22307,  max: 28400,     rate: 0.3200 },
  { min: 28401,  max: 41629,     rate: 0.3500 },
  { min: 41630,  max: 44987,     rate: 0.4300 },
  { min: 44988,  max: 80000,     rate: 0.4500 },
  { min: 80001,  max: Infinity,  rate: 0.4800 },
]

function calcIRS(taxableIncome) {
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
```

---

## 5. Розрахунок IRS (NHR режим)

При наявності NHR (Non-Habitual Resident) статусу застосовується **фіксована ставка 20%** до `taxableBase` (без знижки нової активності, бо NHR і так вигідніший).

```js
function calcIRS_NHR(taxableBase, nhrRate = 0.20) {
  return taxableBase * nhrRate
}
```

> **Важливо:** NHR знижка нової активності **не** застосовується одночасно з NHR. Вибирається вигідніший варіант.

---

## 6. Солідарний збір

Додається **поверх IRS** якщо оподатковувана база перевищує €80 000:

```
Від €80 001 до €250 000  → +2.5% від суми перевищення
Від €250 001 і вище      → +5.0% від суми перевищення
```

**Псевдокод:**
```js
function calcSolidaritySurcharge(taxableIncome) {
  let surcharge = 0

  if (taxableIncome > 250000) {
    surcharge += (taxableIncome - 250000) * 0.050
    surcharge += (250000 - 80000) * 0.025
  } else if (taxableIncome > 80000) {
    surcharge += (taxableIncome - 80000) * 0.025
  }

  return surcharge
}
```

---

## 7. Segurança Social (соціальні внески)

Соціальне страхування як самозайнятий.

### База нарахування

```
ssBase = grossAnnual × 0.75    // для IT / послуги (coefficient 0.75)
```

> Для коефіцієнта 0.35 і 0.15 база та сама: `grossAnnual × coefficient`

### Ставка

```
ssRate = 21.4%
```

### Формула

```js
function calcSocialSecurity(grossAnnual, coefficient, activityYear) {
  if (activityYear === 1) return 0  // перший рік: повне звільнення

  const ssBase = grossAnnual * coefficient
  return ssBase * 0.214
}
```

### Важливі деталі

- **Рік 1:** 0€ (повне звільнення)
- **Рік 2+:** 21.4% від бази
- Сплачується **щомісяця** між 10-м і 20-м числом
- Квартальна декларація (до останнього дня січ/квіт/лип/жовт)

---

## 8. Net результат

### Повна формула

```js
function calcAll(inputs) {
  const {
    grossAnnual,
    activityYear,
    hasNHR,
    coefficient = 0.75,
    nhrRate = 0.20
  } = inputs

  // Step 1: taxable base
  const taxableBase = grossAnnual * coefficient

  // Step 2: IRS знижка (тільки для Freelancer режиму)
  const taxableBaseReduced = applyNewActivityDiscount(taxableBase, activityYear)

  // Step 3: IRS
  const irsFreelancer = calcIRS(taxableBaseReduced)
  const irsNHR        = calcIRS_NHR(taxableBase, nhrRate)

  // Step 4: Солідарний збір
  const solidarityFL  = calcSolidaritySurcharge(taxableBaseReduced)
  const solidarityNHR = calcSolidaritySurcharge(taxableBase)

  // Step 5: Seg.Social
  const socialSecurity = calcSocialSecurity(grossAnnual, coefficient, activityYear)

  // Step 6: Разом IRS + Solidarity
  const totalTaxFL  = irsFreelancer + solidarityFL
  const totalTaxNHR = irsNHR + solidarityNHR

  // Step 7: Net
  const netFreelancer = grossAnnual - totalTaxFL - socialSecurity
  const netNHR        = grossAnnual - totalTaxNHR - socialSecurity

  // Вибір режиму (якщо є NHR)
  const net = hasNHR
    ? Math.max(netFreelancer, netNHR)   // вибираємо вигідніший
    : netFreelancer

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
    effectiveRateFL:  totalTaxFL  / grossAnnual,
    effectiveRateNHR: totalTaxNHR / grossAnnual,
  }
}
```

---

## 9. Зворотній розрахунок

Користувач вводить бажаний **net/місяць** → калькулятор показує необхідний **gross**.

Оскільки IRS прогресивний, точне рішення — через ітерацію (бінарний пошук):

```js
function findRequiredGross(targetNetMonthly, activityYear, hasNHR, coefficient = 0.75) {
  const targetNetAnnual = targetNetMonthly * 12

  let lo = targetNetAnnual        // нижня межа gross
  let hi = targetNetAnnual * 3    // верхня межа gross (запас)

  for (let i = 0; i < 100; i++) {
    const mid = (lo + hi) / 2
    const result = calcAll({ grossAnnual: mid, activityYear, hasNHR, coefficient })
    const net = hasNHR
      ? Math.max(result.netFreelancer, result.netNHR)
      : result.netFreelancer

    if (Math.abs(net - targetNetAnnual) < 1) break  // точність €1

    if (net < targetNetAnnual) lo = mid
    else hi = mid
  }

  return (lo + hi) / 2
}
```

**Приклад:** ціль = €5 000/міс net
```
grossRequired_FL  ≈ €9 250/міс  (≈ €111 000/рік)  — рік 3+, без NHR
grossRequired_NHR ≈ €8 200/міс  (≈ €98 500/рік)   — з NHR
```

---

## 10. Шкала ставок IRS 2025

Повна таблиця для відображення в UI:

```js
const IRS_BRACKETS_2025 = [
  { from: 0,      to: 8059,      marginalRate: 0.130, description: "Мінімальний" },
  { from: 8060,   to: 12160,     marginalRate: 0.165, description: "" },
  { from: 12161,  to: 17233,     marginalRate: 0.220, description: "" },
  { from: 17234,  to: 22306,     marginalRate: 0.250, description: "" },
  { from: 22307,  to: 28400,     marginalRate: 0.320, description: "" },
  { from: 28401,  to: 41629,     marginalRate: 0.350, description: "" },
  { from: 41630,  to: 44987,     marginalRate: 0.430, description: "" },
  { from: 44988,  to: 80000,     marginalRate: 0.450, description: "" },
  { from: 80001,  to: Infinity,  marginalRate: 0.480, description: "Максимальний" },
]
```

---

## 11. Повний приклад

**Вхідні дані:** `gross = €80 000`, `рік = 1`, `NHR = так`, `coefficient = 0.75`

```
[1] taxableBase          = 80 000 × 0.75            = 60 000 €
[2] taxableBaseReduced   = 60 000 × 0.50 (рік 1)   = 30 000 €

--- FREELANCER режим ---
[3a] IRS (прогресивний, на 30 000€):
     0–8059:    8 059 × 13%   =  1 047.67 €
     8060–12160: 4 101 × 16.5% =    676.67 €
     12161–17233: 5 073 × 22% =  1 116.06 €
     17234–22306: 5 073 × 25% =  1 268.25 €
     22307–28400: 5 694 × 32% =  1 822.08 €
     28401–30000: 1 600 × 35% =    560.00 €
     Разом IRS FL            =  6 490.73 €

[4a] Solidarity FL        = 0 (база 30 000 < 80 000)
[5]  Seg.Social           = 0 (рік 1 — звільнено)
[6a] Net Freelancer       = 80 000 - 6 491 - 0     = 73 509 €/рік = 6 126 €/міс
[7a] Ефективна ставка FL  = 6 491 / 80 000         = 8.1%

--- NHR режим (20% flat) ---
[3b] IRS NHR              = 60 000 × 20%            = 12 000 €
[4b] Solidarity NHR       = 0 (база 60 000 < 80 000)
[6b] Net NHR              = 80 000 - 12 000 - 0    = 68 000 €/рік = 5 667 €/міс
[7b] Ефективна ставка NHR = 12 000 / 80 000         = 15.0%

==> Рік 1: Freelancer ВИГІДНІШИЙ (€6 126 vs €5 667/міс)
```

---

## 12. Сценарії для UI

Рекомендовані режими відображення в калькуляторі:

### Режим 1: Слайдер Gross → показуємо Net

```
Input:  grossAnnual (slider: 20k–200k)
Input:  activityYear (tabs: 1 / 2 / 3+)
Input:  hasNHR (toggle)

Output: Net/місяць (FL), Net/місяць (NHR)
Output: Breakdown bar (net / IRS / seg.social)
Output: Ефективна ставка
```

### Режим 2: Слайдер Net → показуємо потрібний Gross

```
Input:  targetNetMonthly (slider: 2k–15k)
Input:  activityYear, hasNHR

Output: Required gross/місяць (FL)
Output: Required gross/місяць (NHR)
Output: Різниця між режимами
```

### Режим 3: Порівняльна таблиця по роках

```
Row per year: Рік 1 / Рік 2 / Рік 3+
Columns: Gross | IRS FL | IRS NHR | Seg.Social | Net FL | Net NHR
```

---

## 13. Обмеження

1. **Не враховуються особисті відрахування** (витрати на здоров'я, освіту, житло) — вони зменшують IRS але індивідуальні.
2. **Одруженим** можна подавати спільну декларацію — база ділиться на 2, це може знизити ставку.
3. **ПДВ (IVA):** якщо річний оборот > €14 500 — потрібна реєстрація ПДВ. Калькулятор це **не** враховує.
4. **NHR 2.0 (IFICI):** нові правила з 2024 для нових заявників, потрібна кваліфікація через роботодавця/компанію. Старий NHR (до 2024) = 20% flat як описано.
5. **Витрати і 15% ліміт:** якщо реальних витрат менше 15% від gross — частина "assumed expenses" додається назад до taxable base. Для спрощення калькулятор цього не показує.
6. **Не є юридичною або фінансовою порадою** — для точних розрахунків рекомендовано звернутись до contabilista certificado.

---

## Структура проєкту (пропозиція)

```
tax-calculator/
├── src/
│   ├── lib/
│   │   ├── taxEngine.ts        ← вся логіка цього документа
│   │   ├── brackets.ts         ← константи: шкала, коефіцієнти
│   │   └── reverseCalc.ts      ← бінарний пошук для reverse
│   ├── components/
│   │   ├── GrossSlider.tsx
│   │   ├── NetTargetSlider.tsx
│   │   ├── BreakdownBar.tsx
│   │   ├── ComparisonTable.tsx
│   │   └── BracketVisualizer.tsx
│   └── pages/
│       └── index.tsx
└── README.md
```

---

*Джерела: CIRS 2025 (Código do Imposto sobre o Rendimento das Pessoas Singulares), Segurança Social Portugal, Portal das Finanças*
