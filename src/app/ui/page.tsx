import type { Metadata } from "next"
import type { CSSProperties } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "UI Palette",
  description: "Кольорова гама проекту Portugal Tax Calculator.",
}

type ColorToken = {
  name: string
  cssVar: string
  value: {
    light: string
    dark: string
  }
  note?: string
}

type PaletteSection = {
  title: string
  description: string
  tokens: ColorToken[]
}

const sections: PaletteSection[] = [
  {
    title: "Core",
    description: "Основні кольори інтерфейсу, тексту та поверхонь.",
    tokens: [
      {
        name: "Background",
        cssVar: "--background",
        value: { light: "#f5f7f7", dark: "#0d1117" },
        note: "Базовий фон сторінок",
      },
      {
        name: "Foreground",
        cssVar: "--foreground",
        value: { light: "#1a1a1a", dark: "#e6e6e6" },
        note: "Основний текст",
      },
      {
        name: "Card",
        cssVar: "--card",
        value: { light: "#ffffff", dark: "#161b22" },
        note: "Поверхні карток",
      },
      {
        name: "Muted",
        cssVar: "--muted",
        value: { light: "#e8eaea", dark: "#30363d" },
        note: "Нейтральні підкладки",
      },
      {
        name: "Muted Foreground",
        cssVar: "--muted-foreground",
        value: { light: "#666666", dark: "#8b949e" },
        note: "Другорядний текст",
      },
    ],
  },
  {
    title: "Brand",
    description: "Брендові акценти Luso Ledger: зелений, червоний і золотий.",
    tokens: [
      {
        name: "Primary",
        cssVar: "--primary",
        value: { light: "#006633", dark: "#00cc66" },
        note: "Португальський зелений",
      },
      {
        name: "Primary Foreground",
        cssVar: "--primary-foreground",
        value: { light: "#ffffff", dark: "#001a0d" },
        note: "Текст на primary",
      },
      {
        name: "Secondary",
        cssVar: "--secondary",
        value: { light: "#9e3039", dark: "#ff6b6b" },
        note: "Luso red",
      },
      {
        name: "Secondary Foreground",
        cssVar: "--secondary-foreground",
        value: { light: "#ffffff", dark: "#ffffff" },
        note: "Текст на secondary",
      },
      {
        name: "Accent",
        cssVar: "--accent",
        value: { light: "#d4af37", dark: "#e9c46a" },
        note: "Золотий акцент",
      },
      {
        name: "Accent Foreground",
        cssVar: "--accent-foreground",
        value: { light: "#1a1a1a", dark: "#1a1a1a" },
        note: "Текст на accent",
      },
    ],
  },
  {
    title: "Controls",
    description: "Станові кольори для полів, рамок, фокусу та помилок.",
    tokens: [
      {
        name: "Border",
        cssVar: "--border",
        value: { light: "#d0d0d0", dark: "#30363d" },
        note: "Лінії й розділювачі",
      },
      {
        name: "Input",
        cssVar: "--input",
        value: { light: "#e8eaea", dark: "#21262d" },
        note: "Поля вводу",
      },
      {
        name: "Ring",
        cssVar: "--ring",
        value: { light: "#006633", dark: "#00cc66" },
        note: "Фокус",
      },
      {
        name: "Destructive",
        cssVar: "--destructive",
        value: { light: "#dc2626", dark: "#f85149" },
        note: "Помилки та небезпечні дії",
      },
      {
        name: "Popover",
        cssVar: "--popover",
        value: { light: "#ffffff", dark: "#161b22" },
        note: "Випадаючі поверхні",
      },
    ],
  },
  {
    title: "Charts",
    description: "Кольори для графіків, порівнянь і візуальних розкладок.",
    tokens: [
      {
        name: "Chart 1",
        cssVar: "--chart-1",
        value: { light: "#006633", dark: "#00cc66" },
      },
      {
        name: "Chart 2",
        cssVar: "--chart-2",
        value: { light: "#9e3039", dark: "#ff6b6b" },
      },
      {
        name: "Chart 3",
        cssVar: "--chart-3",
        value: { light: "#d4af37", dark: "#e9c46a" },
      },
      {
        name: "Chart 4",
        cssVar: "--chart-4",
        value: { light: "#0066cc", dark: "#4da6ff" },
      },
      {
        name: "Chart 5",
        cssVar: "--chart-5",
        value: { light: "#6b4499", dark: "#b299cc" },
      },
    ],
  },
  {
    title: "Sidebar",
    description: "Окремий набір для майбутніх навігаційних поверхонь.",
    tokens: [
      {
        name: "Sidebar",
        cssVar: "--sidebar",
        value: { light: "#f5f7f7", dark: "#161b22" },
      },
      {
        name: "Sidebar Foreground",
        cssVar: "--sidebar-foreground",
        value: { light: "#1a1a1a", dark: "#e6e6e6" },
      },
      {
        name: "Sidebar Primary",
        cssVar: "--sidebar-primary",
        value: { light: "#006633", dark: "#00cc66" },
      },
      {
        name: "Sidebar Accent",
        cssVar: "--sidebar-accent",
        value: { light: "#e8eaea", dark: "#30363d" },
      },
      {
        name: "Sidebar Border",
        cssVar: "--sidebar-border",
        value: { light: "#d0d0d0", dark: "#30363d" },
      },
    ],
  },
]

