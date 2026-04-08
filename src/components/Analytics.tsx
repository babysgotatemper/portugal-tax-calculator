"use client"

import { useEffect } from "react"
import Script from "next/script"
import { usePathname, useSearchParams } from "next/navigation"

const GA_ID = process.env.NEXT_PUBLIC_GA_ID
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID

export function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!GA_ID) {
      return
    }

    const query = searchParams.toString()
    const pagePath = query ? `${pathname}?${query}` : pathname

    let attempts = 0

    function sendPageView() {
      attempts += 1

      if (!window.gtag) {
        return attempts >= 10
      }

      window.gtag("config", GA_ID, {
        page_path: pagePath,
      })

      return true
    }

    if (sendPageView()) {
      return
    }

    const retry = window.setInterval(() => {
      if (sendPageView()) {
        window.clearInterval(retry)
      }
    }, 250)

    return () => window.clearInterval(retry)
  }, [pathname, searchParams])

  return (
    <>
      {GA_ID ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script
            id="ga4-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){window.dataLayer.push(arguments);}
                window.gtag = gtag;
                gtag('js', new Date());
                gtag('config', ${JSON.stringify(GA_ID)}, { send_page_view: false });
              `,
            }}
          />
        </>
      ) : null}

      {CLARITY_ID ? (
        <Script
          id="clarity-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", ${JSON.stringify(CLARITY_ID)});
            `,
          }}
        />
      ) : null}
    </>
  )
}
