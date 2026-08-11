"use client"

import { TrendingUp } from "lucide-react"
import { useTranslations } from "next-intl"
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"

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
  type ChartConfig,
} from "@/components/ui/chart"
import { conversionGoalData } from "@/lib/chart-data"

export function ConversionRadialChart() {
  const t = useTranslations("Charts")

  const chartConfig = {
    conversion: {
      label: t("conversionGoal.seriesConversion"),
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{ t("conversionGoal.title") }</CardTitle>
        <CardDescription>{ t("conversionGoal.description") }</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={ chartConfig }
          className="mx-auto aspect-square max-h-[280px]"
        >
          <RadialBarChart
            data={ conversionGoalData }
            startAngle={ 0 }
            endAngle={ 250 }
            innerRadius={ 80 }
            outerRadius={ 110 }
          >
            <PolarGrid
              gridType="circle"
              radialLines={ false }
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={ [110, 94] }
            />
            <RadialBar
              dataKey="value"
              background
              cornerRadius={ 10 }
            />
            <PolarRadiusAxis tick={ false } tickLine={ false } axisLine={ false }>
              <Label
                content={ ({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={ viewBox.cx }
                        y={ viewBox.cy }
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={ viewBox.cx }
                          y={ viewBox.cy }
                          className="fill-foreground text-3xl font-bold"
                        >
                          { conversionGoalData[0].value }%
                        </tspan>
                        <tspan
                          x={ viewBox.cx }
                          y={ (viewBox.cy || 0) + 24 }
                          className="fill-muted-foreground text-xs"
                        >
                          { t("conversionGoal.ofGoal") }
                        </tspan>
                      </text>
                    )
                  }
                } }
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          { t("conversionGoal.onTrack") } <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  )
}
