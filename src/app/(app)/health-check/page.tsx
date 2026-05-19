"use client"

import { KPIGrid } from "@/components/health-check/KPIGrid"
import { CategoryRiskChart } from "@/components/health-check/CategoryRiskChart"
import { ChannelPerformance } from "@/components/health-check/ChannelPerformance"
import { RiskItemTable } from "@/components/health-check/RiskItemTable"
import { PriorityIssues } from "@/components/health-check/PriorityIssues"
import { AIInsightBox } from "@/components/common/AIInsightBox"
import { StatusBadge } from "@/components/common/StatusBadge"
import Link from "next/link"
import { ROUTES } from "@/lib/constants"
import { useHealthCheck } from "@/hooks/useHealthCheck"

// MOCK: inventory metrics endpoints not available — using catalog products count for totalSKU
const MOCK_KPIS_BASE = [
  { label: "Áp lực tồn kho", value: "45%", subtitle: "450 / 1,000 đơn vị", trend: "+5%", trendType: "down" as const },
  { label: "Tỷ lệ sell-through", value: "41%", subtitle: "thấp hơn 15% so với ngành", trend: "-15%", trendType: "down" as const },
  { label: "SKU chậm bán", value: "32%", subtitle: "32 / 100 SKU cần xử lý", trend: "12 nghiêm trọng", trendType: "down" as const },
  { label: "Rủi ro kênh bán", value: "72%", subtitle: "TikTok Shop", trend: "phụ thuộc cao", trendType: "down" as const },
]

const MOCK_CATEGORIES = [
  { name: "Quần (Bottoms)", value: 1240, total: 2000 },
  { name: "Đồ khoác hè", value: 860, total: 2000 },
  { name: "Phụ kiện", value: 420, total: 2000 },
  { name: "Váy/Đầm", value: 180, total: 2000 },
]

const MOCK_CHANNELS = [
  { name: "TikTok Shop", orders: 720, rate: 82 },
  { name: "Website", orders: 140, rate: 34 },
  { name: "Cửa hàng Flagship", orders: 90, rate: 21 },
]

const MOCK_RISK_ITEMS = [
  { sku: "SKU-001", name: "Quần Wide Leg Trousers Đen", stock: 420, sellThrough: 18, risk: "HIGH" as const },
  { sku: "SKU-002", name: "Áo Khoác Light Summer Jacket", stock: 280, sellThrough: 24, risk: "HIGH" as const },
  { sku: "SKU-003", name: "Váy Midi Floral Print", stock: 150, sellThrough: 45, risk: "MEDIUM" as const },
  { sku: "SKU-004", name: "Áo Thun Oversize Basic", stock: 90, sellThrough: 68, risk: "LOW" as const },
  { sku: "SKU-005", name: "Túi Tote Canvas", stock: 75, sellThrough: 72, risk: "STRATEGIC" as const },
]

const MOCK_ISSUES = [
  {
    icon: "inventory_2",
    title: "450 đơn vị tồn kho quá mức tại TP.HCM",
    description: "Quần Wide Leg và Áo khoác hè tập trung 68% tồn kho — cần phân phối lại ngay",
    severity: "NGHIÊM TRỌNG" as const,
  },
  {
    icon: "location_on",
    title: "Cơ hội phân phối sang Hà Nội",
    description: "Xu hướng Bottoms đang tăng 28% tại Hà Nội trong Q2 — chuyển 150 đv từ TP.HCM",
    severity: "CHIẾN LƯỢC" as const,
  },
  {
    icon: "sell",
    title: "Summer Light Jacket cần markdown 12%",
    description: "Sell-through chỉ 24% sau 45 ngày — giảm giá ngay để tránh tồn cuối mùa",
    severity: "QUAN TRỌNG" as const,
  },
]

const AI_INSIGHTS = [
  "Áp lực tồn kho 45% cao hơn 15% so với benchmark ngành thời trang VN",
  "TikTok Shop chiếm 72% doanh số nhưng 28% sản phẩm chưa được tối ưu cho kênh này",
  "Bottoms (Quần) là danh mục có rủi ro cao nhất — 1,240 đơn vị tồn đọng",
  "Nếu không có hành động trong 30 ngày, markdown bắt buộc ≥20% cho 32 SKU",
]

export default function HealthCheckPage() {
  const { data: healthData, isLoading } = useHealthCheck()

  const kpis = MOCK_KPIS_BASE.map((kpi, i) =>
    i === 2
      ? { ...kpi, subtitle: `${healthData?.totalSKU ?? 32} / ${healthData?.totalProducts ?? 100} SKU cần xử lý` }
      : kpi
  )

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <StatusBadge status="complete" />
            <StatusBadge status="ready" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Chẩn đoán Sức khỏe
          </h1>
        </div>
        <div className="text-right text-xs text-slate-500 dark:text-slate-400 space-y-0.5">
          <p>SKU: <span className="font-semibold">{isLoading ? "..." : (healthData?.totalSKU ?? 0)}</span></p>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="mb-8">
        <KPIGrid data={kpis} />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Category Risk Chart */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-4">
              Tồn kho theo danh mục
            </h2>
            <CategoryRiskChart categories={MOCK_CATEGORIES} />
          </div>

          {/* Risk Item Table */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-4">
              SKU cần xử lý
            </h2>
            <RiskItemTable items={MOCK_RISK_ITEMS} />
          </div>

          {/* Priority Issues */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-4">
              Vấn đề ưu tiên
            </h2>
            <PriorityIssues issues={MOCK_ISSUES} />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Channel Performance */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-4">
              Hiệu suất kênh bán
            </h2>
            <ChannelPerformance channels={MOCK_CHANNELS} />
          </div>

          {/* AI Insights */}
          <AIInsightBox
            title="Phân tích AI"
            items={AI_INSIGHTS}
            variant="dark"
          />

          {/* Full analysis */}
          <div className="bg-green-50 dark:bg-green-950 rounded-xl p-4 border border-green-200 dark:border-green-900">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-[18px]">
                task_alt
              </span>
              <p className="text-sm font-bold text-green-800 dark:text-green-200">
                Phân tích đầy đủ đã được tạo
              </p>
            </div>
            <p className="text-xs text-green-700 dark:text-green-300">
              12 đề xuất hành động và dự báo Q2 2026 đã sẵn sàng
            </p>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href={ROUTES.RECOMMENDATIONS}
          className="group bg-brand-gradient rounded-xl p-5 flex items-center gap-4 hover:opacity-90 transition"
        >
          <span className="material-symbols-outlined text-white text-3xl">recommend</span>
          <div className="text-white">
            <p className="font-bold">Xem Đề xuất AI</p>
            <p className="text-indigo-200 text-sm">12 hành động ưu tiên</p>
          </div>
        </Link>
        <Link
          href={ROUTES.FORECAST}
          className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 flex items-center gap-4 hover:border-primary/50 transition"
        >
          <span className="material-symbols-outlined text-primary text-3xl">insights</span>
          <div>
            <p className="font-bold text-slate-900 dark:text-slate-100">Xem Dự báo Q2</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Xu hướng sản phẩm 2026</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
