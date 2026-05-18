import { cn } from "@/lib/utils"

interface Props {
  children: React.ReactNode
  className?: string
}

export function GlassCard({ children, className }: Props) {
  return (
    <div className={cn("glass-card rounded-xl p-6", className)}>
      {children}
    </div>
  )
}
