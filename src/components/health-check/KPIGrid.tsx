import { KPICard } from "@/components/common/KPICard"

interface HealthCheckKPI {
  label: string
  value: string | number
  subtitle: string
  trend?: string
  trendType?: "up" | "down" | "neutral"
}

interface Props {
  data: HealthCheckKPI[]
}

export function KPIGrid({ data }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {data.map((kpi) => (
        <KPICard key={kpi.label} {...kpi} />
      ))}
    </div>
  )
}
