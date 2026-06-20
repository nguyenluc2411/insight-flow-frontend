"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  useAdminPackages,
  useCreatePackage,
  useUpdatePackage,
  useUpdatePlan,
} from "@/hooks/useAdmin"
import { useToast } from "@/hooks/use-toast"
import { formatCurrency } from "@/lib/utils"
import { parseApiError } from "@/lib/errors"
import type { BillingPackage, BillingPlan } from "@/types/admin.types"

export default function AdminPlansPage() {
  const { data: packages, isLoading, isError, refetch } = useAdminPackages()
  const updatePlan = useUpdatePlan()
  const updatePackage = useUpdatePackage()
  const { toast } = useToast()

  const [editingPlan, setEditingPlan] = useState<BillingPlan | null>(null)
  const [createOpen, setCreateOpen] = useState(false)

  function togglePackage(pkg: BillingPackage) {
    const next = pkg.status?.toUpperCase() === "ACTIVE" ? "INACTIVE" : "ACTIVE"
    updatePackage.mutate(
      { packageId: pkg.id, status: next },
      {
        onSuccess: () =>
          toast({
            title: next === "ACTIVE" ? "Đã hiển thị gói" : "Đã ẩn gói",
            description: `“${pkg.name}” ${next === "ACTIVE" ? "hiển thị cho khách hàng" : "đã ẩn khỏi trang giá"}.`,
          }),
        onError: (err) =>
          toast({
            title: "Cập nhật thất bại",
            description: parseApiError(err, "Không thể đổi trạng thái gói."),
            variant: "destructive",
          }),
      }
    )
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Gói & Giá</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Quản lý các gói dịch vụ, chỉnh giá và hiển thị cho khách hàng.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <span className="material-symbols-outlined text-[18px] mr-1.5">add</span>
          Tạo gói
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
          ))}
        </div>
      ) : isError ? (
        <Card>
          <CardContent className="p-10 flex flex-col items-center gap-3 text-center">
            <span className="material-symbols-outlined text-3xl text-slate-300 dark:text-slate-600">error</span>
            <p className="text-sm text-slate-500 dark:text-slate-400">Không tải được danh sách gói.</p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Thử lại
            </Button>
          </CardContent>
        </Card>
      ) : (packages ?? []).length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center text-slate-500 dark:text-slate-400">
            Chưa có gói nào. Bấm “Tạo gói” để thêm.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {packages!.map((pkg) => {
            const hidden = pkg.status?.toUpperCase() !== "ACTIVE"
            return (
              <Card key={pkg.id} className={hidden ? "opacity-70" : ""}>
                <CardHeader className="flex flex-row items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      {pkg.name}
                      <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                        {pkg.code}
                      </span>
                      {hidden && (
                        <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                          Đã ẩn
                        </span>
                      )}
                    </CardTitle>
                    {pkg.description && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{pkg.description}</p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => togglePackage(pkg)}
                    disabled={updatePackage.isPending}
                  >
                    {hidden ? "Hiển thị" : "Ẩn gói"}
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
                          <th className="py-2 pr-4 font-semibold">Chu kỳ</th>
                          <th className="py-2 pr-4 font-semibold text-right">Giá</th>
                          <th className="py-2 pr-4 font-semibold text-right">Dùng thử</th>
                          <th className="py-2 pr-4 font-semibold">Trạng thái</th>
                          <th className="py-2 font-semibold text-right">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pkg.plans.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-4 text-center text-slate-400">
                              Chưa có plan.
                            </td>
                          </tr>
                        ) : (
                          pkg.plans.map((plan) => (
                            <tr key={plan.id} className="border-b border-slate-50 dark:border-slate-800/50">
                              <td className="py-2.5 pr-4 font-medium text-slate-700 dark:text-slate-200">
                                {plan.billingCycle}
                              </td>
                              <td className="py-2.5 pr-4 text-right tabular-nums font-semibold text-slate-900 dark:text-slate-100">
                                {formatCurrency(plan.priceVnd)}
                              </td>
                              <td className="py-2.5 pr-4 text-right tabular-nums text-slate-600 dark:text-slate-300">
                                {plan.trialDays} ngày
                              </td>
                              <td className="py-2.5 pr-4">
                                <span
                                  className={
                                    plan.status?.toUpperCase() === "ACTIVE"
                                      ? "text-green-600 dark:text-green-400"
                                      : "text-slate-400"
                                  }
                                >
                                  {plan.status?.toUpperCase() === "ACTIVE" ? "Đang bán" : "Tắt"}
                                </span>
                              </td>
                              <td className="py-2.5 text-right">
                                <Button variant="outline" size="sm" onClick={() => setEditingPlan(plan)}>
                                  Sửa giá
                                </Button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <EditPlanDialog
        plan={editingPlan}
        onClose={() => setEditingPlan(null)}
        onSave={(payload) =>
          updatePlan.mutate(
            { planId: editingPlan!.id, ...payload },
            {
              onSuccess: () => {
                setEditingPlan(null)
                toast({ title: "Đã cập nhật giá", description: "Thay đổi đã được lưu." })
              },
              onError: (err) =>
                toast({
                  title: "Lưu thất bại",
                  description: parseApiError(err, "Không thể cập nhật plan."),
                  variant: "destructive",
                }),
            }
          )
        }
        saving={updatePlan.isPending}
      />

      <CreatePackageDialog open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  )
}

function EditPlanDialog({
  plan,
  onClose,
  onSave,
  saving,
}: {
  plan: BillingPlan | null
  onClose: () => void
  onSave: (payload: { priceVnd: number; trialDays: number; status: string }) => void
  saving: boolean
}) {
  const [price, setPrice] = useState("")
  const [trial, setTrial] = useState("")
  const [active, setActive] = useState(true)

  // Sync local form when a new plan is opened.
  const [lastId, setLastId] = useState<string | null>(null)
  if (plan && plan.id !== lastId) {
    setLastId(plan.id)
    setPrice(String(plan.priceVnd))
    setTrial(String(plan.trialDays))
    setActive(plan.status?.toUpperCase() === "ACTIVE")
  }

  return (
    <Dialog open={!!plan} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sửa giá — {plan?.billingCycle}</DialogTitle>
          <DialogDescription>Cập nhật giá, số ngày dùng thử và trạng thái bán của plan.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Giá (VND)
            </label>
            <Input
              type="number"
              min={0}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Số ngày dùng thử
            </label>
            <Input type="number" min={0} value={trial} onChange={(e) => setTrial(e.target.value)} />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-primary accent-primary"
            />
            <span className="text-sm text-slate-700 dark:text-slate-300">Đang bán (hiển thị cho khách)</span>
          </label>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Huỷ
          </Button>
          <Button
            onClick={() =>
              onSave({
                priceVnd: Math.max(0, Number(price) || 0),
                trialDays: Math.max(0, Number(trial) || 0),
                status: active ? "ACTIVE" : "INACTIVE",
              })
            }
            disabled={saving}
          >
            {saving ? "Đang lưu..." : "Lưu"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function CreatePackageDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const createPackage = useCreatePackage()
  const { toast } = useToast()
  const [code, setCode] = useState("")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [trial, setTrial] = useState("0")

  function reset() {
    setCode("")
    setName("")
    setDescription("")
    setPrice("")
    setTrial("0")
  }

  function submit() {
    if (!code.trim() || !name.trim()) {
      toast({ title: "Thiếu thông tin", description: "Mã gói và tên là bắt buộc.", variant: "destructive" })
      return
    }
    createPackage.mutate(
      {
        code: code.trim().toUpperCase(),
        name: name.trim(),
        description: description.trim() || undefined,
        monthlyPriceVnd: Math.max(0, Number(price) || 0),
        trialDays: Math.max(0, Number(trial) || 0),
      },
      {
        onSuccess: () => {
          toast({ title: "Đã tạo gói", description: `Gói “${name}” đã được tạo.` })
          reset()
          onClose()
        },
        onError: (err) =>
          toast({
            title: "Tạo gói thất bại",
            description: parseApiError(err, "Không thể tạo gói."),
            variant: "destructive",
          }),
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tạo gói mới</DialogTitle>
          <DialogDescription>Tạo gói kèm một plan theo tháng. Có thể thêm plan khác sau.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Mã gói</label>
              <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="PRO" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Tên</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Chuyên nghiệp" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Mô tả</label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Mô tả ngắn" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Giá/tháng (VND)
              </label>
              <Input type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Dùng thử (ngày)
              </label>
              <Input type="number" min={0} value={trial} onChange={(e) => setTrial(e.target.value)} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={createPackage.isPending}>
            Huỷ
          </Button>
          <Button onClick={submit} disabled={createPackage.isPending}>
            {createPackage.isPending ? "Đang tạo..." : "Tạo gói"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
