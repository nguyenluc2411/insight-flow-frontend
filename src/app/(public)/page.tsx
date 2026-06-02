import Link from "next/link"
import { ROUTES, APP_FULL_NAME } from "@/lib/constants"
import { LandingPricing } from "@/components/landing/LandingPricing"
import { Logo } from "@/components/common/Logo"

const PROBLEMS = [
  { icon: "inventory_2", title: "Tồn kho quá mức", desc: "Vốn bị chôn vùi trong hàng không bán được, phải markdown giảm giá mạnh cuối mùa" },
  { icon: "trending_down", title: "Dự báo không chính xác", desc: "Không biết sản phẩm nào sẽ hot, nhập quá ít hoặc quá nhiều so với nhu cầu thực tế" },
  { icon: "warning", title: "Quyết định không có dữ liệu", desc: "Đang ra quyết định nhập hàng dựa trên cảm tính thay vì dữ liệu thị trường" },
]

const SOLUTIONS = [
  { icon: "auto_awesome", title: "AI phân tích 10,000+ điểm dữ liệu", desc: "Phân tích xu hướng TikTok, Shopee, dữ liệu bán hàng của bạn và 500+ shop tương tự" },
  { icon: "insights", title: "Dự báo chính xác 89%", desc: "Biết trước 3 tháng nào nên nhập gì, bao nhiêu, bán ở kênh nào" },
  { icon: "recommend", title: "Đề xuất hành động cụ thể", desc: "Không chỉ báo cáo — AI đề xuất chính xác: chuyển kho đâu, markdown bao nhiêu, nhập gì thêm" },
]

const STEPS = [
  { num: 1, icon: "account_circle", title: "Tạo hồ sơ Shop", desc: "Cho AI biết bạn đang bán gì, ở đâu, quy mô như thế nào — mất 2 phút" },
  { num: 2, icon: "upload_file", title: "Tích hợp dữ liệu", desc: "Kết nối KiotViet, Sapo hoặc upload file Excel — AI tự động làm sạch và chuẩn hóa" },
  { num: 3, icon: "bolt", title: "Nhận Thông tin AI", desc: "Trong 60 giây, nhận báo cáo sức khỏe + dự báo xu hướng + 12 đề xuất hành động" },
]

