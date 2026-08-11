"use client"

import { useTranslations } from "next-intl"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

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
import { weeklyActivityData } from "@/lib/chart-data"

export function SalesBarChart() {
  const t = useTranslations("Charts")

  const chartConfig = {
    orders: {
      label: t("weeklyActivity.seriesOrders"),
      color: "var(--chart-1)",
    },
    returns: {
      label: t("weeklyActivity.seriesReturns"),
      color: "var(--chart-5)",
    },
  } satisfies ChartConfig

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{ t("weeklyActivity.title") }</CardTitle>
        <CardDescription>{ t("weeklyActivity.description") }</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer config={ chartConfig } className="aspect-auto h-[300px] w-full">
          <BarChart accessibilityLayer data={ weeklyActivityData }>
            <CartesianGrid vertical={ false } />
            <XAxis
              dataKey="day"
              tickLine={ false }
              axisLine={ false }
              tickMargin={ 10 }
              tickFormatter={ (value) => t(`weekdays.${ value }`) }
            />
            <YAxis tickLine={ false } axisLine={ false } tickMargin={ 8 } />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={ (value) => t(`weekdays.${ value }`) }
                />
              }
            />
            <Bar dataKey="orders" fill="var(--color-orders)" radius={ [4, 4, 0, 0] } />
            <Bar dataKey="returns" fill="var(--color-returns)" radius={ [4, 4, 0, 0] } />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
