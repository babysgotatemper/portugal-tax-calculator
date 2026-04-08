# Task: Add Analytics and UX Metrics

## Goal

Add analytics so we can understand how many people visit the site, which calculator actions they use, and where users may run into friction.

## Scope

- Connect Google Analytics 4 through `NEXT_PUBLIC_GA_ID`.
- Optionally connect Microsoft Clarity through `NEXT_PUBLIC_CLARITY_ID`.
- Track page views.
- Track key product events:
  - `income_period_change`
  - `activity_year_change`
  - `activity_type_change`
  - `nhr_toggle`
  - `tax_detail_tab_change`
  - `usd_toggle`
  - `donation_popup_view`
  - `donation_popup_close`
  - `donation_jar_link_click`
  - `donation_jar_button_click`
  - `donation_card_copy`
- Avoid sending exact income values. Use income buckets instead.
- Add `.env.example` with analytics environment variables.
- Document setup in `README.md`.

## Acceptance Criteria

- GA4 script does not load when `NEXT_PUBLIC_GA_ID` is empty.
- Clarity script does not load when `NEXT_PUBLIC_CLARITY_ID` is empty.
- Page views are visible in GA4 after setting `NEXT_PUBLIC_GA_ID`.
- Product events are visible in GA4 after user interactions.
- Clarity session recordings and heatmaps work after setting `NEXT_PUBLIC_CLARITY_ID`.
- Exact income values are not sent to analytics.
- `npm run lint` passes.
- `npm run build` passes.
