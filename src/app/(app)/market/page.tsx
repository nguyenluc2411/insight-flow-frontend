"use client"

import { KPICard } from "@/components/common/KPICard"
import { TrendIndicator } from "@/components/common/TrendIndicator"
import { ProgressBar } from "@/components/common/ProgressBar"
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton"
import Link from "next/link"
import { ROUTES } from "@/lib/constants"
import { FeatureGate } from "@/components/feature/FeatureGate"
import { useMarketSummary } from "@/hooks/useMarket"
import type { ChannelOpportunity, RegionDemand, TrendHighlight, ProductOpportunity } from "@/types/bff.types"

// ─── Display name maps ───────────────────────────────────────────────────────

const CHANNEL_NAMES: Record<string, string> = {
  TIKTOK: "TikTok Shop",
  SHOPEE: "Shopee Fashion",
  WEBSITE: "Website Thương hiệu",
  OFFLINE: "Offline / Cửa hàng",
  LAZADA: "Lazada",
}

const COMPETITION_LABELS: Record<string, string> = {
  HIGH: "Cao",
  MEDIUM: "Trung bình",
  LOW: "Thấp",
}

const DEMAND_LABELS: Record<string, string> = {
  VERY_HIGH: "Rất cao",
  HIGH: "Cao",
  MEDIUM: "Trung bình",
  RISING: "Đang tăng",
  LOW: "Thấp",
}

const DEMAND_COLORS: Record<string, string> = {
  VERY_HIGH: "text-green-600",
  HIGH: "text-green-500",
  MEDIUM: "text-amber-500",
  RISING: "text-primary",
  LOW: "text-slate-400",
}

const REGION_NAMES: Record<string, string> = {
  hcmc: "TP. Hồ Chí Minh",
  hanoi: "Hà Nội",
  danang: "Đà Nẵng",
  cantho: "Cần Thơ",
}

const BADGE_CONFIG: Record<string, { label: string; cls: string }> = {
  HOT: { label: "Đang hot", cls: "bg-pink-100 text-pink-700" },
  RECOMMEND_IMPORT: { label: "Đề xuất nhập", cls: "bg-indigo-100 text-indigo-700" },
  NEW_OPPORTUNITY: { label: "Cơ hội mới", cls: "bg-green-100 text-green-700" },
}

const PRODUCT_EMOJIS = ["👕", "👖", "👗", "🧥", "👟", "👜"]

// ─── Page ────────────────────────────────────────────────────────────────────

export default function MarketPage() {
  return (
    <FeatureGate featureCode="SALES_ANALYTICS">
      <MarketPageContent />
    </FeatureGate>
  )
}

