"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import data from "@/components/ui/Dashboard/data.json";

export const description = "An interactive area chart";

// Generate chart data from JSON
const generateChartData = () => {
  const solarCustomer = data.solarCustomers[0];
  return solarCustomer.dailyData.map((day) => ({
    date: day.date,
    currentGeneration: day.currentGeneration,
    loadConsumption: parseFloat((day.photovoltaicOutput - day.transferredToGrid).toFixed(1)),
  }));
};

const chartData = generateChartData();

const chartConfig = {
  load: {
    label: "Load",
  },
  currentGeneration: {
    label: "Current Generation",
    color: "#2563eb",
  },
  loadConsumption: {
    label: "Load Consumption",
    color: "#0ea5e9",
  },
} satisfies ChartConfig;

export function Component() {
  const [timeRange, setTimeRange] = React.useState("7d");

  const filteredData = React.useMemo(() => {
    if (!chartData || !Array.isArray(chartData)) {
      return [];
    }

    return chartData.filter((item) => {
      const date = new Date(item.date);
      const referenceDate = new Date("2024-01-21"); // Updated to match our data range
      let daysToSubtract = 90;
      if (timeRange === "30d") {
        daysToSubtract = 30;
      } else if (timeRange === "7d") {
        daysToSubtract = 7;
      }
      const startDate = new Date(referenceDate);
      startDate.setDate(startDate.getDate() - daysToSubtract);
      return date >= startDate;
    });
  }, [timeRange]);

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Current Generation vs Load Consumption</CardTitle>
          {/* <CardDescription>Showing total load for the last 3 months</CardDescription> */}
        </div>
        <div className="flex items-center gap-2">
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={(value) => {
              if (value) setTimeRange(value);
            }}
            variant="outline"
            className="hidden sm:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="w-[160px] rounded-lg sm:hidden"
              aria-label="Select a value"
            >
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
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
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
                    });
                  }}
                  formatter={(value, name) => [
                    `${value} kWh`,
                    name === "currentGeneration"
                      ? "Current Generation"
                      : "Load Consumption",
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
              dataKey="currentGeneration"
              type="linear"
              fill="transparent"
              stroke="var(--color-currentGeneration)"
              strokeWidth={3}
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
