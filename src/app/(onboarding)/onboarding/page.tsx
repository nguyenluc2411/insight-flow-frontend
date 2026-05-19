"use client"

import { useRouter } from "next/navigation"
import { useOnboardingStore } from "@/stores/onboarding.store"
import { useAuthStore } from "@/stores/auth.store"
import { authService } from "@/services/auth.service"
import { ROUTES, LOCATIONS, FASHION_CATEGORIES, BUSINESS_SCALES, PLATFORMS, APP_NAME } from "@/lib/constants"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useState } from "react"

const STEPS = [
  { label: "Khu vực", icon: "location_on" },
  { label: "Danh mục", icon: "category" },
  { label: "Quy mô & Kênh", icon: "storefront" },
]

export default function OnboardingPage() {
  const router = useRouter()
  const { updateTenantSettings, setUser } = useAuthStore()
  const {
    location, categories, businessScale, platforms,
    currentStep, setLocation, toggleCategory, setScale, togglePlatform,
    nextStep, prevStep,
  } = useOnboardingStore()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const progress = Math.round((currentStep / 3) * 100)

  async function handleFinish() {
    setIsLoading(true)
    setError(null)
    const settings = {
      location: location ?? undefined,
      categories,
      businessScale: businessScale ?? undefined,
      platforms,
      profileComplete: true,
    }
    try {
      const updatedUser = await authService.updateProfile(settings)
      setUser(updatedUser)
      updateTenantSettings(settings)
      router.push(ROUTES.MARKET)
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
      setError(detail ?? "Không thể lưu thông tin. Vui lòng thử lại.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-900 dark:to-indigo-950">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-gradient flex items-center justify-center">
              <span className="text-white text-sm font-black">F</span>
            </div>
            <span className="gradient-text font-black text-lg">{APP_NAME}</span>
          </Link>
          <button className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">language</span>
            VI
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10">
        {/* Progress */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              Bước {currentStep} / 3
            </p>
            <p className="text-sm font-bold text-primary">Hoàn thành {progress}%</p>
          </div>
          <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full">
            <div
              className="h-full bg-brand-gradient rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex gap-2 mt-4">
            {STEPS.map((step, i) => (
              <div
                key={step.label}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all",
                  i + 1 === currentStep
                    ? "bg-primary text-white"
                    : i + 1 < currentStep
                      ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                      : "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
                )}
              >
                <span className="material-symbols-outlined text-[14px]">
                  {i + 1 < currentStep ? "check" : step.icon}
                </span>
                {step.label}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-soft p-8">
          {/* STEP 1 — Location */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 mb-1">
                Shop của bạn ở đâu?
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                Chọn khu vực chính để nhận phân tích thị trường phù hợp
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {LOCATIONS.map((loc) => (
                  <button
                    key={loc.id}
                    onClick={() => setLocation(loc.id)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-6 rounded-xl border-2 transition-all",
                      location === loc.id
                        ? "border-primary bg-indigo-50 dark:bg-indigo-950"
                        : "border-slate-200 dark:border-slate-700 hover:border-primary/50"
                    )}
                  >
                    <span className="material-symbols-outlined text-3xl text-primary">location_city</span>
                    <p className="font-bold text-slate-900 dark:text-slate-100">{loc.label}</p>
                    <p className="text-xs text-slate-500">{loc.sub}</p>
                    {location === loc.id && (
                      <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                    )}
                  </button>
                ))}
              </div>
              <button
                className="mt-4 text-sm text-primary hover:underline font-medium"
                onClick={() => {}}
              >
                + Xem tất cả khu vực
              </button>
            </div>
          )}

          {/* STEP 2 — Categories */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 mb-1">
                Bạn kinh doanh danh mục nào?
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                Chọn một hoặc nhiều danh mục thời trang
              </p>
              <div className="flex flex-wrap gap-3">
                {FASHION_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={cn(
                      "px-5 py-2.5 rounded-full border-2 text-sm font-semibold transition-all",
                      categories.includes(cat)
                        ? "border-primary bg-primary text-white"
                        : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary/50"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              {categories.length > 0 && (
                <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                  Đã chọn: {categories.join(", ")}
                </p>
              )}
            </div>
          )}

          {/* STEP 3 — Scale + Platforms */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 mb-6">
                Quy mô & Kênh bán hàng
              </h2>

              {/* Scale */}
              <div className="mb-8">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                  Quy mô kinh doanh của bạn
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {BUSINESS_SCALES.map((scale) => (
                    <button
                      key={scale.id}
                      onClick={() => setScale(scale.id)}
                      className={cn(
                        "p-4 rounded-xl border-2 text-left transition-all",
                        businessScale === scale.id
                          ? "border-primary bg-indigo-50 dark:bg-indigo-950"
                          : "border-slate-200 dark:border-slate-700 hover:border-primary/50"
                      )}
                    >
                      <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                        {scale.label}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Platforms */}
              <div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                  Bạn đang bán ở kênh nào? (có thể chọn nhiều)
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {PLATFORMS.map((plat) => (
                    <button
                      key={plat.id}
                      onClick={() => togglePlatform(plat.id)}
                      className={cn(
                        "flex items-center gap-2.5 p-3.5 rounded-xl border-2 transition-all",
                        platforms.includes(plat.id)
                          ? "border-primary bg-indigo-50 dark:bg-indigo-950"
                          : "border-slate-200 dark:border-slate-700 hover:border-primary/50"
                      )}
                    >
                      <span className="material-symbols-outlined text-[20px] text-primary">
                        {plat.icon}
                      </span>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {plat.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-lg text-sm text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Nav Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Quay lại
            </button>

            {currentStep < 3 ? (
              <button
                onClick={nextStep}
                disabled={
                  (currentStep === 1 && !location) ||
                  (currentStep === 2 && categories.length === 0)
                }
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-brand-gradient text-white font-bold text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Tiếp theo
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={isLoading || !businessScale}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-gradient text-white font-bold text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {isLoading ? (
                  <>
                    <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                    Hoàn tất & Phân tích thị trường
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Footer badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-green-500">security</span>
            Dữ liệu được mã hóa
          </span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-indigo-500">bolt</span>
            Phân tích trong 60 giây
          </span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-purple-500">analytics</span>
            AI được đào tạo trên dữ liệu thời trang VN
          </span>
        </div>
      </main>
    </div>
  )
}
