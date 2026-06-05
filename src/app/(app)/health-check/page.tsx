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
import { useInventorySummary, useCategories } from "@/hooks/useCatalog"
import { useRecommendations } from "@/hooks/useRecommendations"
import { getForecastPeriod } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import { catalogService } from "@/services/catalog.service"
import { useAuthStore } from "@/stores/auth.store"

export default function HealthCheckPage() {
  const { data: health, isLoading } = useHealthCheck()
  const { data: invSummary, isLoading: invLoading } = useInventorySummary()
  const { data: categories } = useCategories()
  const { data: clearanceData } = useRecommendations({ action: "CLEARANCE" })

  // Resolve variantId -> real SKU / product name so the risk table shows readable
  // identifiers instead of raw UUIDs.
  const { tenant } = useAuthStore()
  const { data: variantsPage } = useQuery({
    queryKey: ["catalog-variants", tenant?.id],
    queryFn: () => catalogService.getAllVariants(500),
    staleTime: 5 * 60_000,
  })
  const { data: productsPage } = useQuery({
    queryKey: ["catalog-products-all", tenant?.id],
    queryFn: () => catalogService.getProducts({ size: 500 }),
    staleTime: 5 * 60_000,
  })
  const variantById = new Map((variantsPage?.content ?? []).map((v) => [v.id, v]))
  const productById = new Map((productsPage?.content ?? []).map((p) => [p.id, p]))

  const loading = isLoading || invLoading
  const pressurePct = health?.inventoryPressurePct ?? 0
  const sellThrough = health?.sellThroughRate ?? 0
  const slowSKU = health?.slowMovingSKUCount ?? 0
  const totalSKU = invSummary?.totalSKU ?? 0
  const totalQty = invSummary?.totalQuantity ?? 0
  const lowStock = invSummary?.lowStockCount ?? 0

  // Map ML clearance recommendations → RiskItemTable format
  const riskItems = (clearanceData?.items ?? []).map((item) => {
    const v = variantById.get(item.variantId)
    const p = v ? productById.get(v.productId) : undefined
    return {
      sku: v?.sku ?? item.variantId.slice(0, 8) + "…",
      name: p?.name ?? v?.sku ?? `Mã hàng ${item.variantId.slice(-6)}`,
      reason: item.reason ?? undefined,
      stock: item.currentStock ?? 0,
      sellThrough: item.salesVelocity30d != null && (item.currentStock ?? 0) > 0
        ? Math.min(99, Math.round((item.salesVelocity30d * 30) / ((item.currentStock ?? 1) + item.salesVelocity30d * 30) * 100))
        : 0,
      risk: item.priority as "HIGH" | "MEDIUM" | "LOW",
    }
  })

  // Dynamic issues from real health + inventory data
  const dynamicIssues = [
    ...(slowSKU > 0 ? [{
      icon: "inventory_2",
      title: `${slowSKU} mã hàng chậm bán cần xử lý`,
      description: `Áp lực tồn kho ${pressurePct.toFixed(0)}% — ưu tiên thanh lý hoặc chuyển kênh`,
      severity: (pressurePct > 50 ? "NGHIÊM TRỌNG" : "QUAN TRỌNG") as "NGHIÊM TRỌNG" | "QUAN TRỌNG" | "CHIẾN LƯỢC",
    }] : []),
    ...(lowStock > 0 ? [{
      icon: "warning",
      title: `${lowStock} mã hàng dưới ngưỡng tái đặt hàng`,
      description: "Cần nhập thêm hàng để tránh hết hàng trong 7-14 ngày tới",
      severity: "QUAN TRỌNG" as const,
    }] : []),
    ...((clearanceData?.items ?? []).length > 0 ? [{
      icon: "sell",
      title: `${clearanceData!.items.length} mã hàng cần thanh lý`,
      description: "AI phát hiện hàng tồn lâu ngày — xem bảng mã hàng cần xử lý bên dưới",
      severity: "CHIẾN LƯỢC" as const,
    }] : []),
  ]

  // Dynamic AI insights from real data
  const aiInsights = [
    ...(slowSKU > 0 ? [`${slowSKU} mã hàng chậm bán — cần hành động trong 30 ngày`] : []),
    ...(pressurePct > 30 ? [`Áp lực tồn kho ${pressurePct.toFixed(0)}% vượt ngưỡng bình thường`] : []),
    ...(lowStock > 0 ? [`${lowStock} vị trí tồn kho dưới ngưỡng đặt lại hàng — nguy cơ hết hàng`] : []),
    "Kết nối POS để nhận phân tích chi tiết hơn theo từng kênh bán",
  ]

  const kpis = [
    {
      label: "Tổng mã hàng",
      value: loading ? "..." : String(totalSKU),
      subtitle: `${totalQty.toLocaleString("vi-VN")} đơn vị tồn kho`,
      trendType: "neutral" as const,
    },
    {
      label: "Áp lực tồn kho",
      value: loading ? "..." : `${pressurePct.toFixed(0)}%`,
      subtitle: "tỷ lệ tồn kho so với sức chứa",
      trendType: pressurePct > 60 ? ("down" as const) : ("neutral" as const),
    },
    {
      label: "Mã hàng sắp hết",
      value: loading ? "..." : String(lowStock),
      subtitle: `${slowSKU} mã hàng chậm bán cần xử lý`,
      trendType: lowStock > 0 ? ("down" as const) : ("neutral" as const),
    },
    {
      label: "Tỷ lệ bán ra",
      value: loading ? "..." : (sellThrough > 0 ? `${sellThrough.toFixed(0)}%` : "—"),
      subtitle: "cần dữ liệu bán hàng để tính toán",
      trendType: sellThrough > 0 && sellThrough < 40 ? ("down" as const) : ("neutral" as const),
    },
  ]

  const categoryNameMap = Object.fromEntries(
    (categories ?? []).map((c) => [c.id, c.name])
  )

  const categoryChartData = (health?.categoryRisks ?? []).map((c) => ({
    name: categoryNameMap[c.category] ?? c.category,
    value: c.units,
    total: Math.max(c.units * 2, 100),
  }))

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
          <p>Tổng mã hàng: <span className="font-semibold">{loading ? "..." : totalSKU}</span></p>
          <p>Thiếu hàng: <span className="font-semibold text-amber-500">{loading ? "..." : lowStock}</span></p>
          {health?.lastUpdated && (
            <p>Cập nhật: {new Date(health.lastUpdated).toLocaleTimeString("vi-VN")}</p>
          )}
        </div>
      </div>

      {/* KPI Grid */}
      <div className="mb-8">
        <KPIGrid data={kpis} />
      </div>

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
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-100 dark:border-slate-800">
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-4">
                Tồn kho theo danh mục
              </h2>
              <CategoryRiskChart categories={categoryChartData.length > 0 ? categoryChartData : [
                { name: "Chưa có dữ liệu", value: 0, total: 100 }
              ]} />
            </div>

            {/* Risk Item Table — real ML clearance data */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-100 dark:border-slate-800">
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-4">
                Mã hàng cần xử lý
                {riskItems.length > 0 && (
                  <span className="ml-2 text-xs font-normal text-primary">({riskItems.length} mã hàng từ AI)</span>
                )}
              </h2>
              {riskItems.length > 0 ? (
                <RiskItemTable items={riskItems} />
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400 py-4 text-center">
                  Chưa có mã hàng nào cần thanh lý — tải dữ liệu bán hàng để AI phân tích.
                </p>
              )}
            </div>

            {/* Priority Issues — dynamic */}
            {dynamicIssues.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-100 dark:border-slate-800">
                <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-4">
                  Vấn đề ưu tiên
                </h2>
                <PriorityIssues issues={dynamicIssues} />
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-100 dark:border-slate-800">
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-4">
                Hiệu suất kênh bán
              </h2>
              <ChannelPerformance channels={channelData.length > 0 ? channelData : [
                { name: "Chưa có dữ liệu", orders: 0, rate: 0 }
              ]} />
            </div>

            <AIInsightBox title="Phân tích AI" items={aiInsights} variant="dark" />

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
                Đề xuất hành động và dự báo {getForecastPeriod()} đã sẵn sàng
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
            <p className="font-bold text-slate-900 dark:text-slate-100">Xem Dự báo {getForecastPeriod()}</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Xu hướng sản phẩm thời trang</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
