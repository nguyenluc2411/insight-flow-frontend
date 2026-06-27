import { TransactionsView } from "@/components/admin/TransactionsView"

export default function RefundedTransactionsPage() {
  return (
    <TransactionsView
      title="Đã hoàn tiền"
      description="Các giao dịch đã được xác nhận hoàn tiền cho khách (lưu vết đối soát)."
      statuses={["REFUNDED"]}
      actions="none"
    />
  )
}
