"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TenantStatusBadge } from "@/components/admin/TenantStatusBadge"
import { useAdminTenants } from "@/hooks/useAdmin"
import { formatDate, formatNumber } from "@/lib/utils"

const PAGE_SIZE = 20
const STATUS_OPTIONS = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "active", label: "Hoạt động" },
  { value: "trial", label: "Dùng thử" },
  { value: "suspended", label: "Tạm ngưng" },
  { value: "cancelled", label: "Đã huỷ" },
]

export default function AdminTenantsPage() {
  const router = useRouter()
  const [page, setPage] = useState(0)
  const [status, setStatus] = useState("all")
  const [search, setSearch] = useState("")
  const [q, setQ] = useState("")

  // Debounce the search box so we don't refetch on every keystroke.
  useEffect(() => {
    const t = setTimeout(() => {
      setQ(search.trim())
      setPage(0)
    }, 350)
    return () => clearTimeout(t)
  }, [search])

  const { data, isLoading, isError, isFetching, refetch } = useAdminTenants({
    page,
    size: PAGE_SIZE,
    status: status === "all" ? undefined : status,
    q: q || undefined,
  })

  const tenants = data?.content ?? []
  const totalPages = data?.totalPages ?? 0
  const totalElements = data?.totalElements ?? 0

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Khách hàng</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Quản lý các tenant trên nền tảng — tìm kiếm, lọc và xem chi tiết.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-slate-400">
            search
          </span>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên hoặc slug..."
            className="pl-10"
          />
        </div>
        <Select
          value={status}
          onValueChange={(v) => {
            setStatus(v)
            setPage(0)
          }}
        >
          <SelectTrigger className="w-full sm:w-52">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className="overflow-hidden">
        {isError ? (
          <div className="p-10 flex flex-col items-center gap-3 text-center">
            <span className="material-symbols-outlined text-3xl text-slate-300 dark:text-slate-600">error</span>
            <p className="text-sm text-slate-500 dark:text-slate-400">Không tải được danh sách khách hàng.</p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Thử lại
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-left text-slate-500 dark:text-slate-400">
                  <th className="px-4 py-3 font-semibold">Tên</th>
                  <th className="px-4 py-3 font-semibold">Gói</th>
                  <th className="px-4 py-3 font-semibold">Trạng thái</th>
                  <th className="px-4 py-3 font-semibold text-right">Người dùng</th>
                  <th className="px-4 py-3 font-semibold">Tạo lúc</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="border-b border-slate-50 dark:border-slate-800/50">
                      <td colSpan={5} className="px-4 py-3">
                        <div className="h-5 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
                      </td>
                    </tr>
                  ))
                ) : tenants.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-slate-500 dark:text-slate-400">
                      Không có khách hàng nào khớp bộ lọc.
                    </td>
                  </tr>
                ) : (
                  tenants.map((t) => (
                    <tr
                      key={t.id}
                      onClick={() => router.push(`/admin/tenants/${t.id}`)}
                      className="border-b border-slate-50 dark:border-slate-800/50 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-900 dark:text-slate-100">{t.name}</div>
                        <div className="text-xs text-slate-400">{t.slug}</div>
                      </td>
                      <td className="px-4 py-3 capitalize text-slate-600 dark:text-slate-300">{t.plan}</td>
                      <td className="px-4 py-3">
                        <TenantStatusBadge status={t.status} />
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-slate-600 dark:text-slate-300">
                        {formatNumber(t.userCount)}
                      </td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{formatDate(t.createdAt)}</td>
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
          {isLoading ? "Đang tải..." : `${formatNumber(totalElements)} khách hàng`}
          {isFetching && !isLoading ? " • đang cập nhật..." : ""}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
          >
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
    </div>
  )
}
