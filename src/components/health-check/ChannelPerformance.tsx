"use client"

import { useEffect, useState } from "react"

interface ChannelData {
  name: string
  orders: number
  rate: number
}

interface Props {
  channels: ChannelData[]
}

const CHANNEL_COLORS: Record<string, string> = {
  "TikTok Shop": "bg-pink-500",
  "Website": "bg-blue-500",
  "Cửa hàng Flagship": "bg-amber-500",
}

export function ChannelPerformance({ channels }: Props) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  return (
    <div className="space-y-4">
      {channels.map((ch) => (
        <div key={ch.name}>
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <div
                className={`w-2.5 h-2.5 rounded-full ${CHANNEL_COLORS[ch.name] ?? "bg-slate-400"}`}
              />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{ch.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {ch.orders} đơn
              </span>
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{ch.rate}%</span>
            </div>
          </div>
          <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${CHANNEL_COLORS[ch.name] ?? "bg-slate-400"}`}
              style={{ width: mounted ? `${ch.rate}%` : "0%" }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
