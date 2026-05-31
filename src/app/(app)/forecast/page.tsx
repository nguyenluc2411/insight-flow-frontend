"use client"

import { KPICard } from "@/components/common/KPICard"
import { StatusBadge } from "@/components/common/StatusBadge"
import { ConfidenceBadge } from "@/components/common/ConfidenceBadge"
import { RiskBadge } from "@/components/common/RiskBadge"
import { TrendIndicator } from "@/components/common/TrendIndicator"
import { AIInsightBox } from "@/components/common/AIInsightBox"
import { useForecastSummary } from "@/hooks/useForecast"
import { useCategories } from "@/hooks/useCatalog"
import { useRecommendations } from "@/hooks/useRecommendations"
import { FeatureGate } from "@/components/feature/FeatureGate"

const AI_STRATEGY_ITEMS = [
  "Tập trung vào Linen và Natural Fabrics — đây là meta của H2 2026",
  "TikTok Shop là kênh chính — ưu tiên sản phẩm có khả năng viral",
  "Đa dạng hóa khu vực — Hà Nội đang underserved về Bottoms trendy",
  "Giảm phụ thuộc Formal wear — chuyển sang Casual/Streetwear",
]

const TREND_COLOR = {
  UP: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-900",
  DOWN: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-900",
  STABLE: "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
}

const CONFIDENCE_VALUE: Record<string, number> = { HIGH: 90, MEDIUM: 70, LOW: 50 }

export default function ForecastPage() {
  return (
    <FeatureGate featureCode="DEMAND_FORECAST">
      <ForecastPageContent />
    </FeatureGate>
  )
}

