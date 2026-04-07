"use client"

import { useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { AlertCircle, HelpCircle } from "lucide-react"
import { calcAll } from "@/lib/taxEngine"
import { ACTIVITY_COEFFICIENTS } from "@/lib/brackets"
import { UI, TOOLTIPS } from "@/lib/constants"
import { BreakdownBar } from "@/components/BreakdownBar"
import { ComparisonTable } from "@/components/ComparisonTable"
import { BracketVisualizer } from "@/components/BracketVisualizer"
import { ReverseCalculator } from "@/components/ReverseCalculator"
import { useExchangeRate } from "@/components/ExchangeRateToast"
import { PriceWithUSD } from "@/components/PriceWithUSD"

const fmtDec = (n: number) =>
  n.toLocaleString("uk-UA", { style: "currency", currency: "EUR", maximumFractionDigits: 2 })

const pct = (n: number) => `${(n * 100).toFixed(1)}%`

function TooltipIcon({ text }: { text: string }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <HelpCircle className="w-4 h-4 text-muted-foreground hover:text-foreground cursor-help transition-colors" />
        </TooltipTrigger>
        <TooltipContent className="max-w-xs text-sm">{text}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default function Home() {
  const [gross, setGross] = useState(100000)
  const [activityYear, setActivityYear] = useState<1 | 2 | 3>(1)
  const [hasNHR, setHasNHR] = useState(false)
  const [coeffIdx, setCoeffIdx] = useState(0)

  const coefficient = ACTIVITY_COEFFICIENTS[coeffIdx].value
  const result = calcAll({ grossAnnual: gross, activityYear, hasNHR, coefficient })
  const displayMode: "freelancer" | "nhr" = result.bestMode
  const mainResult = displayMode === "nhr" ? result.netMonthlyNHR : result.netMonthlyFL
  const totalTaxes = displayMode === "nhr" ? result.totalTaxNHR : result.totalTaxFL

  // Get live exchange rate for consistent conversion
  const { rate } = useExchangeRate()

  return (
    <div className="gradient-hero min-h-screen">


      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* ── Hero ─────────────────────────────────────────────── */}
        {/* <div className="mb-12 pt-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary leading-tight mb-2">
            {UI.hero.title}{" "}
            <span className="text-primary">{UI.hero.subtitle}</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl">
            {UI.hero.description}
          </p>
        </div> */}

        {/* ── Main 2-column layout ───────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">

          {/* ── LEFT: Inputs ─────────────────────────────────── */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg border-border/60 sticky top-8">
              <CardContent className="pt-6 space-y-5">

                {/* Gross input */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Label className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
                      {UI.inputs.grossLabel}
                    </Label>
                    <TooltipIcon text={TOOLTIPS.grossIncome} />
                  </div>
                  <input
                    type="number"
                    value={gross}
                    onChange={(e) => setGross(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-muted border border-border/40 rounded-lg text-lg font-semibold text-foreground"
                  />
                  <Slider
                    min={10000}
                    max={300000}
                    step={1000}
                    value={[gross]}
                    onValueChange={(v) => setGross(Array.isArray(v) ? v[0] : v)}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>€10k</span>
                    <span>€300k</span>
                  </div>
                </div>

                <Separator />

                {/* Activity year */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <Label className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
                      {UI.inputs.yearLabel}
                    </Label>
                    <TooltipIcon text={TOOLTIPS.activityYear} />
                  </div>
                  <div className="flex gap-2">
                    {([1, 2, 3] as const).map((y) => (
                      <button
                        key={y}
                        onClick={() => setActivityYear(y)}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all border ${
                          activityYear === y
                            ? "bg-primary text-white border-primary"
                            : "bg-muted border-border/40 text-foreground hover:bg-muted/80"
                        }`}
                      >
                        {y === 3 ? "3+" : y} {y === 1 ? "рік" : "рік"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* NHR */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border/40">
                  <Switch id="nhr" checked={hasNHR} onCheckedChange={setHasNHR} />
                  <div className="flex-1 flex items-center gap-2">
                    <Label htmlFor="nhr" className="cursor-pointer text-sm font-medium">
                      {UI.inputs.nhrLabel}
                      <span className="text-xs text-muted-foreground ml-1">({UI.inputs.nhrDescription})</span>
                    </Label>
                    <TooltipIcon text={TOOLTIPS.nhr} />
                  </div>
                </div>

                {/* Activity type */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
                      {UI.inputs.activityLabel}
                    </Label>
                    <TooltipIcon text={TOOLTIPS.activityYear} />
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {ACTIVITY_COEFFICIENTS.map((a, i) => (
                      <button
                        key={i}
                        onClick={() => setCoeffIdx(i)}
                        className={`px-2 py-2 rounded-lg text-xs font-medium border transition-all ${
                          coeffIdx === i
                            ? "bg-primary/10 text-primary border-primary/40"
                            : "bg-background border-border/40 hover:bg-muted text-foreground"
                        }`}
                      >
                        <div className="truncate">{a.label.split(" / ")[0]}</div>
                        <div className="text-[10px] opacity-70">{(a.value * 100).toFixed(0)}%</div>
                      </button>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Info box */}
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 space-y-1.5">
                  <p className="text-xs font-bold text-primary uppercase tracking-wider">
                    {UI.inputs.guideLabel}
                  </p>
                  <ul className="text-[11px] text-muted-foreground space-y-1">
                    {UI.inputs.guide.map((item, i) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                </div>

              </CardContent>
            </Card>
          </div>

          {/* ── RIGHT: Results ─────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Main result with accent line */}
            <Card className="shadow-lg border-border/60 overflow-hidden">
              <CardContent className="p-0">
                <div className="flex">
                  {/* Accent bar */}
                  <div className="w-2 bg-linear-to-b from-primary via-primary to-transparent" />

                  <div className="flex-1 px-8 py-6">
                    <div className="flex items-center justify-between gap-6">
                      {/* Label */}
                      <div className="flex items-center gap-2 min-w-max">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                          {UI.results.monthlyNetTitle}
                        </p>
                        <TooltipIcon text={TOOLTIPS.netIncome} />
                      </div>

                      {/* Main amount */}
                      <div className="flex items-baseline gap-2 flex-1 justify-center">
                        <div className="text-4xl font-bold text-primary leading-none">
                          {(mainResult).toLocaleString("uk-UA", { maximumFractionDigits: 0 })}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          ≈ ${(mainResult * rate).toLocaleString("uk-UA", { maximumFractionDigits: 0 })}
                        </div>
                      </div>

                      {/* Gross & Rate */}
                      <div className="flex items-center gap-8 min-w-max">
                        <div>
                          <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold mb-1">
                            Валовий
                          </p>
                          <p className="text-lg font-bold text-foreground">
                            {(gross / 12).toLocaleString("uk-UA", { maximumFractionDigits: 0 })}€
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold mb-1">
                            Ставка
                          </p>
                          <p className="text-lg font-bold text-primary">
                            {pct(displayMode === "nhr" ? result.effectiveRateNHR : result.effectiveRateFL)}
                          </p>
                        </div>
                      </div>

                      {/* NHR Badge */}
                      {displayMode === "nhr" && (
                        <Badge className="bg-amber-500 text-white text-xs h-fit ml-auto">
                          {UI.results.nhrBadge}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detalhamento */}
            <Card className="shadow-lg border-border/60">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-sm">
                    {UI.results.detailsTitle}
                  </CardTitle>
                  <TooltipIcon text={TOOLTIPS.taxBurden} />
                </div>
              </CardHeader>
              <CardContent className="space-y-1.5">
                <div className="space-y-1">
                  {[
                    {
                      label: UI.results.grossIncome,
                      value: gross / 12,
                      color: "text-foreground",
                    },
                    {
                      label: UI.results.pdfoPD,
                      value: (displayMode === "nhr" ? result.irsNHR : result.irsFreelancer) / 12,
                      color: "text-red-600 dark:text-red-400",
                    },
                    {
                      label: UI.results.socialContribution,
                      value: result.socialSecurity / 12,
                      color: "text-amber-600 dark:text-amber-400",
                    },
                    {
                      label: UI.results.solidarityTax,
                      value: (displayMode === "nhr" ? result.solidarityNHR : result.solidarityFL) / 12,
                      color: "text-orange-500",
                    },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex justify-between items-center py-1 border-b border-border/40 last:border-0"
                    >
                      <span className="text-xs text-muted-foreground">{row.label}</span>
                      <div className={`${row.color} text-xs`}>
                        <PriceWithUSD amountEUR={row.value} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-2 flex justify-between items-center">
                  <span className="font-bold text-primary uppercase text-[10px] tracking-wider">
                    {UI.results.totalNet}
                  </span>
                  <div className="text-primary text-xs">
                    <PriceWithUSD amountEUR={mainResult} showFull={true} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Carga Fiscal (Tax burden bar) */}
            <Card className="shadow-lg border-border/60">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base">
                    {UI.results.taxBurdenTitle}
                  </CardTitle>
                  <TooltipIcon text={TOOLTIPS.taxBurden} />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">
                      {UI.results.distribution}:
                    </span>
                    <div className="text-muted-foreground">
                      <PriceWithUSD amountEUR={totalTaxes + result.socialSecurity} />
                      <span className="ml-2">
                        {pct((totalTaxes + result.socialSecurity) / gross)}
                      </span>
                    </div>
                  </div>
                  <div className="flex h-8 gap-0.5 rounded-lg overflow-hidden bg-muted">
                    <div
                      className="bg-emerald-500"
                      style={{
                        width: `${((displayMode === "nhr" ? result.netNHR : result.netFreelancer) / gross) * 100}%`,
                      }}
                      title={`${UI.results.totalNet}: ${fmtDec((displayMode === "nhr" ? result.netNHR : result.netFreelancer) / 12)}`}
                    />
                    <div
                      className="bg-primary"
                      style={{
                        width: `${(result.socialSecurity / gross) * 100}%`,
                      }}
                      title={`${UI.results.socialContribution}: ${fmtDec(result.socialSecurity / 12)}`}
                    />
                    <div
                      className="bg-red-500"
                      style={{
                        width: `${((displayMode === "nhr" ? result.irsNHR : result.irsFreelancer) / gross) * 100}%`,
                      }}
                      title={`${UI.results.pdfoPD}: ${fmtDec((displayMode === "nhr" ? result.irsNHR : result.irsFreelancer) / 12)}`}
                    />
                    <div
                      className="bg-orange-500"
                      style={{
                        width: `${((displayMode === "nhr" ? result.solidarityNHR : result.solidarityFL) / gross) * 100}%`,
                      }}
                      title={`${UI.results.solidarityTax}: ${fmtDec((displayMode === "nhr" ? result.solidarityNHR : result.solidarityFL) / 12)}`}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {UI.results.legend.map((item) => (
                      <div key={item.label} className="flex items-center gap-1.5">
                        <div
                          className={`w-2 h-2 rounded-full bg-${item.color}-500`}
                        />
                        <span>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Warning if high tax bracket */}
            {(displayMode === "nhr" ? result.effectiveRateNHR : result.effectiveRateFL) >
              0.35 && (
              <div className="flex gap-3 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-red-900 dark:text-red-400 mb-1">
                    {UI.results.warningTitle}
                  </p>
                  <p className="text-red-800 dark:text-red-300">
                    {UI.results.warningText(
                      displayMode === "nhr"
                        ? result.effectiveRateNHR
                        : result.effectiveRateFL
                    )}
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* ── Detailed Tabs ─────────────────────────────────── */}
        <Tabs defaultValue="breakdown" className="mb-12">
          <TabsList className="bg-muted border border-border/40">
            <TabsTrigger value="breakdown" className="text-xs sm:text-sm">
              {UI.tabs.distribution}
            </TabsTrigger>
            <TabsTrigger value="reverse" className="text-xs sm:text-sm">
              {UI.tabs.reverse}
            </TabsTrigger>
            <TabsTrigger value="years" className="text-xs sm:text-sm">
              {UI.tabs.years}
            </TabsTrigger>
            <TabsTrigger value="brackets" className="text-xs sm:text-sm">
              {UI.tabs.brackets}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="breakdown" className="mt-4">
            <Card className="shadow-lg border-border/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">
                  {UI.tabsContent.distributionTitle}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BreakdownBar result={result} mode={displayMode} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reverse" className="mt-4">
            <Card className="shadow-lg border-border/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">
                  {UI.tabsContent.reverseTitle}
                </CardTitle>
                <CardDescription className="text-xs">
                  {UI.tabsContent.reverseHelper}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ReverseCalculator
                  activityYear={activityYear}
                  hasNHR={hasNHR}
                  coefficient={coefficient}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="years" className="mt-4">
            <Card className="shadow-lg border-border/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">
                  {UI.tabsContent.yearsTitle}
                </CardTitle>
                <CardDescription className="text-xs">
                  {UI.tabsContent.yearsHelper}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ComparisonTable
                  grossAnnual={gross}
                  hasNHR={hasNHR}
                  coefficient={coefficient}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="brackets" className="mt-4">
            <Card className="shadow-lg border-border/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">
                  {UI.tabsContent.bracketsTitle}
                </CardTitle>
                <CardDescription className="text-xs">
                  {UI.tabsContent.bracketsHelper}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BracketVisualizer taxableIncome={result.taxableBaseReduced} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* ── Footer ───────────────────────────────────────────── */}
        <footer className="text-center py-8 border-t border-border/20 text-xs text-muted-foreground">
          <p>{UI.footer.copyright}</p>
        </footer>

      </main>
    </div>
  )
}
