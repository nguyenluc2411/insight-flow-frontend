import { redirect } from "next/navigation"

// The refunds screen moved under the unified "Giao dịch" section.
// Keep this route as a redirect so old links/bookmarks still work.
export default function AdminRefundsRedirect() {
  redirect("/admin/transactions/refunds")
}
