"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export const description = "An interactive area chart"

const chartData = [
  { date: "2024-04-01", loadGeneration: 222, loadConsumption: 150 },
  { date: "2024-04-02", loadGeneration: 97, loadConsumption: 180 },
  { date: "2024-04-03", loadGeneration: 167, loadConsumption: 120 },
  { date: "2024-04-04", loadGeneration: 242, loadConsumption: 260 },
  { date: "2024-04-05", loadGeneration: 373, loadConsumption: 290 },
  { date: "2024-04-06", loadGeneration: 301, loadConsumption: 340 },
  { date: "2024-04-07", loadGeneration: 245, loadConsumption: 180 },
  { date: "2024-04-08", loadGeneration: 409, loadConsumption: 320 },
  { date: "2024-04-09", loadGeneration: 59, loadConsumption: 110 },
  { date: "2024-04-10", loadGeneration: 261, loadConsumption: 190 },
  { date: "2024-04-11", loadGeneration: 327, loadConsumption: 350 },
  { date: "2024-04-12", loadGeneration: 292, loadConsumption: 210 },
  { date: "2024-04-13", loadGeneration: 342, loadConsumption: 380 },
  { date: "2024-04-14", loadGeneration: 137, loadConsumption: 220 },
  { date: "2024-04-15", loadGeneration: 120, loadConsumption: 170 },
  { date: "2024-04-16", loadGeneration: 138, loadConsumption: 190 },
  { date: "2024-04-17", loadGeneration: 446, loadConsumption: 360 },
  { date: "2024-04-18", loadGeneration: 364, loadConsumption: 410 },
  { date: "2024-04-19", loadGeneration: 243, loadConsumption: 180 },
  { date: "2024-04-20", loadGeneration: 89, loadConsumption: 150 },
  { date: "2024-04-21", loadGeneration: 137, loadConsumption: 200 },
  { date: "2024-04-22", loadGeneration: 224, loadConsumption: 170 },
  { date: "2024-04-23", loadGeneration: 138, loadConsumption: 230 },
  { date: "2024-04-24", loadGeneration: 387, loadConsumption: 290 },
  { date: "2024-04-25", loadGeneration: 215, loadConsumption: 250 },
  { date: "2024-04-26", loadGeneration: 75, loadConsumption: 130 },
  { date: "2024-04-27", loadGeneration: 383, loadConsumption: 420 },
  { date: "2024-04-28", loadGeneration: 122, loadConsumption: 180 },
  { date: "2024-04-29", loadGeneration: 315, loadConsumption: 240 },
  { date: "2024-04-30", loadGeneration: 454, loadConsumption: 380 },
  { date: "2024-05-01", loadGeneration: 165, loadConsumption: 220 },
  { date: "2024-05-02", loadGeneration: 293, loadConsumption: 310 },
  { date: "2024-05-03", loadGeneration: 247, loadConsumption: 190 },
  { date: "2024-05-04", loadGeneration: 385, loadConsumption: 420 },
  { date: "2024-05-05", loadGeneration: 481, loadConsumption: 390 },
  { date: "2024-05-06", loadGeneration: 498, loadConsumption: 520 },
  { date: "2024-05-07", loadGeneration: 388, loadConsumption: 300 },
  { date: "2024-05-08", loadGeneration: 149, loadConsumption: 210 },
  { date: "2024-05-09", loadGeneration: 227, loadConsumption: 180 },
  { date: "2024-05-10", loadGeneration: 293, loadConsumption: 330 },
  { date: "2024-05-11", loadGeneration: 335, loadConsumption: 270 },
  { date: "2024-05-12", loadGeneration: 197, loadConsumption: 240 },
  { date: "2024-05-13", loadGeneration: 197, loadConsumption: 160 },
  { date: "2024-05-14", loadGeneration: 448, loadConsumption: 490 },
  { date: "2024-05-15", loadGeneration: 473, loadConsumption: 380 },
  { date: "2024-05-16", loadGeneration: 338, loadConsumption: 400 },
  { date: "2024-05-17", loadGeneration: 499, loadConsumption: 420 },
  { date: "2024-05-18", loadGeneration: 315, loadConsumption: 350 },
  { date: "2024-05-19", loadGeneration: 235, loadConsumption: 180 },
  { date: "2024-05-20", loadGeneration: 177, loadConsumption: 230 },
  { date: "2024-05-21", loadGeneration: 82, loadConsumption: 140 },
  { date: "2024-05-22", loadGeneration: 81, loadConsumption: 120 },
  { date: "2024-05-23", loadGeneration: 252, loadConsumption: 290 },
  { date: "2024-05-24", loadGeneration: 294, loadConsumption: 220 },
  { date: "2024-05-25", loadGeneration: 201, loadConsumption: 250 },
  { date: "2024-05-26", loadGeneration: 213, loadConsumption: 170 },
  { date: "2024-05-27", loadGeneration: 420, loadConsumption: 460 },
  { date: "2024-05-28", loadGeneration: 233, loadConsumption: 190 },
  { date: "2024-05-29", loadGeneration: 78, loadConsumption: 130 },
  { date: "2024-05-30", loadGeneration: 340, loadConsumption: 280 },
  { date: "2024-05-31", loadGeneration: 178, loadConsumption: 230 },
  { date: "2024-06-01", loadGeneration: 178, loadConsumption: 200 },
  { date: "2024-06-02", loadGeneration: 470, loadConsumption: 410 },
  { date: "2024-06-03", loadGeneration: 103, loadConsumption: 160 },
  { date: "2024-06-04", loadGeneration: 439, loadConsumption: 380 },
  { date: "2024-06-05", loadGeneration: 88, loadConsumption: 140 },
  { date: "2024-06-06", loadGeneration: 294, loadConsumption: 250 },
  { date: "2024-06-07", loadGeneration: 323, loadConsumption: 370 },
  { date: "2024-06-08", loadGeneration: 385, loadConsumption: 320 },
  { date: "2024-06-09", loadGeneration: 438, loadConsumption: 480 },
  { date: "2024-06-10", loadGeneration: 155, loadConsumption: 200 },
  { date: "2024-06-11", loadGeneration: 92, loadConsumption: 150 },
  { date: "2024-06-12", loadGeneration: 492, loadConsumption: 420 },
  { date: "2024-06-13", loadGeneration: 81, loadConsumption: 130 },
  { date: "2024-06-14", loadGeneration: 426, loadConsumption: 380 },
  { date: "2024-06-15", loadGeneration: 307, loadConsumption: 350 },
  { date: "2024-06-16", loadGeneration: 371, loadConsumption: 310 },
  { date: "2024-06-17", loadGeneration: 475, loadConsumption: 520 },
  { date: "2024-06-18", loadGeneration: 107, loadConsumption: 170 },
  { date: "2024-06-19", loadGeneration: 341, loadConsumption: 290 },
  { date: "2024-06-20", loadGeneration: 408, loadConsumption: 450 },
  { date: "2024-06-21", loadGeneration: 169, loadConsumption: 210 },
  { date: "2024-06-22", loadGeneration: 317, loadConsumption: 270 },
  { date: "2024-06-23", loadGeneration: 480, loadConsumption: 530 },
  { date: "2024-06-24", loadGeneration: 132, loadConsumption: 180 },
  { date: "2024-06-25", loadGeneration: 141, loadConsumption: 190 },
  { date: "2024-06-26", loadGeneration: 434, loadConsumption: 380 },
  { date: "2024-06-27", loadGeneration: 448, loadConsumption: 490 },
  { date: "2024-06-28", loadGeneration: 149, loadConsumption: 200 },
  { date: "2024-06-29", loadGeneration: 103, loadConsumption: 160 },
  { date: "2024-06-30", loadGeneration: 446, loadConsumption: 400 },
]

