"use client"

type AnalyticsValue = string | number | boolean | null | undefined
type AnalyticsParams = Record<string, AnalyticsValue>

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
    clarity?: (...args: unknown[]) => void
  }
}

export function trackEvent(name: string, params: AnalyticsParams = {}) {
  if (typeof window === "undefined") {
    return
  }

  window.gtag?.("event", name, params)
  window.clarity?.("event", name)
}

export function incomeBucket(grossAnnual: number) {
  if (grossAnnual < 25_000) return "under_25k"
  if (grossAnnual < 50_000) return "25k_50k"
  if (grossAnnual < 100_000) return "50k_100k"
  if (grossAnnual < 200_000) return "100k_200k"
  return "over_200k"
}
