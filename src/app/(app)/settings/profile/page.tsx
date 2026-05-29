"use client"

import { useState } from "react"
import { useAuthStore } from "@/stores/auth.store"
import { authService } from "@/services/auth.service"
import { useToast } from "@/hooks/use-toast"
import { parseApiError } from "@/lib/errors"
import { LOCATIONS, FASHION_CATEGORIES, BUSINESS_SCALES, PLATFORMS } from "@/lib/constants"
import { cn } from "@/lib/utils"

export default function ProfilePage() {
  const { user, tenant, setUser } = useAuthStore()
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Editable settings — these are the only fields the API supports
  const [location, setLocation] = useState<string>(user?.location ?? "")
  const [categories, setCategories] = useState<string[]>(user?.categories ?? [])
  const [businessScale, setBusinessScale] = useState<string>(user?.businessScale ?? "")
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(user?.platforms ?? [])

  function toggleCategory(cat: string) {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    )
  }
  function togglePlatform(id: string) {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setIsSaving(true)
    try {
      const updatedUser = await authService.updateProfile({
        location: location || undefined,
        categories,
        businessScale: businessScale || undefined,
        platforms: selectedPlatforms,
        profileComplete: true,
      })
      setUser(updatedUser)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
      toast({ title: "Đã lưu thông tin", description: "Cài đặt shop đã được cập nhật" })
    } catch (err: unknown) {
      toast({ title: "Lỗi lưu thông tin", description: parseApiError(err, "Không thể lưu thông tin"), variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  const chipBase = "px-4 py-2 rounded-full border-2 text-sm font-semibold transition-all cursor-pointer"
  const chipActive = "border-primary bg-primary text-white"
  const chipInactive = "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary/50"

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Thông tin cá nhân</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Quản lý thông tin tài khoản và cài đặt shop</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Account Info — read-only */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-brand-gradient flex items-center justify-center shrink-0">
              <span className="text-white text-2xl font-black">
                {user?.fullName ? user.fullName[0].toUpperCase() : "U"}
              </span>
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-slate-100">{user?.fullName ?? "—"}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
              {tenant && (
                <p className="text-xs text-primary font-medium mt-0.5">{tenant.slug}.forecastly.ai</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Tên shop</p>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{tenant?.name ?? "—"}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Gói dịch vụ</p>
              <span className="inline-flex items-center px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 text-xs font-bold rounded-full">
                {tenant?.plan?.toUpperCase() ?? "TRIAL"}
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-4 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">info</span>
            Tên, email không thể thay đổi. Liên hệ support để cập nhật.
          </p>
        </div>

        {/* Shop Settings — editable */}
        <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-6 space-y-6">
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-200">Cài đặt Shop</h2>

          {/* Location */}
          <div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Khu vực hoạt động</p>
            <div className="flex flex-wrap gap-2">
              {LOCATIONS.map((loc) => (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => setLocation(loc.id)}
                  className={cn(chipBase, location === loc.id ? chipActive : chipInactive)}
                >
                  {loc.label}
                </button>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Danh mục kinh doanh</p>
            <div className="flex flex-wrap gap-2">
              {FASHION_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className={cn(chipBase, categories.includes(cat) ? chipActive : chipInactive)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Business Scale */}
          <div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Quy mô kinh doanh</p>
            <div className="flex flex-wrap gap-2">
              {BUSINESS_SCALES.map((scale) => (
                <button
                  key={scale.id}
                  type="button"
                  onClick={() => setBusinessScale(scale.id)}
                  className={cn(chipBase, businessScale === scale.id ? chipActive : chipInactive)}
                >
                  {scale.label}
                </button>
              ))}
            </div>
          </div>

          {/* Platforms */}
          <div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Kênh bán hàng</p>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map((plat) => (
                <button
                  key={plat.id}
                  type="button"
                  onClick={() => togglePlatform(plat.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 rounded-full border-2 text-sm font-semibold transition-all cursor-pointer",
                    selectedPlatforms.includes(plat.id) ? chipActive : chipInactive
                  )}
                >
                  <span className="material-symbols-outlined text-[16px]">{plat.icon}</span>
                  {plat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-brand-gradient text-white font-bold text-sm rounded-xl hover:opacity-90 disabled:opacity-60 transition"
            >
              {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
            {saved && (
              <span className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400 font-medium">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                Đã lưu!
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