const FEATURES = [
  {
    icon: "monitor_heart",
    title: "Chẩn đoán Sức khỏe",
    desc: "Phát hiện tự động tồn kho quá mức, SKU chậm bán, kênh bán kém hiệu quả",
    color: "text-red-500",
    bg: "bg-red-50 dark:bg-red-950",
  },
  {
    icon: "insights",
    title: "Dự báo Xu hướng",
    desc: "Dự đoán sản phẩm nào sẽ trending mùa tới với độ tin cậy 89%",
    color: "text-indigo-500",
    bg: "bg-indigo-50 dark:bg-indigo-950",
  },
  {
    icon: "recommend",
    title: "Đề xuất thông minh",
    desc: "12+ hành động ưu tiên cao: chuyển kho, markdown, tăng nhập — có số liệu cụ thể",
    color: "text-purple-500",
    bg: "bg-purple-50 dark:bg-purple-950",
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-950/95 backdrop-blur border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Logo size={30} />
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-400">
            <a href="#features" className="hover:text-primary transition">Tính năng</a>
            <a href="#how-it-works" className="hover:text-primary transition">Cách hoạt động</a>
            <a href="#pricing" className="hover:text-primary transition">Bảng giá</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href={ROUTES.LOGIN}
              className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary transition"
            >
              Đăng nhập
            </Link>
            <Link
              href={ROUTES.REGISTER}
              className="px-4 py-2 bg-brand-gradient text-white text-sm font-bold rounded-lg hover:opacity-90 transition"
            >
              Bắt đầu ngay
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-indigo-950 dark:via-slate-950 dark:to-purple-950 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 px-3 py-1.5 rounded-full text-xs font-bold mb-6">
                <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                AI được đào tạo trên dữ liệu thời trang Việt Nam
              </div>
              <h1 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-slate-100 leading-tight mb-4">
                Biến Dữ liệu Thời trang thành{" "}
                <span className="gradient-text">Sự chắc chắn về Nhu cầu</span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                AI dự báo xu hướng, tối ưu tồn kho và đề xuất hành động cụ thể — giúp shop thời trang Việt Nam tăng sell-through rate và giảm rủi ro tồn kho.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={ROUTES.REGISTER}
                  className="px-6 py-3 bg-brand-gradient text-white font-bold rounded-xl hover:opacity-90 transition flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
                  Bắt đầu Đánh giá AI
                </Link>
                <Link
                  href={ROUTES.DASHBOARD}
                  className="px-6 py-3 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:border-primary/50 transition flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">preview</span>
                  Xem Dashboard Mẫu
                </Link>
              </div>
              {/* Brand logos */}
              <div className="flex items-center gap-4 mt-8">
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                  Tin dùng bởi:
                </p>
                {["VOGUE VN", "LOCAL BRAND VN", "FASHION WEEK"].map((brand) => (
                  <span key={brand} className="text-xs font-black text-slate-400 dark:text-slate-600 tracking-widest">
                    {brand}
                  </span>
                ))}
              </div>
            </div>

            {/* Dashboard Preview Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                <span className="ml-2 text-xs text-slate-400">Forecastly Dashboard</span>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { label: "Sell-through", value: "+11%", color: "text-green-600" },
                  { label: "Tồn kho giảm", value: "-18%", color: "text-indigo-600" },
                  { label: "Độ tin cậy AI", value: "89%", color: "text-purple-600" },
                  { label: "Đề xuất hành động", value: "12", color: "text-amber-600" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                    <p className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
                    <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                  </div>
                ))}
              </div>
              <div className="bg-indigo-900 rounded-xl p-4">
                <p className="text-xs text-indigo-300 mb-1">AI Insight</p>
                <p className="text-sm text-white font-medium">
                  Chuyển 150 đv Wide Leg Trousers → Hà Nội + TikTok để giảm tồn 33%
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problems & Solutions */}
      <section className="py-16 px-4 bg-white dark:bg-slate-950" id="features">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Problems */}
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 mb-6">
                3 vấn đề nan giải của shop thời trang
              </h2>
              <div className="space-y-4">
                {PROBLEMS.map((p) => (
                  <div key={p.icon} className="flex items-start gap-4 p-4 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-100 dark:border-red-900/50">
                    <span className="material-symbols-outlined text-red-500 text-[24px] shrink-0">{p.icon}</span>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-slate-100">{p.title}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Solutions */}
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 mb-6">
                3 giải pháp AI của {APP_FULL_NAME}
              </h2>
              <div className="space-y-4">
                {SOLUTIONS.map((s) => (
                  <div key={s.icon} className="flex items-start gap-4 p-4 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900/50">
                    <span className="material-symbols-outlined text-indigo-500 text-[24px] shrink-0">{s.icon}</span>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-slate-100">{s.title}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30" id="how-it-works">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100 mb-3">
            3 Bước tới Sự Thông thái
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-12">
            Từ dữ liệu thô đến quyết định thông minh — chỉ trong 60 giây
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <div key={step.num} className="relative">
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-soft border border-slate-100 dark:border-slate-800">
                  <div className="w-14 h-14 rounded-2xl bg-brand-gradient flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-white text-[28px]">{step.icon}</span>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-950 text-primary text-sm font-black flex items-center justify-center mx-auto mb-3">
                    {step.num}
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{step.desc}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-1/3 -right-4 z-10">
                    <span className="material-symbols-outlined text-slate-300 dark:text-slate-700 text-2xl">arrow_forward</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Features */}
      <section className="py-16 px-4 bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100 text-center mb-12">
            Mọi thứ bạn cần trong một Dashboard
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 hover:shadow-soft transition"
              >
                <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-4`}>
                  <span className={`material-symbols-outlined ${f.color} text-[24px]`}>{f.icon}</span>
                </div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <LandingPricing />

      {/* Dark CTA */}
      <section className="py-16 px-4 bg-slate-900 dark:bg-slate-950">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-black text-white mb-4">
            Biến Kho hàng thành Hành động Sinh lời
          </h2>
          <p className="text-slate-400 mb-8">
            Bắt đầu miễn phí 30 ngày. Không cần thẻ tín dụng. Không cần kỹ năng tech.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href={ROUTES.REGISTER}
              className="px-8 py-4 bg-brand-gradient text-white font-bold rounded-2xl hover:opacity-90 transition text-lg"
            >
              Bắt đầu miễn phí ngay
            </Link>
            <div className="text-slate-400 text-sm">
              Đã có tài khoản?{" "}
              <Link href={ROUTES.LOGIN} className="text-indigo-400 hover:underline font-medium">
                Đăng nhập
              </Link>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px] text-green-500">check_circle</span>
              Miễn phí 30 ngày
            </span>
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px] text-green-500">check_circle</span>
              Không cần thẻ tín dụng
            </span>
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px] text-green-500">check_circle</span>
              Hủy bất kỳ lúc nào
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <div className="mb-2">
                <Logo size={26} light />
              </div>
              <p className="text-xs text-slate-500">AI Dự báo Thời trang Việt Nam</p>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-slate-400">
              <a href="#" className="hover:text-white transition">Điều khoản</a>
              <a href="#" className="hover:text-white transition">Bảo mật</a>
              <a href="#" className="hover:text-white transition">Liên hệ</a>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-slate-800 text-center text-xs text-slate-600">
            © 2026 {APP_FULL_NAME}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
