"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

type StatusEntry = { status: string; count: number };

const chartConfig = {
  count: {
    label: "Leads",
  },
  NEW: { label: "New", color: "var(--chart-2, #3b82f6)" },
  CONTACTED: { label: "Contacted", color: "var(--chart-5, #f59e0b)" },
  QUALIFIED: { label: "Qualified", color: "var(--chart-4, #8b5cf6)" },
  PROPOSAL: { label: "Proposal", color: "var(--chart-1, #f26b38)" },
  WON: { label: "Won", color: "var(--chart-3, #10b981)" },
  LOST: { label: "Lost", color: "#ef4444" },
} satisfies ChartConfig

export function ChartBarInteractive({ data }: { data: StatusEntry[] }) {
  const [activeStatus, setActiveStatus] = React.useState<string>(data[0]?.status ?? "NEW")

  const total = React.useMemo(
    () =>
      Object.fromEntries(data.map((d) => [d.status, d.count])),
    [data]
  )

  const chartData = data.map((d) => ({
    status: d.status,
    count: d.count,
    fill: (chartConfig as Record<string, { color?: string }>)[d.status]?.color ?? "#64748b",
  }))

  return (
    <Card className="py-0">
      <CardHeader className="flex flex-col items-stretch border-b p-0! sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:py-6">
          <CardTitle>Leads by Status</CardTitle>
          <CardDescription>Click a status to highlight</CardDescription>
        </div>
        <div className="flex flex-wrap">
          {data.map((d) => (
            <button
              key={d.status}
              data-active={activeStatus === d.status}
              className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-4 py-3 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-t-0 sm:border-l sm:px-6 sm:py-4 min-w-[80px]"
              onClick={() => setActiveStatus(d.status)}
            >
              <span className="text-xs text-muted-foreground">
                {(chartConfig as Record<string, { label?: string }>)[d.status]?.label ?? d.status}
              </span>
              <span className="text-lg leading-none font-bold sm:text-2xl">
                {d.count.toLocaleString()}
              </span>
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[200px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="status"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) =>
                (chartConfig as Record<string, { label?: string }>)[value]?.label ?? value
              }
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="count"
                  labelFormatter={(value) =>
                    (chartConfig as Record<string, { label?: string }>)[value]?.label ?? value
                  }
                />
              }
            />
            <Bar
              dataKey="count"
              fill={
                (chartConfig as Record<string, { color?: string }>)[activeStatus]?.color ??
                "var(--chart-1, #f26b38)"
              }
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
