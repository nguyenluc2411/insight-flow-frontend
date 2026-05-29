import api from "@/lib/axios"
import type { Package, Subscription, UsageStatus, UpgradeRequestResult } from "@/types/billing.types"

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

  // MVP manual-payment model: this submits a request that an admin approves.
  // It does NOT change the plan immediately.
  async requestUpgrade(packageCode: string, billingCycle = "MONTHLY"): Promise<UpgradeRequestResult> {
    const { data } = await api.post("/api/v1/billing/subscriptions/upgrade-request", {
      packageCode,
      billingCycle,
    })
    return data
  },
}

export type { Package, Subscription, UsageStatus, UpgradeRequestResult }
