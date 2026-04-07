"use client"

import { useState } from "react"
import { Slider } from "@/components/ui/slider"
import { findRequiredGross } from "@/lib/reverseCalc"

interface Props {
  activityYear: 1 | 2 | 3
  hasNHR: boolean
  coefficient: number
}

const fmt = (n: number) =>
  n.toLocaleString("pt-PT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 })

export function ReverseCalculator({ activityYear, hasNHR, coefficient }: Props) {
  const [targetNet, setTargetNet] = useState(5000)

  const result = findRequiredGross(targetNet, activityYear, hasNHR, coefficient)

  const saving = result.grossFL - result.grossNHR

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Бажаний net / місяць</span>
          <span className="text-2xl font-bold text-primary tabular-nums">{fmt(targetNet)}</span>
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
        <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Freelancer режим</p>
          <p className="text-2xl font-bold tabular-nums">{fmt(result.grossFL / 12)}<span className="text-sm font-normal text-muted-foreground">/міс</span></p>
          <p className="text-sm text-muted-foreground">{fmt(result.grossFL)} / рік</p>
        </div>

        {hasNHR && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20 dark:border-emerald-800 p-4 space-y-1">
            <p className="text-xs text-emerald-700 dark:text-emerald-400 uppercase tracking-wide font-medium">NHR режим</p>
            <p className="text-2xl font-bold tabular-nums text-emerald-700 dark:text-emerald-400">
              {fmt(result.grossNHR / 12)}<span className="text-sm font-normal">/міс</span>
            </p>
            <p className="text-sm text-emerald-600 dark:text-emerald-500">{fmt(result.grossNHR)} / рік</p>
          </div>
        )}
      </div>

      {hasNHR && saving > 0 && (
        <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 p-3 text-center">
          <p className="text-sm text-emerald-700 dark:text-emerald-400">
            З NHR можна заробляти <strong>{fmt(saving)}/рік менше</strong> і мати той самий net
          </p>
        </div>
      )}
    </div>
  )
}
