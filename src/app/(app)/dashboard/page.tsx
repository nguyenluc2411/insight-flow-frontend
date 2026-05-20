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
      label: "Tổng SKU",
      value: isLoading ? "..." : String(totalSKU),
      subtitle: "sản phẩm đang theo dõi",
      trendType: "neutral" as const,
    },
    {
      label: "Thiếu hàng",
      value: isLoading ? "..." : String(lowStockCount),
      subtitle: "SKU dưới ngưỡng reorder",
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
      value: tenant?.plan ?? "trial",
      subtitle: "plan hiện tại",
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

      {/* CTA Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href={ROUTES.HEALTH_CHECK}
          className="group bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-100 dark:border-slate-800 shadow-soft hover:border-primary/50 transition-all"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors">
              <span className="material-symbols-outlined text-primary group-hover:text-white transition-colors">monitor_heart</span>
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-slate-100">Kiểm tra Sức khỏe</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Xem báo cáo chẩn đoán tồn kho và rủi ro kênh bán hàng
              </p>
            </div>
          </div>
        </Link>

        <Link
          href={ROUTES.RECOMMENDATIONS}
          className="group bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-100 dark:border-slate-800 shadow-soft hover:border-primary/50 transition-all"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950 flex items-center justify-center shrink-0 group-hover:bg-secondary transition-colors">
              <span className="material-symbols-outlined text-secondary group-hover:text-white transition-colors">recommend</span>
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-slate-100">Đề xuất AI</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Hành động ưu tiên để tối ưu tồn kho và tăng doanh thu
              </p>
            </div>
          </div>
        </Link>
      </div>

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
