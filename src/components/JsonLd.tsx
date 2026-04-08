const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://portugal-tax-calculator.vercel.app"

export function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Portugal Tax Calculator",
    alternateName: [
      "PT Tax Calc",
      "Portugal Freelancer Tax Calculator",
      "Portugal Gross Net Calculator",
    ],
    url: SITE_URL,
    description:
      "Calculate gross and net income for freelancers, self-employed workers and NHR residents in Portugal. " +
      "Includes IRS 2025, Segurança Social, NHR 20%, solidarity surcharge, deductions and USD equivalent.",
    applicationCategory: "FinanceApplication",
    featureList: [
      "Portugal freelancer gross to net calculation",
      "Net to gross reverse calculation",
      "IRS 2025 progressive tax brackets",
      "NHR 20% flat rate mode",
      "Segurança Social estimate",
      "Tax deductions",
      "EUR to USD equivalent display",
    ],
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
    },
    inLanguage: ["uk", "pt", "en"],
    keywords:
      "portugal tax calculator, IRS 2025, NHR portugal, freelancer portugal taxes, self employed portugal, segurança social, gross net calculator portugal",
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
