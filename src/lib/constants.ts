export const APP_NAME = "InsightFlow AI"
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
  SALES_RECORD: "/sales/record",
  SETTINGS: "/settings",
  SETTINGS_PROFILE: "/settings/profile",
  SETTINGS_INTEGRATIONS: "/settings/integrations",
  SETTINGS_BILLING: "/settings/billing",
}

// featureRequired marks which plan entitlement unlocks the item (see useEntitlements).
// All items stay VISIBLE; locked ones show a lock badge and a locked page with an
// upgrade CTA (MVP: discoverability + upsell, not hidden).
export const NAV_ITEMS: { label: string; href: string; icon: string; featureRequired?: string }[] = [
  { label: "Trang chủ", href: ROUTES.DASHBOARD, icon: "home" },
  { label: "Ghi nhận doanh số", href: ROUTES.SALES_RECORD, icon: "edit_note" },
  { label: "Cơ hội thị trường", href: ROUTES.MARKET, icon: "trending_up", featureRequired: "SALES_ANALYTICS" },
  { label: "Kiểm tra Sức khỏe", href: ROUTES.HEALTH_CHECK, icon: "monitor_heart" },
  { label: "Dự báo", href: ROUTES.FORECAST, icon: "insights", featureRequired: "DEMAND_FORECAST" },
  { label: "Đề xuất", href: ROUTES.RECOMMENDATIONS, icon: "recommend", featureRequired: "INVENTORY_RECOMMEND" },
]

// Feature metadata shown on locked pages (title + what the feature does + which plan unlocks it).
export const FEATURE_META: Record<string, { label: string; description: string; unlockPlan: string }> = {
  DEMAND_FORECAST: {
    label: "Dự báo nhu cầu AI",
    description:
      "Dự báo số lượng bán theo từng SKU trong 30 ngày tới dựa trên lịch sử bán hàng, giúp nhập đúng lượng và tránh tồn kho chết.",
    unlockPlan: "Advanced",
  },
  INVENTORY_RECOMMEND: {
    label: "Đề xuất xử lý tồn kho",
    description:
      "Gợi ý hành động cho từng SKU — nhập thêm, thanh lý, đẩy bán — được ưu tiên theo mức độ ảnh hưởng tới doanh thu.",
    unlockPlan: "Advanced",
  },
  SALES_ANALYTICS: {
    label: "Phân tích bán hàng & Cơ hội thị trường",
    description:
      "Phân tích doanh số theo sản phẩm, kênh và thời gian; phát hiện xu hướng và cơ hội thị trường cho shop của bạn.",
    unlockPlan: "Basic",
  },
  EXPORT_REPORTS: {
    label: "Xuất báo cáo",
    description: "Xuất báo cáo doanh số và tồn kho ra Excel/PDF để chia sẻ và lưu trữ.",
    unlockPlan: "Advanced",
  },
  MULTI_LOCATION: {
    label: "Nhiều chi nhánh",
    description: "Quản lý tồn kho và bán hàng cho nhiều cửa hàng/chi nhánh trong một tài khoản.",
    unlockPlan: "Advanced",
  },
  API_ACCESS: {
    label: "Truy cập API",
    description: "Tích hợp dữ liệu Insight Flow vào hệ thống của bạn qua API.",
    unlockPlan: "Pro",
  },
}

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
