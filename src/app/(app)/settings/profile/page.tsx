"use client"

import { useState } from "react"
import { useAuthStore } from "@/stores/auth.store"
import { cn } from "@/lib/utils"

export default function ProfilePage() {
  const { user, tenant } = useAuthStore()
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [form, setForm] = useState({
    fullName: user?.fullName ?? "",
    email: user?.email ?? "",
    shopName: tenant?.name ?? "",
    phone: user?.phone ?? "",
  })

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setIsSaving(true)
    await new Promise((r) => setTimeout(r, 800)) // TODO: call authService.updateProfile()
    setSaved(true)
    setIsSaving(false)
    setTimeout(() => setSaved(false), 3000)
  }

  const inputClass =
    "w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 transition"

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Thông tin cá nhân</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Cập nhật thông tin tài khoản và shop của bạn</p>
      </div>

      <div className="max-w-2xl bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-6">
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="w-16 h-16 rounded-full bg-brand-gradient flex items-center justify-center">
            <span className="text-white text-2xl font-black">
              {form.fullName ? form.fullName[0].toUpperCase() : "U"}
            </span>
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-slate-100">{form.fullName || "Chưa đặt tên"}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{tenant?.slug}.forecastly.ai</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Họ và tên</label>
            <input
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className={inputClass}
              placeholder="Nguyễn Văn A"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Tên shop</label>
            <input
              value={form.shopName}
              onChange={(e) => setForm({ ...form, shopName: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Số điện thoại</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className={inputClass}
              placeholder="0901 234 567"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
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
