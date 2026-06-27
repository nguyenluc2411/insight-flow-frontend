import { TransactionsView } from "@/components/admin/TransactionsView"

export default function PaidTransactionsPage() {
  return (
    <TransactionsView
      title="Đã trả tiền thành công"
      description="Các giao dịch đăng ký gói đã thanh toán và kích hoạt thành công."
      statuses={["SUCCESS"]}
      actions="none"
    />
  )
}
