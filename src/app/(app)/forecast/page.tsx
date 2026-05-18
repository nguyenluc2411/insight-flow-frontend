import { KPICard } from "@/components/common/KPICard"
import { StatusBadge } from "@/components/common/StatusBadge"
import { ConfidenceBadge } from "@/components/common/ConfidenceBadge"
import { RiskBadge } from "@/components/common/RiskBadge"
import { TrendIndicator } from "@/components/common/TrendIndicator"
import { AIInsightBox } from "@/components/common/AIInsightBox"

// TODO: replace with API calls
const MOCK_KPIS = [
  { label: "Nhóm sản phẩm tăng", value: "3", subtitle: "danh mục nên đầu tư", trend: "+2 so với Q1", trendType: "up" as const },
  { label: "SKU ưu tiên nhập", value: "9", subtitle: "sản phẩm được đề xuất", trendType: "neutral" as const },
  { label: "Mã hàng rủi ro", value: "6", subtitle: "cần xem xét lại", trendType: "down" as const },
  { label: "Độ tin cậy AI", value: "89%", subtitle: "dựa trên 12 tháng data", trend: "+2%", trendType: "up" as const },
]

const MOCK_CATEGORY_TRENDS = [
  { name: "Tops & Crop Tops", trend: 18, confidence: 92, action: "Tăng nhập" },
  { name: "Bottoms (Cargo/Baggy)", trend: 9, confidence: 85, action: "Tăng nhẹ" },
  { name: "Phụ kiện Hè", trend: 4.4, confidence: 78, action: "Giữ" },
  { name: "Áo khoác hè", trend: -12, confidence: 88, action: "Giảm nhập" },
]

const MOCK_PRIORITY_PRODUCTS = [
  { name: "Áo Crop Top Linen Trắng", category: "Tops", trend: 28, confidence: 92, img: "👕" },
  { name: "Quần Cargo Beige Baggy", category: "Bottoms", trend: 22, confidence: 87, img: "👖" },
  { name: "Túi Tote Canvas Mini", category: "Phụ kiện", trend: 18, confidence: 85, img: "👜" },
  { name: "Váy Midi Linen Set", category: "Sets", trend: 15, confidence: 80, img: "👗" },
]

const MOCK_NEW_PRODUCTS = [
  { name: "Áo Thun Graphic Vintage", category: "Tops", insight: "Xu hướng Y2K đang tăng mạnh trên TikTok — chưa có đối thủ", img: "🎨" },
  { name: "Quần Short Linen", category: "Bottoms", insight: "Linen đang trending — hoàn hảo cho mùa hè Việt Nam", img: "🩳" },
  { name: "Mũ Bucket Hat Washed", category: "Phụ kiện", insight: "Phụ kiện add-on thấp rủi ro, biên lợi nhuận +35%", img: "🧢" },
]

const MOCK_AVOID_PRODUCTS = [
  { sku: "SKU-008", name: "Áo Blazer Formal", category: "Tops", reason: "Thị trường bão hòa, -22% demand", risk: "HIGH" as const },
  { sku: "SKU-012", name: "Quần Jean Skinny", category: "Bottoms", reason: "Xu hướng giảm, oversized đang thay thế", risk: "HIGH" as const },
  { sku: "SKU-019", name: "Đầm Cocktail Mini", category: "Dresses", reason: "Cạnh tranh cao, biên lợi nhuận thấp", risk: "MEDIUM" as const },
]

const AI_STRATEGY_ITEMS = [
  "Tập trung vào Linen và Natural Fabrics — đây là meta của H2 2026",
  "TikTok Shop là kênh chính — ưu tiên sản phẩm có khả năng viral (Crop Tops, Cargo)",
  "Đa dạng hóa khu vực — Hà Nội đang underserved về Bottoms trendy",
  "Giảm phụ thuộc Formal wear — chuyển sang Casual/Streetwear để tối ưu sell-through",
]

