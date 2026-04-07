import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Portugal Tax Calculator — IRS 2025"
export const size = { width: 1200, height: 600 }
export const contentType = "image/png"

export default function TwitterImage() {
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
            top: -100,
            left: -100,
            width: 350,
            height: 350,
            borderRadius: "50%",
            background: "rgba(45,106,79,0.35)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -80,
            right: -60,
            width: 280,
            height: 280,
            borderRadius: "50%",
            background: "rgba(233,196,106,0.15)",
          }}
        />

        {/* Flag stripe */}
        <div style={{ position: "absolute", left: 0, top: 0, width: 16, height: "100%", background: "#2d6a4f" }} />
        <div style={{ position: "absolute", left: 16, top: 0, width: 7, height: "100%", background: "#cc0000" }} />

        {/* Content */}
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
          <span style={{ fontSize: 64 }}>🇵🇹</span>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 52, fontWeight: 800, color: "#ffffff", letterSpacing: "-1px", lineHeight: 1 }}>
              PT Tax Calc
            </span>
            <span style={{ fontSize: 22, color: "#86efac", marginTop: 6, fontWeight: 500 }}>
              Freelancer · NHR · IRS 2025
            </span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 14 }}>
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
                borderRadius: 14,
                padding: "12px 24px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
              }}
            >
              <span style={{ fontSize: 28, fontWeight: 800, color: "#e9c46a" }}>{s.value}</span>
              <span style={{ fontSize: 13, color: "#94a3b8" }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  )
}
