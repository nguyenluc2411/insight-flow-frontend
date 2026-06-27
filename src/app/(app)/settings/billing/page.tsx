"use client"

import { useEffect, useState } from "react"
import { useAuthStore } from "@/stores/auth.store"
import { billingService } from "@/services/billing.service"
import type { Package, Subscription, UsageStatus, CheckoutInfo } from "@/types/billing.types"
import { useToast } from "@/hooks/use-toast"
import { parseApiError } from "@/lib/errors"
import { cn } from "@/lib/utils"
import { PaymentQrDialog } from "@/components/billing/PaymentQrDialog"
import { clearEntitlementsCache } from "@/hooks/use-entitlements"

const FEATURE_LABELS: Record<string, string> = {
  DEMAND_FORECAST: "Dự báo nhu cầu AI",
  INVENTORY_RECOMMEND: "Đề xuất xử lý tồn kho",
  SALES_ANALYTICS: "Phân tích bán hàng",
  MULTI_LOCATION: "Hỗ trợ nhiều chi nhánh",
  EXPORT_REPORTS: "Xuất báo cáo",
  API_ACCESS: "Truy cập API",
  PRIORITY_SUPPORT: "Hỗ trợ ưu tiên",
  KIOTVIET_INTEGRATION: "Tích hợp KiotViet",
  SAPO_INTEGRATION: "Tích hợp Sapo",
}

function formatVnd(price: number): string {
  if (price === 0) return "Miễn phí"
  return new Intl.NumberFormat("vi-VN").format(price) + "đ"
}

function pickMonthlyPlan(pkg: Package) {
  return (
    pkg.plans.find((p) => p.billingCycle === "MONTHLY") ??
    pkg.plans.find((p) => p.billingCycle === "TRIAL") ??
    pkg.plans[0]
  )
}

