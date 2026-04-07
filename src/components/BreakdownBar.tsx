"use client"

import { TaxResult } from "@/lib/taxEngine"

interface Props {
  result: TaxResult
  mode: "freelancer" | "nhr"
}

const fmt = (n: number) =>
  n.toLocaleString("pt-PT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 })

const pct = (n: number) => `${(n * 100).toFixed(1)}%`

export function BreakdownBar({ result, mode }: Props) {
  const gross = result.grossAnnual
  const irs      = mode === "nhr" ? result.irsNHR      : result.irsFreelancer
  const solida   = mode === "nhr" ? result.solidarityNHR : result.solidarityFL
  const ss       = result.socialSecurity
  const net      = mode === "nhr" ? result.netNHR       : result.netFreelancer

  const irsShare    = gross > 0 ? irs    / gross : 0
  const solidaShare = gross > 0 ? solida / gross : 0
  const ssShare     = gross > 0 ? ss     / gross : 0
  const netShare    = gross > 0 ? net    / gross : 0

  const segments = [
    { label: "Net",          value: net,    share: netShare,    color: "bg-emerald-500" },
    { label: "IRS",          value: irs,    share: irsShare,    color: "bg-red-500" },
    { label: "Solidarity",   value: solida, share: solidaShare, color: "bg-orange-400" },
    { label: "Seg. Social",  value: ss,     share: ssShare,     color: "bg-amber-500" },
  ]

  return (
    <div className="space-y-3">
      {/* Bar */}
      <div className="flex h-10 w-full overflow-hidden rounded-xl shadow-inner bg-muted">
        {segments.map((s) =>
          s.share > 0 ? (
            <div
              key={s.label}
              className={`${s.color} transition-all duration-500 flex items-center justify-center`}
              style={{ width: `${s.share * 100}%` }}
              title={`${s.label}: ${fmt(s.value)}`}
            >
              {s.share > 0.08 && (
                <span className="text-white text-xs font-semibold drop-shadow">
                  {pct(s.share)}
                </span>
              )}
            </div>
          ) : null
        )}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full flex-shrink-0 ${s.color}`} />
            <span className="text-sm text-muted-foreground flex-1">{s.label}</span>
            <span className="text-sm font-semibold tabular-nums">{fmt(s.value)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
