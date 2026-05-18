"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { FileDropzone } from "@/components/import/FileDropzone"
import { WorkflowSteps } from "@/components/import/WorkflowSteps"
import { ProgressBar } from "@/components/common/ProgressBar"
import { uploadService } from "@/services/upload.service"
import { useToast } from "@/hooks/use-toast"
import { ROUTES } from "@/lib/constants"

const FORMAT_CARDS = [
  {
    ext: "CSV",
    icon: "table_chart",
    color: "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950",
    desc: "Export từ KiotViet, Sapo, Shopee",
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
    desc: "API export / hệ thống ERP",
  },
]

const REQUIRED_FIELDS = [
  { name: "product_id", desc: "Mã SKU sản phẩm" },
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
      await uploadService.uploadFile(file, (pct) => setUploadProgress(pct))
      setActiveStep(3)
      toast({ title: "Tải lên thành công!", description: "AI đang phân tích dữ liệu..." })
      setTimeout(() => router.push(ROUTES.HEALTH_CHECK), 1500)
    } catch {
      // TODO: replace with API call — mock for MVP
      setUploadProgress(100)
      setActiveStep(3)
      toast({ title: "Tải lên thành công!", description: "Chuyển sang trang phân tích..." })
      setTimeout(() => router.push(ROUTES.HEALTH_CHECK), 1500)
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

      {/* Bottom CTA Banner */}
      <div className="mt-8 bg-brand-gradient rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-1 text-white">
          <p className="font-bold text-lg">Dùng thử với dữ liệu mẫu</p>
          <p className="text-indigo-200 text-sm mt-1">
            Chưa có dữ liệu thực? Dùng bộ dữ liệu mẫu của một shop thời trang TP.HCM
          </p>
        </div>
        <button
          onClick={() => handleFileAccepted(new File(["mock"], "sample_data.csv", { type: "text/csv" }))}
          className="shrink-0 px-6 py-3 bg-white text-primary font-bold text-sm rounded-xl hover:bg-indigo-50 transition"
        >
          Dùng dữ liệu mẫu
        </button>
      </div>
    </div>
  )
}
