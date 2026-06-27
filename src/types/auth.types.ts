export interface User {
  id: string
  email: string
  fullName: string
  tenantId: string
  tenantSlug: string
  roles: string[]
  // Profile settings (returned by GET/PUT /api/v1/auth/me)
  location?: string
  categories?: string[]
  businessScale?: string
  platforms?: string[]
  profileComplete?: boolean
  phone?: string
  status?: "active" | "inactive"
  lastLoginAt?: string
  createdAt?: string
}

export interface Tenant {
  id: string
  name: string
  slug: string
  plan: string
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
