/**
 * Chart datasets keep stable, untranslated keys (`jan`, `mon`, `electronics`, …).
 * Chart components resolve them to labels through the `Charts` namespace.
 */

export const monthlyRevenueData = [
  { month: "jan", revenue: 4200, expenses: 2800 },
  { month: "feb", revenue: 5100, expenses: 3200 },
  { month: "mar", revenue: 4800, expenses: 2900 },
  { month: "apr", revenue: 6200, expenses: 3500 },
  { month: "may", revenue: 5800, expenses: 3100 },
  { month: "jun", revenue: 7100, expenses: 3800 },
  { month: "jul", revenue: 6800, expenses: 3600 },
  { month: "aug", revenue: 7500, expenses: 3900 },
  { month: "sep", revenue: 8200, expenses: 4100 },
  { month: "oct", revenue: 7900, expenses: 4000 },
  { month: "nov", revenue: 9100, expenses: 4300 },
  { month: "dec", revenue: 9800, expenses: 4500 },
]

export const visitorTrafficData = [
  { month: "jan", desktop: 1860, mobile: 980, tablet: 420 },
  { month: "feb", desktop: 2100, mobile: 1240, tablet: 510 },
  { month: "mar", desktop: 1950, mobile: 1180, tablet: 480 },
  { month: "apr", desktop: 2380, mobile: 1520, tablet: 620 },
  { month: "may", desktop: 2210, mobile: 1390, tablet: 550 },
  { month: "jun", desktop: 2640, mobile: 1680, tablet: 710 },
]

export const salesByCategoryData = [
  { category: "electronics", sales: 4520 },
  { category: "clothing", sales: 3280 },
  { category: "home", sales: 2940 },
  { category: "sports", sales: 2180 },
  { category: "books", sales: 1560 },
]

export const trafficSourcesData = [
  { source: "organic", visitors: 4200, fill: "var(--color-organic)" },
  { source: "direct", visitors: 2800, fill: "var(--color-direct)" },
  { source: "social", visitors: 1900, fill: "var(--color-social)" },
  { source: "referral", visitors: 1400, fill: "var(--color-referral)" },
  { source: "email", visitors: 980, fill: "var(--color-email)" },
]

export const weeklyActivityData = [
  { day: "mon", orders: 145, returns: 12 },
  { day: "tue", orders: 178, returns: 8 },
  { day: "wed", orders: 162, returns: 15 },
  { day: "thu", orders: 195, returns: 10 },
  { day: "fri", orders: 220, returns: 18 },
  { day: "sat", orders: 168, returns: 9 },
  { day: "sun", orders: 132, returns: 6 },
]

export const conversionGoalData = [{ goal: "conversion", value: 78, fill: "var(--color-conversion)" }]

/** `key` resolves to `Charts.kpi.{key}Title`. */
export const kpiStats = [
  {
    key: "totalRevenue",
    value: "$84,320",
    change: "+12.5%",
    trend: "up" as const,
  },
  {
    key: "activeUsers",
    value: "12,847",
    change: "+8.2%",
    trend: "up" as const,
  },
  {
    key: "conversionRate",
    value: "3.24%",
    change: "+0.4%",
    trend: "up" as const,
  },
  {
    key: "avgOrderValue",
    value: "$68.40",
    change: "-2.1%",
    trend: "down" as const,
  },
]
