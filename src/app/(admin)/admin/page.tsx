"use client"

import Link from "next/link"
import { KPICard } from "@/components/common/KPICard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RevenueChart, SignupTrendChart } from "@/components/admin/AdminCharts"
import { useAdminMetrics, useBillingMetrics } from "@/hooks/useAdmin"
import { formatCurrency, formatNumber } from "@/lib/utils"

const SIGNUP_WINDOW = 30
const REVENUE_WINDOW = 12

export default function AdminOverviewPage() {
  const { data: metrics, isLoading: mLoading, isError: mError, refetch: refetchM } = useAdminMetrics(SIGNUP_WINDOW)
  const { data: billing, isLoading: bLoading, isError: bError, refetch: refetchB } = useBillingMetrics(REVENUE_WINDOW)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Tổng quan nền tảng</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Số liệu khách hàng, người dùng và doanh thu toàn hệ thống.
        </p>
      </div>

      {/* Tenant / user KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <KPICard
          label="Tổng khách hàng"
          value={mLoading ? "..." : formatNumber(metrics?.totalTenants ?? 0)}
          subtitle="tenant đang hoạt động trên nền tảng"
        />
        <KPICard
          label="Đang hoạt động"
          value={mLoading ? "..." : formatNumber(metrics?.activeTenants ?? 0)}
          subtitle="tenant trạng thái active"
          trendType="up"
        />
        <KPICard
          label="Dùng thử"
          value={mLoading ? "..." : formatNumber(metrics?.trialTenants ?? 0)}
          subtitle="tenant đang trial"
        />
        <KPICard
          label="Tạm ngưng"
          value={mLoading ? "..." : formatNumber(metrics?.suspendedTenants ?? 0)}
          subtitle="suspended / cancelled"
          trendType={(metrics?.suspendedTenants ?? 0) > 0 ? "down" : "neutral"}
        />
      </div>

      {/* Revenue / subscription KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPICard
          label="MRR"
          value={bLoading ? "..." : formatCurrency(billing?.mrr ?? 0)}
          subtitle="doanh thu định kỳ hàng tháng"
          trendType="up"
        />
        <KPICard
          label="Tổng doanh thu"
          value={bLoading ? "..." : formatCurrency(billing?.totalRevenue ?? 0)}
          subtitle="thanh toán thành công luỹ kế"
        />
        <KPICard
          label="Gói đang trả phí"
          value={bLoading ? "..." : formatNumber(billing?.activeSubscriptions ?? 0)}
          subtitle="subscription active"
        />
        <KPICard
          label="Tổng người dùng"
          value={mLoading ? "..." : formatNumber(metrics?.totalUsers ?? 0)}
          subtitle="tài khoản trên toàn nền tảng"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Khách hàng mới ({SIGNUP_WINDOW} ngày)</CardTitle>
          </CardHeader>
          <CardContent>
            {mLoading ? (
              <ChartSkeleton />
            ) : mError ? (
              <ChartError onRetry={() => refetchM()} />
            ) : (
              <SignupTrendChart data={metrics?.newTenantsByDay ?? []} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Doanh thu theo tháng ({REVENUE_WINDOW} tháng)</CardTitle>
          </CardHeader>
          <CardContent>
            {bLoading ? (
              <ChartSkeleton />
            ) : bError ? (
              <ChartError onRetry={() => refetchB()} />
            ) : (
              <RevenueChart data={billing?.revenueByMonth ?? []} />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Breakdown by plan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Breakdown
          title="Khách hàng theo gói"
          loading={mLoading}
          data={metrics?.tenantsByPlan}
        />
        <Breakdown
          title="Gói đăng ký theo loại"
          loading={bLoading}
          data={billing?.subscriptionsByPlan}
        />
      </div>

      <div className="mt-8">
        <Link
          href="/admin/tenants"
          className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Xem toàn bộ khách hàng
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </Link>
      </div>
    </div>
  )
}

function Breakdown({
  title,
  data,
  loading,
}: {
  title: string
  data?: Record<string, number>
  loading: boolean
}) {
  const rows = Object.entries(data ?? {}).sort((a, b) => b[1] - a[1])
  const total = rows.reduce((sum, [, v]) => sum + v, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <div className="h-24 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
        ) : rows.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">Chưa có dữ liệu.</p>
        ) : (
          rows.map(([key, value]) => {
            const pct = total > 0 ? Math.round((value / total) * 100) : 0
            return (
              <div key={key}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium capitalize text-slate-700 dark:text-slate-200">{key}</span>
                  <span className="tabular-nums text-slate-500 dark:text-slate-400">
                    {formatNumber(value)} ({pct}%)
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full rounded-full bg-brand-gradient" style={{ width: `${pct}%` }} />
                </div>
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}

function ChartSkeleton() {
  return <div className="h-[260px] animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
}

function ChartError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="h-[260px] flex flex-col items-center justify-center gap-3 text-center">
      <span className="material-symbols-outlined text-3xl text-slate-300 dark:text-slate-600">error</span>
      <p className="text-sm text-slate-500 dark:text-slate-400">Không tải được dữ liệu biểu đồ.</p>
      <button
        onClick={onRetry}
        className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
      >
        Thử lại
      </button>
    </div>
  )
}
