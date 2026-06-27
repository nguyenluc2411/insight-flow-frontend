import api from "@/lib/axios"
import type { Package, Subscription, UsageStatus, UpgradeRequestResult, CheckoutInfo, TransactionPage } from "@/types/billing.types"

export const billingService = {
  async getPackages(): Promise<Package[]> {
    const { data } = await api.get("/api/v1/billing/packages")
    return data
  },

  async getCurrentSubscription(): Promise<Subscription> {
    const { data } = await api.get("/api/v1/billing/subscriptions/current")
    return data
  },

  async getUsage(): Promise<UsageStatus> {
    const { data } = await api.get("/api/v1/billing/entitlements/usage")
    return data
  },

  // SePay checkout: returns a dynamic VietQR. After the customer transfers, SePay's
  // webhook auto-upgrades the plan — no admin step. Poll getCurrentSubscription to detect it.
  async createCheckout(packageCode: string, billingCycle = "MONTHLY"): Promise<CheckoutInfo> {
    const { data } = await api.post("/api/v1/billing/checkout", {
      packageCode,
      billingCycle,
    })
    return data
  },

  // Legacy manual-payment model: submits a request that an admin approves.
  // Kept as a fallback; the primary flow is createCheckout (auto-upgrade on payment).
  async requestUpgrade(packageCode: string, billingCycle = "MONTHLY"): Promise<UpgradeRequestResult> {
    const { data } = await api.post("/api/v1/billing/subscriptions/upgrade-request", {
      packageCode,
      billingCycle,
    })
    return data
  },

  async getTransactions(page: number = 0, size: number = 20): Promise<TransactionPage> {
    const { data } = await api.get("/api/v1/billing/subscriptions/transactions", {
      params: { page, size }
    })
    return data
  },
}

export type { Package, Subscription, UsageStatus, UpgradeRequestResult, CheckoutInfo, TransactionPage }
