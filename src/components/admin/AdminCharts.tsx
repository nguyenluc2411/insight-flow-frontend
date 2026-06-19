"use client"

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import type { DailyCount, MonthlyRevenue } from "@/types/admin.types"
import { formatCurrency, formatNumber } from "@/lib/utils"

const AXIS = "#94a3b8" // slate-400
const GRID = "#e2e8f0" // slate-200
const INDIGO = "#6366f1"
const PURPLE = "#a855f7"

/** Compact VND for axis ticks: 1.500.000 -> "1,5tr", 12.000 -> "12k". */
function compactVnd(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toLocaleString("vi-VN", { maximumFractionDigits: 1 })}tr`
  if (value >= 1_000) return `${Math.round(value / 1_000)}k`
  return String(value)
}

/** "2026-06-19" -> "19/06". */
function shortDay(iso: string): string {
  const [, m, d] = iso.split("-")
  return `${d}/${m}`
}

/** "2026-06" -> "T6/26". */
function shortMonth(ym: string): string {
  const [y, m] = ym.split("-")
  return `T${Number(m)}/${y.slice(2)}`
}

/** Daily new sign-ups over the selected window. */
export function SignupTrendChart({ data }: { data: DailyCount[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="signupFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={INDIGO} stopOpacity={0.35} />
            <stop offset="100%" stopColor={INDIGO} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={shortDay}
          tick={{ fontSize: 11, fill: AXIS }}
          interval="preserveStartEnd"
          minTickGap={24}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 11, fill: AXIS }}
          axisLine={false}
          tickLine={false}
          width={32}
        />
        <Tooltip
          formatter={(v: number) => [formatNumber(v), "Khách hàng mới"]}
          labelFormatter={(l: string) => shortDay(l)}
          contentStyle={{ borderRadius: 8, fontSize: 12, border: `1px solid ${GRID}` }}
        />
        <Area type="monotone" dataKey="count" stroke={INDIGO} strokeWidth={2} fill="url(#signupFill)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}

/** Monthly successful-payment revenue (VND). */
export function RevenueChart({ data }: { data: MonthlyRevenue[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 4, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
        <XAxis
          dataKey="month"
          tickFormatter={shortMonth}
          tick={{ fontSize: 11, fill: AXIS }}
          interval="preserveStartEnd"
          minTickGap={16}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={compactVnd}
          tick={{ fontSize: 11, fill: AXIS }}
          axisLine={false}
          tickLine={false}
          width={44}
        />
        <Tooltip
          formatter={(v: number) => [formatCurrency(v), "Doanh thu"]}
          labelFormatter={(l: string) => shortMonth(l)}
          contentStyle={{ borderRadius: 8, fontSize: 12, border: `1px solid ${GRID}` }}
          cursor={{ fill: "rgba(99,102,241,0.06)" }}
        />
        <Bar dataKey="amount" fill={PURPLE} radius={[4, 4, 0, 0]} maxBarSize={48} />
      </BarChart>
    </ResponsiveContainer>
  )
}
