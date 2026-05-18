import Link from "next/link"
import { ROUTES } from "@/lib/constants"

const SETTINGS_ITEMS = [
  {
    href: ROUTES.SETTINGS_PROFILE,
    icon: "person",
    title: "Thông tin cá nhân",
    desc: "Tên, email, số điện thoại",
  },
  {
    href: ROUTES.SETTINGS_INTEGRATIONS,
    icon: "cable",
    title: "Kết nối & Tích hợp",
    desc: "KiotViet, Sapo, Shopee",
  },
  {
    href: ROUTES.SETTINGS_BILLING,
    icon: "credit_card",
    title: "Gói dịch vụ",
    desc: "Thanh toán, hóa đơn",
  },
]

export default function SettingsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Cài đặt</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Quản lý tài khoản và tích hợp của bạn</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SETTINGS_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-100 dark:border-slate-800 hover:border-primary/50 hover:shadow-soft transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
              <span className="material-symbols-outlined text-primary group-hover:text-white transition-colors text-[20px]">
                {item.icon}
              </span>
            </div>
            <p className="font-bold text-slate-900 dark:text-slate-100">{item.title}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
