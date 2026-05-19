import api from "@/lib/axios"
import type { SpringPage } from "./catalog.service"

export interface Order {
  id: string
  tenantId: string
  customerId?: string
  channel?: string
  status: string
  totalAmount: number
  createdAt: string
}

export interface Customer {
  id: string
  tenantId: string
  name: string
  email?: string
  phone?: string
  totalOrders?: number
  createdAt: string
}

export const salesService = {
  async getOrders(params?: { page?: number; size?: number; status?: string; channel?: string }): Promise<SpringPage<Order>> {
    const { data } = await api.get("/api/v1/sales/orders", { params })
    return data
  },

  async getOrderById(id: string): Promise<Order> {
    const { data } = await api.get(`/api/v1/sales/orders/${id}`)
    return data
  },

  async createOrder(payload: Partial<Order>): Promise<Order> {
    const { data } = await api.post("/api/v1/sales/orders", payload)
    return data
  },

  async getCustomers(params?: { page?: number; size?: number }): Promise<SpringPage<Customer>> {
    const { data } = await api.get("/api/v1/sales/customers", { params })
    return data
  },
}
