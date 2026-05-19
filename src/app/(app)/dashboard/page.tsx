"use client"

import { KPICard } from "@/components/common/KPICard"
import Link from "next/link"
import { ROUTES } from "@/lib/constants"
import { useDashboard } from "@/hooks/useDashboard"
import { useAuthStore } from "@/stores/auth.store"

export default function DashboardPage() {
  const { data: summary, isLoading } = useDashboard()
  const user = useAuthStore((s) => s.user)
  const tenant = useAuthStore((s) => s.tenant)

  const kpis = [
    { label: "Tổng SKU", value: isLoading ? "..." : String(summary?.totalSKU ?? 0), subtitle: "sản phẩm đang theo dõi", trendType: "neutral" as const },
    { label: "Đề xuất AI", value: isLoading ? "..." : String(summary?.totalRecommendations ?? 0), subtitle: "hành động chờ xử lý", trendType: "neutral" as const },
    { label: "Trạng thái AI", value: summary?.mlHealthy ? "Online" : "—", subtitle: "ml-service", trendType: summary?.mlHealthy ? ("up" as const) : ("neutral" as const) },
    { label: "Gói dịch vụ", value: tenant?.plan ?? "trial", subtitle: "plan hiện tại", trendType: "neutral" as const },
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
                12 hành động ưu tiên để tối ưu tồn kho và tăng doanh thu
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Empty state — only shown when no data */}
      {!isLoading && !summary?.hasData && (
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
