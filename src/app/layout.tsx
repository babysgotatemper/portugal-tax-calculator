import type { Metadata } from "next"
import { Inter, Geist_Mono } from "next/font/google"
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

export const metadata: Metadata = {
  title: "Portugal Tax Calculator — IRS 2025",
  description:
    "Calculate your net income as a freelancer or NHR resident in Portugal. IRS 2025 progressive tax brackets, Segurança Social, and NHR 20% flat rate.",
  openGraph: {
    title: "Portugal Tax Calculator — IRS 2025",
    description: "Freelancer / NHR tax calculator for Portugal",
    siteName: "PT Tax Calc",
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="uk"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
