export const APP_NAME = "Forecastly"
export const APP_FULL_NAME = "InsightFlow AI"

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  ONBOARDING: "/onboarding",
  DASHBOARD: "/dashboard",
  MARKET: "/market",
  HEALTH_CHECK: "/health-check",
  HEALTH_CHECK_IMPORT: "/health-check/import",
  FORECAST: "/forecast",
  RECOMMENDATIONS: "/recommendations",
  SETTINGS: "/settings",
  SETTINGS_PROFILE: "/settings/profile",
  SETTINGS_INTEGRATIONS: "/settings/integrations",
  SETTINGS_BILLING: "/settings/billing",
}

export const NAV_ITEMS = [
  { label: "Trang chủ", href: ROUTES.DASHBOARD, icon: "home" },
  { label: "Cơ hội thị trường", href: ROUTES.MARKET, icon: "trending_up" },
  { label: "Kiểm tra Sức khỏe", href: ROUTES.HEALTH_CHECK, icon: "monitor_heart" },
  { label: "Dự báo", href: ROUTES.FORECAST, icon: "insights" },
  { label: "Đề xuất", href: ROUTES.RECOMMENDATIONS, icon: "recommend" },
]

export const RISK_LABELS: Record<string, string> = {
  HIGH: "Rủi ro cao",
  MEDIUM: "Rủi ro trung bình",
  LOW: "Ổn định",
  STRATEGIC: "Chiến lược",
}

export const ACTION_LABELS: Record<string, string> = {
  CLEARANCE: "Thanh lý",
  RESTOCK: "Nhập thêm",
  PROMOTE: "Đẩy bán",
  OK: "Ổn định",
}

export const FASHION_CATEGORIES = [
  "Thời trang Nữ", "Thời trang Nam", "Streetwear",
  "Local Brand", "Trẻ em", "Phụ kiện",
]

export const PLATFORMS = [
  { id: "website", label: "Website", icon: "language" },
  { id: "offline", label: "Cửa hàng Offline", icon: "storefront" },
  { id: "shopee", label: "Shopee", icon: "shopping_bag" },
  { id: "tiktok", label: "TikTok Shop", icon: "play_circle" },
  { id: "lazada", label: "Lazada", icon: "local_shipping" },
]

export const BUSINESS_SCALES = [
  { id: "individual", label: "Cá nhân kinh doanh" },
  { id: "small", label: "Cửa hàng nhỏ" },
  { id: "chain", label: "Chuỗi cửa hàng" },
]

export const LOCATIONS = [
  { id: "hcmc", label: "TP. Hồ Chí Minh", sub: "Ho Chi Minh City" },
  { id: "hanoi", label: "Hà Nội", sub: "Hanoi" },
  { id: "danang", label: "Đà Nẵng", sub: "Da Nang" },
]
