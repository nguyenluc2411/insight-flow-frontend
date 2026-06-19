import api from "@/lib/axios"
import type {
  AdminMetrics,
  AdminTenantDetail,
  AdminTenantListItem,
  BillingMetrics,
  Page,
} from "@/types/admin.types"

/**
 * Platform super-admin API. All endpoints require the SUPER_ADMIN role
 * (enforced server-side; the admin UI is also role-gated client-side).
 */
export const adminService = {
  /** Tenant + user metrics for the dashboard. */
  async getMetrics(days = 30): Promise<AdminMetrics> {
    const { data } = await api.get<AdminMetrics>("/api/v1/admin/metrics", {
      params: { days },
    })
    return data
  },

  /** Revenue + subscription metrics (served by billing-service). */
  async getBillingMetrics(months = 12): Promise<BillingMetrics> {
    const { data } = await api.get<BillingMetrics>("/api/v1/billing/admin/metrics", {
      params: { months },
    })
    return data
  },

  /** Paginated tenant list with optional status filter / name|slug search. */
  async listTenants(params: {
    page?: number
    size?: number
    status?: string
    q?: string
  }): Promise<Page<AdminTenantListItem>> {
    const { data } = await api.get<Page<AdminTenantListItem>>("/api/v1/admin/tenants", {
      params: {
        page: params.page ?? 0,
        size: params.size ?? 20,
        ...(params.status ? { status: params.status } : {}),
        ...(params.q ? { q: params.q } : {}),
      },
    })
    return data
  },

  /** Full tenant detail including its users. */
  async getTenant(id: string): Promise<AdminTenantDetail> {
    const { data } = await api.get<AdminTenantDetail>(`/api/v1/admin/tenants/${id}`)
    return data
  },

  /** Suspend or re-activate a tenant. */
  async updateTenantStatus(id: string, status: string): Promise<AdminTenantDetail> {
    const { data } = await api.patch<AdminTenantDetail>(
      `/api/v1/admin/tenants/${id}/status`,
      { status }
    )
    return data
  },
}
