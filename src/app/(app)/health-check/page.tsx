"use client"

import { KPIGrid } from "@/components/health-check/KPIGrid"
import { CategoryRiskChart } from "@/components/health-check/CategoryRiskChart"
import { ChannelPerformance } from "@/components/health-check/ChannelPerformance"
import { RiskItemTable } from "@/components/health-check/RiskItemTable"
import { PriorityIssues } from "@/components/health-check/PriorityIssues"
import { AIInsightBox } from "@/components/common/AIInsightBox"
import { StatusBadge } from "@/components/common/StatusBadge"
import Link from "next/link"
import { ROUTES } from "@/lib/constants"
import { useHealthCheck } from "@/hooks/useHealthCheck"

const MOCK_RISK_ITEMS = [
  { sku: "SKU-001", name: "Quần Wide Leg Trousers Đen", stock: 420, sellThrough: 18, risk: "HIGH" as const },
  { sku: "SKU-002", name: "Áo Khoác Light Summer Jacket", stock: 280, sellThrough: 24, risk: "HIGH" as const },
  { sku: "SKU-003", name: "Váy Midi Floral Print", stock: 150, sellThrough: 45, risk: "MEDIUM" as const },
  { sku: "SKU-004", name: "Áo Thun Oversize Basic", stock: 90, sellThrough: 68, risk: "LOW" as const },
  { sku: "SKU-005", name: "Túi Tote Canvas", stock: 75, sellThrough: 72, risk: "STRATEGIC" as const },
]

const MOCK_ISSUES = [
  {
    icon: "inventory_2",
    title: "Tồn kho quá mức tại TP.HCM",
    description: "Quần Wide Leg và Áo khoác hè tập trung 68% tồn kho — cần phân phối lại ngay",
    severity: "NGHIÊM TRỌNG" as const,
  },
  {
    icon: "location_on",
    title: "Cơ hội phân phối sang Hà Nội",
    description: "Xu hướng Bottoms đang tăng 28% tại Hà Nội trong Q2 — chuyển hàng từ TP.HCM",
    severity: "CHIẾN LƯỢC" as const,
  },
  {
    icon: "sell",
    title: "Summer Light Jacket cần markdown",
    description: "Sell-through thấp sau 45 ngày — giảm giá để tránh tồn cuối mùa",
    severity: "QUAN TRỌNG" as const,
  },
]

const AI_INSIGHTS = [
  "Áp lực tồn kho cao hơn benchmark ngành thời trang VN",
  "TikTok Shop chiếm tỷ trọng lớn doanh số nhưng nhiều sản phẩm chưa được tối ưu",
  "Bottoms là danh mục có rủi ro cao nhất",
  "Nếu không có hành động trong 30 ngày, markdown bắt buộc cho nhiều SKU",
]

export default function HealthCheckPage() {
  const { data: health, isLoading } = useHealthCheck()

  const pressurePct = health?.inventoryPressurePct ?? 0
  const sellThrough = health?.sellThroughRate ?? 0
  const slowSKU = health?.slowMovingSKUCount ?? 0

  const kpis = [
    {
      label: "Áp lực tồn kho",
      value: isLoading ? "..." : `${pressurePct.toFixed(0)}%`,
      subtitle: "tỷ lệ tồn kho so với capacity",
      trendType: pressurePct > 60 ? ("down" as const) : ("neutral" as const),
    },
    {
      label: "Tỷ lệ sell-through",
      value: isLoading ? "..." : `${sellThrough.toFixed(0)}%`,
      subtitle: "thấp hơn benchmark ngành",
      trendType: sellThrough < 40 ? ("down" as const) : ("up" as const),
    },
    {
      label: "SKU chậm bán",
      value: isLoading ? "..." : String(slowSKU),
      subtitle: "SKU cần xử lý",
      trendType: slowSKU > 0 ? ("down" as const) : ("neutral" as const),
    },
    {
      label: "Rủi ro kênh bán",
      value: isLoading ? "..." : (health?.channelPerformance?.[0]?.channel ?? "—"),
      subtitle: "kênh chiếm tỷ trọng cao nhất",
      trendType: "neutral" as const,
    },
  ]

  // Map BFF CategoryRisk → chart format
  const categoryChartData = (health?.categoryRisks ?? []).map((c) => ({
    name: c.category,
    value: c.units,
    total: Math.max(c.units * 2, 100),
  }))

  // Map BFF ChannelPerformance → component format
  const channelData = (health?.channelPerformance ?? []).map((c) => ({
    name: c.channel,
    orders: c.orders,
    rate: Math.round(c.rate),
  }))

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <StatusBadge status="complete" />
            <StatusBadge status="ready" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Chẩn đoán Sức khỏe
          </h1>
        </div>
        <div className="text-right text-xs text-slate-500 dark:text-slate-400 space-y-0.5">
          <p>SKU chậm bán: <span className="font-semibold">{isLoading ? "..." : slowSKU}</span></p>
          {health?.lastUpdated && (
            <p>Cập nhật: {new Date(health.lastUpdated).toLocaleTimeString("vi-VN")}</p>
          )}
        </div>
      </div>

      {/* KPI Grid */}
      <div className="mb-8">
        <KPIGrid data={kpis} />
      </div>

      {/* Skeleton while loading */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Category Risk Chart */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-100 dark:border-slate-800">
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-4">
                Tồn kho theo danh mục
              </h2>
              <CategoryRiskChart categories={categoryChartData.length > 0 ? categoryChartData : [
                { name: "Chưa có dữ liệu", value: 0, total: 100 }
              ]} />
            </div>

            {/* Risk Item Table */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-100 dark:border-slate-800">
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-4">
                SKU cần xử lý
              </h2>
              <RiskItemTable items={MOCK_RISK_ITEMS} />
            </div>

            {/* Priority Issues */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-100 dark:border-slate-800">
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-4">
                Vấn đề ưu tiên
              </h2>
              <PriorityIssues issues={MOCK_ISSUES} />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Channel Performance */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-100 dark:border-slate-800">
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-4">
                Hiệu suất kênh bán
              </h2>
              <ChannelPerformance channels={channelData.length > 0 ? channelData : [
                { name: "Chưa có dữ liệu", orders: 0, rate: 0 }
              ]} />
            </div>

            {/* AI Insights */}
            <AIInsightBox title="Phân tích AI" items={AI_INSIGHTS} variant="dark" />

            <div className="bg-green-50 dark:bg-green-950 rounded-xl p-4 border border-green-200 dark:border-green-900">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-[18px]">
                  task_alt
                </span>
                <p className="text-sm font-bold text-green-800 dark:text-green-200">
                  Phân tích đầy đủ đã được tạo
                </p>
              </div>
              <p className="text-xs text-green-700 dark:text-green-300">
                Đề xuất hành động và dự báo Q2 2026 đã sẵn sàng
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href={ROUTES.RECOMMENDATIONS}
          className="group bg-brand-gradient rounded-xl p-5 flex items-center gap-4 hover:opacity-90 transition"
        >
          <span className="material-symbols-outlined text-white text-3xl">recommend</span>
          <div className="text-white">
            <p className="font-bold">Xem Đề xuất AI</p>
            <p className="text-indigo-200 text-sm">Hành động ưu tiên tối ưu tồn kho</p>
          </div>
        </Link>
        <Link
          href={ROUTES.FORECAST}
          className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 flex items-center gap-4 hover:border-primary/50 transition"
        >
          <span className="material-symbols-outlined text-primary text-3xl">insights</span>
          <div>
            <p className="font-bold text-slate-900 dark:text-slate-100">Xem Dự báo Q2</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Xu hướng sản phẩm 2026</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
