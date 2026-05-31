import api from "@/lib/axios"

export interface UploadResponse {
  fileId: string
  fileName: string
  status: "processing" | "completed" | "failed"
  message?: string
}

export const uploadService = {
  async uploadFile(file: File, onProgress?: (pct: number) => void): Promise<UploadResponse> {
    const formData = new FormData()
    formData.append("file", file)
    const { data } = await api.post("/api/v1/integrations/import", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (e) => {
        if (onProgress && e.total) onProgress(Math.round((e.loaded * 100) / e.total))
      },
    })
    return data
  },
  async getImportStatus(fileId: string): Promise<UploadResponse> {
    const { data } = await api.get(`/api/v1/integrations/import/${fileId}`)
    return data
  },
}
