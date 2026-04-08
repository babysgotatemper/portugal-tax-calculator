import type { Metadata } from "next"
import { Inter, Geist_Mono } from "next/font/google"
import { Suspense } from "react"
import { Analytics } from "@/components/Analytics"
import { JsonLd } from "@/components/JsonLd"
import "./globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://portugal-tax-calculator.vercel.app"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "Portugal Tax Calculator — Freelancer, NHR, IRS 2025",
    template: "%s | PT Tax Calc",
  },
  description:
    "Калькулятор податків у Португалії для фрілансерів, self-employed та NHR: " +
    "net і gross дохід, IRS 2025, Segurança Social, solidarity surcharge, відрахування та USD еквівалент.",
  keywords: [
    "portugal tax calculator",
    "IRS 2025",
    "NHR portugal",
    "freelancer portugal taxes",
    "self employed portugal tax",
    "segurança social",
    "portugal income tax",
    "portugal freelancer calculator",
    "portugal net salary calculator",
    "gross net calculator portugal",
    "калькулятор податків португалія",
    "податки фрілансер португалія",
    "NHR португалія",
    "IRS португалія 2025",
  ],
  category: "finance",
  authors: [{ name: "PT Tax Calc" }],
  creator: "PT Tax Calc",
  publisher: "PT Tax Calc",

  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/favicon.svg",
  },

  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "PT Tax Calc",
    title: "Portugal Tax Calculator — Freelancer, NHR, IRS 2025",
    description:
      "Розрахунок net і gross доходу у Португалії: IRS 2025, Segurança Social, NHR 20%, " +
      "податкові відрахування, effective tax rate та порівняння по роках.",
    locale: "uk_UA",
  },

  twitter: {
    card: "summary_large_image",
    title: "Portugal Tax Calculator — Freelancer, NHR, IRS 2025",
    description:
      "Gross/net калькулятор для Португалії: freelancer, NHR, IRS 2025, Segurança Social і USD еквівалент.",
    creator: "@pttaxcalc",
  },

  alternates: {
    canonical: SITE_URL,
  },

  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="uk"
      className={`${inter.variable} ${geistMono.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <JsonLd />
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
        {children}
      </body>
    </html>
  )
}
