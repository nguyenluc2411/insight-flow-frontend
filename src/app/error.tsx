"use client"

import { useEffect } from "react"

// Root error boundary (Next.js App Router): catches render/runtime errors in any
// route segment and shows a friendly fallback instead of a blank screen.
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Surface to the console for debugging; wire to an error tracker later.
    console.error(error)
  }, [error])

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
      <span className="material-symbols-outlined text-amber-500 text-5xl mb-3">error</span>
      <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Đã có lỗi xảy ra</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md">
        Xin lỗi, có sự cố ngoài ý muốn. Bạn có thể thử lại, nếu vẫn lỗi vui lòng liên hệ hỗ trợ.
      </p>
      {error?.digest && (
        <p className="text-xs text-slate-400 dark:text-slate-600 mt-1">Mã lỗi: {error.digest}</p>
      )}
      <div className="flex items-center gap-3 mt-5">
        <button
          onClick={reset}
          className="px-4 py-2 rounded-lg bg-brand-gradient text-white text-sm font-bold"
        >
          Thử lại
        </button>
        <a
          href="/"
          className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Về trang chủ
        </a>
      </div>
    </div>
  )
}