const lightThemeVars = {
  "--primary": "#006633",
  "--primary-foreground": "#ffffff",
  "--background": "#f5f7f7",
  "--foreground": "#1a1a1a",
  "--card": "#ffffff",
  "--card-foreground": "#1a1a1a",
  "--popover": "#ffffff",
  "--popover-foreground": "#1a1a1a",
  "--secondary": "#9e3039",
  "--secondary-foreground": "#ffffff",
  "--muted": "#e8eaea",
  "--muted-foreground": "#666666",
  "--accent": "#d4af37",
  "--accent-foreground": "#1a1a1a",
  "--destructive": "#dc2626",
  "--border": "#d0d0d0",
  "--input": "#e8eaea",
  "--ring": "#006633",
  "--chart-1": "#006633",
  "--chart-2": "#9e3039",
  "--chart-3": "#d4af37",
  "--chart-4": "#0066cc",
  "--chart-5": "#6b4499",
  "--sidebar": "#f5f7f7",
  "--sidebar-foreground": "#1a1a1a",
  "--sidebar-primary": "#006633",
  "--sidebar-primary-foreground": "#ffffff",
  "--sidebar-accent": "#e8eaea",
  "--sidebar-accent-foreground": "#1a1a1a",
  "--sidebar-border": "#d0d0d0",
  "--sidebar-ring": "#006633",
} as CSSProperties

const darkThemeVars = {
  "--primary": "#00cc66",
  "--primary-foreground": "#001a0d",
  "--background": "#0d1117",
  "--foreground": "#e6e6e6",
  "--card": "#161b22",
  "--card-foreground": "#e6e6e6",
  "--popover": "#161b22",
  "--popover-foreground": "#e6e6e6",
  "--secondary": "#ff6b6b",
  "--secondary-foreground": "#ffffff",
  "--muted": "#30363d",
  "--muted-foreground": "#8b949e",
  "--accent": "#e9c46a",
  "--accent-foreground": "#1a1a1a",
  "--destructive": "#f85149",
  "--border": "#30363d",
  "--input": "#21262d",
  "--ring": "#00cc66",
  "--chart-1": "#00cc66",
  "--chart-2": "#ff6b6b",
  "--chart-3": "#e9c46a",
  "--chart-4": "#4da6ff",
  "--chart-5": "#b299cc",
  "--sidebar": "#161b22",
  "--sidebar-foreground": "#e6e6e6",
  "--sidebar-primary": "#00cc66",
  "--sidebar-primary-foreground": "#001a0d",
  "--sidebar-accent": "#30363d",
  "--sidebar-accent-foreground": "#e6e6e6",
  "--sidebar-border": "#30363d",
  "--sidebar-ring": "#00cc66",
} as CSSProperties

function ColorSwatch({
  token,
  mode,
}: {
  token: ColorToken
  mode: "light" | "dark"
}) {
  return (
    <div className="rounded-lg border border-border/60 bg-card p-3">
      <div
        className="mb-3 h-20 rounded-md border border-foreground/10"
        style={{ backgroundColor: `var(${token.cssVar})` }}
      />
      <div className="space-y-1">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-sm font-semibold leading-tight">{token.name}</h3>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
            {token.value[mode]}
          </code>
        </div>
        <p className="text-xs text-muted-foreground">{token.cssVar}</p>
        {token.note ? (
          <p className="text-xs leading-relaxed text-muted-foreground">{token.note}</p>
        ) : null}
      </div>
    </div>
  )
}

function PalettePreview({ mode }: { mode: "light" | "dark" }) {
  const bars = ["--chart-1", "--chart-2", "--chart-3", "--chart-4", "--chart-5"]

  return (
    <div className="rounded-lg border border-border/70 bg-card p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">Portugal Tax Calculator</p>
          <p className="text-xs text-muted-foreground">
            {mode === "light" ? "Світлий режим" : "Темний режим"}
          </p>
        </div>
        <div className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
          Primary
        </div>
      </div>
      <div className="mb-4 grid grid-cols-3 gap-2">
        <div className="rounded-md bg-primary p-3 text-xs font-semibold text-primary-foreground">
          Primary
        </div>
        <div className="rounded-md bg-secondary p-3 text-xs font-semibold text-secondary-foreground">
          Secondary
        </div>
        <div className="rounded-md bg-accent p-3 text-xs font-semibold text-accent-foreground">
          Accent
        </div>
      </div>
      <div className="flex h-3 overflow-hidden rounded-full bg-muted">
        {bars.map((bar) => (
          <div
            key={bar}
            className="flex-1"
            style={{ backgroundColor: `var(${bar})` }}
          />
        ))}
      </div>
    </div>
  )
}

function PaletteMode({
  mode,
  className,
}: {
  mode: "light" | "dark"
  className?: string
}) {
  return (
    <section
      className={cn(
        "rounded-xl border border-border/70 bg-background p-4 text-foreground sm:p-6",
        className
      )}
      style={mode === "light" ? lightThemeVars : darkThemeVars}
    >
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            {mode === "light" ? "Light theme" : "Dark theme"}
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            {mode === "light" ? "Світла палітра" : "Темна палітра"}
          </h2>
        </div>
        <div className="w-full lg:max-w-md">
          <PalettePreview mode={mode} />
        </div>
      </div>

      <div className="space-y-6">
        {sections.map((section) => (
          <Card key={section.title} className="border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
              <CardDescription>{section.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {section.tokens.map((token) => (
                  <ColorSwatch key={token.cssVar} token={token} mode={mode} />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

export default function UiPage() {
  return (
    <main className="gradient-hero min-h-screen px-4 py-8 sm:px-6 lg:py-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">
            UI
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Кольорова гама проекту
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
            Semantic-токени з `globals.css`, їхні hex-значення та коротке
            призначення для світлої і темної тем.
          </p>
        </header>

        <div className="grid gap-8">
          <PaletteMode mode="light" />
          <PaletteMode mode="dark" className="dark" />
        </div>
      </div>
    </main>
  )
}
