const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://portugal-tax-calculator.vercel.app"

export function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Portugal Tax Calculator",
    url: SITE_URL,
    description:
      "Calculate net income as a freelancer or NHR resident in Portugal. " +
      "IRS 2025 progressive tax brackets, Segurança Social, NHR 20% flat rate.",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
    },
    inLanguage: ["uk", "pt", "en"],
    keywords:
      "portugal tax, IRS 2025, NHR, freelancer, segurança social, income tax calculator",
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
