export interface Plan {
  id: string
  packageId: string
  billingCycle: "TRIAL" | "MONTHLY" | "YEARLY" | "ONE_TIME"
  priceVnd: number
  currency: string
  trialDays: number
  status: string
}

export interface Package {
  id: string
  code: "TRIAL" | "STARTER" | "PRO" | string
  version: number
  name: string
  description: string | null
  displayOrder: number | null
  status: string
  plans: Plan[]
  featureCodes: string[]
}

export interface Subscription {
  id: string
  tenantId: string
  planId: string
  priceAtSubscription: number
  featuresAtSubscription: string[]
  limitsAtSubscription: Record<string, unknown>
  planVersion: number
  status: "TRIAL" | "PENDING_PAYMENT" | "ACTIVE" | "PAST_DUE" | "GRACE_PERIOD" | "EXPIRED" | "CANCELED" | string
  startDate: string
  endDate: string
  autoRenew: boolean
  createdAt: string
  updatedAt: string
}

export interface UsageStatus {
  tenantId: string
  usageDate: string
  apiCallsCount: number
  maxApiCallsPerDay: number
  productExportsCount: number
  reportsGeneratedCount: number
  forecastsExecutedCount: number
  storageUsedBytes: number
  maxStorageGb: number
}

export interface UpgradeRequestResult {
  id: string
  tenantId: string
  requestedPackageCode: string
  billingCycle: string
  status: "PENDING" | "APPROVED" | "REJECTED" | string
  note: string | null
  resolvedAt: string | null
  createdAt: string
}

// SePay dynamic-QR checkout. The plan auto-upgrades once SePay's webhook confirms
// the transfer (matched by `content` = IFLOWxxxxxx), so the UI just polls the
// subscription until the plan changes.
export interface CheckoutInfo {
  qrUrl: string
  amount: number
  content: string
  bankId: string
  accountNo: string
  accountName: string
}
