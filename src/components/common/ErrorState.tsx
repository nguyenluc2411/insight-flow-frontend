interface Props {
  message?: string
  onRetry?: () => void
}

export function ErrorState({ message = "Đã có lỗi xảy ra", onRetry }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="material-symbols-outlined text-5xl text-red-400 dark:text-red-500 mb-4">error_outline</span>
      <p className="text-slate-700 dark:text-slate-300 font-semibold mb-1">Không thể tải dữ liệu</p>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 max-w-sm">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-primary border border-primary/30 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950 transition"
        >
          <span className="material-symbols-outlined text-[16px]">refresh</span>
          Thử lại
        </button>
      )}
    </div>
  )
}
