"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { TenantStatusBadge } from "@/components/admin/TenantStatusBadge"
import {
  useAdminTenant,
  useTenantBillingHistory,
  useTenantTransactions,
  useUpdateTenantStatus,
} from "@/hooks/useAdmin"
import { useToast } from "@/hooks/use-toast"
import { formatCurrency, formatDate } from "@/lib/utils"
import { parseApiError } from "@/lib/errors"

export default function AdminTenantDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id ?? null

  const { data: tenant, isLoading, isError, refetch } = useAdminTenant(id)
  const updateStatus = useUpdateTenantStatus()
  const { toast } = useToast()
  const [confirmOpen, setConfirmOpen] = useState(false)

  const isSuspended = tenant?.status?.toLowerCase() === "suspended"
  const nextStatus = isSuspended ? "active" : "suspended"

  function handleToggleStatus() {
    if (!id) return
    updateStatus.mutate(
      { id, status: nextStatus },
      {
        onSuccess: () => {
          setConfirmOpen(false)
          toast({
            title: isSuspended ? "Đã kích hoạt lại" : "Đã tạm ngưng",
            description: isSuspended
              ? "Khách hàng có thể truy cập trở lại."
              : "Khách hàng đã bị tạm ngưng truy cập.",
          })
        },
        onError: (err) => {
          toast({
            title: "Cập nhật thất bại",
            description: parseApiError(err, "Không thể đổi trạng thái. Vui lòng thử lại."),
            variant: "destructive",
          })
        },
      }
    )
  }

  return (
    <div>
      <Link
        href="/admin/tenants"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 mb-6"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Danh sách khách hàng
      </Link>

      {isLoading ? (
        <div className="space-y-4">
          <div className="h-24 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
          <div className="h-64 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
        </div>
      ) : isError || !tenant ? (
        <Card>
          <CardContent className="p-10 flex flex-col items-center gap-3 text-center">
            <span className="material-symbols-outlined text-3xl text-slate-300 dark:text-slate-600">error</span>
            <p className="text-sm text-slate-500 dark:text-slate-400">Không tải được thông tin khách hàng.</p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Thử lại
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{tenant.name}</h1>
                <TenantStatusBadge status={tenant.status} />
              </div>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                {tenant.slug} • Gói <span className="capitalize font-medium">{tenant.plan}</span>
              </p>
            </div>
            <Button
              variant={isSuspended ? "default" : "destructive"}
              onClick={() => setConfirmOpen(true)}
              disabled={updateStatus.isPending}
            >
              <span className="material-symbols-outlined text-[18px] mr-1.5">
                {isSuspended ? "play_circle" : "block"}
              </span>
              {isSuspended ? "Kích hoạt lại" : "Tạm ngưng"}
            </Button>
          </div>

          {/* Meta */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <MetaCard label="Ngày tạo" value={formatDate(tenant.createdAt)} />
            <MetaCard
              label="Kết thúc dùng thử"
              value={tenant.trialEndsAt ? formatDate(tenant.trialEndsAt) : "—"}
            />
            <MetaCard label="Số người dùng" value={String(tenant.users?.length ?? 0)} />
          </div>

          {/* Users */}
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Người dùng</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-y border-slate-100 dark:border-slate-800 text-left text-slate-500 dark:text-slate-400">
                      <th className="px-6 py-3 font-semibold">Người dùng</th>
                      <th className="px-6 py-3 font-semibold">Vai trò</th>
                      <th className="px-6 py-3 font-semibold">Trạng thái</th>
                      <th className="px-6 py-3 font-semibold">Đăng nhập gần nhất</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(tenant.users ?? []).length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-10 text-center text-slate-500 dark:text-slate-400">
                          Chưa có người dùng.
                        </td>
                      </tr>
                    ) : (
                      tenant.users.map((u) => (
                        <tr key={u.id} className="border-b border-slate-50 dark:border-slate-800/50">
                          <td className="px-6 py-3">
                            <div className="font-medium text-slate-900 dark:text-slate-100">{u.fullName || "—"}</div>
                            <div className="text-xs text-slate-400">{u.email}</div>
                          </td>
                          <td className="px-6 py-3 text-slate-600 dark:text-slate-300">
                            {u.roles?.join(", ") || "—"}
                          </td>
                          <td className="px-6 py-3">
                            <TenantStatusBadge status={u.status} />
                          </td>
                          <td className="px-6 py-3 text-slate-500 dark:text-slate-400">
                            {u.lastLoginAt ? formatDate(u.lastLoginAt) : "Chưa đăng nhập"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Billing */}
          {id && <TenantBilling tenantId={id} />}
        </>
      )}

      {/* Confirm dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isSuspended ? "Kích hoạt lại khách hàng?" : "Tạm ngưng khách hàng?"}</DialogTitle>
            <DialogDescription>
              {isSuspended
                ? `“${tenant?.name}” sẽ được phép truy cập nền tảng trở lại.`
                : `“${tenant?.name}” sẽ bị chặn truy cập cho đến khi được kích hoạt lại.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)} disabled={updateStatus.isPending}>
              Huỷ
            </Button>
            <Button
              variant={isSuspended ? "default" : "destructive"}
              onClick={handleToggleStatus}
              disabled={updateStatus.isPending}
            >
              {updateStatus.isPending ? "Đang xử lý..." : "Xác nhận"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function TenantBilling({ tenantId }: { tenantId: string }) {
  const { data: history, isLoading: hLoading, isError: hError } = useTenantBillingHistory(tenantId)
  const { data: txns, isLoading: tLoading, isError: tError } = useTenantTransactions(tenantId)

  const statusColor = (status?: string | null) => {
    const s = status?.toUpperCase()
    if (s === "SUCCESS") return "text-green-600 dark:text-green-400"
    if (s === "REFUNDED" || s?.startsWith("PENDING")) return "text-amber-600 dark:text-amber-400"
    if (s?.startsWith("FAILED")) return "text-red-600 dark:text-red-400"
    return "text-slate-500 dark:text-slate-400"
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {/* Payment transactions */}
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Lịch sử thanh toán</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {tLoading ? (
            <div className="p-6 space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-6 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
              ))}
            </div>
          ) : tError ? (
            <p className="p-6 text-sm text-slate-500 dark:text-slate-400">Không tải được giao dịch.</p>
          ) : (txns?.content ?? []).length === 0 ? (
            <p className="p-6 text-sm text-slate-500 dark:text-slate-400">Chưa có giao dịch thanh toán.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-y border-slate-100 dark:border-slate-800 text-left text-slate-500 dark:text-slate-400">
                    <th className="px-6 py-3 font-semibold">Thời gian</th>
                    <th className="px-6 py-3 font-semibold">Gói</th>
                    <th className="px-6 py-3 font-semibold text-right">Số tiền</th>
                    <th className="px-6 py-3 font-semibold">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {txns!.content.map((t) => (
                    <tr key={t.id} className="border-b border-slate-50 dark:border-slate-800/50">
                      <td className="px-6 py-3 text-slate-500 dark:text-slate-400">{formatDate(t.createdAt)}</td>
                      <td className="px-6 py-3 text-slate-600 dark:text-slate-300">{t.packageCode || "—"}</td>
                      <td className="px-6 py-3 text-right tabular-nums font-medium text-slate-900 dark:text-slate-100">
                        {t.amount != null ? formatCurrency(t.amount) : "—"}
                      </td>
                      <td className={`px-6 py-3 font-medium ${statusColor(t.status)}`}>{t.status || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Billing history (subscription events) */}
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Lịch sử gói đăng ký</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {hLoading ? (
            <div className="p-6 space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-6 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
              ))}
            </div>
          ) : hError ? (
            <p className="p-6 text-sm text-slate-500 dark:text-slate-400">Không tải được lịch sử gói.</p>
          ) : (history?.content ?? []).length === 0 ? (
            <p className="p-6 text-sm text-slate-500 dark:text-slate-400">Chưa có thay đổi gói nào.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-y border-slate-100 dark:border-slate-800 text-left text-slate-500 dark:text-slate-400">
                    <th className="px-6 py-3 font-semibold">Thời gian</th>
                    <th className="px-6 py-3 font-semibold">Sự kiện</th>
                    <th className="px-6 py-3 font-semibold">Gói</th>
                    <th className="px-6 py-3 font-semibold text-right">Số tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {history!.content.map((h) => (
                    <tr key={h.id} className="border-b border-slate-50 dark:border-slate-800/50">
                      <td className="px-6 py-3 text-slate-500 dark:text-slate-400">{formatDate(h.createdAt)}</td>
                      <td className="px-6 py-3 text-slate-600 dark:text-slate-300">{h.eventType || "—"}</td>
                      <td className="px-6 py-3 text-slate-600 dark:text-slate-300">
                        {h.fromPackageCode ? `${h.fromPackageCode} → ` : ""}
                        {h.toPackageCode || "—"}
                      </td>
                      <td className="px-6 py-3 text-right tabular-nums text-slate-900 dark:text-slate-100">
                        {h.amountVnd != null ? formatCurrency(h.amountVnd) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function MetaCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-100 dark:border-slate-800">
      <p className="text-[11px] uppercase tracking-[.06em] text-slate-500 dark:text-slate-400 font-semibold">
        {label}
      </p>
      <p className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1">{value}</p>
    </div>
  )
}
