export interface User {
  id: string
  email: string
  fullName: string
  tenantId: string
  tenantSlug: string
  roles: string[]
  phone?: string
  status?: "active" | "inactive"
  lastLoginAt?: string
  createdAt?: string
}

export interface Tenant {
  id: string
  name: string
  slug: string
  plan: "trial" | "starter" | "pro"
  status?: "active" | "inactive"
  trialEndsAt?: string
  settings?: TenantSettings
}

export interface TenantSettings {
  location?: string
  categories?: string[]
  businessScale?: string
  platforms?: string[]
  profileComplete?: boolean
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
  user: User
  tenant?: Tenant
}

export interface LoginRequest {
  tenantSlug: string
  email: string
  password: string
}

export interface RegisterRequest {
  tenantName: string
  slug: string
  ownerEmail: string
  ownerPassword: string
  ownerFullName: string
}
