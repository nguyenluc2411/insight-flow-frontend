"use client"

import { useEffect, useRef, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { billingService } from "@/services/billing.service"
import type { CheckoutInfo } from "@/types/billing.types"
import { useToast } from "@/hooks/use-toast"

const EXPIRY_SECONDS = 15 * 60
const POLL_MS = 4000

type Phase = "waiting" | "success" | "expired"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  checkout: CheckoutInfo | null
  packageName: string
  /** Plan id the subscription should switch to once payment is confirmed. */
  targetPlanId: string | null
  /** Called once the upgrade is detected (parent reloads billing data). */
  onSuccess: () => void
}

function formatVnd(n: number): string {
  return new Intl.NumberFormat("vi-VN").format(n) + "đ"
}

function mmss(total: number): string {
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${s.toString().padStart(2, "0")}`
}

export function PaymentQrDialog({
  open,
  onOpenChange,
  checkout,
  packageName,
  targetPlanId,
  onSuccess,
}: Props) {
  const { toast } = useToast()
  const [phase, setPhase] = useState<Phase>("waiting")
  const [remaining, setRemaining] = useState(EXPIRY_SECONDS)
  const successFired = useRef(false)

  // Reset state whenever a fresh checkout is opened.
  useEffect(() => {
    if (open && checkout) {
      setPhase("waiting")
      setRemaining(EXPIRY_SECONDS)
      successFired.current = false
    }
  }, [open, checkout])

  // 15-minute countdown (matches the BE Redis TTL for the order code).
  useEffect(() => {
    if (!open || phase !== "waiting") return
    const t = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          setPhase("expired")
          return 0
        }
        return r - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [open, phase])

  // Poll the subscription: SePay's webhook auto-upgrades the plan after the transfer.
  useEffect(() => {
    if (!open || phase !== "waiting" || !targetPlanId) return
    let active = true
    const t = setInterval(async () => {
      try {
        const sub = await billingService.getCurrentSubscription()
        if (active && sub.planId === targetPlanId && !successFired.current) {
          successFired.current = true
          setPhase("success")
          onSuccess()
        }
      } catch {
        // Ignore transient errors while polling.
      }
    }, POLL_MS)
    return () => {
      active = false
      clearInterval(t)
    }
  }, [open, phase, targetPlanId, onSuccess])

  async function copy(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text)
      toast({ title: `Đã copy ${label}` })
    } catch {
      // Clipboard may be unavailable (non-secure context) — ignore.
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Thanh toán gói {packageName}</DialogTitle>
          <DialogDescription>
            {phase === "waiting" &&
              "Quét mã QR bằng app ngân hàng. Gói tự mở khoá ngay khi hệ thống nhận được tiền."}
            {phase === "success" && "Thanh toán thành công!"}
            {phase === "expired" && "Mã thanh toán đã hết hạn."}
          </DialogDescription>
        </DialogHeader>

        {phase === "success" ? (
          <div className="flex flex-col items-center py-6 gap-3">
            <span className="material-symbols-outlined text-green-500 text-5xl">check_circle</span>
            <p className="font-bold text-slate-900 dark:text-slate-100">Đã nâng cấp gói {packageName}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
              Các tính năng mới đã được mở khoá.
            </p>
            <button
              onClick={() => onOpenChange(false)}
              className="mt-2 px-4 py-2 rounded-lg bg-brand-gradient text-white text-sm font-bold"
            >
              Hoàn tất
            </button>
          </div>
        ) : phase === "expired" ? (
          <div className="flex flex-col items-center py-6 gap-3">
            <span className="material-symbols-outlined text-amber-500 text-5xl">timer_off</span>
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
              Mã đã hết hạn sau 15 phút. Vui lòng tạo lại thanh toán.
            </p>
            <button
              onClick={() => onOpenChange(false)}
              className="mt-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium"
            >
              Đóng
            </button>
          </div>
        ) : checkout ? (
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={checkout.qrUrl} alt="VietQR" className="w-56 h-56 object-contain" />
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
              Đang chờ thanh toán · còn {mmss(remaining)}
            </div>

            <div className="w-full rounded-lg bg-slate-50 dark:bg-slate-800/50 p-3 text-sm space-y-1.5">
              <Row label="Số tiền" value={formatVnd(checkout.amount)} onCopy={() => copy(String(checkout.amount), "số tiền")} />
              <Row label="Ngân hàng" value={checkout.bankId} />
              <Row label="Số TK" value={checkout.accountNo} onCopy={() => copy(checkout.accountNo, "số tài khoản")} />
              <Row label="Chủ TK" value={checkout.accountName} />
              <Row label="Nội dung CK" value={checkout.content} onCopy={() => copy(checkout.content, "nội dung")} highlight />
            </div>

            <p className="text-xs text-amber-600 dark:text-amber-400 text-center">
              Giữ nguyên nội dung chuyển khoản <b>{checkout.content}</b> để hệ thống tự khớp giao dịch.
            </p>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

function Row({
  label,
  value,
  onCopy,
  highlight,
}: {
  label: string
  value: string
  onCopy?: () => void
  highlight?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-slate-500 dark:text-slate-400">{label}</span>
      <span className="flex items-center gap-1.5">
        <span className={highlight ? "font-bold text-primary" : "font-medium text-slate-900 dark:text-slate-100"}>
          {value}
        </span>
        {onCopy && (
          <button onClick={onCopy} className="text-slate-400 hover:text-primary" aria-label={`Copy ${label}`}>
            <span className="material-symbols-outlined text-[16px]">content_copy</span>
          </button>
        )}
      </span>
    </div>
  )
}
