type ApiError = {
  response?: {
    status?: number
    data?: { detail?: string; title?: string; message?: string }
  }
  message?: string
  code?: string
}

/** Maps backend English detail strings → Vietnamese */
const DETAIL_MAP: Record<string, string> = {
  // Auth
  "Invalid credentials": "Email hoặc mật khẩu không đúng",
  "Authentication Failed": "Email hoặc mật khẩu không đúng",
  "Authentication failed": "Email hoặc mật khẩu không đúng",
  "User not found": "Không tìm thấy tài khoản",
  "Email already exists": "Email đã được sử dụng",
  "Tenant not found": "Không tìm thấy shop",
  "Slug already exists": "Tên shop (slug) đã được sử dụng",
  "Access denied": "Bạn không có quyền truy cập",
  "Unauthorized": "Phiên đăng nhập đã hết hạn",
  "Token expired": "Phiên đăng nhập đã hết hạn",
  "Invalid token": "Phiên đăng nhập không hợp lệ",
  "Permission denied": "Bạn không có quyền thực hiện thao tác này",
  // Data
  "Resource not found": "Không tìm thấy dữ liệu",
  "Not found": "Không tìm thấy dữ liệu",
  "Validation failed": "Dữ liệu không hợp lệ",
  "Bad request": "Yêu cầu không hợp lệ",
  // Server
  "Internal Server Error": "Đã xảy ra lỗi hệ thống",
  "Service unavailable": "Dịch vụ tạm thời không khả dụng",
  "Too many requests": "Quá nhiều yêu cầu, vui lòng thử lại sau",
}

/** Maps HTTP status codes → Vietnamese fallback */
const STATUS_MAP: Record<number, string> = {
  400: "Dữ liệu không hợp lệ",
  401: "Phiên đăng nhập đã hết hạn",
  403: "Bạn không có quyền truy cập",
  404: "Không tìm thấy dữ liệu",
  409: "Dữ liệu đã tồn tại",
  422: "Dữ liệu không hợp lệ",
  429: "Quá nhiều yêu cầu, vui lòng thử lại sau",
  500: "Đã xảy ra lỗi hệ thống",
  502: "Không thể kết nối đến máy chủ",
  503: "Dịch vụ tạm thời không khả dụng",
}

/**
 * Converts any API/network error into a user-friendly Vietnamese string.
 * Priority: DETAIL_MAP → STATUS_MAP → fallback
 */
export function parseApiError(err: unknown, fallback = "Đã xảy ra lỗi, vui lòng thử lại"): string {
  const error = err as ApiError

  // Network error — no response from server
  if (!error.response) {
    if (error.code === "ECONNABORTED" || error.message?.toLowerCase().includes("timeout")) {
      return "Yêu cầu quá thời gian, vui lòng thử lại"
    }
    return "Không thể kết nối đến máy chủ"
  }

  // RFC 7807 detail field → translate or fall through to status
  const detail = error.response.data?.detail
  if (detail && typeof detail === "string") {
    return DETAIL_MAP[detail] ?? STATUS_MAP[error.response.status ?? 0] ?? fallback
  }

  // HTTP status fallback
  const status = error.response.status
  if (status && STATUS_MAP[status]) {
    return STATUS_MAP[status]
  }

  return fallback
}
