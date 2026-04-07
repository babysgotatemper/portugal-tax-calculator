"use client"

import { useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { calcAll } from "@/lib/taxEngine"
import { ACTIVITY_COEFFICIENTS } from "@/lib/brackets"
import { BreakdownBar } from "@/components/BreakdownBar"
import { ComparisonTable } from "@/components/ComparisonTable"
import { BracketVisualizer } from "@/components/BracketVisualizer"
import { ReverseCalculator } from "@/components/ReverseCalculator"

const fmt = (n: number) =>
  n.toLocaleString("pt-PT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 })

const pct = (n: number) => `${(n * 100).toFixed(1)}%`

export default function Home() {
  const [gross, setGross] = useState(80000)
  const [activityYear, setActivityYear] = useState<1 | 2 | 3>(1)
  const [hasNHR, setHasNHR] = useState(false)
  const [coeffIdx, setCoeffIdx] = useState(0)

  const coefficient = ACTIVITY_COEFFICIENTS[coeffIdx].value
  const result = calcAll({ grossAnnual: gross, activityYear, hasNHR, coefficient })
  const displayMode: "freelancer" | "nhr" = result.bestMode

  return (
    <div className="gradient-hero min-h-screen">

      {/* ── Header ───────────────────────────────────────────── */}
      <header className="glass border-b border-border/50 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl leading-none">🇵🇹</span>
            <div className="leading-tight">
              <span className="font-bold text-sm tracking-tight">PT Tax Calc</span>
              <span className="hidden sm:inline text-muted-foreground text-xs ml-2">IRS 2025</span>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-1.5">
            <Badge
              variant="outline"
              className="text-[10px] border-primary/30 text-primary bg-primary/5 hidden sm:flex"
            >
              CIRS 2025
            </Badge>
            <Badge
              variant="outline"
              className="text-[10px] text-muted-foreground hidden sm:flex"
            >
              Not financial advice
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-6">

        {/* ── Hero ─────────────────────────────────────────────── */}
        <div className="text-center space-y-2 pt-2 pb-4">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Калькулятор податків{" "}
            <span className="text-primary">Португалії</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto">
            Freelancer та NHR режими — IRS, Segurança Social, ефективна ставка
          </p>
        </div>

        {/* ── Inputs ───────────────────────────────────────────── */}
        <Card className="shadow-sm border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Параметри
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-7 pt-2">

            {/* Gross slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-baseline">
                <Label className="text-sm font-medium">Gross дохід / рік</Label>
                <span className="text-3xl font-bold tabular-nums text-primary">{fmt(gross)}</span>
              </div>
              <Slider
                min={10000}
                max={300000}
                step={1000}
                value={[gross]}
                onValueChange={(v) => setGross(Array.isArray(v) ? v[0] : v)}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>10 000 €</span>
                <span>300 000 €</span>
              </div>
            </div>

            <Separator />

            {/* Activity year + NHR */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">

              <div className="flex flex-col gap-1.5">
                <Label className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
                  Рік активності
                </Label>
                <div className="flex gap-2">
                  {([1, 2, 3] as const).map((y) => (
                    <button
                      key={y}
                      onClick={() => setActivityYear(y)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
                        activityYear === y
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "border-border bg-background hover:bg-muted text-foreground"
                      }`}
                    >
                      {y === 3 ? "3+" : y} рік
                    </button>
                  ))}
                </div>
                {activityYear === 1 && (
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    ✓ Seg. Social = 0 · IRS знижка 50%
                  </p>
                )}
                {activityYear === 2 && (
                  <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                    IRS знижка 25%
                  </p>
                )}
              </div>

              <div className="hidden sm:block w-px h-10 bg-border" />

              <div className="flex flex-col gap-1.5">
                <Label className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
                  NHR статус
                </Label>
                <div className="flex items-center gap-2.5">
                  <Switch id="nhr" checked={hasNHR} onCheckedChange={setHasNHR} />
                  <Label htmlFor="nhr" className="cursor-pointer text-sm">
                    {hasNHR ? (
                      <span className="text-primary font-semibold">Увімкнено · 20% flat</span>
                    ) : (
                      <span className="text-muted-foreground">Вимкнено</span>
                    )}
                  </Label>
                </div>
              </div>
            </div>

            {/* Activity type chips */}
            <div className="space-y-2">
              <Label className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
                Тип активності
              </Label>
              <div className="flex flex-wrap gap-1.5">
                {ACTIVITY_COEFFICIENTS.map((a, i) => (
                  <button
                    key={i}
                    onClick={() => setCoeffIdx(i)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      coeffIdx === i
                        ? "bg-primary/10 text-primary border-primary/40 font-semibold"
                        : "bg-background border-border hover:bg-muted text-foreground"
                    }`}
                  >
                    {a.label}
                    <span className={`ml-1 ${coeffIdx === i ? "text-primary/70" : "text-muted-foreground"}`}>
                      {(a.value * 100).toFixed(0)}%
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </CardContent>
        </Card>

        {/* ── KPI summary cards ─────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          <Card className={`card-hover shadow-sm border-border/60 ${displayMode === "freelancer" ? "ring-2 ring-primary/30" : ""}`}>
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
                  Net / міс · FL
                </p>
                {displayMode === "freelancer" && (
                  <Badge className="bg-primary text-primary-foreground text-[10px] h-4 px-1.5 rounded-full">
                    Кращий
                  </Badge>
                )}
              </div>
              <p className="text-3xl font-bold tabular-nums text-primary leading-none">
                {fmt(result.netMonthlyFL)}
              </p>
              <p className="text-xs text-muted-foreground mt-1.5">{fmt(result.netFreelancer)} / рік</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Ставка <span className="font-semibold text-foreground">{pct(result.effectiveRateFL)}</span>
              </p>
            </CardContent>
          </Card>

          {hasNHR ? (
            <Card className={`card-hover shadow-sm border-border/60 ${displayMode === "nhr" ? "ring-2 ring-primary/30" : ""}`}>
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
                    Net / міс · NHR
                  </p>
                  {displayMode === "nhr" && (
                    <Badge className="bg-primary text-primary-foreground text-[10px] h-4 px-1.5 rounded-full">
                      Кращий
                    </Badge>
                  )}
                </div>
                <p className="text-3xl font-bold tabular-nums text-primary leading-none">
                  {fmt(result.netMonthlyNHR)}
                </p>
                <p className="text-xs text-muted-foreground mt-1.5">{fmt(result.netNHR)} / рік</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Ставка <span className="font-semibold text-foreground">{pct(result.effectiveRateNHR)}</span>
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-sm border-dashed border-border/50 opacity-45">
              <CardContent className="pt-5 pb-4">
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mb-2">
                  Net / міс · NHR
                </p>
                <p className="text-2xl font-bold text-muted-foreground">—</p>
                <p className="text-xs text-muted-foreground mt-1.5">Увімкніть NHR</p>
              </CardContent>
            </Card>
          )}

          <Card className="card-hover shadow-sm border-border/60">
            <CardContent className="pt-5 pb-4">
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mb-2">
                Seg. Social / рік
              </p>
              <p className="text-3xl font-bold tabular-nums text-amber-600 dark:text-amber-400 leading-none">
                {fmt(result.socialSecurity)}
              </p>
              <p className="text-xs text-muted-foreground mt-1.5">{fmt(result.socialSecurity / 12)} / міс</p>
              {activityYear === 1 ? (
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                  ✓ Рік 1 — звільнено
                </p>
              ) : (
                <p className="text-[11px] text-muted-foreground mt-0.5">21.4% від бази</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ── Tabs ─────────────────────────────────────────────── */}
        <Tabs defaultValue="breakdown">
          <TabsList className="bg-muted/60 border border-border/40 w-full sm:w-auto h-9">
            <TabsTrigger value="breakdown" className="text-xs">Розбивка</TabsTrigger>
            <TabsTrigger value="reverse"   className="text-xs">Зворотній</TabsTrigger>
            <TabsTrigger value="years"     className="text-xs">По роках</TabsTrigger>
            <TabsTrigger value="brackets"  className="text-xs">Шкала IRS</TabsTrigger>
          </TabsList>

          <TabsContent value="breakdown" className="mt-4">
            <Card className="shadow-sm border-border/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">
                  Розподіл доходу
                  {hasNHR && (
                    <span className="ml-2 font-normal text-muted-foreground text-xs">
                      ({displayMode === "nhr" ? "NHR" : "Freelancer"})
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <BreakdownBar result={result} mode={displayMode} />
                {hasNHR && (
                  <>
                    <Separator />
                    <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest">
                      Порівняння режимів
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground font-medium">Freelancer</p>
                        <BreakdownBar result={result} mode="freelancer" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground font-medium">NHR</p>
                        <BreakdownBar result={result} mode="nhr" />
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reverse" className="mt-4">
            <Card className="shadow-sm border-border/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Зворотній розрахунок</CardTitle>
                <CardDescription className="text-xs">
                  Введіть бажаний net — отримаєте потрібний gross
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
            <Card className="shadow-sm border-border/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Порівняння по роках</CardTitle>
                <CardDescription className="text-xs">
                  Gross {fmt(gross)} — як змінюються податки
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ComparisonTable grossAnnual={gross} hasNHR={hasNHR} coefficient={coefficient} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="brackets" className="mt-4">
            <Card className="shadow-sm border-border/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Шкала IRS 2025</CardTitle>
                <CardDescription className="text-xs">
                  Активні брекети для бази{" "}
                  <strong className="text-foreground">{fmt(result.taxableBaseReduced)}</strong>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BracketVisualizer taxableIncome={result.taxableBaseReduced} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* ── Footer ───────────────────────────────────────────── */}
        <footer className="text-center pb-8 space-y-1">
          <p className="text-[11px] text-muted-foreground">
            Розрахунки орієнтовні. Не враховує особисті відрахування, ПДВ (IVA), сімейний стан.
          </p>
          <p className="text-[11px] text-muted-foreground">
            Для точного розрахунку зверніться до <em>contabilista certificado</em>.
            Джерело: CIRS 2025, Segurança Social Portugal.
          </p>
        </footer>

      </main>
    </div>
  )
}
