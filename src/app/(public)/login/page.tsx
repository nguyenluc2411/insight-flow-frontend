"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { loginSchema, type LoginFormData } from "@/lib/validations"
import { useAuthStore } from "@/stores/auth.store"
import { useToast } from "@/hooks/use-toast"
import { parseApiError } from "@/lib/errors"
import { ROUTES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { LogoMark } from "@/components/common/Logo"

export default function LoginPage() {
  const router = useRouter()
  const { login, isLoading, tenant } = useAuthStore()
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) })

  async function onSubmit(data: LoginFormData) {
    try {
      await login(data.email, data.password)
      const currentUser = useAuthStore.getState().user
      if (currentUser?.profileComplete) {
        router.push(ROUTES.DASHBOARD)
      } else {
        router.push(ROUTES.ONBOARDING)
      }
    } catch (err: unknown) {
      toast({ title: "Lỗi đăng nhập", description: parseApiError(err, "Đăng nhập thất bại"), variant: "destructive" })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-900 dark:to-indigo-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <LogoMark size={52} />
          </div>
          <h1 className="font-display font-bold text-2xl tracking-tight text-slate-900 dark:text-slate-100">
            Insight<span className="gradient-text">Flow</span>{" "}
            <span className="text-primary">AI</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">AI Dự báo Thời trang Việt Nam</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              placeholder="ban@example.com"
              className={cn(
                "w-full px-4 py-2.5 rounded-lg border text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 transition",
                errors.email ? "border-red-400" : "border-slate-200 dark:border-slate-700"
              )}
            />
            {errors.email && (
              <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Mật khẩu
            </label>
            <div className="relative">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={cn(
                  "w-full px-4 py-2.5 pr-10 rounded-lg border text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 transition",
                  errors.password ? "border-red-400" : "border-slate-200 dark:border-slate-700"
                )}
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
            {errors.password && (
              <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Remember me + Forgot */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-slate-300 text-primary accent-primary"
              />
              <span className="text-sm text-slate-600 dark:text-slate-400">Ghi nhớ đăng nhập</span>
            </label>
            <Link
              href={ROUTES.FORGOT_PASSWORD}
              className="text-sm text-primary hover:underline font-medium"
            >
              Quên mật khẩu?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-brand-gradient text-white font-bold text-sm hover:opacity-90 disabled:opacity-60 transition"
          >
            {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
          <span className="text-xs text-slate-400">hoặc</span>
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
        </div>

        <p className="text-center text-sm text-slate-600 dark:text-slate-400">
          Chưa có tài khoản?{" "}
          <Link href={ROUTES.REGISTER} className="text-primary font-semibold hover:underline">
            Đăng ký miễn phí
          </Link>
        </p>

        <p className="text-center mt-4">
          <Link
            href={ROUTES.HOME}
            className="text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 inline-flex items-center gap-1 transition-colors"
          >
            <span className="material-symbols-outlined text-[15px]">arrow_back</span>
            Về trang chủ
          </Link>
        </p>
      </div>
    </div>
  )
}
