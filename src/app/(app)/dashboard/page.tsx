"use client"

import { KPICard } from "@/components/common/KPICard"
import Link from "next/link"
import { ROUTES } from "@/lib/constants"
import { useDashboard } from "@/hooks/useDashboard"
import { useInventorySummary } from "@/hooks/useCatalog"
import { useAuthStore } from "@/stores/auth.store"

export default function DashboardPage() {
  const { data: overview, isLoading: bffLoading } = useDashboard()
  const { data: invSummary, isLoading: invLoading } = useInventorySummary()
  const user = useAuthStore((s) => s.user)
  const tenant = useAuthStore((s) => s.tenant)

  const isLoading = bffLoading || invLoading

  // BFF may be DOWN — fallback to catalog inventory for totalSKU
  const totalSKU = overview?.totalSKU ?? invSummary?.totalSKU ?? 0
  const lowStockCount = invSummary?.lowStockCount ?? 0
  const mlOnline = overview?.mlStatus === "UP"
  const hasData = totalSKU > 0

  const kpis = [
    {
      label: "Tổng mã hàng",
      value: isLoading ? "..." : String(totalSKU),
      subtitle: "sản phẩm đang theo dõi",
      trendType: "neutral" as const,
    },
    {
      label: "Thiếu hàng",
      value: isLoading ? "..." : String(lowStockCount),
      subtitle: "mã hàng dưới ngưỡng đặt lại hàng",
      trendType: lowStockCount > 0 ? ("down" as const) : ("neutral" as const),
    },
    {
      label: "Cảnh báo AI",
      value: isLoading ? "..." : String(overview?.highPriorityAlerts ?? 0),
      subtitle: "ưu tiên cao cần xử lý",
      trendType: (overview?.highPriorityAlerts ?? 0) > 0 ? ("down" as const) : ("neutral" as const),
    },
    {
      label: "Gói dịch vụ",
      value: tenant?.plan ? tenant.plan.toUpperCase() : "TRIAL",
      subtitle: "gói đang sử dụng",
      trendType: "neutral" as const,
    },
  ]

  return (
    <div>
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Xin chào{user?.fullName ? `, ${user.fullName.split(" ").pop()}` : ""}!
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          {tenant?.name ?? "Shop của bạn"} — tổng quan hoạt động hôm nay.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map((kpi) => (
          <KPICard key={kpi.label} {...kpi} />
        ))}
      </div>

      {/* ML status indicator */}
      {!isLoading && mlOnline === false && (
        <div className="mb-6 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-900 rounded-xl p-4 flex items-center gap-3">
          <span className="material-symbols-outlined text-amber-500 text-xl shrink-0">warning</span>
          <p className="text-sm text-amber-800 dark:text-amber-200">
            Dịch vụ AI đang tạm thời không khả dụng — dữ liệu hiển thị có thể chưa được cập nhật.
          </p>
        </div>
      )}

      {/* Empty state — shown when no data yet */}
      {!isLoading && !hasData && (
        <div className="mt-8 bg-indigo-50 dark:bg-indigo-950 border border-indigo-100 dark:border-indigo-900 rounded-xl p-5 flex items-center gap-4">
          <span className="material-symbols-outlined text-indigo-500 text-3xl">cloud_upload</span>
          <div className="flex-1">
            <p className="font-semibold text-indigo-800 dark:text-indigo-200">Chưa có dữ liệu thực</p>
            <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-0.5">
              Tải dữ liệu đơn hàng để nhận phân tích AI chính xác
            </p>
          </div>
          <Link
            href={ROUTES.HEALTH_CHECK_IMPORT}
            className="shrink-0 px-4 py-2 bg-brand-gradient text-white text-sm font-bold rounded-lg hover:opacity-90 transition"
          >
            Tải dữ liệu
          </Link>
        </div>
      )}
    </div>
  )
}
