"use client"

import { TAX_BRACKETS } from "@/lib/brackets"

interface Props {
  taxableIncome: number
}

const fmt = (n: number) =>
  n === Infinity
    ? "∞"
    : n.toLocaleString("pt-PT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 })

export function BracketVisualizer({ taxableIncome }: Props) {
  return (
    <div className="space-y-1.5">
      {TAX_BRACKETS.map((b, i) => {
        const isActive = taxableIncome > b.min
        const portion = isActive
          ? Math.min(taxableIncome, b.max === Infinity ? taxableIncome : b.max) - b.min
          : 0
        const barMax = b.max === Infinity ? Math.max(taxableIncome - b.min, 1) : b.max - b.min

        return (
          <div key={i} className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
            <span className={`text-xs font-mono w-8 text-right ${isActive ? "text-foreground font-semibold" : "text-muted-foreground"}`}>
              {(b.rate * 100).toFixed(0)}%
            </span>
            <div className="relative h-5 bg-muted rounded overflow-hidden">
              <div
                className={`h-full rounded transition-all duration-500 ${
                  isActive
                    ? i < 3 ? "bg-emerald-400"
                    : i < 6 ? "bg-amber-400"
                    : "bg-red-400"
                    : "bg-transparent"
                }`}
                style={{ width: `${Math.min(100, (portion / barMax) * 100)}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {fmt(b.min)} – {b.max === Infinity ? "∞" : fmt(b.max)}
            </span>
          </div>
        )
      })}
    </div>
  )
}
