"use client"

import { KPICard } from "@/components/common/KPICard"
import { StatusBadge } from "@/components/common/StatusBadge"
import { RiskBadge } from "@/components/common/RiskBadge"
import { ConfidenceBadge } from "@/components/common/ConfidenceBadge"
import { AIInsightBox } from "@/components/common/AIInsightBox"
import { ProgressBar } from "@/components/common/ProgressBar"
import Link from "next/link"
import { ROUTES } from "@/lib/constants"
import { useRecommendations, useRecommendationsSummary, useRefreshRecommendations } from "@/hooks/useRecommendations"
import { ACTION_LABELS } from "@/lib/constants"
import { useToast } from "@/hooks/use-toast"

// MOCK: displayed when ML service returns no data yet
const MOCK_KPIS = [
  { label: "Tổng hành động", value: "12", subtitle: "khuyến nghị của AI", trendType: "neutral" as const },
  { label: "Giảm backlog", value: "-18%", subtitle: "dự kiến sau 30 ngày", trend: "3,400→2,788", trendType: "up" as const },
  { label: "Tăng sell-through", value: "+11%", subtitle: "cải thiện dự kiến", trend: "41%→52%", trendType: "up" as const },
  { label: "Giảm rủi ro markdown", value: "-15%", subtitle: "tránh markdown khẩn cấp", trend: "tiết kiệm ~18M VND", trendType: "up" as const },
]

const MOCK_TOP_ACTIONS = [
  {
    priority: "ƯU TIÊN RẤT CAO",
    priorityColor: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-900",
    icon: "local_shipping",
    title: "Chuyển Wide Leg Trousers → Hà Nội + TikTok",
    description: "Di chuyển 150 đơn vị từ TP.HCM sang Hà Nội và đẩy mạnh TikTok Shop — Bottoms đang trending +28% tại Hà Nội",
    impact: "Giảm tồn kho 33%, tăng sell-through 18%",
    confidence: 92,
  },
  {
    priority: "ƯU TIÊN CAO",
    priorityColor: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-900",
    icon: "sell",
    title: "Markdown Summer Light Jacket 12%",
    description: "Giảm giá 12% ngay bây giờ để tránh markdown sâu hơn cuối mùa — sell-through chỉ 24% sau 45 ngày",
    impact: "Thoát 280 đv tồn, tránh markdown 25% sau 30 ngày",
    confidence: 88,
  },
  {
    priority: "CHIẾN LƯỢC",
    priorityColor: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-400 dark:border-indigo-900",
    icon: "block",
    title: "Giảm nhập Bottoms kỳ tới 30%",
    description: "Tồn kho Bottoms hiện đang chiếm 62% tổng tồn — cân bằng lại danh mục để tối ưu vốn",
    impact: "Giải phóng ~45M VND vốn đầu tư vào Tops",
    confidence: 90,
  },
]

const MOCK_DETAIL_TABLE = [
  { sku: "SKU-001", category: "Bottoms", issue: "Tồn kho cao", action: "Chuyển kênh/khu vực", impact: "Giảm 33% tồn", priority: "HIGH" as const, confidence: 92 },
  { sku: "SKU-002", category: "Áo khoác", issue: "Chậm bán", action: "Markdown 12%", impact: "Tăng sell-through 28%", priority: "HIGH" as const, confidence: 88 },
  { sku: "SKU-003", category: "Váy", issue: "Tồn vừa", action: "Promote TikTok", impact: "Tăng đơn 18%", priority: "MEDIUM" as const, confidence: 80 },
  { sku: "SKU-004", category: "Tops", issue: "Bán tốt", action: "Tăng nhập", impact: "+22% doanh thu", priority: "STRATEGIC" as const, confidence: 85 },
  { sku: "SKU-005", category: "Phụ kiện", issue: "Cơ hội mới", action: "Thêm vào danh mục", impact: "+15% biên lợi nhuận", priority: "STRATEGIC" as const, confidence: 78 },
]

const MOCK_ACTION_DIST = [
  { channel: "TikTok Shop", count: 5, pct: 42 },
  { channel: "Website", count: 3, pct: 25 },
  { channel: "Kho TP.HCM", count: 2, pct: 17 },
  { channel: "Kho Hà Nội", count: 2, pct: 16 },
]

const AI_LOGIC_RULES = [
  "Ưu tiên hành động nếu sell-through <30% và tuổi tồn kho >45 ngày",
  "Chuyển kho nếu khu vực hiện tại có demand thấp hơn khu vực khác >20%",
  "Markdown 10-15% nếu còn >60 ngày đến cuối mùa và sell-through <40%",
  "Đề xuất nhập thêm nếu sell-through >75% và stock-out risk >60%",
]