export default function BillingPage() {
  const { tenant, updateTenantPlan } = useAuthStore()
  const { toast } = useToast()

  const [packages, setPackages] = useState<Package[]>([])
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [usage, setUsage] = useState<UsageStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [upgradingCode, setUpgradingCode] = useState<string | null>(null)
  const [checkout, setCheckout] = useState<CheckoutInfo | null>(null)
  const [payOpen, setPayOpen] = useState(false)
  const [payTarget, setPayTarget] = useState<{
    name: string
    isPaid: (sub: Subscription) => boolean
  } | null>(null)

  // Sync resolved plan code into auth store so dashboard / other pages stay fresh.
  const currentPkgCode =
    subscription?.packageCode?.toUpperCase() ??
    packages.find((p) => p.plans.some((pl) => pl.id === subscription?.planId))?.code ??
    (tenant?.plan?.toUpperCase() ?? "TRIAL")

  useEffect(() => {
    if (subscription?.packageCode) {
      updateTenantPlan(subscription.packageCode.toLowerCase())
    }
  }, [subscription]) // eslint-disable-line react-hooks/exhaustive-deps

  async function loadData() {
    clearEntitlementsCache()
    setLoading(true)
    try {
      const [pkgs, sub, usg] = await Promise.allSettled([
        billingService.getPackages(),
        billingService.getCurrentSubscription(),
        billingService.getUsage(),
      ])
      if (pkgs.status === "fulfilled") {
        setPackages([...pkgs.value].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)))
      }
      if (sub.status === "fulfilled") setSubscription(sub.value)
      if (usg.status === "fulfilled") setUsage(usg.value)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  // mode "upgrade": detect plan switch. mode "renew": detect endDate extension (same plan).
  async function startCheckout(pkg: Package, mode: "upgrade" | "renew") {
    const plan = pickMonthlyPlan(pkg)
    if (!plan) return
    const baselineEnd = subscription?.endDate ? new Date(subscription.endDate).getTime() : 0
    const isPaid =
      mode === "upgrade"
        ? (sub: Subscription) => sub.planId === plan.id
        : (sub: Subscription) => !!sub.endDate && new Date(sub.endDate).getTime() > baselineEnd
    setUpgradingCode(pkg.code)
    try {
      const info = await billingService.createCheckout(pkg.code, plan.billingCycle)
      setCheckout(info)
      setPayTarget({ name: pkg.name, isPaid })
      setPayOpen(true)
    } catch (err: unknown) {
      toast({
        title: "Lỗi tạo thanh toán",
        description: parseApiError(err, "Không thể tạo mã thanh toán. Vui lòng thử lại."),
        variant: "destructive",
      })
    } finally {
      setUpgradingCode(null)
    }
  }

  const handleUpgrade = (pkg: Package) => startCheckout(pkg, "upgrade")

  function handleRenew() {
    const pkg = packages.find((p) => p.code === currentPkgCode)
    if (pkg) startCheckout(pkg, "renew")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="material-symbols-outlined animate-spin text-primary text-3xl">progress_activity</span>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Gói dịch vụ</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Quản lý gói và thanh toán của bạn</p>
      </div>

      <div className="space-y-6">
        {/* Current Plan Summary */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Gói hiện tại</p>
              {currentPkgCode === "TRIAL" ? (
                <div>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400">
                      Bản dùng thử
                    </span>
                    {subscription?.endDate && (
                      <span className="text-sm text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">schedule</span>
                        Còn đến {new Date(subscription.endDate).toLocaleDateString("vi-VN")}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    Hết hạn dùng thử, tài khoản sẽ tự chuyển về bản miễn phí. Nâng cấp để giữ các tính năng nâng cao.
                  </p>
                </div>
              ) : ["BASIC", "ADVANCED", "PRO"].includes(currentPkgCode) ? (
                <span className={cn(
                  "inline-flex items-center px-3 py-1 rounded-full text-sm font-bold",
                  currentPkgCode === "PRO"
                    ? "bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300"
                    : currentPkgCode === "ADVANCED"
                    ? "bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                )}>
                  {currentPkgCode}
                </span>
              ) : (
                <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                  Bạn đang dùng bản miễn phí — nâng cấp để mở khóa dự báo và đề xuất AI.
                </p>
              )}
            </div>
            {["BASIC", "ADVANCED", "PRO"].includes(currentPkgCode) && (
              <div className="text-right shrink-0">
                {subscription?.endDate && (
                  <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">
                    Gia hạn {new Date(subscription.endDate).toLocaleDateString("vi-VN")}
                  </p>
                )}
                <button
                  onClick={handleRenew}
                  disabled={upgradingCode !== null}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:border-primary/50 hover:text-primary transition disabled:opacity-60"
                >
                  Gia hạn gói
                </button>
              </div>
            )}
          </div>

          {/* Usage stats */}
          {usage && (
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <UsageStat label="Lượt gọi API hôm nay" value={usage.apiCallsCount} max={usage.maxApiCallsPerDay} />
              <UsageStat label="Báo cáo đã tạo" value={usage.reportsGeneratedCount} />
              <UsageStat label="Lượt dự báo" value={usage.forecastsExecutedCount} />
              <UsageStat
                label="Lưu trữ (GB)"
                value={Math.round((usage.storageUsedBytes / 1_073_741_824) * 100) / 100}
                max={usage.maxStorageGb}
              />
            </div>
          )}
        </div>

        {/* Plan Cards — only marketed plans; Free/Trial are not selectable plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages
            .filter((pkg) => !["FREE", "TRIAL"].includes(pkg.code))
            .map((pkg) => {
            const isCurrent = currentPkgCode === pkg.code
            const plan = pickMonthlyPlan(pkg)
            const highlight = pkg.code === "ADVANCED"
            const isUpgrading = upgradingCode === pkg.code
            return (
              <div
                key={pkg.id}
                className={cn(
                  "relative bg-white dark:bg-slate-900 rounded-xl border-2 p-6 flex flex-col transition-all",
                  isCurrent
                    ? "border-primary shadow-soft"
                    : highlight
                    ? "border-indigo-200 dark:border-indigo-800"
                    : "border-slate-100 dark:border-slate-800"
                )}
              >
                {highlight && !isCurrent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-brand-gradient text-white text-xs font-bold px-3 py-1 rounded-full">
                      Phổ biến nhất
                    </span>
                  </div>
                )}
                {isCurrent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span>
                      Gói của bạn
                    </span>
                  </div>
                )}

                <div className="mb-4">
                  <p className="font-bold text-lg text-slate-900 dark:text-slate-100">{pkg.name}</p>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-black text-slate-900 dark:text-slate-100">
                      {formatVnd(plan?.priceVnd ?? 0)}
                    </span>
                    {plan && plan.priceVnd > 0 && (
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        / {plan.billingCycle === "YEARLY" ? "năm" : "tháng"}
                      </span>
                    )}
                  </div>
                  {pkg.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{pkg.description}</p>
                  )}
                </div>

                <ul className="space-y-2 flex-1 mb-6">
                  {pkg.featureCodes.map((code) => (
                    <li key={code} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <span className="material-symbols-outlined text-[16px] text-green-500 mt-0.5 shrink-0">check</span>
                      {FEATURE_LABELS[code] ?? code}
                    </li>
                  ))}
                </ul>

                <button
                  disabled={isCurrent || isUpgrading}
                  onClick={() => handleUpgrade(pkg)}
                  className={cn(
                    "w-full py-2.5 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2",
                    isCurrent
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-default"
                      : highlight
                      ? "bg-brand-gradient text-white hover:opacity-90"
                      : "border-2 border-primary text-primary hover:bg-primary/5",
                    isUpgrading && "opacity-60"
                  )}
                >
                  {isUpgrading && (
                    <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
                  )}
                  {isCurrent ? "Gói hiện tại" : isUpgrading ? "Đang tạo mã..." : `Nâng cấp gói ${pkg.name}`}
                </button>
              </div>
            )
          })}
        </div>

        {/* Contact */}
        <div className="bg-indigo-50 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900 p-6">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-primary text-[24px] shrink-0">support_agent</span>
            <div>
              <p className="font-bold text-slate-900 dark:text-slate-100 mb-1">Cần hỗ trợ về thanh toán?</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Liên hệ với chúng tôi qua email{" "}
                <a href="mailto:support@insightflow.ai" className="text-primary font-semibold hover:underline">
                  support@insightflow.ai
                </a>{" "}
                để được tư vấn gói phù hợp hoặc xử lý các vấn đề thanh toán.
              </p>
            </div>
          </div>
        </div>
      </div>

      <PaymentQrDialog
        open={payOpen}
        onOpenChange={setPayOpen}
        checkout={checkout}
        packageName={payTarget?.name ?? ""}
        isPaid={payTarget?.isPaid ?? (() => false)}
        onSuccess={loadData}
      />
    </div>
  )
}

function UsageStat({ label, value, max }: { label: string; value: number; max?: number }) {
  const unlimited = max === -1
  return (
    <div>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{label}</p>
      <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
        {value}
        {max !== undefined && (
          <span className="text-sm font-normal text-slate-400">
            {" "}/ {unlimited ? "∞" : max}
          </span>
        )}
      </p>
    </div>
  )
}
