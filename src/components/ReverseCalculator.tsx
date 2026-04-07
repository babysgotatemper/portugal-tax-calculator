"use client"

import { useState } from "react"
import { Slider } from "@/components/ui/slider"
import { findRequiredGross } from "@/lib/reverseCalc"
import { PriceWithUSD } from "@/components/PriceWithUSD"
import { useExchangeRate } from "@/components/ExchangeRateToast"

interface Props {
  activityYear: 1 | 2 | 3
  hasNHR: boolean
  coefficient: number
}

export function ReverseCalculator({ activityYear, hasNHR, coefficient }: Props) {
  const [targetNet, setTargetNet] = useState(5000)
  const { rate } = useExchangeRate()

  const result = findRequiredGross(targetNet, activityYear, hasNHR, coefficient)
  const saving = result.grossFL - result.grossNHR

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Бажаний net / місяць</span>
          <div>
            <div className="text-2xl font-bold text-primary tabular-nums">
              {(targetNet).toLocaleString("uk-UA", { maximumFractionDigits: 0 })}€
            </div>
            <div className="text-xs text-muted-foreground tabular-nums">
              ≈ ${(targetNet * rate).toLocaleString("uk-UA", { maximumFractionDigits: 0 })}
            </div>
          </div>
        </div>
        <Slider
          min={1000}
          max={20000}
          step={250}
          value={[targetNet]}
          onValueChange={(v) => setTargetNet(Array.isArray(v) ? v[0] : v)}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>1 000 €</span>
          <span>20 000 €</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Freelancer режим */}
        <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
            Freelancer режим
          </p>
          <div>
            <p className="text-xl font-bold tabular-nums">
              {(result.grossFL / 12).toLocaleString("uk-UA", { maximumFractionDigits: 0 })}€
              <span className="text-sm font-normal text-muted-foreground ml-1">/міс</span>
            </p>
            <p className="text-[10px] text-muted-foreground tabular-nums">
              ≈ ${(result.grossFL / 12 * rate).toLocaleString("uk-UA", { maximumFractionDigits: 0 })}
            </p>
          </div>
          <p className="text-xs text-muted-foreground border-t border-border/40 pt-1 mt-1">
            <span className="font-medium">Річно:</span> <PriceWithUSD amountEUR={result.grossFL} />
          </p>
        </div>

        {/* NHR режим */}
        {hasNHR && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20 dark:border-emerald-800 p-4 space-y-2">
            <p className="text-xs text-emerald-700 dark:text-emerald-400 uppercase tracking-wide font-medium">
              NHR режим
            </p>
            <div>
              <p className="text-xl font-bold tabular-nums text-emerald-700 dark:text-emerald-400">
                {(result.grossNHR / 12).toLocaleString("uk-UA", { maximumFractionDigits: 0 })}€
                <span className="text-sm font-normal text-emerald-600 dark:text-emerald-500 ml-1">/міс</span>
              </p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-500 tabular-nums">
                ≈ ${(result.grossNHR / 12 * rate).toLocaleString("uk-UA", { maximumFractionDigits: 0 })}
              </p>
            </div>
            <p className="text-xs text-emerald-600 dark:text-emerald-500 border-t border-emerald-200 dark:border-emerald-800 pt-1 mt-1">
              <span className="font-medium">Річно:</span> <PriceWithUSD amountEUR={result.grossNHR} />
            </p>
          </div>
        )}
      </div>

      {/* Економія з NHR */}
      {hasNHR && saving > 0 && (
        <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 p-3 text-center">
          <p className="text-sm text-emerald-700 dark:text-emerald-400">
            З NHR можна заробляти <strong>{(saving).toLocaleString("uk-UA", { maximumFractionDigits: 0 })}€/рік</strong> менше
          </p>
          <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-1">
            ≈ <strong>${(saving * rate).toLocaleString("uk-UA", { maximumFractionDigits: 0 })}</strong>/рік
          </p>
        </div>
      )}
    </div>
  )
}