export default function RecommendationsPage() {
  const { toast } = useToast()
  const { data: recoData, isLoading } = useRecommendations()
  const { data: summary } = useRecommendationsSummary()
  const { mutate: refresh, isPending: isRefreshing } = useRefreshRecommendations()

  const realItems = recoData?.items ?? []
  const totalActions = summary?.total ?? recoData?.total ?? 0

  const kpis = [
    { ...MOCK_KPIS[0], value: String(totalActions > 0 ? totalActions : MOCK_KPIS[0].value) },
    ...MOCK_KPIS.slice(1),
  ]

  function handleRefresh() {
    refresh(undefined, {
      onSuccess: () => toast({ title: "Đang làm mới đề xuất...", description: "Dữ liệu sẽ cập nhật sau vài giây" }),
      onError: () => toast({ title: "Không thể làm mới", variant: "destructive" }),
    })
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <StatusBadge status="complete" />
            <StatusBadge status="ready" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Đề xuất AI</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Dựa trên dữ liệu bán hàng và phân tích thị trường
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing || isLoading}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-primary border border-primary/30 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950 disabled:opacity-50 transition"
        >
          <span className={`material-symbols-outlined text-[16px] ${isRefreshing ? "animate-spin" : ""}`}>
            refresh
          </span>
          Làm mới
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map((kpi) => (
          <KPICard key={kpi.label} {...kpi} />
        ))}
      </div>

      {/* Top Actions + AI Explanation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Top Actions */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">
            3 hành động ưu tiên cao
          </h2>
          <div className="space-y-4">
            {MOCK_TOP_ACTIONS.map((action, i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-[16px]">{action.icon}</span>
                    </div>
                    <span className={`px-2.5 py-1 text-[11px] font-bold rounded border uppercase tracking-wider ${action.priorityColor}`}>
                      {action.priority}
                    </span>
                  </div>
                  <ConfidenceBadge value={action.confidence} />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm mb-2">{action.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">{action.description}</p>
                <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400 font-medium">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span>
                  {action.impact}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — AI Insight + Simulation */}
        <div className="space-y-4">
          <AIInsightBox
            title="Tại sao AI đề xuất điều này?"
            items={[
              "Phân tích 1,000 đơn vị tồn kho và 950 giao dịch bán hàng",
              "So sánh với xu hướng thị trường thời trang Việt Nam Q2 2026",
              "Dự đoán dựa trên mô hình ML được đào tạo trên 500+ shop thời trang VN",
            ]}
            variant="purple"
          />

          {/* Simulation Preview */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-5">
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4">
              Mô phỏng sau 30 ngày
            </p>
            <div className="space-y-3">
              {[
                { label: "Backlog", before: 3400, after: 2914, unit: "đv", pct: 86 },
                { label: "Sell-through", before: "41%", after: "53%", pct: 53 },
              ].map((sim) => (
                <div key={sim.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500 dark:text-slate-400">{sim.label}</span>
                    <span className="font-bold text-green-600 dark:text-green-400">
                      {sim.before} → {sim.after}
                    </span>
                  </div>
                  <ProgressBar value={sim.pct} color="bg-green-500" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detail Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-100 dark:border-slate-800 mb-8">
        <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-4">
          Tất cả đề xuất {realItems.length > 0 && <span className="text-primary">({realItems.length})</span>}
        </h2>
        {isLoading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <div key={i} className="h-10 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />)}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  {["SKU", "Danh mục", "Hành động", "Lý do", "Ưu tiên", "Tin cậy"].map((h) => (
                    <th key={h} className="text-left pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wider pr-4">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {realItems.length > 0
                  ? realItems.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="py-3 pr-4 font-mono text-xs text-slate-500">{row.sku ?? row.variantId.slice(0,8)}</td>
                        <td className="py-3 pr-4 text-slate-700 dark:text-slate-300">{row.category ?? "—"}</td>
                        <td className="py-3 pr-4 font-medium text-slate-900 dark:text-slate-100">{ACTION_LABELS[row.action] ?? row.action}</td>
                        <td className="py-3 pr-4 text-slate-600 dark:text-slate-400 text-xs max-w-[200px] truncate">{row.reason}</td>
                        <td className="py-3 pr-4"><RiskBadge level={row.priority} /></td>
                        <td className="py-3"><ConfidenceBadge value={Math.round((row.confidence ?? 0) * 100)} /></td>
                      </tr>
                    ))
                  : MOCK_DETAIL_TABLE.map((row) => (
                      <tr key={row.sku} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="py-3 pr-4 font-mono text-xs text-slate-500">{row.sku}</td>
                        <td className="py-3 pr-4 text-slate-700 dark:text-slate-300">{row.category}</td>
                        <td className="py-3 pr-4 font-medium text-slate-900 dark:text-slate-100">{row.action}</td>
                        <td className="py-3 pr-4 text-slate-600 dark:text-slate-400">{row.issue}</td>
                        <td className="py-3 pr-4"><RiskBadge level={row.priority} /></td>
                        <td className="py-3"><ConfidenceBadge value={row.confidence} /></td>
                      </tr>
                    ))
                }
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Action Distribution + AI Logic */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Distribution */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4">
            Phân bổ hành động theo kênh
          </h3>
          <div className="space-y-3">
            {MOCK_ACTION_DIST.map((dist) => (
              <div key={dist.channel}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-slate-600 dark:text-slate-400">{dist.channel}</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{dist.count} hành động</span>
                </div>
                <ProgressBar value={dist.pct} />
              </div>
            ))}
          </div>
        </div>

        {/* AI Logic Rules */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4">
            Quy tắc AI sử dụng
          </h3>
          <div className="space-y-3">
            {AI_LOGIC_RULES.map((rule, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-primary text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{rule}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button className="bg-brand-gradient text-white rounded-xl p-5 flex items-center gap-4 hover:opacity-90 transition">
          <span className="material-symbols-outlined text-2xl">download</span>
          <div className="text-left">
            <p className="font-bold">Xuất kế hoạch hành động</p>
            <p className="text-indigo-200 text-sm">Excel / PDF với 12 đề xuất</p>
          </div>
        </button>
        <Link
          href={ROUTES.FORECAST}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 flex items-center gap-4 hover:border-primary/50 transition"
        >
          <span className="material-symbols-outlined text-primary text-2xl">insights</span>
          <div>
            <p className="font-bold text-slate-900 dark:text-slate-100">Xem dự báo xu hướng</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Xu hướng sản phẩm Q2 2026</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
