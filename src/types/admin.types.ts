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

// Spring Data Page envelope.
export interface Page<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}
