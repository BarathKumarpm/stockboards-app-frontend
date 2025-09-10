"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Package, ShoppingCart } from "lucide-react"

const activities = [
  {
    id: 1,
    type: "Order",
    item: "Product A",
    quantity: 50,
    status: "Shipped",
    date: "2024-07-26",
    icon: ShoppingCart,
  },
  {
    id: 2,
    type: "Restock",
    item: "Product B",
    quantity: 100,
    status: "Received",
    date: "2024-07-25",
    icon: Package,
  },
  {
    id: 3,
    type: "Order",
    item: "Product C",
    quantity: 25,
    status: "Shipped",
    date: "2024-07-24",
    icon: ShoppingCart,
  },
  {
    id: 4,
    type: "Restock",
    item: "Product A",
    quantity: 75,
    status: "Received",
    date: "2024-07-23",
    icon: Package,
  },
]

export function RecentActivities() {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Recent Stock Activities
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <activity.icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{activity.item}</p>
                  <p className="text-sm text-muted-foreground">
                    {activity.type} • {activity.quantity} units • {activity.date}
                  </p>
                </div>
              </div>
              <Badge variant={activity.status === "Shipped" ? "default" : "secondary"} className="text-xs">
                {activity.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
