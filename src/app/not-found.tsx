import Link from "next/link"
import { ROUTES, APP_NAME } from "@/lib/constants"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-900 dark:to-indigo-950 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-2xl bg-brand-gradient flex items-center justify-center mx-auto mb-6">
          <span className="text-white text-4xl font-black">F</span>
        </div>
        <h1 className="text-8xl font-black gradient-text mb-4">404</h1>
        <p className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">Trang không tồn tại</p>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={ROUTES.DASHBOARD}
            className="px-6 py-3 bg-brand-gradient text-white font-bold rounded-xl hover:opacity-90 transition"
          >
            Về Dashboard
          </Link>
          <Link
            href={ROUTES.HOME}
            className="px-6 py-3 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:border-primary/50 transition"
          >
            Trang chủ
          </Link>
        </div>
      </div>
    </div>
  )
}
