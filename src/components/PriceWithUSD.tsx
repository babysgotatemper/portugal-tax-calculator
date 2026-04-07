"use client"

import { useExchangeRate } from "@/components/ExchangeRateToast"

interface Props {
  amountEUR: number
  showFull?: boolean
}

const fmtDec = (n: number) =>
  n.toLocaleString("uk-UA", { style: "currency", currency: "EUR", maximumFractionDigits: 2 })

const fmtUSD = (n: number) =>
  n.toLocaleString("uk-UA", { style: "currency", currency: "USD", maximumFractionDigits: 2 })

export function PriceWithUSD({ amountEUR, showFull = false }: Props) {
  const { rate, loading, error } = useExchangeRate()

  if (error || loading) {
    return <span className="font-semibold tabular-nums">{fmtDec(amountEUR)}</span>
  }

  const amountUSD = amountEUR * rate

  if (showFull) {
    return (
      <div className="space-y-0.5">
        <p className="font-semibold tabular-nums text-lg text-primary">
          {fmtDec(amountEUR)}
        </p>
        <p className="text-[11px] text-muted-foreground tabular-nums">
          ≈ {fmtUSD(amountUSD)}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-0.5">
      <p className="font-semibold tabular-nums">{fmtDec(amountEUR)}</p>
      <p className="text-[10px] text-muted-foreground tabular-nums">
        ≈ {fmtUSD(amountUSD)}
      </p>
    </div>
  )
}
