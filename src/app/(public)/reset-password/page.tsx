"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ROUTES } from "@/lib/constants"
import { authService } from "@/services/auth.service"
import { parseApiError } from "@/lib/errors"

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token") ?? ""

  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!token) setError("Link đặt lại mật khẩu không hợp lệ. Vui lòng yêu cầu link mới.")
  }, [token])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (newPassword.length < 8) {
      setError("Mật khẩu phải có ít nhất 8 ký tự.")
      return
    }
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.")
      return
    }
    setIsLoading(true)
    setError("")
    try {
      await authService.resetPassword(token, newPassword)
      setDone(true)
      setTimeout(() => router.push(ROUTES.LOGIN), 3000)
    } catch (err: unknown) {
      setError(parseApiError(err, "Link không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu link mới."))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-900 dark:to-indigo-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-brand-gradient flex items-center justify-center mx-auto mb-3">
            <span className="text-white text-xl font-black">F</span>
          </div>
          <h1 className="text-xl font-black text-slate-900 dark:text-slate-100">Đặt lại mật khẩu</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Nhập mật khẩu mới cho tài khoản của bạn
          </p>
        </div>

        {done ? (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-green-50 dark:bg-green-950 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-3xl">
                check_circle
              </span>
            </div>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-1">
              Đặt lại mật khẩu thành công!
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Đang chuyển hướng về trang đăng nhập...
            </p>
            <Link href={ROUTES.LOGIN} className="text-sm text-primary font-semibold hover:underline">
              Đăng nhập ngay
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* New password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Mật khẩu mới
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Tối thiểu 8 ký tự"
                  required
                  disabled={!token}
                  className="w-full px-4 py-2.5 pr-10 rounded-lg border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 transition disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Xác nhận mật khẩu
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu mới"
                required
                disabled={!token}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 transition disabled:opacity-50"
              />
            </div>

            {error && (
              <p className="text-xs text-red-600 bg-red-50 dark:bg-red-950/30 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading || !token}
              className="w-full py-3 rounded-xl bg-brand-gradient text-white font-bold text-sm hover:opacity-90 disabled:opacity-60 transition"
            >
              {isLoading ? "Đang cập nhật..." : "Đặt lại mật khẩu"}
            </button>

            <p className="text-center text-sm">
              <Link href={ROUTES.FORGOT_PASSWORD} className="text-primary font-semibold hover:underline">
                Yêu cầu link mới
              </Link>
              {" · "}
              <Link href={ROUTES.LOGIN} className="text-slate-500 hover:underline">
                Quay lại đăng nhập
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
