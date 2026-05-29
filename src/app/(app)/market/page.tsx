import { KPICard } from "@/components/common/KPICard"
import { AIInsightBox } from "@/components/common/AIInsightBox"
import { TrendIndicator } from "@/components/common/TrendIndicator"
import { ProgressBar } from "@/components/common/ProgressBar"
import Link from "next/link"
import { ROUTES } from "@/lib/constants"
import { FeatureGate } from "@/components/feature/FeatureGate"

// TODO: replace with API calls
const MOCK_KPIS = [
  { label: "Điểm cơ hội thị trường", value: "92/100", subtitle: "Cao nhất từ trước đến nay", trend: "+7 điểm", trendType: "up" as const },
  { label: "Nhóm sản phẩm tiềm năng", value: "4", subtitle: "Được AI xác định", trendType: "neutral" as const },
  { label: "Kênh tốt nhất", value: "TikTok Shop", subtitle: "82% hiệu suất", trend: "+12%", trendType: "up" as const },
  { label: "Mức độ cạnh tranh", value: "Cao", subtitle: "Bottoms & Streetwear", trendType: "neutral" as const },
]

const MOCK_PRODUCTS = [
  {
    name: "Áo Crop Top Linen",
    badge: "Đang hot",
    badgeColor: "bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-400",
    trend: 28,
    insight: "Xu hướng tăng 28% trên TikTok — phù hợp với mùa hè 2026",
    img: "👕",
  },
  {
    name: "Quần Cargo Baggy",
    badge: "Đề xuất nhập",
    badgeColor: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400",
    trend: 22,
    insight: "Streetwear đang bùng nổ Q2 — thị phần còn trống tại Hà Nội",
    img: "👖",
  },
  {
    name: "Váy Maxi Boho",
    badge: "Cơ hội mới",
    badgeColor: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
    trend: 15,
    insight: "Chưa khai thác — cạnh tranh thấp, biên lợi nhuận cao hơn 18%",
    img: "👗",
  },
]

const MOCK_CHANNELS = [
  { name: "TikTok Shop", score: 92, growth: 34 },
  { name: "Shopee Fashion", score: 74, growth: 18 },
  { name: "Website Thương hiệu", score: 58, growth: 9 },
  { name: "Offline / Cửa hàng", score: 45, growth: 3 },
]

const MOCK_REGIONS = [
  { name: "Hà Nội", demand: "Rất cao", growth: 28, color: "text-green-600" },
  { name: "TP. Hồ Chí Minh", demand: "Cao", growth: 18, color: "text-green-500" },
  { name: "Đà Nẵng", demand: "Trung bình", growth: 12, color: "text-amber-500" },
  { name: "Cần Thơ", demand: "Đang tăng", growth: 8, color: "text-blue-500" },
]

const MOCK_TRENDS = [
  { name: "Linen & Natural Fabrics", tag: "Vải tự nhiên", growth: 42 },
  { name: "Oversized Silhouettes", tag: "Dáng rộng", growth: 35 },
  { name: "Y2K Revival", tag: "Retro", growth: 28 },
  { name: "Tonal Dressing", tag: "Màu đơn sắc", growth: 21 },
]

export default function MarketPage() {
  return (
    <FeatureGate featureCode="SALES_ANALYTICS">
      <MarketPageContent />
    </FeatureGate>
  )
}

function MarketPageContent() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Cơ hội Thị trường
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Phân tích thị trường thời trang Việt Nam — Q2 2026
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {MOCK_KPIS.map((kpi) => (
          <KPICard key={kpi.label} {...kpi} />
        ))}
      </div>

      {/* Product Opportunities */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
            Cơ hội sản phẩm được AI đề xuất
          </h2>
          <button className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
            Xem tất cả xu hướng
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {MOCK_PRODUCTS.map((product) => (
            <div
              key={product.name}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-soft transition-shadow"
            >
              {/* Product image placeholder */}
              <div className="h-40 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 flex items-center justify-center text-6xl">
                {product.img}
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-slate-900 dark:text-slate-100">{product.name}</h3>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${product.badgeColor}`}>
                    {product.badge}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <TrendIndicator value={product.trend} />
                  <span className="text-xs text-slate-500 dark:text-slate-400">so với tháng trước</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                  {product.insight}
                </p>
                <button className="w-full py-2 bg-brand-gradient text-white text-sm font-bold rounded-lg hover:opacity-90 transition">
                  Xem chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Channels */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">storefront</span>
            Kênh bán tốt nhất
          </h3>
          <div className="space-y-3">
            {MOCK_CHANNELS.map((ch) => (
              <div key={ch.name}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-slate-600 dark:text-slate-400">{ch.name}</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{ch.score}/100</span>
                </div>
                <ProgressBar value={ch.score} />
              </div>
            ))}
          </div>
        </div>

        {/* Regions */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">location_on</span>
            Nhu cầu theo khu vực
          </h3>
          <div className="space-y-3">
            {MOCK_REGIONS.map((r) => (
              <div key={r.name} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{r.name}</p>
                  <p className={`text-xs font-semibold ${r.color}`}>{r.demand}</p>
                </div>
                <TrendIndicator value={r.growth} />
              </div>
            ))}
          </div>
        </div>

        {/* Trends */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">trending_up</span>
            Xu hướng nổi bật
          </h3>
          <div className="space-y-3">
            {MOCK_TRENDS.map((t) => (
              <div key={t.name} className="flex items-center gap-3">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.name}</p>
                  <span className="text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full">
                    {t.tag}
                  </span>
                </div>
                <TrendIndicator value={t.growth} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <Link
        href={ROUTES.HEALTH_CHECK_IMPORT}
        className="block bg-brand-gradient rounded-2xl p-6 hover:opacity-90 transition"
      >
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <span className="material-symbols-outlined text-white text-4xl">monitor_heart</span>
          <div className="text-white flex-1">
            <p className="text-lg font-bold">Khai phá các chỉ số sức khỏe doanh nghiệp</p>
            <p className="text-indigo-200 text-sm mt-1">
              Tải dữ liệu của bạn để nhận phân tích cá nhân hóa và so sánh với thị trường
            </p>
          </div>
          <span className="material-symbols-outlined text-white text-2xl">arrow_forward</span>
        </div>
      </Link>
    </div>
  )
}
