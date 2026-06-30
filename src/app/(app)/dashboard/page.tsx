"use client"

import Link from "next/link"
import { ROUTES } from "@/lib/constants"
import { useAuthStore } from "@/stores/auth.store"

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user)

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-indigo-950 dark:via-slate-950 dark:to-purple-950 -m-4 sm:-m-8 p-8 min-h-[calc(100vh-64px)] flex flex-col justify-center">
      <div className="max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 px-3 py-1.5 rounded-full text-xs font-bold mb-6">
              <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
              AI được đào tạo trên dữ liệu thời trang Việt Nam
            </div>
            
            {user?.fullName && (
              <h2 className="text-2xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
                Xin chào, {user.fullName.split(" ").pop()}!
              </h2>
            )}

            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-slate-100 leading-tight mb-4">
              Biến Dữ liệu Thời trang thành{" "}
              <span className="gradient-text">Sự chắc chắn về Nhu cầu</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              AI dự báo xu hướng, tối ưu tồn kho và đề xuất hành động cụ thể — giúp shop thời trang Việt Nam tăng tỷ lệ bán ra và giảm rủi ro tồn kho.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={ROUTES.HEALTH_CHECK_IMPORT}
                className="px-6 py-3 bg-brand-gradient text-white font-bold rounded-xl hover:opacity-90 transition flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
                Bắt đầu phân tích ngay
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
              <span className="ml-2 text-xs text-slate-400">InsightFlow AI</span>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { label: "Tỷ lệ bán ra", value: "+11%", color: "text-green-600" },
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
              <p className="text-xs text-indigo-300 mb-1">Gợi ý AI</p>
              <p className="text-sm text-white font-medium">
                Chuyển 150 đơn vị Quần Ống Rộng → Hà Nội + TikTok để giảm tồn 33%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
