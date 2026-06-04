"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { FileDropzone } from "@/components/import/FileDropzone"
import { WorkflowSteps } from "@/components/import/WorkflowSteps"
import { ProgressBar } from "@/components/common/ProgressBar"
import { uploadService } from "@/services/upload.service"
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
  {
    ext: "JSON",
    icon: "data_object",
    color: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950",
    desc: "Xuất từ API / hệ thống ERP",
  },
]

const REQUIRED_FIELDS = [
  { name: "product_id", desc: "Mã sản phẩm" },
  { name: "product_name", desc: "Tên sản phẩm" },
  { name: "category", desc: "Danh mục" },
  { name: "quantity_sold", desc: "Số lượng đã bán" },
  { name: "quantity_on_hand", desc: "Tồn kho hiện tại" },
  { name: "channel", desc: "Kênh bán hàng" },
  { name: "sale_date", desc: "Ngày giao dịch" },
]

export default function ImportPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [activeStep, setActiveStep] = useState(1)

  async function handleFileAccepted(file: File) {
    setIsUploading(true)
    setActiveStep(2)
    try {
      const result = await uploadService.uploadFile(file, (pct) => setUploadProgress(pct))
      setActiveStep(3)

      if (result.status === "processing") {
        // Poll import status every 3s
        let attempts = 0
        const poll = setInterval(async () => {
          attempts++
          try {
            const status = await uploadService.getImportStatus(result.fileId)
            if (status.status === "completed") {
              clearInterval(poll)
              toast({ title: "Phân tích hoàn thành!", description: "Chuyển sang trang sức khỏe..." })
              router.push(ROUTES.HEALTH_CHECK)
            } else if (status.status === "failed") {
              clearInterval(poll)
              toast({ title: "Phân tích thất bại", description: status.message ?? "Vui lòng thử lại", variant: "destructive" })
              setIsUploading(false)
            }
          } catch { clearInterval(poll) }
          if (attempts >= 20) clearInterval(poll)
        }, 3000)
      } else {
        toast({ title: "Tải lên thành công!", description: "Chuyển sang trang phân tích..." })
        setTimeout(() => router.push(ROUTES.HEALTH_CHECK), 1500)
      }
    } catch (err: unknown) {
      // Always surface upload failures — never fake success.
      toast({
        title: "Lỗi tải lên",
        description: parseApiError(err, "Không thể tải lên dữ liệu. Vui lòng thử lại."),
        variant: "destructive",
      })
      setActiveStep(1)
      setUploadProgress(0)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Tải Dữ liệu</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Tải lên dữ liệu bán hàng để AI phân tích sức khỏe doanh nghiệp của bạn
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left — Main upload area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Dropzone */}
          <FileDropzone onFileAccepted={handleFileAccepted} isLoading={isUploading} />

          {/* Upload progress */}
          {isUploading && (
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Đang tải lên...
                </p>
                <span className="text-sm font-bold text-primary">{uploadProgress}%</span>
              </div>
              <ProgressBar value={uploadProgress} showLabel={false} />
            </div>
          )}

          {/* Workflow Steps */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-100 dark:border-slate-800">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">Quy trình xử lý</p>
            <WorkflowSteps activeStep={activeStep} />
          </div>

          {/* Format Cards */}
          <div>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
              Định dạng hỗ trợ
            </p>
            <div className="grid grid-cols-3 gap-3">
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
        </div>

        {/* Right — Fields guide sidebar */}
        <div>
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-100 dark:border-slate-800 sticky top-24">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primary">help_outline</span>
              <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                Các trường được đề xuất
              </p>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              File của bạn nên chứa các cột sau để nhận phân tích đầy đủ:
            </p>
            <div className="space-y-3">
              {REQUIRED_FIELDS.map((field) => (
                <div key={field.name} className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-[14px] text-green-500 mt-0.5 shrink-0">
                    check_circle
                  </span>
                  <div>
                    <code className="text-xs font-mono text-primary bg-indigo-50 dark:bg-indigo-950 px-1.5 py-0.5 rounded">
                      {field.name}
                    </code>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{field.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Không có đủ cột? AI sẽ cố gắng nhận diện và điền thêm thông tin còn thiếu.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Alternative paths — shown when user doesn't have a file ready */}
      <div className="mt-8">
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4">
          Chưa có file dữ liệu? Bắt đầu theo cách khác:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Path 1: Connect POS */}
          <Link
            href={ROUTES.SETTINGS_INTEGRATIONS}
            className="group flex items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 hover:border-primary/50 hover:shadow-soft transition"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors">
              <span className="material-symbols-outlined text-primary group-hover:text-white transition-colors text-[20px]">sync</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">Kết nối KiotViet / Sapo</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Tự động đồng bộ, không cần tải file</p>
            </div>
            <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors text-[18px]">arrow_forward</span>
          </Link>

          {/* Path 2: What data is needed */}
          <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-[20px]">info</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">Không có lịch sử bán hàng?</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Hệ thống vẫn dự báo được dựa trên xu hướng thị trường HCM — kết nối POS để có dự báo chính xác hơn.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
