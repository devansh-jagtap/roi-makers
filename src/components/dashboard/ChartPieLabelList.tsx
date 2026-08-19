"use client"

import { TrendingUp } from "lucide-react"
import { LabelList, Pie, PieChart } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

type ServiceEntry = { service: string; count: number };

const COLORS = [
  "var(--chart-1, #f26b38)",
  "var(--chart-2, #3b82f6)",
  "var(--chart-3, #10b981)",
  "var(--chart-4, #8b5cf6)",
  "var(--chart-5, #f59e0b)",
  "var(--chart-1, #ec4899)",
]

export function ChartPieLabelList({ data }: { data: ServiceEntry[] }) {
  const chartData = data.map((item, index) => ({
    service: item.service,
    visitors: item.count,
    fill: COLORS[index % COLORS.length],
  }))

  const chartConfig: ChartConfig = {
    visitors: { label: "Leads" },
    ...Object.fromEntries(
      data.map((item, index) => [
        item.service,
        { label: item.service, color: COLORS[index % COLORS.length] },
      ])
    ),
  }

  const total = data.reduce((sum, d) => sum + d.count, 0)

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Leads by Service</CardTitle>
        <CardDescription>Service breakdown for all leads</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] [&_.recharts-text]:fill-background"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="visitors" hideLabel />}
            />
            <Pie data={chartData} dataKey="visitors">
              <LabelList
                dataKey="service"
                className="fill-background"
                stroke="none"
                fontSize={11}
                formatter={(value: string) => (value?.length > 10 ? value.slice(0, 10) + '…' : value)}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          {total} total leads across {data.length} services <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          All-time service distribution
        </div>
      </CardFooter>
    </Card>
  )
}
