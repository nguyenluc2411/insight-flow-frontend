import { TransactionsView } from "@/components/admin/TransactionsView"

export default function JunkTransactionsPage() {
  return (
    <TransactionsView
      title="Giao dịch rác"
      description="Giao dịch không thuộc hệ thống (chuyển nhầm, không khớp đơn hàng). Có thể xoá vĩnh viễn."
      statuses={["JUNK"]}
      actions="delete"
    />
  )
}
