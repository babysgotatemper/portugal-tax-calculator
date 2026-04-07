import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Portugal Tax Calculator — IRS 2025"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1a3a2a 0%, #0f2419 50%, #1a2f3a 100%)",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: -120,
            left: -120,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(45,106,79,0.35)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -100,
            right: -80,
            width: 340,
            height: 340,
            borderRadius: "50%",
            background: "rgba(233,196,106,0.15)",
          }}
        />

        {/* Flag stripe left */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 18,
            height: "100%",
            background: "#2d6a4f",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 18,
            top: 0,
            width: 8,
            height: "100%",
            background: "#cc0000",
          }}
        />

        {/* Flag emoji + title */}
        <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 28 }}>
          <span style={{ fontSize: 72 }}>🇵🇹</span>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: 58,
                fontWeight: 800,
                color: "#ffffff",
                letterSpacing: "-1px",
                lineHeight: 1,
              }}
            >
              PT Tax Calc
            </span>
            <span
              style={{
                fontSize: 26,
                color: "#86efac",
                marginTop: 8,
                fontWeight: 500,
                letterSpacing: "0.5px",
              }}
            >
              Freelancer · NHR · IRS 2025
            </span>
          </div>
        </div>

        {/* Stat chips */}
        <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
          {[
            { label: "IRS прогресивний", value: "13–48%" },
            { label: "NHR flat rate",    value: "20%" },
            { label: "Seg. Social",      value: "21.4%" },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 16,
                padding: "14px 28px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
              }}
            >
              <span style={{ fontSize: 32, fontWeight: 800, color: "#e9c46a" }}>{s.value}</span>
              <span style={{ fontSize: 15, color: "#94a3b8" }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  )
}
