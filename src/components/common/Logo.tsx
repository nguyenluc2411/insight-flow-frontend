"use client"

import { useId } from "react"
import { cn } from "@/lib/utils"

// ─── LogoMark — squircle gradient icon ────────────────────────────────────────

interface LogoMarkProps {
  size?: number
  className?: string
}

export function LogoMark({ size = 32, className }: LogoMarkProps) {
  const uid = useId().replace(/:/g, "")
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-label="InsightFlow AI"
      className={cn("block shrink-0", className)}
    >
      <defs>
        <linearGradient id={`lm-bg-${uid}`} x1="4" y1="2" x2="44" y2="46" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366F1" />
          <stop offset="0.55" stopColor="#4F46E5" />
          <stop offset="1" stopColor="#7C3AED" />
        </linearGradient>
        <linearGradient id={`lm-sh-${uid}`} x1="0" y1="0" x2="0" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" stopOpacity="0.22" />
          <stop offset="0.5" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* squircle background */}
      <rect width="48" height="48" rx="13" fill={`url(#lm-bg-${uid})`} />
      <rect width="48" height="48" rx="13" fill={`url(#lm-sh-${uid})`} />
      {/* rising bar chart */}
      <rect x="11"    y="28" width="6.5" height="9"  rx="3.25" fill="#fff" fillOpacity="0.55" />
      <rect x="20.75" y="22" width="6.5" height="15" rx="3.25" fill="#fff" fillOpacity="0.78" />
      <rect x="30.5"  y="15" width="6.5" height="22" rx="3.25" fill="#fff" />
      {/* insight dot */}
      <circle cx="33.75" cy="9" r="6.5" fill="#fff" fillOpacity="0.18" />
      <circle cx="33.75" cy="9" r="3.3"  fill="#fff" />
    </svg>
  )
}

// ─── Logo — full lockup: icon + wordmark + AI chip ────────────────────────────

interface LogoProps {
  size?: number
  /** true = white wordmark for dark backgrounds (footer, hero) */
  light?: boolean
  className?: string
}

export function Logo({ size = 32, light = false, className }: LogoProps) {
  const fs   = Math.round(size * 0.55)   // wordmark font size
  const chip = Math.round(size * 0.42)   // AI chip font size
  const gap  = Math.round(size * 0.28)   // gap between icon and text
  const igap = Math.round(size * 0.18)   // gap between wordmark and chip
  const cpy  = Math.round(size * 0.13)   // chip padding Y
  const cpx  = Math.round(size * 0.22)   // chip padding X
  const crx  = Math.round(size * 0.2)    // chip border-radius

  return (
    <div className={cn("flex items-center select-none", className)} style={{ gap }}>
      <LogoMark size={size} />

      <div className="flex items-center" style={{ gap: igap }}>
        {/* wordmark */}
        <span
          className="font-display font-bold leading-none"
          style={{ fontSize: fs, letterSpacing: "-0.02em" }}
        >
          <span style={{ color: light ? "#fff" : "#0F172A" }}>Insight</span>
          <span
            className={light ? "" : "gradient-text"}
            style={light ? { color: "#c7d2fe" } : undefined}
          >
            Flow
          </span>
        </span>

        {/* AI chip */}
        <span
          className="font-display font-bold leading-none"
          style={{
            fontSize: chip,
            letterSpacing: "0.04em",
            color:      light ? "#fff"     : "#4338CA",
            background: light ? "rgba(255,255,255,0.16)" : "#EEF2FF",
            padding:    `${cpy}px ${cpx}px`,
            borderRadius: crx,
          }}
        >
          AI
        </span>
      </div>
    </div>
  )
}
