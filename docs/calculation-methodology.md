# Методологія розрахунків Portugal Tax Calculator

Цей документ описує, як працює калькулятор у поточній версії коду. Джерелом істини для числових значень у застосунку є `src/lib/brackets.ts` і `src/lib/taxEngine.ts`.

## 1. Вхідний дохід

Користувач може ввести дохід як:

- gross на рік;
- gross на місяць;
- net на рік;
- net на місяць.

Для податкового engine усе приводиться до річного gross:

```text
annual gross = monthly gross * 12
annual net target = monthly net target * 12
```

Якщо користувач вводить net, калькулятор запускає зворотний розрахунок у `findRequiredGross`: бінарним пошуком підбирається gross, який дає потрібний net після IRS, Segurança Social і solidarity surcharge.

## 2. Оподатковувана база

Для freelancer-режиму калькулятор застосовує коефіцієнт активності:

```text
taxableBase = grossAnnual * coefficient
```

За замовчуванням для професійних послуг використовується `0.75`. Інші коефіцієнти задаються у `ACTIVITY_COEFFICIENTS`.

Офіційний орієнтир: Portal das Finanças, Código do IRS, режим simplificado / coeficientes, зокрема Artigo 31.º. Див. також офіційні матеріали AT щодо CIRS: https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/Pages/default.aspx

## 3. Знижка для перших років активності

Калькулятор застосовує зменшення бази для IRS за податковими періодами активності. Для фізичних осіб у Португалії податковий період зазвичай збігається з календарним роком:

```text
1-й податковий період активності: taxableBase * 0.50
2-й податковий період активності: taxableBase * 0.75
3-й податковий період і далі: taxableBase
```

Це реалізовано в `applyNewActivityDiscount`.

## 4. IRS

Freelancer IRS рахується прогресивно за шкалою з `TAX_BRACKETS`:

```text
irs = sum(taxable amount inside each bracket * bracket rate)
```

Поточні bracket-значення в коді:

| From | To | Rate |
| --- | --- | --- |
| 0 | 8 059 | 13% |
| 8 060 | 12 160 | 16.5% |
| 12 161 | 17 233 | 22% |
| 17 234 | 22 306 | 25% |
| 22 307 | 28 400 | 32% |
| 28 401 | 41 629 | 35% |
| 41 630 | 44 987 | 43% |
| 44 988 | 80 000 | 45% |
| 80 001 | ∞ | 48% |

Офіційний орієнтир для актуальних ставок: Portal das Finanças, Código do IRS, Artigo 68.º: https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/irs/ra/pages/irsra72-1207.aspx

Важливо: офіційні пороги можуть змінюватися щороку. Якщо рік калькулятора змінюється, потрібно оновити `TAX_BRACKETS`.

## 5. NHR

Для NHR режиму калькулятор застосовує flat rate:

```text
irsNHR = taxableBase * 0.20
```

Офіційний орієнтир: Portal das Finanças, Código do IRS, Artigo 72.º, пункт щодо residentes não habituais і ставки 20% для категорій A/B у high value-added activities: https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/ra/Pages/irs72ra_202310.aspx

## 6. Segurança Social

Калькулятор рахує Segurança Social так:

```text
1-й рік активності: 0
2-й рік і далі: grossAnnual * coefficient * 0.214
```

Тобто застосовується ставка 21.4% до релевантної бази після коефіцієнта.

Важливо: для Segurança Social перше звільнення не є календарним роком у прямому сенсі. Для першого enquadramento воно прив'язане до перших 12 місяців після початку активності; калькулятор наближує це як `activityYear === 1`.

Офіційний орієнтир: Segurança Social, trabalhadores independentes: https://www.seg-social.pt/trabalhadores-independentes

## 7. Додатковий solidarity surcharge

Калькулятор застосовує:

```text
80 000 - 250 000: 2.5% на суму понад 80 000
250 000+: 2.5% на 170 000 + 5% на суму понад 250 000
```

Офіційний орієнтир: Portal das Finanças, Código do IRS, Artigo 68.º-A: https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/irs/Pages/irs68a.aspx

## 8. Податкові відрахування

Калькулятор застосовує collection deductions до суми IRS у freelancer-режимі:

```text
mortgage = min(mortgageInterest * 15%, 296)
health = min(healthExpenses * 15%, 1000)
education = min(educationExpenses * 30%, 800)
children = numChildren * 600
children for single parent = numChildren * 726
```

Ці значення знаходяться в `DEDUCTION_RULES`.

## 9. Net і effective rate

Після IRS, solidarity surcharge і Segurança Social:

```text
netFreelancer = grossAnnual - irsFreelancer - solidarityFL - socialSecurity
netNHR = grossAnnual - irsNHR - solidarityNHR - socialSecurity
effectiveRate = annualTaxes / grossAnnual
```

Якщо NHR увімкнений і дає більший net, калькулятор показує NHR як кращий режим. Інакше показує freelancer.
