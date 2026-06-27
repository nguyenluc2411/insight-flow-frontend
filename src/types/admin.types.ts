// Admin (platform super-admin) domain types. Mirror the backend DTOs in
// auth-service (AdminController) and billing-service (AdminMetricsController).

export interface DailyCount {
  date: string // ISO date (YYYY-MM-DD)
  count: number
}

export interface AdminMetrics {
  totalTenants: number
  activeTenants: number
  trialTenants: number
  suspendedTenants: number
  totalUsers: number
  tenantsByStatus: Record<string, number>
  tenantsByPlan: Record<string, number>
  newTenantsByDay: DailyCount[]
}

export interface MonthlyRevenue {
  month: string // e.g. "2026-06"
  amount: number // VND
}

export interface BillingMetrics {
  activeSubscriptions: number
  trialSubscriptions: number
  mrr: number // VND
  totalRevenue: number // VND
  subscriptionsByPlan: Record<string, number>
  revenueByMonth: MonthlyRevenue[]
}

export interface AdminTenantListItem {
  id: string
  name: string
  slug: string
  plan: string
  status: string
  userCount: number
  trialEndsAt: string | null
  createdAt: string
}

export interface AdminUserItem {
  id: string
  email: string
  fullName: string
  status: string
  roles: string[]
  lastLoginAt: string | null
  createdAt: string
}

export interface AdminTenantDetail {
  id: string
  name: string
  slug: string
  plan: string
  status: string
  trialEndsAt: string | null
  createdAt: string
  settings: Record<string, unknown>
  users: AdminUserItem[]
}

// ── Billing catalog (packages & plans) ──────────────────────────────────────

export interface BillingPlan {
  id: string
  packageId: string
  billingCycle: string // MONTHLY | YEARLY ...
  priceVnd: number
  currency: string
  trialDays: number
  status: string // ACTIVE | INACTIVE
}

export interface BillingPackage {
  id: string
  code: string
  version: number
  name: string
  description: string | null
  displayOrder: number | null
  status: string // ACTIVE | INACTIVE
  plans: BillingPlan[]
  featureCodes: string[]
}

export interface CreatePackagePayload {
  code: string
  name: string
  description?: string
  displayOrder?: number
  monthlyPriceVnd?: number
  trialDays?: number
}

// ── Per-tenant billing history & transactions ───────────────────────────────

export interface BillingHistoryItem {
  id: string
  tenantId: string
  subscriptionId: string | null
  eventType: string | null
  fromPackageCode: string | null
  toPackageCode: string | null
  amountVnd: number | null
  description: string | null
  createdAt: string
}

export interface PaymentTransactionItem {
  id: string
  sepayId: string
  tenantId: string | null
  packageCode: string | null
  amount: number | null
  accountNumber: string | null
  senderAccountNumber: string | null
  content: string | null
  status: string | null
  errorReason: string | null
  transactionCode: string | null
  createdAt: string
  updatedAt: string | null
}

// Spring Data Page envelope.
export interface Page<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

// ── Refunds (manual reconciliation of mismatched transfers) ──────────────────
// Mirrors billing-service PaymentTransactionResponse (AdminRefundController).
// A transfer lands here as PENDING_REFUND when the customer paid the wrong
// amount / duplicated a payment; an admin confirms the out-of-band refund.

export type RefundStatus = "SUCCESS" | "PENDING_REFUND" | "REFUNDED" | "JUNK" | string

export interface RefundTransaction {
  id: string
  sepayId: string
  /** Null for transfers that could not be matched to a tenant. */
  tenantId: string | null
  packageCode: string | null
  amount: number | null
  /** Receiving (merchant) bank account. */
  accountNumber: string | null
  /** Sender account — usually null; reconcile via referenceCode instead. */
  senderAccountNumber: string | null
  /** Bank/SePay reference code — the reliable key to match a bank statement. */
  referenceCode: string | null
  /** Raw bank transfer memo. */
  content: string | null
  status: RefundStatus
  /** Why the transfer needs a refund, plus the admin audit trail. */
  errorReason: string | null
  /** Actual bank-transfer time reported by the webhook. */
  transactionDate: string | null
  createdAt: string
  updatedAt: string | null
}

export interface ConfirmRefundResult {
  status: string
  message: string
}
