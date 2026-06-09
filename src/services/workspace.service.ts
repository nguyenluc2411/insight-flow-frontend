import rawAxios from "axios"
import api from "@/lib/axios"
import type {
  AdviceResponse,
  CreateWorkspaceRequest,
  CreateWorkspaceResponse,
  WorkspaceHistoryItem,
} from "@/types/workspace.types"

export const workspaceService = {
  /** Flow 1 — list every analysis session for the current tenant (sorted desc). */
  async getHistory(): Promise<WorkspaceHistoryItem[]> {
    const { data } = await api.get<WorkspaceHistoryItem[]>("/api/v1/workspaces/history")
    return data
  },

  /** Flow 2 / step 1 — register a workspace and get the MinIO presigned PUT URL. */
  async createWorkspace(req: CreateWorkspaceRequest): Promise<CreateWorkspaceResponse> {
    const { data } = await api.post<CreateWorkspaceResponse>("/api/v1/workspaces", req)
    return data
  },

  /**
   * Flow 2 / step 2 — upload the raw file straight to MinIO via the presigned URL.
   * Uses a bare axios call (NOT the shared `api` instance): the auth interceptor
   * would inject `Authorization` + `Content-Type: application/json`, which breaks
   * the presigned signature. `contentType` must match what step 1 was signed with.
   */
  async uploadToStorage(presignedUrl: string, file: File, contentType: string): Promise<void> {
    await rawAxios.put(presignedUrl, file, {
      headers: { "Content-Type": contentType },
      // Allow large files; presigned upload bypasses the backend entirely.
      timeout: 120000,
      transformRequest: [(d) => d],
    })
  },

  /** Flow 2 / step 3 — confirm the file landed and kick off the async AI job. */
  async confirmUpload(workspaceId: string): Promise<void> {
    await api.post(`/api/v1/workspaces/${workspaceId}/confirm`)
  },

  /**
   * Flow 3 — fetch the AI advice for a workspace. While the upstream job is still
   * running the row may not exist yet (404); we map that to a synthetic PENDING
   * status so the caller can keep polling instead of erroring out.
   */
  async getAdvice(workspaceId: string): Promise<AdviceResponse> {
    try {
      const { data } = await api.get<AdviceResponse>(
        `/api/v1/ml/recommendations/advice/${workspaceId}`
      )
      return data
    } catch (err) {
      if (rawAxios.isAxiosError(err) && err.response?.status === 404) {
        return { workspace_id: workspaceId, status: "PENDING", result: null }
      }
      throw err
    }
  },
}
