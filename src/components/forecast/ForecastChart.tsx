"use client"

import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import type { ForecastSeriesResponse } from "@/types/ml.types"

const AXIS = "#94a3b8" // slate-400
const GRID = "#e2e8f0" // slate-200
const INDIGO = "#6366f1" // forecast line
const SLATE = "#475569" // actual line
const BAND = "#6366f1" // confidence band fill

interface ChartRow {
  date: string
  actual?: number
  predicted?: number
  /** [lower, upper] confidence range — only on forecast rows. */
  range?: [number, number]
}

/** ISO datetime -> "dd/mm". */
function shortDay(iso: string): string {
  const d = new Date(iso)
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`
}

const CONFIDENCE_LABEL: Record<string, string> = {
  high: "Cao",
  medium: "Trung bình",
  low: "Thấp",
  none: "Chưa xác định",
}

const CONFIDENCE_CLASS: Record<string, string> = {
  high: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-900",
  medium: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-900",
  low: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-900",
  none: "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
}

function buildRows(series: ForecastSeriesResponse): ChartRow[] {
  const history: ChartRow[] = series.history.map((h) => ({
    date: h.date,
    actual: Math.round(h.actual * 10) / 10,
  }))
  const forecast: ChartRow[] = series.predictions.map((p) => ({
    date: p.date,
    predicted: Math.round(p.predicted * 10) / 10,
    range: [Math.round(p.lowerBound * 10) / 10, Math.round(p.upperBound * 10) / 10],
  }))
  return [...history, ...forecast]
}

interface Props {
  series?: ForecastSeriesResponse
  isLoading: boolean
  title?: string
}

export function ForecastChart({ series, isLoading, title = "Dự báo nhu cầu theo ngày" }: Props) {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-100 dark:border-slate-800">
        <div className="h-6 w-48 bg-slate-100 dark:bg-slate-800 rounded animate-pulse mb-4" />
        <div className="h-[300px] bg-slate-50 dark:bg-slate-800 rounded animate-pulse" />
      </div>
    )
  }

  if (!series || (series.history.length === 0 && series.predictions.length === 0)) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-100 dark:border-slate-800">
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-2">{title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 py-8 text-center">
          Chưa có dữ liệu dự báo cho sản phẩm này.
        </p>
      </div>
    )
  }

  const rows = buildRows(series)
  const conf = series.confidence ?? "none"
  const wape = series.accuracy?.measured ? series.accuracy?.wape ?? null : null
  const accuracyPct = wape != null ? Math.max(0, Math.round((1 - wape) * 100)) : null

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-100 dark:border-slate-800">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">{title}</h3>
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-full border uppercase tracking-wider ${CONFIDENCE_CLASS[conf] ?? CONFIDENCE_CLASS.none}`}
          >
            <span className="material-symbols-outlined text-[13px]">verified</span>
            Độ tin cậy: {CONFIDENCE_LABEL[conf] ?? "—"}
          </span>
          {accuracyPct != null ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-full border border-indigo-200 bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400 dark:border-indigo-900">
              <span className="material-symbols-outlined text-[13px]">target</span>
              Độ chính xác kiểm thử ~{accuracyPct}%
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-full border border-slate-200 bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700">
              Chưa đo được sai số
            </span>
          )}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={rows} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
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
            width={36}
          />
          <Tooltip
            labelFormatter={(l: string) => shortDay(l)}
            formatter={(value, name) => {
              if (name === "Khoảng tin cậy" && Array.isArray(value)) {
                return [`${value[0]} – ${value[1]}`, name]
              }
              return [value as number, name]
            }}
            contentStyle={{ borderRadius: 8, fontSize: 12, border: `1px solid ${GRID}` }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Area
            type="monotone"
            dataKey="range"
            name="Khoảng tin cậy"
            stroke="none"
            fill={BAND}
            fillOpacity={0.12}
            connectNulls
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="actual"
            name="Đã bán (thực tế)"
            stroke={SLATE}
            strokeWidth={2}
            dot={false}
            connectNulls
          />
          <Line
            type="monotone"
            dataKey="predicted"
            name="Dự báo"
            stroke={INDIGO}
            strokeWidth={2}
            strokeDasharray="5 4"
            dot={false}
            connectNulls
          />
        </ComposedChart>
      </ResponsiveContainer>

      {series.warning ? (
        <p className="mt-3 text-xs text-amber-700 dark:text-amber-400 flex items-start gap-1.5">
          <span className="material-symbols-outlined text-[14px] mt-0.5 shrink-0">info</span>
          {series.warning}
        </p>
      ) : null}
    </div>
  )
}
