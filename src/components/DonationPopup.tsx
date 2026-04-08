"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Check, Copy, X } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { DONATION } from "@/lib/constants"

export function DonationPopup() {
  const [isVisible, setIsVisible] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  useEffect(() => {
    if (window.sessionStorage.getItem(DONATION.storageKey) === "true") {
      return
    }

    const timer = window.setTimeout(() => setIsVisible(true), DONATION.delayMs)

    return () => window.clearTimeout(timer)
  }, [])

  if (!isVisible) {
    return null
  }

  function closePopup() {
    window.sessionStorage.setItem(DONATION.storageKey, "true")
    setIsVisible(false)
  }

  async function copyCardNumber() {
    try {
      await navigator.clipboard.writeText(DONATION.cardNumber.replaceAll(" ", ""))
      setIsCopied(true)
      window.setTimeout(() => setIsCopied(false), 2000)
    } catch {
      setIsCopied(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="donation-popup-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 px-3 py-3 backdrop-blur-sm sm:px-4 sm:py-4"
    >
      <div className="relative grid max-h-[calc(100dvh-1.5rem)] w-full max-w-md overflow-hidden rounded-lg border border-border bg-card p-3 text-card-foreground shadow-2xl sm:max-w-3xl sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] sm:gap-5 sm:p-5">
        <button
          type="button"
          onClick={closePopup}
          aria-label={DONATION.closeLabel}
          className="absolute right-3 top-3 inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="size-4" />
        </button>

        <Image
          src={DONATION.imageSrc}
          alt={DONATION.imageAlt}
          width={1350}
          height={1687}
          priority={false}
          unoptimized
          className="mb-3 max-h-[34dvh] w-full rounded-lg border border-border/60 object-contain sm:mb-0 sm:h-full sm:max-h-[min(620px,calc(100dvh-4rem))] sm:object-cover"
        />

        <div className="min-w-0 pr-8 sm:flex sm:flex-col sm:justify-center sm:pr-6">
          <div className="space-y-1.5 sm:space-y-2">
            <p className="text-[0.7rem] font-bold uppercase tracking-widest text-primary sm:text-xs">
              {DONATION.subtitle}
            </p>
            <h2 id="donation-popup-title" className="text-lg font-semibold leading-tight sm:text-xl">
              {DONATION.title}
            </h2>
            <p className="text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">
              {DONATION.description}
            </p>
          </div>

          <div className="mt-3 space-y-2 rounded-lg border border-border/60 bg-muted/30 p-2.5 sm:mt-5 sm:space-y-3 sm:p-3">
            <div>
              <p className="mb-1 text-[0.65rem] font-bold uppercase tracking-widest text-muted-foreground sm:text-xs">
                {DONATION.jarLabel}
              </p>
              <a
                href={DONATION.jarUrl}
                target="_blank"
                rel="noreferrer"
                className="break-all text-xs font-semibold text-primary underline-offset-4 hover:underline sm:text-sm"
              >
                {DONATION.jarUrl}
              </a>
            </div>

            <div>
              <p className="mb-1 text-[0.65rem] font-bold uppercase tracking-widest text-muted-foreground sm:text-xs">
                {DONATION.cardLabel}
              </p>
              <p className="break-all font-mono text-xs font-semibold text-foreground sm:text-sm">
                {DONATION.cardNumber}
              </p>
            </div>
          </div>

          <div className="mt-3 grid gap-2 sm:mt-5 sm:grid-cols-2">
            <a
              href={DONATION.jarUrl}
              target="_blank"
              rel="noreferrer"
              className={buttonVariants({ size: "lg", className: "h-9 sm:h-10" })}
            >
              {DONATION.primaryAction}
            </a>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={copyCardNumber}
              className="h-9 sm:h-10"
            >
              {isCopied ? <Check className="size-4" /> : <Copy className="size-4" />}
              {isCopied ? DONATION.copiedAction : DONATION.copyAction}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
