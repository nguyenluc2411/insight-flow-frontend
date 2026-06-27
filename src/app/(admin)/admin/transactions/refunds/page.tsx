import { TransactionsView } from "@/components/admin/TransactionsView"

export default function RefundsTransactionsPage() {
  return (
    <TransactionsView
      title="Hoàn tiền"
      description="Giao dịch chuyển khoản sai số tiền, trùng lặp hoặc cần đối soát. Đánh dấu đã hoàn tiền cho khách, hoặc chuyển sang giao dịch rác nếu không thuộc hệ thống."
      statuses={["PENDING_REFUND"]}
      actions="refund"
    />
  )
}
