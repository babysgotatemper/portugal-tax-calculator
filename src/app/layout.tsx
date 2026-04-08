import type { Metadata } from "next"
import { Inter, Geist_Mono } from "next/font/google"
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
    default: "Portugal Tax Calculator — IRS 2025",
    template: "%s | PT Tax Calc",
  },
  description:
    "Розрахуй свій net дохід як фрілансер або NHR резидент у Португалії. " +
    "Прогресивна шкала IRS 2025, Segurança Social та NHR flat rate 20%.",
  keywords: [
    "portugal tax calculator",
    "IRS 2025",
    "NHR portugal",
    "freelancer portugal taxes",
    "segurança social",
    "portugal income tax",
    "калькулятор податків португалія",
  ],
  authors: [{ name: "PT Tax Calc" }],
  creator: "PT Tax Calc",

  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/favicon.svg",
  },

  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "PT Tax Calc",
    title: "Portugal Tax Calculator — IRS 2025",
    description:
      "Freelancer та NHR режими: IRS, Segurança Social, ефективна ставка. " +
      "Зворотній розрахунок та порівняння по роках.",
    locale: "uk_UA",
  },

  twitter: {
    card: "summary_large_image",
    title: "Portugal Tax Calculator — IRS 2025",
    description: "Freelancer та NHR: IRS 2025, Seg. Social, net / місяць",
    creator: "@pttaxcalc",
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
        {children}
      </body>
    </html>
  )
}
