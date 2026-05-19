"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { registerSchema, type RegisterFormData } from "@/lib/validations"
import { authService } from "@/services/auth.service"
import { useAuthStore } from "@/stores/auth.store"
import { useToast } from "@/hooks/use-toast"
import { parseApiError } from "@/lib/errors"
import { ROUTES, APP_NAME } from "@/lib/constants"
import { cn } from "@/lib/utils"

export default function RegisterPage() {
  const router = useRouter()
  const { setAuth } = useAuthStore()
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) })

  function handleNameChange(name: string) {
    const slug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
    setValue("slug", slug)
  }

  async function onSubmit(data: RegisterFormData) {
    setIsLoading(true)
    try {
      const result = await authService.register({
        tenantName: data.tenantName,
        slug: data.slug,
        ownerEmail: data.ownerEmail,
        ownerPassword: data.ownerPassword,
        ownerFullName: data.ownerFullName,
      })
      setAuth(result)
      router.push(ROUTES.ONBOARDING)
    } catch (err: unknown) {
      toast({ title: "Lỗi đăng ký", description: parseApiError(err, "Đăng ký thất bại"), variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const inputClass = (hasError: boolean) =>
    cn(
      "w-full px-4 py-2.5 rounded-lg border text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 transition",
      hasError ? "border-red-400" : "border-slate-200 dark:border-slate-700"
    )

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-900 dark:to-indigo-950 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden flex">
        {/* Left — Form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-10 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-brand-gradient flex items-center justify-center">
              <span className="text-white text-sm font-black">F</span>
            </div>
            <span className="gradient-text font-black text-lg">{APP_NAME}</span>
          </div>

          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 mb-1">
            Bắt đầu 14 ngày miễn phí
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Không cần thẻ tín dụng. Hủy bất kỳ lúc nào.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Shop Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Tên shop
              </label>
              <input
                {...register("tenantName")}
                placeholder="Shop Thời Trang Của Bạn"
                onChange={(e) => {
                  register("tenantName").onChange(e)
                  handleNameChange(e.target.value)
                }}
                className={inputClass(!!errors.tenantName)}
              />
              {errors.tenantName && (
                <p className="text-xs text-red-600 mt-1">{errors.tenantName.message}</p>
              )}
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Slug (URL định danh)
              </label>
              <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden focus-within:ring-2 focus-within:ring-primary/40">
                <span className="px-3 py-2.5 text-sm text-slate-400 bg-slate-50 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 select-none">
                  forecastly.ai/
                </span>
                <input
                  {...register("slug")}
                  placeholder="my-shop"
                  className="flex-1 px-3 py-2.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
                />
              </div>
              {errors.slug && <p className="text-xs text-red-600 mt-1">{errors.slug.message}</p>}
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Họ và tên
              </label>
              <input
                {...register("ownerFullName")}
                placeholder="Nguyễn Văn A"
                className={inputClass(!!errors.ownerFullName)}
              />
              {errors.ownerFullName && (
                <p className="text-xs text-red-600 mt-1">{errors.ownerFullName.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Email
              </label>
              <input
                {...register("ownerEmail")}
                type="email"
                placeholder="ban@example.com"
                className={inputClass(!!errors.ownerEmail)}
              />
              {errors.ownerEmail && (
                <p className="text-xs text-red-600 mt-1">{errors.ownerEmail.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  {...register("ownerPassword")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Tối thiểu 8 ký tự"
                  className={inputClass(!!errors.ownerPassword) + " pr-10"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
              {errors.ownerPassword && (
                <p className="text-xs text-red-600 mt-1">{errors.ownerPassword.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Xác nhận mật khẩu
              </label>
              <input
                {...register("confirmPassword")}
                type="password"
                placeholder="Nhập lại mật khẩu"
                className={inputClass(!!errors.confirmPassword)}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-600 mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Terms */}
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                required
                className="w-4 h-4 mt-0.5 rounded border-slate-300 accent-primary"
              />
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Tôi đồng ý với{" "}
                <a href="#" className="text-primary hover:underline font-medium">
                  Điều khoản dịch vụ
                </a>{" "}
                và{" "}
                <a href="#" className="text-primary hover:underline font-medium">
                  Chính sách bảo mật
                </a>
              </span>
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-brand-gradient text-white font-bold text-sm hover:opacity-90 disabled:opacity-60 transition"
            >
              {isLoading ? "Đang tạo tài khoản..." : "Tạo tài khoản miễn phí"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-4">
            Đã có tài khoản?{" "}
            <Link href={ROUTES.LOGIN} className="text-primary font-semibold hover:underline">
              Đăng nhập
            </Link>
          </p>
        </div>

        {/* Right — Benefits (hidden on mobile) */}
        <div className="hidden lg:flex lg:w-1/2 bg-brand-gradient p-10 flex-col justify-center text-white">
          <div className="mb-8">
            <div className="flex items-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <span key={i} className="material-symbols-outlined text-yellow-300 text-[18px]">
                  star
                </span>
              ))}
            </div>
            <p className="text-lg font-bold mb-1">Đã được tin dùng bởi 500+ shop thời trang VN</p>
            <p className="text-indigo-200 text-sm">
              Từ Hà Nội đến TP.HCM — các shop local brand đang dùng Forecastly để tăng sell-through rate
            </p>
          </div>

          <div className="space-y-5 mb-8">
            {[
              {
                icon: "insights",
                title: "Dự báo AI chính xác 89%",
                desc: "Biết trước xu hướng 3 tháng tới, không còn tình trạng tồn kho quá mức",
              },
              {
                icon: "monitor_heart",
                title: "Chẩn đoán sức khỏe tự động",
                desc: "Phát hiện ngay những SKU đang gặp vấn đề và đề xuất hành động cụ thể",
              },
              {
                icon: "recommend",
                title: "Đề xuất thông minh",
                desc: "12+ hành động ưu tiên giúp giảm tồn kho và tăng doanh thu",
              },
            ].map((f) => (
              <div key={f.icon} className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-white text-[20px]">{f.icon}</span>
                </div>
                <div>
                  <p className="font-bold text-sm">{f.title}</p>
                  <p className="text-indigo-200 text-xs mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white/10 rounded-xl p-4 border border-white/20">
            <p className="text-sm font-bold mb-1">Miễn phí 14 ngày, không cần thẻ tín dụng</p>
            <p className="text-indigo-200 text-xs">
              Sau 14 ngày, chọn gói phù hợp hoặc tiếp tục dùng gói Free với tính năng cơ bản.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
