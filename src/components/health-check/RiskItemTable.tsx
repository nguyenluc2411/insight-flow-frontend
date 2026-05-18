import { RiskBadge } from "@/components/common/RiskBadge"

interface RiskItem {
  sku: string
  name: string
  stock: number
  sellThrough: number
  risk: "HIGH" | "MEDIUM" | "LOW" | "STRATEGIC"
}

interface Props {
  items: RiskItem[]
}

export function RiskItemTable({ items }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 dark:border-slate-800">
            <th className="text-left pb-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              SKU / Tên
            </th>
            <th className="text-right pb-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Tồn
            </th>
            <th className="text-right pb-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Sell-through
            </th>
            <th className="text-right pb-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Rủi ro
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {items.map((item) => (
            <tr key={item.sku} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <td className="py-3 pr-4">
                <p className="font-semibold text-slate-900 dark:text-slate-100">{item.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{item.sku}</p>
              </td>
              <td className="py-3 text-right font-medium text-slate-700 dark:text-slate-300">
                {item.stock.toLocaleString("vi-VN")}
              </td>
              <td className="py-3 text-right font-medium text-slate-700 dark:text-slate-300">
                {item.sellThrough}%
              </td>
              <td className="py-3 text-right">
                <RiskBadge level={item.risk} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
