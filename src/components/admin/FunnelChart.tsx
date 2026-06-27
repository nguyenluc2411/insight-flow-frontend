"use client"

import React from "react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { GlassCard } from "@/components/common/GlassCard"
import type { FunnelStep } from "@/services/analytics.service"

interface FunnelChartProps {
  data: FunnelStep[]
  title?: string
}

export function FunnelChart({ data, title = "Phễu chuyển đổi (Funnel)" }: FunnelChartProps) {
  if (!data || data.length === 0) return null

  // Calculate percentages based on the first step (Visitors)
  const maxVal = data[0]?.value || 1
  const chartData = data.map((item, index) => ({
    ...item,
    percentage: index === 0 ? 100 : Math.round(((item.value || 0) / maxVal) * 100 * 10) / 10,
    dropoff: index > 0 ? Math.round((((data[index - 1]?.value || 0) - (item.value || 0)) / (data[index - 1]?.value || 1)) * 100) : 0
  }))

  const colors = ["#818cf8", "#a855f7", "#ec4899", "#f43f5e"]

  return (
    <GlassCard className="p-6">
      <h3 className="text-lg font-bold text-slate-800 mb-6">{title}</h3>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={chartData}
            margin={{ top: 20, right: 80, left: 20, bottom: 5 }}
            barSize={40}
          >
            <XAxis type="number" hide />
            <YAxis 
              dataKey="stepName" 
              type="category" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#475569', fontWeight: 600 }}
              width={100}
            />
            <Tooltip
              cursor={{ fill: 'rgba(99,102,241,0.06)' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload
                  return (
                    <div className="bg-white p-3 rounded-lg shadow-soft border border-slate-100">
                      <p className="font-bold text-slate-800">{data?.stepName}</p>
                      <p className="text-indigo-600 font-bold">{data?.value?.toLocaleString() ?? "0"} users</p>
                      {data?.percentage < 100 && (
                        <p className="text-slate-500 text-sm mt-1">
                          Chuyển đổi: {data?.percentage}%
                        </p>
                      )}
                      {data?.dropoff > 0 && (
                        <p className="text-red-500 text-sm mt-1 font-medium">
                          Rớt khách: {data?.dropoff}%
                        </p>
                      )}
                    </div>
                  )
                }
                return null
              }}
            />
            <Bar 
              dataKey="value" 
              fill="#6366f1" 
              radius={[0, 4, 4, 0]} 
              maxBarSize={48}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  )
}
