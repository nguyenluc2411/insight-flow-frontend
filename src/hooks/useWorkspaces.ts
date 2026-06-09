"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { workspaceService } from "@/services/workspace.service"
import { useAuthStore } from "@/stores/auth.store"
import type { AdviceResponse } from "@/types/workspace.types"

/** Flow 1 — load analysis history when the panel mounts. */
export function useWorkspaceHistory() {
  const tenantId = useAuthStore((s) => s.tenant?.id)
  return useQuery({
    queryKey: ["workspace-history", tenantId],
    queryFn: () => workspaceService.getHistory(),
    enabled: !!tenantId,
    staleTime: 30 * 1000,
  })
}

const XLSX_MIME =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

/** Resolve a stable content-type used for BOTH the create payload and the PUT. */
function resolveContentType(file: File): string {
  if (file.type) return file.type
  const name = file.name.toLowerCase()
  if (name.endsWith(".xlsx")) return XLSX_MIME
  if (name.endsWith(".csv")) return "text/csv"
  return "application/octet-stream"
}

export interface AnalyzeVariables {
  file: File
  workspaceName: string
  /** Reports the current 1-based step so the UI can drive the stepper. */
  onStep?: (step: number) => void
}

/**
 * Flow 2 — orchestrates the 3 mandatory steps sequentially:
 *   1. POST /workspaces  (get presigned URL)
 *   2. PUT  <presigned>  (upload raw file to MinIO)
 *   3. POST /workspaces/{id}/confirm  (trigger AI)
 * Resolves to the workspace_id, which Flow 3 consumes. Any failure rejects so
 * the caller can surface a toast and drop out of the loading state.
 */
export function useAnalyzeWorkspace() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ file, workspaceName, onStep }: AnalyzeVariables): Promise<string> => {
      const contentType = resolveContentType(file)

      onStep?.(1)
      const { workspace_id, s3_presigned_url } = await workspaceService.createWorkspace({
        workspace_name: workspaceName.trim() || file.name,
        file_name: file.name,
        content_type: contentType,
      })

      await workspaceService.uploadToStorage(s3_presigned_url, file, contentType)

      onStep?.(2)
      await workspaceService.confirmUpload(workspace_id)

      onStep?.(3)
      return workspace_id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspace-history"] })
    },
  })
}

const TERMINAL: AdviceResponse["status"][] = ["DONE", "ERROR"]

/**
 * Flow 3 — fetch + poll the AI advice every 3s until it reaches a terminal
 * state (DONE/ERROR). Only runs while `enabled` (modal open + id present).
 */
export function useWorkspaceAdvice(workspaceId: string | null, enabled: boolean) {
  return useQuery({
    queryKey: ["workspace-advice", workspaceId],
    queryFn: () => workspaceService.getAdvice(workspaceId as string),
    enabled: enabled && !!workspaceId,
    refetchInterval: (query) =>
      query.state.data && TERMINAL.includes(query.state.data.status) ? false : 3000,
    refetchOnWindowFocus: false,
  })
}
