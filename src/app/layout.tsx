import type { Metadata } from "next"
import "@/styles/globals.css"
import { Providers } from "./providers"

export const metadata: Metadata = {
  title: "Forecastly — AI cho Thời trang Việt Nam",
  description: "Dự báo nhu cầu, tối ưu tồn kho bằng AI",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans bg-bg-base text-slate-900 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
