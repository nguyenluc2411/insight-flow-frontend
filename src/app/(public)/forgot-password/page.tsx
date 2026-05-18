"use client"

import { useState } from "react"
import Link from "next/link"
import { APP_NAME, ROUTES } from "@/lib/constants"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 1000)) // TODO: call authService.forgotPassword()
    setSent(true)
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-900 dark:to-indigo-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-brand-gradient flex items-center justify-center mx-auto mb-3">
            <span className="text-white text-xl font-black">F</span>
          </div>
          <h1 className="text-xl font-black text-slate-900 dark:text-slate-100">Quên mật khẩu</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Nhập email để nhận link đặt lại mật khẩu
          </p>
        </div>

        {sent ? (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-green-50 dark:bg-green-950 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-3xl">
                mark_email_read
              </span>
            </div>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-1">Đã gửi email!</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Kiểm tra hộp thư {email} để đặt lại mật khẩu.
            </p>
            <Link href={ROUTES.LOGIN} className="text-sm text-primary font-semibold hover:underline">
              ← Quay lại đăng nhập
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ban@example.com"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-brand-gradient text-white font-bold text-sm hover:opacity-90 disabled:opacity-60 transition"
            >
              {isLoading ? "Đang gửi..." : "Gửi link đặt lại mật khẩu"}
            </button>

            <p className="text-center text-sm">
              <Link href={ROUTES.LOGIN} className="text-primary font-semibold hover:underline">
                ← Quay lại đăng nhập
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
