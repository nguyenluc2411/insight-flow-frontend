"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  useConfirmRefund,
  useDeleteTransaction,
  useMarkJunk,
  useRefunds,
} from "@/hooks/useAdmin"
import { useToast } from "@/hooks/use-toast"
import { cn, formatCurrency, formatNumber } from "@/lib/utils"
import { parseApiError } from "@/lib/errors"
import type { RefundTransaction } from "@/types/admin.types"

const PAGE_SIZE = 20

/** Per-row actions available for a given transaction list. */
export type TxActions = "none" | "refund" | "delete"

export interface TransactionsViewProps {
  title: string
  description: string
  /** Backend statuses to fetch for this view. */
  statuses: string[]
  /** Which row actions to expose. */
  actions?: TxActions
  searchPlaceholder?: string
}

/** Local datetime formatter (the shared formatDate shows date only). */
function formatDateTime(value: string | null): string {
  if (!value) return "—"
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value))
}

type ConfirmState = { type: "refund" | "junk" | "delete"; tx: RefundTransaction } | null

export function TransactionsView({
  title,
  description,
  statuses,
  actions = "none",
  searchPlaceholder = "Tìm mã tham chiếu, nội dung CK, mã đơn, gói...",
}: TransactionsViewProps) {
  const [qInput, setQInput] = useState("")
  const [q, setQ] = useState("")
  const [page, setPage] = useState(0)
  const [selected, setSelected] = useState<RefundTransaction | null>(null)
  const [confirm, setConfirm] = useState<ConfirmState>(null)

  // Debounce the search box; reset to the first page whenever the keyword changes.
  useEffect(() => {
    const t = setTimeout(() => {
      setQ(qInput.trim())
      setPage(0)
    }, 350)
    return () => clearTimeout(t)
  }, [qInput])

  const { data, isLoading, isError, isFetching, refetch } = useRefunds({
    statuses,
    q: q || undefined,
    page,
    size: PAGE_SIZE,
  })

  const rows = data?.content ?? []
  const totalPages = data?.totalPages ?? 0
  const totalElements = data?.totalElements ?? 0
  const hasActions = actions !== "none"
  const colSpan = hasActions ? 7 : 6

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{title}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">{description}</p>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <div className="relative w-full sm:max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-slate-400 pointer-events-none">
            search
          </span>
          <Input
            value={qInput}
            onChange={(e) => setQInput(e.target.value)}
            placeholder={searchPlaceholder}
            className="pl-10"
          />
        </div>
      </div>

      <Card className="overflow-hidden">
        {isError ? (
          <div className="p-10 flex flex-col items-center gap-3 text-center">
            <span className="material-symbols-outlined text-3xl text-slate-300 dark:text-slate-600">error</span>
            <p className="text-sm text-slate-500 dark:text-slate-400">Không tải được danh sách giao dịch.</p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Thử lại
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-left text-slate-500 dark:text-slate-400">
                  <th className="px-4 py-3 font-semibold">Thời gian</th>
                  <th className="px-4 py-3 font-semibold">Mã tham chiếu</th>
                  <th className="px-4 py-3 font-semibold">Gói</th>
                  <th className="px-4 py-3 font-semibold text-right">Số tiền</th>
                  <th className="px-4 py-3 font-semibold">Lý do</th>
                  <th className="px-4 py-3 font-semibold">Trạng thái</th>
                  {hasActions && <th className="px-4 py-3 font-semibold text-right">Thao tác</th>}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="border-b border-slate-50 dark:border-slate-800/50">
                      <td colSpan={colSpan} className="px-4 py-3">
                        <div className="h-5 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
                      </td>
                    </tr>
                  ))
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={colSpan} className="px-4 py-12 text-center text-slate-500 dark:text-slate-400">
                      {q ? "Không tìm thấy giao dịch khớp từ khoá." : "Không có giao dịch nào."}
                    </td>
                  </tr>
                ) : (
                  rows.map((t) => (
                    <tr
                      key={t.id}
                      onClick={() => setSelected(t)}
                      className="border-b border-slate-50 dark:border-slate-800/50 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
                    >
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {formatDateTime(t.transactionDate ?? t.createdAt)}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-600 dark:text-slate-300">
                        {t.referenceCode || "—"}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{t.packageCode || "—"}</td>
                      <td className="px-4 py-3 text-right tabular-nums font-medium text-slate-900 dark:text-slate-100">
                        {t.amount != null ? formatCurrency(t.amount) : "—"}
                      </td>
                      <td className="px-4 py-3 max-w-[260px] truncate text-slate-500 dark:text-slate-400">
                        {t.errorReason || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <TxStatusBadge status={t.status} />
                      </td>
                      {hasActions && (
                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                            {actions === "refund" && (
                              <>
                                <Button size="sm" variant="outline" onClick={() => setConfirm({ type: "refund", tx: t })}>
                                  Đã hoàn tiền
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => setConfirm({ type: "junk", tx: t })}>
                                  Không thuộc hệ thống
                                </Button>
                              </>
                            )}
                            {actions === "delete" && (
                              <Button size="sm" variant="destructive" onClick={() => setConfirm({ type: "delete", tx: t })}>
                                Xoá
                              </Button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {isLoading ? "Đang tải..." : `${formatNumber(totalElements)} giao dịch`}
          {isFetching && !isLoading ? " • đang cập nhật..." : ""}
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>
            Trước
          </Button>
          <span className="text-sm text-slate-500 dark:text-slate-400 tabular-nums">
            {totalPages === 0 ? 0 : page + 1}/{totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
          >
            Sau
          </Button>
        </div>
      </div>

      <TxDetailDialog transaction={selected} onClose={() => setSelected(null)} />
      <TxConfirmDialog state={confirm} onClose={() => setConfirm(null)} />
    </div>
  )
}

/** Read-only detail of a transaction. */
function TxDetailDialog({
  transaction,
  onClose,
}: {
  transaction: RefundTransaction | null
  onClose: () => void
}) {
  return (
    <Dialog open={!!transaction} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Chi tiết giao dịch</DialogTitle>
          <DialogDescription>
            Đối chiếu thông tin với sao kê ngân hàng. Thao tác (hoàn tiền / xoá) nằm ở danh sách.
          </DialogDescription>
        </DialogHeader>

        {transaction && (
          <div className="space-y-3 text-sm">
            <DetailRow label="Trạng thái">
              <TxStatusBadge status={transaction.status} />
            </DetailRow>
            <DetailRow label="Số tiền">
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {transaction.amount != null ? formatCurrency(transaction.amount) : "—"}
              </span>
            </DetailRow>
            <DetailRow label="Mã tham chiếu">
              <span className="font-mono text-xs">{transaction.referenceCode || "—"}</span>
            </DetailRow>
            <DetailRow label="Mã đơn">
              <span className="font-mono text-xs">{transaction.content || "—"}</span>
            </DetailRow>
            <DetailRow label="Gói">{transaction.packageCode || "—"}</DetailRow>
            <DetailRow label="Thời gian chuyển">{formatDateTime(transaction.transactionDate)}</DetailRow>
            <DetailRow label="TK nhận">
              <span className="font-mono text-xs">{transaction.accountNumber || "—"}</span>
            </DetailRow>
            <DetailRow label="Khách hàng">
              {transaction.tenantId ? (
                <Link
                  href={`/admin/tenants/${transaction.tenantId}`}
                  className="text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Xem khách hàng
                </Link>
              ) : (
                <span className="text-slate-400">Không khớp được khách hàng</span>
              )}
            </DetailRow>
            {transaction.errorReason && (
              <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 p-3">
                <p className="text-[11px] uppercase tracking-wide font-semibold text-amber-700 dark:text-amber-400 mb-1">
                  Lý do / lưu vết
                </p>
                <p className="text-amber-800 dark:text-amber-300 whitespace-pre-wrap text-xs">
                  {transaction.errorReason}
                </p>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/** Confirm + execute a row action (mark refunded / mark junk / delete). */
function TxConfirmDialog({ state, onClose }: { state: ConfirmState; onClose: () => void }) {
  const { toast } = useToast()
  const confirmRefund = useConfirmRefund()
  const markJunk = useMarkJunk()
  const deleteTxn = useDeleteTransaction()
  const [note, setNote] = useState("")

  // Reset the note whenever a new action is opened.
  useEffect(() => {
    setNote("")
  }, [state?.tx.id, state?.type])

  if (!state) return null

  const isBusy = confirmRefund.isPending || markJunk.isPending || deleteTxn.isPending

  const COPY = {
    refund: {
      title: "Xác nhận đã hoàn tiền",
      description: "Đánh dấu giao dịch đã được hoàn tiền thủ công cho khách. Trạng thái chuyển sang Đã hoàn tiền.",
      confirmLabel: "Xác nhận đã hoàn tiền",
      destructive: false,
      withNote: true,
    },
    junk: {
      title: "Đánh dấu không thuộc hệ thống",
      description: "Giao dịch sẽ được chuyển vào mục Giao dịch rác (không gắn với đơn hàng nào của hệ thống).",
      confirmLabel: "Chuyển vào giao dịch rác",
      destructive: false,
      withNote: true,
    },
    delete: {
      title: "Xoá vĩnh viễn giao dịch rác",
      description: "Hành động này xoá hẳn giao dịch khỏi hệ thống và KHÔNG THỂ khôi phục.",
      confirmLabel: "Xoá vĩnh viễn",
      destructive: true,
      withNote: false,
    },
  }[state.type]

  function handleConfirm() {
    if (!state) return
    const trimmed = note.trim() || undefined

    const onSuccess = (res: { message?: string }) => {
      toast({ title: COPY.title, description: res?.message })
      onClose()
    }
    const onError = (err: unknown) => {
      toast({
        title: "Thao tác thất bại",
        description: parseApiError(err, "Không thể thực hiện thao tác. Trạng thái giao dịch có thể đã thay đổi."),
        variant: "destructive",
      })
    }

    if (state.type === "refund") {
      confirmRefund.mutate({ id: state.tx.id, note: trimmed }, { onSuccess, onError })
    } else if (state.type === "junk") {
      markJunk.mutate({ id: state.tx.id, note: trimmed }, { onSuccess, onError })
    } else {
      deleteTxn.mutate(state.tx.id, { onSuccess, onError })
    }
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{COPY.title}</DialogTitle>
          <DialogDescription>{COPY.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-3 text-sm">
          <DetailRow label="Số tiền">
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {state.tx.amount != null ? formatCurrency(state.tx.amount) : "—"}
            </span>
          </DetailRow>
          <DetailRow label="Mã tham chiếu">
            <span className="font-mono text-xs">{state.tx.referenceCode || "—"}</span>
          </DetailRow>

          {COPY.withNote && (
            <div>
              <label
                htmlFor="action-note"
                className="block text-[11px] uppercase tracking-wide font-semibold text-slate-500 dark:text-slate-400 mb-1.5"
              >
                Ghi chú (tuỳ chọn)
              </label>
              <textarea
                id="action-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                placeholder={
                  state.type === "refund"
                    ? "VD: Đã hoàn 499.000đ qua MB, ref FT24XXXX"
                    : "VD: Người lạ chuyển nhầm, không có mã đơn"
                }
                className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isBusy}>
            Huỷ
          </Button>
          <Button
            variant={COPY.destructive ? "destructive" : "default"}
            onClick={handleConfirm}
            disabled={isBusy}
          >
            {isBusy ? "Đang xử lý..." : COPY.confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-slate-500 dark:text-slate-400 shrink-0">{label}</span>
      <span className="text-right text-slate-700 dark:text-slate-200 min-w-0">{children}</span>
    </div>
  )
}

const TX_STATUS_STYLES: Record<string, string> = {
  PENDING_REFUND: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  REFUNDED: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400",
  SUCCESS: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
  JUNK: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  FAILED_VALIDATION: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400",
}

const TX_STATUS_LABELS: Record<string, string> = {
  PENDING_REFUND: "Chờ hoàn tiền",
  REFUNDED: "Đã hoàn tiền",
  SUCCESS: "Thành công",
  JUNK: "Giao dịch rác",
  FAILED_VALIDATION: "Thất bại",
}

function TxStatusBadge({ status }: { status: string }) {
  const key = status?.toUpperCase()
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        TX_STATUS_STYLES[key] ?? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
      )}
    >
      {TX_STATUS_LABELS[key] ?? status}
    </span>
  )
}
