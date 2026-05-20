import api from "@/lib/axios"

export type ConnectorType = "KIOTVIET" | "SAPO" | "HARAVAN"

export interface ConnectorConfigResponse {
  id: string
  tenantId: string
  connectorType: ConnectorType
  name?: string
  status: string
  lastSyncAt?: string
  createdAt: string
  updatedAt?: string
}

export interface CreateConnectorRequest {
  connectorType: ConnectorType
  name?: string
  credentials: Record<string, string>
  config?: Record<string, unknown>
}

export interface SyncJobResponse {
  id: string
  tenantId: string
  connectorConfigId: string
  entityType?: string
  syncType?: string
  status: string
  recordsProcessed?: number
  recordsFailed?: number
  startedAt?: string
  completedAt?: string
  createdAt: string
}

export interface SyncJobPage {
  content: SyncJobResponse[]
  totalElements: number
  totalPages: number
  number: number
  size: number
  first: boolean
  last: boolean
  empty: boolean
}

export const integrationService = {
  async listConnectors(): Promise<ConnectorConfigResponse[]> {
    const { data } = await api.get("/api/v1/integrations")
    return data
  },

  async createConnector(payload: CreateConnectorRequest): Promise<ConnectorConfigResponse> {
    const { data } = await api.post("/api/v1/integrations", payload)
    return data
  },

  async getConnector(id: string): Promise<ConnectorConfigResponse> {
    const { data } = await api.get(`/api/v1/integrations/${id}`)
    return data
  },

  async deleteConnector(id: string): Promise<void> {
    await api.delete(`/api/v1/integrations/${id}`)
  },

  async triggerSync(id: string): Promise<{ jobId: string; status: string }> {
    const { data } = await api.post(`/api/v1/integrations/${id}/sync`)
    return data
  },

  async getSyncJobs(id: string, params?: { page?: number; size?: number }): Promise<SyncJobPage> {
    const { data } = await api.get(`/api/v1/integrations/${id}/jobs`, { params })
    return data
  },
}
