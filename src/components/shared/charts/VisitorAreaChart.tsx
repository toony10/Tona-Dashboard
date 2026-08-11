"use client"

import { useTranslations } from "next-intl"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { visitorTrafficData } from "@/lib/chart-data"

export function VisitorAreaChart() {
  const t = useTranslations("Charts")

  const chartConfig = {
    desktop: {
      label: t("devices.desktop"),
      color: "var(--chart-1)",
    },
    mobile: {
      label: t("devices.mobile"),
      color: "var(--chart-2)",
    },
    tablet: {
      label: t("devices.tablet"),
      color: "var(--chart-4)",
    },
  } satisfies ChartConfig

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{ t("visitors.title") }</CardTitle>
        <CardDescription>{ t("visitors.description") }</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer config={ chartConfig } className="aspect-auto h-[300px] w-full">
          <AreaChart
            accessibilityLayer
            data={ visitorTrafficData }
            margin={ { left: 12, right: 12 } }
          >
            <CartesianGrid vertical={ false } />
            <XAxis
              dataKey="month"
              tickLine={ false }
              axisLine={ false }
              tickMargin={ 8 }
              tickFormatter={ (value) => t(`months.${ value }`) }
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  indicator="line"
                  labelFormatter={ (value) => t(`months.${ value }`) }
                />
              }
            />
            <ChartLegend content={ <ChartLegendContent /> } />
            <Area
              dataKey="tablet"
              type="natural"
              fill="var(--color-tablet)"
              fillOpacity={ 0.4 }
              stroke="var(--color-tablet)"
              stackId="a"
            />
            <Area
              dataKey="mobile"
              type="natural"
              fill="var(--color-mobile)"
              fillOpacity={ 0.4 }
              stroke="var(--color-mobile)"
              stackId="a"
            />
            <Area
              dataKey="desktop"
              type="natural"
              fill="var(--color-desktop)"
              fillOpacity={ 0.4 }
              stroke="var(--color-desktop)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
