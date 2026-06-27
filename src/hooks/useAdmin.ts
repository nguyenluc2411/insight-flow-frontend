import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { adminService } from "@/services/admin.service"

/** Tenant + user metrics for the admin dashboard. */
export function useAdminMetrics(days = 30) {
  return useQuery({
    queryKey: ["admin", "metrics", days],
    queryFn: () => adminService.getMetrics(days),
    staleTime: 60 * 1000,
  })
}

/** Revenue + subscription metrics. */
export function useBillingMetrics(months = 12) {
  return useQuery({
    queryKey: ["admin", "billing-metrics", months],
    queryFn: () => adminService.getBillingMetrics(months),
    staleTime: 60 * 1000,
  })
}

/** Paginated tenant list. */
export function useAdminTenants(params: {
  page?: number
  size?: number
  status?: string
  q?: string
}) {
  return useQuery({
    queryKey: ["admin", "tenants", params],
    queryFn: () => adminService.listTenants(params),
    placeholderData: (prev) => prev,
  })
}

/** Single tenant detail (only fetched when an id is provided). */
export function useAdminTenant(id: string | null) {
  return useQuery({
    queryKey: ["admin", "tenant", id],
    queryFn: () => adminService.getTenant(id as string),
    enabled: !!id,
  })
}

/** Suspend / re-activate a tenant, then refresh lists + metrics. */
export function useUpdateTenantStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      adminService.updateTenantStatus(id, status),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["admin", "tenants"] })
      qc.invalidateQueries({ queryKey: ["admin", "tenant", vars.id] })
      qc.invalidateQueries({ queryKey: ["admin", "metrics"] })
    },
  })
}

// ── Billing catalog ──────────────────────────────────────────────────────────

/** All packages incl. hidden/inactive. */
export function useAdminPackages() {
  return useQuery({
    queryKey: ["admin", "packages"],
    queryFn: () => adminService.listPackages(),
    staleTime: 30 * 1000,
  })
}

export function useUpdatePlan() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      planId,
      ...payload
    }: {
      planId: string
      priceVnd?: number
      trialDays?: number
      billingCycle?: string
      status?: string
    }) => adminService.updatePlan(planId, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "packages"] }),
  })
}

export function useUpdatePackage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      packageId,
      ...payload
    }: {
      packageId: string
      name?: string
      description?: string
      displayOrder?: number
      status?: string
    }) => adminService.updatePackage(packageId, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "packages"] }),
  })
}

export function useCreatePackage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: adminService.createPackage,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "packages"] }),
  })
}

// ── Per-tenant billing ───────────────────────────────────────────────────────

export function useTenantBillingHistory(tenantId: string | null) {
  return useQuery({
    queryKey: ["admin", "tenant-history", tenantId],
    queryFn: () => adminService.getTenantBillingHistory(tenantId as string),
    enabled: !!tenantId,
  })
}

export function useTenantTransactions(tenantId: string | null) {
  return useQuery({
    queryKey: ["admin", "tenant-transactions", tenantId],
    queryFn: () => adminService.getTenantTransactions(tenantId as string),
    enabled: !!tenantId,
  })
}

// ── Refunds ──────────────────────────────────────────────────────────────────

/** Transactions filtered by status (defaults to PENDING_REFUND), with optional search. */
export function useRefunds(
  params: { statuses?: string[]; q?: string; page?: number; size?: number } = {}
) {
  return useQuery({
    queryKey: ["admin", "refunds", params],
    queryFn: () => adminService.listRefunds(params),
    placeholderData: (prev) => prev,
  })
}

/** Single refund-candidate transaction detail. */
export function useRefund(id: string | null) {
  return useQuery({
    queryKey: ["admin", "refund", id],
    queryFn: () => adminService.getRefund(id as string),
    enabled: !!id,
  })
}

/** Confirm a manual refund, then refresh the refund list + detail. */
export function useConfirmRefund() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, note }: { id: string; note?: string }) =>
      adminService.confirmRefund(id, note),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["admin", "refunds"] })
      qc.invalidateQueries({ queryKey: ["admin", "refund", vars.id] })
    },
  })
}

/** Mark a PENDING_REFUND transaction as junk (not ours), then refresh lists. */
export function useMarkJunk() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, note }: { id: string; note?: string }) =>
      adminService.markJunk(id, note),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["admin", "refunds"] })
      qc.invalidateQueries({ queryKey: ["admin", "refund", vars.id] })
    },
  })
}

/** Permanently delete a junk transaction, then refresh lists. */
export function useDeleteTransaction() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => adminService.deleteTransaction(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "refunds"] })
    },
  })
}