export default function ForecastPage() {
  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <StatusBadge status="ready" />
            <span className="px-3 py-1.5 bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 text-[11px] font-bold rounded-full border border-indigo-200 dark:border-indigo-900 uppercase tracking-wider">
              Kỳ dự báo Q2 2026
            </span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Dự báo Xu hướng</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Phân tích xu hướng sản phẩm thời trang Q2 2026
          </p>
        </div>
        <ConfidenceBadge value={89} />
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {MOCK_KPIS.map((kpi) => (
          <KPICard key={kpi.label} {...kpi} />
        ))}
      </div>

      {/* Category Trends */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-100 dark:border-slate-800 mb-8">
        <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-4">
          Xu hướng theo danh mục
        </h2>
        <div className="space-y-4">
          {MOCK_CATEGORY_TRENDS.map((cat) => (
            <div key={cat.name} className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[160px]">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{cat.name}</p>
              </div>
              <TrendIndicator value={cat.trend} />
              <ConfidenceBadge value={cat.confidence} />
              <span
                className={`px-2.5 py-1 text-[11px] font-bold rounded border uppercase tracking-wider ${
                  cat.trend > 0
                    ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-900"
                    : "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-900"
                }`}
              >
                {cat.action}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Priority Products */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">
          Sản phẩm nên ưu tiên kỳ tới
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MOCK_PRIORITY_PRODUCTS.map((p) => (
            <div
              key={p.name}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-soft transition"
            >
              <div className="h-28 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 flex items-center justify-center text-4xl">
                {p.img}
              </div>
              <div className="p-4">
                <p className="font-bold text-slate-900 dark:text-slate-100 text-sm mb-1">{p.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{p.category}</p>
                <div className="flex items-center gap-2">
                  <TrendIndicator value={p.trend} />
                  <ConfidenceBadge value={p.confidence} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Products to Consider */}
      <div className="bg-slate-900 dark:bg-slate-800 rounded-2xl p-6 mb-8">
        <h2 className="text-xl font-bold text-white mb-2">Sản phẩm mới nên cân nhắc</h2>
        <p className="text-slate-400 text-sm mb-5">
          Các danh mục chưa có trong portfolio nhưng có tiềm năng cao
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MOCK_NEW_PRODUCTS.map((p) => (
            <div
              key={p.name}
              className="bg-slate-800 dark:bg-slate-700 rounded-xl p-4 border border-slate-700"
            >
              <div className="text-3xl mb-3">{p.img}</div>
              <p className="font-bold text-white text-sm">{p.name}</p>
              <p className="text-slate-400 text-xs mb-3">{p.category}</p>
              <p className="text-slate-300 text-xs leading-relaxed">{p.insight}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Avoid Products Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-100 dark:border-slate-800 mb-8">
        <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-4">
          Sản phẩm không nên nhập thêm
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                {["SKU", "Tên sản phẩm", "Danh mục", "Lý do", "Rủi ro"].map((h) => (
                  <th key={h} className="text-left pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {MOCK_AVOID_PRODUCTS.map((p) => (
                <tr key={p.sku}>
                  <td className="py-3 text-xs font-mono text-slate-500">{p.sku}</td>
                  <td className="py-3 font-medium text-slate-900 dark:text-slate-100">{p.name}</td>
                  <td className="py-3 text-slate-500 dark:text-slate-400">{p.category}</td>
                  <td className="py-3 text-sm text-slate-600 dark:text-slate-400">{p.reason}</td>
                  <td className="py-3"><RiskBadge level={p.risk} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Import Direction */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-100 dark:border-slate-800 mb-8">
        <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-4">
          Định hướng nhập hàng Q2 2026
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: "Tăng nhập", icon: "trending_up", color: "text-green-600", bg: "bg-green-50 dark:bg-green-950", items: ["Crop Tops Linen", "Cargo Pants", "Tote Bags"] },
            { title: "Giữ nguyên", icon: "horizontal_rule", color: "text-slate-600", bg: "bg-slate-50 dark:bg-slate-800", items: ["Basic T-Shirts", "Midi Skirts", "Accessories"] },
            { title: "Không nhập thêm", icon: "trending_down", color: "text-red-600", bg: "bg-red-50 dark:bg-red-950", items: ["Formal Blazers", "Skinny Jeans", "Cocktail Dresses"] },
          ].map((col) => (
            <div key={col.title} className={`${col.bg} rounded-xl p-4`}>
              <div className={`flex items-center gap-2 mb-3 ${col.color}`}>
                <span className="material-symbols-outlined text-[18px]">{col.icon}</span>
                <p className="font-bold text-sm">{col.title}</p>
              </div>
              <ul className="space-y-1.5">
                {col.items.map((item) => (
                  <li key={item} className="flex items-center gap-1.5 text-sm text-slate-700 dark:text-slate-300">
                    <span className="material-symbols-outlined text-[14px] text-slate-400">chevron_right</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* AI Strategy Box */}
      <AIInsightBox
        title="Chiến lược AI cho Q2 2026"
        items={AI_STRATEGY_ITEMS}
        variant="dark"
      />
    </div>
  )
}
