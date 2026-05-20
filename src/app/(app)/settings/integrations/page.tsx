"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { integrationService, type ConnectorConfigResponse, type ConnectorType } from "@/services/integration.service"
import { useAuthStore } from "@/stores/auth.store"
import { useToast } from "@/hooks/use-toast"
import { parseApiError } from "@/lib/errors"
import Link from "next/link"

const CONNECTOR_META: Record<ConnectorType, {
  icon: string
  color: string
  bg: string
  desc: string
}> = {
  KIOTVIET: {
    icon: "point_of_sale",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950",
    desc: "Kết nối trực tiếp với quản lý bán hàng KiotViet — tự động đồng bộ đơn hàng và tồn kho",
  },
  SAPO: {
    icon: "shopping_cart",
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-50 dark:bg-orange-950",
    desc: "Kết nối với Sapo để đồng bộ dữ liệu bán hàng đa kênh",
  },
  HARAVAN: {
    icon: "language",
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-950",
    desc: "Tích hợp với Haravan — sẽ ra mắt trong Q3 2026",
  },
}

const STATUS_BADGE: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
  INACTIVE: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
  ERROR: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
}

function ConnectorCard({ connector, onSync, onDelete, isSyncing }: {
  connector: ConnectorConfigResponse
  onSync: () => void
  onDelete: () => void
  isSyncing: boolean
}) {
  const meta = CONNECTOR_META[connector.connectorType] ?? CONNECTOR_META.KIOTVIET
  const statusClass = STATUS_BADGE[connector.status] ?? STATUS_BADGE.INACTIVE

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl ${meta.bg} flex items-center justify-center`}>
            <span className={`material-symbols-outlined ${meta.color} text-[24px]`}>{meta.icon}</span>
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-slate-100">
              {connector.name ?? connector.connectorType}
            </p>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${statusClass}`}>
              {connector.status}
            </span>
          </div>
        </div>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">{meta.desc}</p>
      {connector.lastSyncAt && (
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">
          Đồng bộ lần cuối: {new Date(connector.lastSyncAt).toLocaleString("vi-VN")}
        </p>
      )}
      <div className="flex gap-2">
        <button
          onClick={onSync}
          disabled={isSyncing}
          className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-brand-gradient text-white hover:opacity-90 disabled:opacity-60 transition flex items-center justify-center gap-1"
        >
          <span className={`material-symbols-outlined text-[16px] ${isSyncing ? "animate-spin" : ""}`}>sync</span>
          {isSyncing ? "Đang đồng bộ..." : "Đồng bộ ngay"}
        </button>
        <button
          onClick={onDelete}
          className="px-3 py-2.5 rounded-xl text-sm font-bold border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition"
          title="Ngắt kết nối"
        >
          <span className="material-symbols-outlined text-[16px]">link_off</span>
        </button>
      </div>
    </div>
  )
}

const AVAILABLE_CONNECTORS: { type: ConnectorType; label: string }[] = [
  { type: "KIOTVIET", label: "KiotViet" },
  { type: "SAPO", label: "Sapo" },
  { type: "HARAVAN", label: "Haravan" },
]

export default function IntegrationsPage() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const tenantId = useAuthStore((s) => s.tenant?.id)
  const [syncingId, setSyncingId] = useState<string | null>(null)

  const { data: connectors = [], isLoading } = useQuery({
    queryKey: ["integrations", tenantId],
    queryFn: () => integrationService.listConnectors(),
    enabled: !!tenantId,
    staleTime: 5 * 60 * 1000,
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => integrationService.deleteConnector(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["integrations"] })
      toast({ title: "Đã ngắt kết nối" })
    },
    onError: (err) => toast({ title: "Lỗi", description: parseApiError(err), variant: "destructive" }),
  })

  async function handleSync(id: string) {
    setSyncingId(id)
    try {
      await integrationService.triggerSync(id)
      toast({ title: "Đang đồng bộ...", description: "Dữ liệu sẽ cập nhật sau vài phút" })
    } catch (err) {
      toast({ title: "Lỗi đồng bộ", description: parseApiError(err), variant: "destructive" })
    } finally {
      setSyncingId(null)
    }
  }

  const connectedTypes = new Set(connectors.map((c) => c.connectorType))
  const availableToConnect = AVAILABLE_CONNECTORS.filter((c) => !connectedTypes.has(c.type))

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Kết nối & Tích hợp</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Kết nối hệ thống POS/eCommerce để tự động đồng bộ dữ liệu
        </p>
      </div>

      {/* Active Connectors */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {[1, 2].map((i) => (
            <div key={i} className="h-48 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : connectors.length > 0 ? (
        <div className="mb-8">
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-4">Đang kết nối</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {connectors.map((connector) => (
              <ConnectorCard
                key={connector.id}
                connector={connector}
                onSync={() => handleSync(connector.id)}
                onDelete={() => deleteMutation.mutate(connector.id)}
                isSyncing={syncingId === connector.id}
              />
            ))}
          </div>
        </div>
      ) : null}

      {/* Available to Connect */}
      {availableToConnect.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-4">
            {connectors.length > 0 ? "Thêm kết nối" : "Chọn kết nối"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {availableToConnect.map(({ type, label }) => {
              const meta = CONNECTOR_META[type]
              return (
                <div
                  key={type}
                  className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-xl ${meta.bg} flex items-center justify-center`}>
                      <span className={`material-symbols-outlined ${meta.color} text-[24px]`}>{meta.icon}</span>
                    </div>
                    <p className="font-bold text-slate-900 dark:text-slate-100">{label}</p>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">{meta.desc}</p>
                  {type === "HARAVAN" ? (
                    <button
                      disabled
                      className="w-full py-2.5 rounded-xl text-sm font-bold bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                    >
                      Sắp ra mắt
                    </button>
                  ) : (
                    <button className="w-full py-2.5 rounded-xl text-sm font-bold bg-brand-gradient text-white hover:opacity-90 transition">
                      Kết nối
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Manual Upload CTA */}
      <div className="mt-6 bg-indigo-50 dark:bg-indigo-950 rounded-xl p-5 border border-indigo-100 dark:border-indigo-900 flex items-center gap-4">
        <span className="material-symbols-outlined text-indigo-500 text-3xl">upload_file</span>
        <div className="flex-1">
          <p className="font-semibold text-indigo-800 dark:text-indigo-200">Hoặc tải file thủ công</p>
          <p className="text-sm text-indigo-600 dark:text-indigo-400">
            Hỗ trợ CSV, XLSX, JSON từ bất kỳ hệ thống nào
          </p>
        </div>
        <Link
          href="/health-check/import"
          className="shrink-0 px-4 py-2 bg-brand-gradient text-white text-sm font-bold rounded-lg hover:opacity-90 transition"
        >
          Tải file
        </Link>
      </div>
    </div>
  )
}
