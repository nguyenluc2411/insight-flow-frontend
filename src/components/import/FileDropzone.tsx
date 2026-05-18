"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { cn } from "@/lib/utils"

interface Props {
  onFileAccepted: (file: File) => void
  isLoading?: boolean
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function FileDropzone({ onFileAccepted, isLoading = false }: Props) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (file) {
        setSelectedFile(file)
        onFileAccepted(file)
      }
    },
    [onFileAccepted]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/json": [".json"],
    },
    maxFiles: 1,
    disabled: isLoading,
  })

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all",
        isDragActive
          ? "border-primary bg-indigo-50 dark:bg-indigo-950"
          : "border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-slate-50 dark:hover:bg-slate-800/50",
        isLoading && "opacity-60 cursor-not-allowed"
      )}
    >
      <input {...getInputProps()} />

      {selectedFile ? (
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-xl bg-green-100 dark:bg-green-950 flex items-center justify-center">
            <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-3xl">
              task_alt
            </span>
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-slate-100">{selectedFile.name}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {formatFileSize(selectedFile.size)}
            </p>
          </div>
          <p className="text-xs text-green-600 dark:text-green-400 font-medium">
            Nhấn để chọn file khác
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-3xl">
              {isDragActive ? "move_to_inbox" : "cloud_upload"}
            </span>
          </div>
          <div>
            <p className="font-bold text-slate-800 dark:text-slate-200">
              {isDragActive ? "Thả file vào đây..." : "Kéo và thả file vào đây"}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              hoặc nhấn để chọn file từ máy tính
            </p>
          </div>
          <div className="flex items-center gap-2">
            {["CSV", "XLSX", "JSON"].map((ext) => (
              <span
                key={ext}
                className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold rounded"
              >
                .{ext}
              </span>
            ))}
          </div>
        </div>
      )}

      {!selectedFile && (
        <button
          type="button"
          className="mt-6 px-6 py-3 bg-brand-gradient text-white font-bold text-sm rounded-xl hover:opacity-90 transition inline-flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="material-symbols-outlined text-[18px]">upload_file</span>
          Tải lên Dữ liệu Doanh nghiệp
        </button>
      )}
    </div>
  )
}
