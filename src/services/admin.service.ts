import api from "@/lib/axios"
import type {
  AdminMetrics,
  AdminTenantDetail,
  AdminTenantListItem,
  BillingHistoryItem,
  BillingMetrics,
  BillingPackage,
  BillingPlan,
  ConfirmRefundResult,
  CreatePackagePayload,
  Page,
  PaymentTransactionItem,
  RefundTransaction,
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

  // ── Billing catalog (packages & plans) ─────────────────────────────────────

  /** All packages incl. hidden/inactive, with their plans. */
  async listPackages(): Promise<BillingPackage[]> {
    const { data } = await api.get<BillingPackage[]>("/api/v1/billing/admin/catalog/packages")
    return data
  },

  /** Update a plan's price / trial / status. */
  async updatePlan(
    planId: string,
    payload: { priceVnd?: number; trialDays?: number; billingCycle?: string; status?: string }
  ): Promise<BillingPlan> {
    const { data } = await api.patch<BillingPlan>(
      `/api/v1/billing/admin/catalog/plans/${planId}`,
      payload
    )
    return data
  },

  /** Update package metadata / visibility. */
  async updatePackage(
    packageId: string,
    payload: { name?: string; description?: string; displayOrder?: number; status?: string }
  ): Promise<BillingPackage> {
    const { data } = await api.patch<BillingPackage>(
      `/api/v1/billing/admin/catalog/packages/${packageId}`,
      payload
    )
    return data
  },

  /** Create a new package with an initial monthly plan. */
  async createPackage(payload: CreatePackagePayload): Promise<BillingPackage> {
    const { data } = await api.post<BillingPackage>(
      "/api/v1/billing/admin/catalog/packages",
      payload
    )
    return data
  },

  // ── Per-tenant billing history & transactions ──────────────────────────────

  async getTenantBillingHistory(
    tenantId: string,
    params: { page?: number; size?: number } = {}
  ): Promise<Page<BillingHistoryItem>> {
    const { data } = await api.get<Page<BillingHistoryItem>>(
      `/api/v1/billing/admin/tenants/${tenantId}/history`,
      { params: { page: params.page ?? 0, size: params.size ?? 20 } }
    )
    return data
  },

  async getTenantTransactions(
    tenantId: string,
    params: { page?: number; size?: number } = {}
  ): Promise<Page<PaymentTransactionItem>> {
    const { data } = await api.get<Page<PaymentTransactionItem>>(
      `/api/v1/billing/admin/tenants/${tenantId}/transactions`,
      { params: { page: params.page ?? 0, size: params.size ?? 20 } }
    )
    return data
  },

  // ── Refunds (mismatched / duplicated transfers awaiting manual refund) ──────

  /**
   * List transactions awaiting refund reconciliation. Defaults to PENDING_REFUND
   * on the backend; pass `statuses` to widen (e.g. include REFUNDED for history).
   * Statuses are comma-joined so Spring binds them into a single List<String>.
   */
  async listRefunds(
    params: { statuses?: string[]; q?: string; page?: number; size?: number } = {}
  ): Promise<Page<RefundTransaction>> {
    const { data } = await api.get<Page<RefundTransaction>>(
      "/api/v1/billing/admin/refunds",
      {
        params: {
          page: params.page ?? 0,
          size: params.size ?? 20,
          ...(params.statuses?.length ? { statuses: params.statuses.join(",") } : {}),
          ...(params.q?.trim() ? { q: params.q.trim() } : {}),
        },
      }
    )
    return data
  },

  /** Detail of a single transaction for refund verification. */
  async getRefund(id: string): Promise<RefundTransaction> {
    const { data } = await api.get<RefundTransaction>(`/api/v1/billing/admin/refunds/${id}`)
    return data
  },

  /**
   * Mark a PENDING_REFUND transaction as manually refunded (out-of-band).
   * Moves status → REFUNDED and appends `note` to the audit trail.
   */
  async confirmRefund(id: string, note?: string): Promise<ConfirmRefundResult> {
    const { data } = await api.post<ConfirmRefundResult>(
      `/api/v1/billing/admin/refunds/${id}/confirm-refund`,
      note ? { note } : {}
    )
    return data
  },

  /**
   * Mark a PENDING_REFUND transaction as not belonging to the system.
   * Moves status → JUNK (the transaction lands in the junk bin).
   */
  async markJunk(id: string, note?: string): Promise<ConfirmRefundResult> {
    const { data } = await api.post<ConfirmRefundResult>(
      `/api/v1/billing/admin/refunds/${id}/mark-junk`,
      note ? { note } : {}
    )
    return data
  },

  /** Permanently delete a JUNK transaction (hard delete, irreversible). */
  async deleteTransaction(id: string): Promise<ConfirmRefundResult> {
    const { data } = await api.delete<ConfirmRefundResult>(
      `/api/v1/billing/admin/refunds/${id}`
    )
    return data
  },
}
