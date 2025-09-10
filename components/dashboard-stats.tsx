"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Package, ShoppingCart, DollarSign, AlertTriangle } from "lucide-react"

const stats = [
  {
    title: "Total Inventory Value",
    value: "$250,000",
    change: "+12%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Items in Stock",
    value: "1,500",
    change: "+5%",
    trend: "up",
    icon: Package,
  },
  {
    title: "Orders Processed",
    value: "300",
    change: "+8%",
    trend: "up",
    icon: ShoppingCart,
  },
  {
    title: "Low Stock Alerts",
    value: "12",
    change: "-3%",
    trend: "down",
    icon: AlertTriangle,
  },
]

export function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="bg-card/50 backdrop-blur-sm border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {stat.trend === "up" ? (
                <TrendingUp className="mr-1 h-3 w-3 text-accent" />
              ) : (
                <TrendingDown className="mr-1 h-3 w-3 text-destructive" />
              )}
              <span className={stat.trend === "up" ? "text-accent" : "text-destructive"}>{stat.change}</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