function ForecastPageContent() {
  const { data: forecast, isLoading } = useForecastSummary()
  const { data: categories } = useCategories()
  const { data: clearanceData } = useRecommendations({ action: "CLEARANCE" })

  // Map ML clearance recommendations → avoid-products table format
  const avoidProducts = (clearanceData?.items ?? []).map((item) => ({
    sku: item.variantId.slice(0, 8) + "…",
    name: `Variant ${item.variantId.slice(-6)}`,
    category: "—",
    reason: item.reason ?? "Nhu cầu thấp / tồn lâu ngày",
    risk: item.priority as "HIGH" | "MEDIUM" | "LOW",
  }))

  const categoryTrends = forecast?.categoryTrends ?? []
  const topProducts = forecast?.topProducts ?? []
  const confidence = Math.round((forecast?.overallConfidence ?? 0) * 100)

  // Map categoryId → name for enriching BFF data
  const categoryNameMap = Object.fromEntries(
    (categories ?? []).map((c) => [c.id, c.name])
  )

  const kpis = [
    {
      label: "Nhóm sản phẩm tăng",
      value: isLoading ? "..." : String(categoryTrends.filter((c) => c.trend === "UP").length),
      subtitle: "danh mục nên đầu tư",
      trendType: "up" as const,
    },
    {
      label: "SKU ưu tiên nhập",
      value: isLoading ? "..." : String(topProducts.length),
      subtitle: "sản phẩm được đề xuất",
      trendType: "neutral" as const,
    },
    {
      label: "Mã hàng rủi ro",
      value: isLoading ? "..." : String(categoryTrends.filter((c) => c.trend === "DOWN").length),
      subtitle: "danh mục cần xem xét",
      trendType: "down" as const,
    },
    {
      label: "Độ tin cậy AI",
      value: isLoading ? "..." : (confidence > 0 ? `${confidence}%` : "—"),
      subtitle: "dựa trên dữ liệu thực",
      trendType: "up" as const,
    },
  ]

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <StatusBadge status="ready" />
            <span className="px-3 py-1.5 bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 text-[11px] font-bold rounded-full border border-indigo-200 dark:border-indigo-900 uppercase tracking-wider">
              Kỳ dự báo Q2 2026
            </span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Dự báo Xu hướng</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Phân tích xu hướng sản phẩm thời trang Q2 2026
          </p>
        </div>
        {confidence > 0 && <ConfidenceBadge value={confidence} />}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map((kpi) => (
          <KPICard key={kpi.label} {...kpi} />
        ))}
      </div>

      {/* Cold-start banner */}
      {forecast?.hasColdStart && (
        <div className="mb-6 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-900 rounded-xl p-4 flex items-start gap-3">
          <span className="material-symbols-outlined text-amber-500 text-xl shrink-0 mt-0.5">info</span>
          <div>
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">Dự báo dựa trên xu hướng thị trường HCM</p>
            <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
              Shop chưa có đủ lịch sử bán hàng. AI đang dùng dữ liệu Google Trends ngành thời trang HCM làm cơ sở.
              Độ chính xác tăng dần sau 4 tuần có dữ liệu thực.
            </p>
          </div>
        </div>
      )}

      {/* No products message */}
      {forecast?.message && forecast.topProducts.length === 0 && (
        <div className="mb-6 bg-slate-50 dark:bg-slate-800 rounded-xl p-8 text-center">
          <span className="material-symbols-outlined text-slate-400 text-4xl mb-3 block">inventory_2</span>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{forecast.message}</p>
        </div>
      )}

      {/* Category Trends — real data */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-100 dark:border-slate-800 mb-8">
        <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-4">
          Xu hướng theo danh mục
        </h2>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-8 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />)}
          </div>
        ) : categoryTrends.length > 0 ? (
          <div className="space-y-4">
            {categoryTrends.map((cat) => (
              <div key={cat.category} className="flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[160px]">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {categoryNameMap[cat.category] ?? cat.category}
                  </p>
                </div>
                <TrendIndicator value={cat.pct} />
                <ConfidenceBadge value={75} />
                <span className={`px-2.5 py-1 text-[11px] font-bold rounded border uppercase tracking-wider ${TREND_COLOR[cat.trend as keyof typeof TREND_COLOR] ?? TREND_COLOR.STABLE}`}>
                  {cat.trend === "UP" ? "Tăng nhập" : cat.trend === "DOWN" ? "Giảm nhập" : "Giữ nguyên"}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400">Chưa có dữ liệu xu hướng — tải dữ liệu bán hàng để kích hoạt dự báo.</p>
        )}
      </div>

      {/* Top Products — real data */}
      {topProducts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">
            Sản phẩm ưu tiên kỳ tới
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {topProducts.map((p) => (
              <div key={p.variantId} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-4 hover:shadow-soft transition">
                <p className="font-mono text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 truncate" title={p.sku ?? p.variantId}>
                  {p.sku ?? p.variantId.slice(0, 8) + "…"}
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Dự báo 30 ngày
                    </p>
                    <p className="text-2xl font-black text-primary">{Math.round(p.forecastDays30)}</p>
                  </div>
                  <ConfidenceBadge value={CONFIDENCE_VALUE[p.confidence] ?? 70} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Avoid Products Table — real ML clearance data */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-100 dark:border-slate-800 mb-8">
        <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-4">
          Sản phẩm không nên nhập thêm
          {avoidProducts.length > 0 && (
            <span className="ml-2 text-xs font-normal text-primary">({avoidProducts.length} từ ML)</span>
          )}
        </h2>
        {avoidProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  {["SKU", "Variant ID", "Danh mục", "Lý do AI", "Rủi ro"].map((h) => (
                    <th key={h} className="text-left pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wider pr-4">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {avoidProducts.map((p) => (
                  <tr key={p.sku}>
                    <td className="py-3 pr-4 text-xs font-mono text-slate-500">{p.sku}</td>
                    <td className="py-3 pr-4 font-medium text-slate-900 dark:text-slate-100">{p.name}</td>
                    <td className="py-3 pr-4 text-slate-500 dark:text-slate-400">{p.category}</td>
                    <td className="py-3 pr-4 text-sm text-slate-600 dark:text-slate-400">{p.reason}</td>
                    <td className="py-3"><RiskBadge level={p.risk} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400 py-4 text-center">
            Chưa có dữ liệu — tải lịch sử bán hàng để AI xác định sản phẩm rủi ro.
          </p>
        )}
      </div>

      {/* AI Strategy Box */}
      <AIInsightBox title="Chiến lược AI cho Q2 2026" items={AI_STRATEGY_ITEMS} variant="dark" />
    </div>
  )
}