const chartConfig = {
  load: {
    label: "Load",
  },
  loadGeneration: {
    label: "Load Generation",
    color: "#2563eb",
  },
  loadConsumption: {
    label: "Load Consumption",
    color: "#0ea5e9",
  },
} satisfies ChartConfig

export function Component() {
  const [timeRange, setTimeRange] = React.useState("7d")

  const filteredData = React.useMemo(() => {
    if (!chartData || !Array.isArray(chartData)) {
      return []
    }

    return chartData.filter((item) => {
      const date = new Date(item.date)
      const referenceDate = new Date("2024-06-30")
      let daysToSubtract = 90
      if (timeRange === "30d") {
        daysToSubtract = 30
      } else if (timeRange === "7d") {
        daysToSubtract = 7
      }
      const startDate = new Date(referenceDate)
      startDate.setDate(startDate.getDate() - daysToSubtract)
      return date >= startDate
    })
  }, [timeRange])

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Load Generation vs Consumption</CardTitle>
          {/* <CardDescription>Showing total load for the last 3 months</CardDescription> */}
        </div>
        <div className="flex items-center gap-2">
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={(value) => {
              if (value) setTimeRange(value)
            }}
            variant="outline"
            className="hidden sm:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[160px] rounded-lg sm:hidden" aria-label="Select a value">
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={filteredData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={true}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                  formatter={(value, name) => [
                    `${value} MW`,
                    name === "loadGeneration" ? "Load Generation" : "Load Consumption",
                  ]}
                  indicator="dot"
                  className="rounded-lg border bg-background p-2 shadow-md"
                />
              }
            />
            <Area
              dataKey="loadConsumption"
              type="linear"
              fill="transparent"
              stroke="var(--color-loadConsumption)"
              strokeWidth={3}
              stackId="a"
            />
            <Area
              dataKey="loadGeneration"
              type="linear"
              fill="transparent"
              stroke="var(--color-loadGeneration)"
              strokeWidth={3}
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
