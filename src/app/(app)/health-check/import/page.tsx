"use client"

import { useState } from "react"
import Link from "next/link"
import { FileDropzone } from "@/components/import/FileDropzone"
import { WorkflowSteps } from "@/components/import/WorkflowSteps"
import { HistoryPanel } from "@/components/import/HistoryPanel"
import { ReportModal } from "@/components/import/ReportModal"
import { useAnalyzeWorkspace } from "@/hooks/useWorkspaces"
import { useToast } from "@/hooks/use-toast"
import { parseApiError } from "@/lib/errors"
import { ROUTES } from "@/lib/constants"

const FORMAT_CARDS = [
  {
    ext: "CSV",
    icon: "table_chart",
    color: "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950",
    desc: "Xuất từ KiotViet, Sapo, Shopee",
  },
  {
    ext: "XLSX",
    icon: "grid_on",
    color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950",
    desc: "Excel / Google Sheets",
  },
]

export default function ImportPage() {
  const { toast } = useToast()
  const analyze = useAnalyzeWorkspace()

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [workspaceName, setWorkspaceName] = useState("")
  const [activeStep, setActiveStep] = useState(1)

  const [reportOpen, setReportOpen] = useState(false)
  const [reportWorkspaceId, setReportWorkspaceId] = useState<string | null>(null)

  const isAnalyzing = analyze.isPending

  function handleFileSelected(file: File) {
    setSelectedFile(file)
    // Default the workspace name to the file's base name; user can override.
    if (!workspaceName) setWorkspaceName(file.name.replace(/\.[^.]+$/, ""))
  }

  function handleAnalyze() {
    if (!selectedFile || isAnalyzing) return
    setActiveStep(1)
    analyze.mutate(
      { file: selectedFile, workspaceName, onStep: setActiveStep },
      {
        onSuccess: (workspaceId) => {
          setReportWorkspaceId(workspaceId)
          setReportOpen(true)
          // Reset the upload area for the next session.
          setSelectedFile(null)
          setWorkspaceName("")
          setActiveStep(1)
        },
        onError: (err) => {
          toast({
            title: "Phân tích thất bại",
            description: parseApiError(err, "Không thể xử lý dữ liệu. Vui lòng thử lại."),
            variant: "destructive",
          })
          setActiveStep(1)
        },
      }
    )
  }

  function openReport(workspaceId: string) {
    setReportWorkspaceId(workspaceId)
    setReportOpen(true)
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Tải Dữ liệu &amp; Phân tích</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Tải lên dữ liệu bán hàng để AI phân tích sức khỏe tồn kho và dự báo xu hướng
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left — History panel (Flow 1) */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)]">
            <HistoryPanel onOpenReport={openReport} activeId={reportOpen ? reportWorkspaceId : null} />
          </div>
        </div>

        {/* Right — Upload & analyze (Flow 2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Workspace name */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-100 dark:border-slate-800">
            <label
              htmlFor="workspace-name"
              className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2"
            >
              Tên phiên phân tích
            </label>
            <input
              id="workspace-name"
              type="text"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              disabled={isAnalyzing}
              placeholder="VD: Tồn kho tháng 6"
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
            />
          </div>

          {/* Dropzone + scanning overlay */}
          <div className="relative">
            <FileDropzone onFileAccepted={handleFileSelected} isLoading={isAnalyzing} />
            {isAnalyzing && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-2xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-sm">
                <span className="material-symbols-outlined text-5xl text-primary animate-spin mb-3">
                  progress_activity
                </span>
                <p className="font-bold text-slate-800 dark:text-slate-200">Đang quét &amp; xử lý dữ liệu…</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Vui lòng không đóng trang trong khi xử lý
                </p>
              </div>
            )}
          </div>

          {/* Analyze button */}
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={!selectedFile || isAnalyzing}
            className="w-full py-3.5 rounded-xl bg-brand-gradient text-white font-bold text-sm hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isAnalyzing ? "hourglass_top" : "rocket_launch"}
            </span>
            {isAnalyzing ? "Đang phân tích…" : "Bắt đầu phân tích"}
          </button>

          {/* Workflow Steps */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-100 dark:border-slate-800">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">Quy trình xử lý</p>
            <WorkflowSteps activeStep={activeStep} />
          </div>

          {/* Format Cards */}
          <div>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Định dạng hỗ trợ</p>
            <div className="grid grid-cols-2 gap-3">
              {FORMAT_CARDS.map((f) => (
                <div
                  key={f.ext}
                  className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-100 dark:border-slate-800 text-center"
                >
                  <div
                    className={`w-10 h-10 rounded-lg ${f.color} flex items-center justify-center mx-auto mb-2`}
                  >
                    <span className="material-symbols-outlined text-[20px]">{f.icon}</span>
                  </div>
                  <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">.{f.ext}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Alternative path — connect POS */}
          <Link
            href={ROUTES.SETTINGS_INTEGRATIONS}
            className="group flex items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 hover:border-primary/50 hover:shadow-soft transition"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors">
              <span className="material-symbols-outlined text-primary group-hover:text-white transition-colors text-[20px]">
                sync
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">Kết nối KiotViet / Sapo</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Tự động đồng bộ, không cần tải file
              </p>
            </div>
            <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors text-[18px]">
              arrow_forward
            </span>
          </Link>
        </div>
      </div>

      {/* Report modal (Flow 3) */}
      <ReportModal
        workspaceId={reportWorkspaceId}
        open={reportOpen}
        onClose={() => setReportOpen(false)}
      />
    </div>
  )
}
