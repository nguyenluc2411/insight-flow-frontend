export interface ApiError {
  type: string
  title: string
  status: number
  detail: string
  instance?: string
  correlationId: string
  timestamp: string
}

export interface PageResponse<T> {
  content: T[]
  page: {
    number: number
    size: number
    totalElements: number
    totalPages: number
  }
}

export interface ApiResponse<T> {
  data: T
  message?: string
}
