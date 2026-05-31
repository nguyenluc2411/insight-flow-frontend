"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useActiveVariants } from "@/hooks/useCatalog"
import { salesService } from "@/services/sales.service"
import { useToast } from "@/hooks/use-toast"
import { ROUTES } from "@/lib/constants"
import type { ProductVariant } from "@/services/catalog.service"

const CHANNELS = [
  { value: "store",   label: "Tại cửa hàng" },
  { value: "shopee",  label: "Shopee" },
  { value: "tiktok",  label: "TikTok Shop" },
  { value: "website", label: "Website" },
  { value: "other",   label: "Khác" },
]

interface SaleRow {
  variantId: string
  quantity: number
  unitPrice: number
  channel: string
}

function emptyRow(): SaleRow {
  return { variantId: "", quantity: 1, unitPrice: 0, channel: "store" }
}

function formatVariantLabel(v: ProductVariant): string {
  const parts = [v.sku]
  if (v.size)  parts.push(v.size)
  if (v.color) parts.push(v.color)
  return parts.join(" · ")
}

export default function RecordSalesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { data: variants = [], isLoading: variantsLoading } = useActiveVariants()

  const today = new Date().toISOString().slice(0, 10)
  const [saleDate, setSaleDate] = useState(today)
  const [rows, setRows] = useState<SaleRow[]>([emptyRow()])
  const [isSaving, setIsSaving] = useState(false)

  function variantById(id: string): ProductVariant | undefined {
    return variants.find((v) => v.id === id)
  }

  function updateRow(index: number, patch: Partial<SaleRow>) {
    setRows((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], ...patch }
      // Auto-fill price when variant is selected
      if (patch.variantId) {
        const v = variantById(patch.variantId)
        if (v?.sellingPrice) next[index].unitPrice = v.sellingPrice
      }
      return next
    })
  }

  function addRow() {
    setRows((prev) => [...prev, emptyRow()])
  }

  function removeRow(index: number) {
    setRows((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit() {
    const validRows = rows.filter((r) => r.variantId && r.quantity > 0 && r.unitPrice > 0)
    if (validRows.length === 0) {
      toast({ title: "Chưa có dòng nào hợp lệ", description: "Chọn sản phẩm, nhập số lượng và giá bán.", variant: "destructive" })
      return
    }

    // Group by channel — create one order per channel
    const byChannel = validRows.reduce<Record<string, SaleRow[]>>((acc, row) => {
      if (!acc[row.channel]) acc[row.channel] = []
      acc[row.channel].push(row)
      return acc
    }, {})

    setIsSaving(true)
    try {
      for (const [channel, channelRows] of Object.entries(byChannel)) {
        const order = await salesService.createOrder({
          channel,
          items: channelRows.map((r) => ({
            variantId: r.variantId,
            quantity: r.quantity,
            unitPrice: r.unitPrice,
          })),
        })
        await salesService.completeOrder(order.id)
      }

      toast({
        title: "Đã lưu doanh số",
        description: `${validRows.length} dòng · AI sẽ cập nhật dự báo trong vài phút`,
      })
      router.push(ROUTES.FORECAST)
    } catch {
      toast({ title: "Lỗi lưu doanh số", description: "Vui lòng thử lại.", variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Ghi nhận doanh số</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Nhập doanh số bán hàng để AI cải thiện độ chính xác dự báo
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 space-y-6">
        {/* Date */}
        <div className="flex items-center gap-4">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 w-24 shrink-0">
            Ngày bán
          </label>
          <input
            type="date"
            value={saleDate}
            max={today}
            onChange={(e) => setSaleDate(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        {/* Table header */}
        <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider pb-1 border-b border-slate-100 dark:border-slate-800">
          <div className="col-span-5">Sản phẩm</div>
          <div className="col-span-2 text-center">SL bán</div>
          <div className="col-span-2 text-center">Giá (₫)</div>
          <div className="col-span-2">Kênh</div>
          <div className="col-span-1" />
        </div>

        {/* Rows */}
        {variantsLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => <div key={i} className="h-10 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />)}
          </div>
        ) : variants.length === 0 ? (
          <div className="text-center py-8">
            <span className="material-symbols-outlined text-slate-300 text-4xl mb-2 block">inventory_2</span>
            <p className="text-sm text-slate-500 dark:text-slate-400">Chưa có sản phẩm nào.</p>
            <p className="text-xs text-slate-400 mt-1">Kết nối POS hoặc thêm sản phẩm trước.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {rows.map((row, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-center">
                {/* Variant select */}
                <div className="col-span-5">
                  <select
                    value={row.variantId}
                    onChange={(e) => updateRow(i, { variantId: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    <option value="">-- Chọn sản phẩm --</option>
                    {variants.map((v) => (
                      <option key={v.id} value={v.id}>{formatVariantLabel(v)}</option>
                    ))}
                  </select>
                </div>

                {/* Quantity */}
                <div className="col-span-2">
                  <input
                    type="number"
                    min={1}
                    value={row.quantity}
                    onChange={(e) => updateRow(i, { quantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-center text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                {/* Price */}
                <div className="col-span-2">
                  <input
                    type="number"
                    min={0}
                    value={row.unitPrice}
                    onChange={(e) => updateRow(i, { unitPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-center text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                {/* Channel */}
                <div className="col-span-2">
                  <select
                    value={row.channel}
                    onChange={(e) => updateRow(i, { channel: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    {CHANNELS.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>

                {/* Remove */}
                <div className="col-span-1 flex justify-center">
                  {rows.length > 1 && (
                    <button
                      onClick={() => removeRow(i)}
                      className="text-slate-400 hover:text-red-500 transition"
                    >
                      <span className="material-symbols-outlined text-[18px]">remove_circle</span>
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Add row */}
            <button
              onClick={addRow}
              className="flex items-center gap-1.5 text-sm text-primary font-medium hover:underline mt-1"
            >
              <span className="material-symbols-outlined text-[16px]">add_circle</span>
              Thêm sản phẩm
            </button>
          </div>
        )}

        {/* Summary + Submit */}
        {variants.length > 0 && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="text-sm text-slate-500 dark:text-slate-400">
              {rows.filter(r => r.variantId && r.quantity > 0).length} sản phẩm ·{" "}
              {rows.filter(r => r.variantId && r.quantity > 0).reduce((s, r) => s + r.quantity, 0)} đơn vị
            </div>
            <button
              onClick={handleSubmit}
              disabled={isSaving || rows.every(r => !r.variantId)}
              className="flex items-center gap-2 px-6 py-2.5 bg-brand-gradient text-white font-bold text-sm rounded-xl hover:opacity-90 disabled:opacity-50 transition"
            >
              <span className={`material-symbols-outlined text-[18px] ${isSaving ? "animate-spin" : ""}`}>
                {isSaving ? "progress_activity" : "save"}
              </span>
              {isSaving ? "Đang lưu..." : "Lưu doanh số"}
            </button>
          </div>
        )}
      </div>

      {/* Info box */}
      <div className="mt-4 flex items-start gap-3 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 rounded-xl p-4">
        <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">lightbulb</span>
        <p className="text-xs text-indigo-700 dark:text-indigo-300 leading-relaxed">
          Dữ liệu bạn nhập sẽ được AI sử dụng để cải thiện dự báo nhu cầu. Sau 2–4 tuần ghi nhận, dự báo sẽ cá nhân hóa cho riêng shop của bạn thay vì dựa trên xu hướng thị trường chung.
        </p>
      </div>
    </div>
  )
}
