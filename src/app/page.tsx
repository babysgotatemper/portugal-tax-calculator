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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50 dark:from-slate-950 dark:via-slate-900 dark:to-green-950">
      {/* Header */}
      <header className="border-b border-border/60 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
          <span className="text-3xl">🇵🇹</span>
          <div>
            <h1 className="text-lg font-bold leading-tight">Portugal Tax Calculator</h1>
            <p className="text-xs text-muted-foreground">Freelancer / NHR — IRS 2025</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Badge variant="outline" className="text-xs hidden sm:flex">CIRS 2025</Badge>
            <Badge variant="outline" className="text-xs hidden sm:flex">Not financial advice</Badge>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Inputs Card */}
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Параметри</CardTitle>
            <CardDescription>Введіть свої дані для розрахунку</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Gross Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-medium">Gross дохід / рік</Label>
                <span className="text-2xl font-bold text-primary tabular-nums">{fmt(gross)}</span>
              </div>
              <Slider
                min={10000}
                max={300000}
                step={1000}
                value={[gross]}
                onValueChange={(v) => setGross(Array.isArray(v) ? v[0] : v)}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>10 000 €</span>
                <span>300 000 €</span>
              </div>
            </div>

            <Separator />

            {/* Activity year */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <Label className="text-sm font-medium min-w-max">Рік активності</Label>
              <div className="flex gap-2">
                {([1, 2, 3] as const).map((y) => (
                  <button
                    key={y}
                    onClick={() => setActivityYear(y)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                      activityYear === y
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "bg-background border-border hover:bg-muted"
                    }`}
                  >
                    {y === 3 ? "3+" : y} рік
                  </button>
                ))}
              </div>
              {activityYear === 1 && (
                <span className="text-xs text-emerald-600 font-medium">
                  ✓ Seg. Social = 0 | IRS знижка 50%
                </span>
              )}
              {activityYear === 2 && (
                <span className="text-xs text-amber-600 font-medium">
                  IRS знижка 25%
                </span>
              )}
            </div>

            {/* NHR toggle */}
            <div className="flex items-center gap-3">
              <Switch
                id="nhr"
                checked={hasNHR}
                onCheckedChange={setHasNHR}
              />
              <Label htmlFor="nhr" className="cursor-pointer">
                <span className="font-medium">NHR статус</span>
                <span className="ml-2 text-sm text-muted-foreground">— фіксована ставка 20%</span>
              </Label>
            </div>

            {/* Activity type */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Тип активності</Label>
              <div className="flex flex-wrap gap-2">
                {ACTIVITY_COEFFICIENTS.map((a, i) => (
                  <button
                    key={i}
                    onClick={() => setCoeffIdx(i)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      coeffIdx === i
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-border hover:bg-muted"
                    }`}
                  >
                    {a.label}
                    <span className={`ml-1.5 ${coeffIdx === i ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                      ({(a.value * 100).toFixed(0)}%)
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className={`shadow-sm ${displayMode === "freelancer" ? "ring-2 ring-emerald-500/30" : ""}`}>
            <CardContent className="pt-5 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Net / місяць (FL)</p>
                {displayMode === "freelancer" && (
                  <Badge className="bg-emerald-500 text-white text-xs">Кращий</Badge>
                )}
              </div>
              <p className="text-3xl font-bold tabular-nums text-emerald-600">{fmt(result.netMonthlyFL)}</p>
              <p className="text-sm text-muted-foreground">{fmt(result.netFreelancer)} / рік</p>
              <p className="text-xs text-muted-foreground">Ефективна ставка {pct(result.effectiveRateFL)}</p>
            </CardContent>
          </Card>

          {hasNHR ? (
            <Card className={`shadow-sm ${displayMode === "nhr" ? "ring-2 ring-emerald-500/30" : ""}`}>
              <CardContent className="pt-5 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Net / місяць (NHR)</p>
                  {displayMode === "nhr" && (
                    <Badge className="bg-emerald-500 text-white text-xs">Кращий</Badge>
                  )}
                </div>
                <p className="text-3xl font-bold tabular-nums text-emerald-600">{fmt(result.netMonthlyNHR)}</p>
                <p className="text-sm text-muted-foreground">{fmt(result.netNHR)} / рік</p>
                <p className="text-xs text-muted-foreground">Ефективна ставка {pct(result.effectiveRateNHR)}</p>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-sm opacity-50">
              <CardContent className="pt-5 space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Net / місяць (NHR)</p>
                <p className="text-2xl font-bold text-muted-foreground">—</p>
                <p className="text-sm text-muted-foreground">Увімкніть NHR для порівняння</p>
              </CardContent>
            </Card>
          )}

          <Card className="shadow-sm">
            <CardContent className="pt-5 space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Seg. Social / рік</p>
              <p className="text-3xl font-bold tabular-nums text-amber-600">{fmt(result.socialSecurity)}</p>
              <p className="text-sm text-muted-foreground">{fmt(result.socialSecurity / 12)} / міс</p>
              {activityYear === 1 && (
                <p className="text-xs text-emerald-600 font-medium">✓ Рік 1 — звільнено</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Breakdown + Details */}
        <Tabs defaultValue="breakdown">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="breakdown">Розбивка</TabsTrigger>
            <TabsTrigger value="reverse">Зворотній</TabsTrigger>
            <TabsTrigger value="years">По роках</TabsTrigger>
            <TabsTrigger value="brackets">Шкала IRS</TabsTrigger>
          </TabsList>

          <TabsContent value="breakdown" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Розподіл доходу
                  {hasNHR && (
                    <span className="ml-2 text-sm font-normal text-muted-foreground">
                      — показано {displayMode === "nhr" ? "NHR" : "Freelancer"} режим
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BreakdownBar result={result} mode={displayMode} />

                {hasNHR && (
                  <>
                    <Separator className="my-6" />
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-4">Порівняння режимів</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <p className="text-xs text-muted-foreground mb-2 font-medium">Freelancer</p>
                        <BreakdownBar result={result} mode="freelancer" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-2 font-medium">NHR</p>
                        <BreakdownBar result={result} mode="nhr" />
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reverse" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Зворотній розрахунок</CardTitle>
                <CardDescription>Введіть бажаний net — отримаєте потрібний gross</CardDescription>
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
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Порівняння по роках</CardTitle>
                <CardDescription>Gross {fmt(gross)} — як змінюються податки</CardDescription>
              </CardHeader>
              <CardContent>
                <ComparisonTable grossAnnual={gross} hasNHR={hasNHR} coefficient={coefficient} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="brackets" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Шкала IRS 2025</CardTitle>
                <CardDescription>
                  Підсвічено активні брекети для бази{" "}
                  <strong>{fmt(result.taxableBaseReduced)}</strong>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BracketVisualizer taxableIncome={result.taxableBaseReduced} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Disclaimer */}
        <p className="text-xs text-muted-foreground text-center pb-4">
          Калькулятор є орієнтовним. Не враховує особисті відрахування, ПДВ, сімейний стан.{" "}
          <br className="hidden sm:block" />
          Для точних розрахунків зверніться до <em>contabilista certificado</em>.
          Джерело: CIRS 2025, Segurança Social Portugal.
        </p>
      </main>
    </div>
  )
}