function MarketPageContent() {
  const { data, isLoading } = useMarketSummary()

  const kpis = [
    {
      label: "Điểm cơ hội thị trường",
      value: isLoading ? "..." : data?.kpis?.opportunityScore != null ? `${data.kpis.opportunityScore}/100` : "—",
      subtitle: "Chỉ số cơ hội thị trường",
      trend: data?.kpis?.opportunityScoreDelta ? `+${data.kpis.opportunityScoreDelta} điểm` : undefined,
      trendType: "up" as const,
    },
    {
      label: "Nhóm sản phẩm tiềm năng",
      value: isLoading ? "..." : String(data?.kpis?.potentialProductGroups ?? "—"),
      subtitle: "Được AI xác định",
      trendType: "neutral" as const,
    },
    {
      label: "Kênh tốt nhất",
      value: isLoading ? "..." : (data?.kpis?.bestChannel ? CHANNEL_NAMES[data.kpis.bestChannel] ?? data.kpis.bestChannel : "—"),
      subtitle: data?.kpis?.bestChannelScorePct ? `${data.kpis.bestChannelScorePct}% hiệu suất` : "—",
      trendType: "up" as const,
    },
    {
      label: "Mức độ cạnh tranh",
      value: isLoading ? "..." : (data?.kpis?.competitionLevel ? COMPETITION_LABELS[data.kpis.competitionLevel] ?? data.kpis.competitionLevel : "—"),
      subtitle: data?.kpis?.competitionHotCategories?.join(" & ") ?? "—",
      trendType: "neutral" as const,
    },
  ]

  if (isLoading) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Cơ hội Thị trường</h1>
          <p className="text-slate-500 mt-1">Phân tích thị trường thời trang Việt Nam — {currentQuarter()}</p>
        </div>
        <LoadingSkeleton rows={4} />
      </div>
    )
  }

  const channels: ChannelOpportunity[] = data?.channelOpportunities ?? []
  const regions: RegionDemand[] = data?.regionDemand ?? []
  const trends: TrendHighlight[] = data?.trendHighlights ?? []
  const products: ProductOpportunity[] = data?.productOpportunities ?? []

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Cơ hội Thị trường</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Phân tích thị trường thời trang Việt Nam — {data?.period ?? currentQuarter()}
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map((kpi) => <KPICard key={kpi.label} {...kpi} />)}
      </div>

      {/* Product Opportunities */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
            Cơ hội sản phẩm được AI đề xuất
          </h2>
          <button className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
            Xem tất cả xu hướng
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

        {products.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-700 p-8 text-center text-slate-400 text-sm">
            Chưa đủ dữ liệu để xác định cơ hội sản phẩm — tải dữ liệu bán hàng để kích hoạt.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {products.map((product, i) => {
              const badge = BADGE_CONFIG[product.badge] ?? { label: product.badge, cls: "bg-slate-100 text-slate-600" }
              return (
                <div key={i} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-soft transition-shadow">
                  <div className="h-40 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 flex items-center justify-center text-6xl">
                    {PRODUCT_EMOJIS[i % PRODUCT_EMOJIS.length]}
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2 gap-2">
                      <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm leading-tight">{product.name}</h3>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 ${badge.cls}`}>{badge.label}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <TrendIndicator value={product.trendPct} />
                      <span className="text-xs text-slate-500">so với tháng trước</span>
                    </div>
                    {product.insight && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">{product.insight}</p>
                    )}
                    <button className="w-full py-2 bg-brand-gradient text-white text-sm font-bold rounded-lg hover:opacity-90 transition">
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Bottom Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Channels */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">storefront</span>
            Kênh bán tốt nhất
          </h3>
          {channels.length === 0 ? (
            <p className="text-sm text-slate-400">Chưa có dữ liệu kênh bán</p>
          ) : (
            <div className="space-y-3">
              {channels.map((ch) => (
                <div key={ch.channel}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {CHANNEL_NAMES[ch.channel] ?? ch.channel}
                    </span>
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{ch.score}/100</span>
                  </div>
                  <ProgressBar value={ch.score} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Regions */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">location_on</span>
            Nhu cầu theo khu vực
          </h3>
          {regions.length === 0 ? (
            <p className="text-sm text-slate-400">Chưa có dữ liệu khu vực</p>
          ) : (
            <div className="space-y-3">
              {regions.map((r) => (
                <div key={r.region} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {REGION_NAMES[r.region] ?? r.region}
                    </p>
                    <p className={`text-xs font-semibold ${DEMAND_COLORS[r.demandLevel] ?? "text-slate-500"}`}>
                      {DEMAND_LABELS[r.demandLevel] ?? r.demandLevel}
                    </p>
                  </div>
                  <TrendIndicator value={r.growthPct} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Trends */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">trending_up</span>
            Xu hướng nổi bật
          </h3>
          {trends.length === 0 ? (
            <div className="text-sm text-slate-400 space-y-1">
              <p>Dữ liệu xu hướng đang được cập nhật</p>
              <p className="text-xs">Tự động làm mới sau 24 giờ</p>
            </div>
          ) : (
            <div className="space-y-3">
              {trends.map((t) => (
                <div key={t.name} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{t.name}</p>
                    <span className="text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full">
                      {t.tag}
                    </span>
                  </div>
                  <TrendIndicator value={t.growthPct} />
                </div>
              ))}
            </div>
          )}
          {data?.partial && (
            <p className="text-[11px] text-slate-400 mt-3 border-t border-slate-100 pt-2">
              ⚡ Dữ liệu Google Trends đang được cập nhật
            </p>
          )}
        </div>
      </div>

      {/* CTA */}
      <Link href={ROUTES.HEALTH_CHECK_IMPORT} className="block bg-brand-gradient rounded-2xl p-6 hover:opacity-90 transition">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <span className="material-symbols-outlined text-white text-4xl">monitor_heart</span>
          <div className="text-white flex-1">
            <p className="text-lg font-bold">Khai phá các chỉ số sức khỏe doanh nghiệp</p>
            <p className="text-indigo-200 text-sm mt-1">
              Tải dữ liệu của bạn để nhận phân tích cá nhân hóa và so sánh với thị trường
            </p>
          </div>
          <span className="material-symbols-outlined text-white text-2xl">arrow_forward</span>
        </div>
      </Link>
    </div>
  )
}

function currentQuarter() {
  const now = new Date()
  const q = Math.floor(now.getMonth() / 3) + 1
  return `Q${q} ${now.getFullYear()}`
}
