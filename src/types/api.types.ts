export interface ApiError {
  type: string
  title: string
  status: number
  detail: string
  instance?: string
  correlationId?: string
  timestamp: string
}

/** Spring Page response — flat structure matching Spring Data's Page<T> */
export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
  first: boolean
  last: boolean
  empty: boolean
}

export interface ApiResponse<T> {
  data: T
  message?: string
}
