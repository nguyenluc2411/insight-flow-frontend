import api from "@/lib/axios"
import type { SpringPage } from "./catalog.service"

/** Matches OrderItemResponse from sales-service */
export interface OrderItem {
  id: string
  variantId: string
  quantity: number
  unitPrice: number
  unitCost?: number
  discountAmount?: number
  lineTotal: number
}

/** Matches SalesOrderResponse from sales-service */
export interface Order {
  id: string
  tenantId: string
  orderNumber: string
  locationId?: string
  customerId?: string
  channel?: string
  status: string
  subtotal?: number
  discountAmount?: number
  taxAmount?: number
  shippingAmount?: number
  totalAmount: number
  paymentMethod?: string
  orderedAt?: string
  createdAt: string
  updatedAt?: string
  items?: OrderItem[]
}

/** Matches CustomerResponse from sales-service */
export interface Customer {
  id: string
  tenantId: string
  phone?: string
  email?: string
  fullName?: string
  gender?: string
  birthDate?: string
  rfmSegment?: string
  totalSpent?: number
  orderCount?: number
  lastOrderAt?: string
  createdAt: string
}

export interface CreateOrderRequest {
  locationId?: string
  customerId?: string
  channel?: string
  paymentMethod?: string
  items: { variantId: string; quantity: number; unitPrice: number; unitCost?: number; discountAmount?: number }[]
}

export const salesService = {
  async getOrders(params?: { page?: number; size?: number }): Promise<SpringPage<Order>> {
    const { data } = await api.get("/api/v1/sales/orders", { params })
    return data
  },

  async getOrderById(id: string): Promise<Order> {
    const { data } = await api.get(`/api/v1/sales/orders/${id}`)
    return data
  },

  async createOrder(payload: CreateOrderRequest): Promise<Order> {
    const { data } = await api.post("/api/v1/sales/orders", payload)
    return data
  },

  async completeOrder(id: string): Promise<Order> {
    const { data } = await api.post(`/api/v1/sales/orders/${id}/complete`)
    return data
  },

  async getCustomers(params?: { page?: number; size?: number }): Promise<SpringPage<Customer>> {
    const { data } = await api.get("/api/v1/sales/customers", { params })
    return data
  },

  async getCustomerById(id: string): Promise<Customer> {
    const { data } = await api.get(`/api/v1/sales/customers/${id}`)
    return data
  },

  async createCustomer(payload: { phone?: string; email?: string; fullName?: string; gender?: string }): Promise<Customer> {
    const { data } = await api.post("/api/v1/sales/customers", payload)
    return data
  },

  async getSuppliers(params?: { page?: number; size?: number }): Promise<SpringPage<SupplierResponse>> {
    const { data } = await api.get("/api/v1/sales/suppliers", { params })
    return data
  },
}

export interface SupplierResponse {
  id: string
  tenantId: string
  name: string
  contactName?: string
  phone?: string
  email?: string
  address?: string
  status?: string
  createdAt: string
}
