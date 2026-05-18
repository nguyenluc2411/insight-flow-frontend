import { z } from "zod"

export const loginSchema = z.object({
  tenantSlug: z.string().min(3, "Tên shop tối thiểu 3 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự"),
})

export const registerSchema = z.object({
  tenantName: z.string().min(2, "Tên shop tối thiểu 2 ký tự"),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/, "Chỉ dùng chữ thường, số và dấu gạch ngang"),
  ownerFullName: z.string().min(2, "Tên tối thiểu 2 ký tự"),
  ownerEmail: z.string().email("Email không hợp lệ"),
  ownerPassword: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự"),
  confirmPassword: z.string(),
}).refine(d => d.ownerPassword === d.confirmPassword, {
  message: "Mật khẩu không khớp",
  path: ["confirmPassword"],
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
