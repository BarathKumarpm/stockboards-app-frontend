"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Package, Clock, CheckCircle, XCircle } from "lucide-react"

const orders = [
  {
    id: "ORD-001",
    customer: "Tech Solutions Inc.",
    items: 5,
    total: 2500,
    status: "Processing",
    date: "2024-07-26",
  },
  {
    id: "ORD-002",
    customer: "Office Dynamics",
    items: 12,
    total: 1800,
    status: "Shipped",
    date: "2024-07-25",
  },
  {
    id: "ORD-003",
    customer: "Creative Agency",
    items: 3,
    total: 900,
    status: "Delivered",
    date: "2024-07-24",
  },
]

export default function OrdersPage() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Processing":
        return <Clock className="w-4 h-4" />
      case "Shipped":
        return <Package className="w-4 h-4" />
      case "Delivered":
        return <CheckCircle className="w-4 h-4" />
      case "Cancelled":
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Processing":
        return (
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            Processing
          </Badge>
        )
      case "Shipped":
        return (
          <Badge variant="secondary" className="bg-accent/10 text-accent">
            Shipped
          </Badge>
        )
      case "Delivered":
        return (
          <Badge variant="secondary" className="bg-accent/10 text-accent">
            Delivered
          </Badge>
        )
      case "Cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-10 p-2">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">Orders</h1>
          <p className="text-muted-foreground">Manage customer orders and shipments</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Order
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid gap-6"
      >
        {orders.map((order, index) => (
          <Card key={order.id} className="bg-card/50 backdrop-blur-sm border-0">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    {getStatusIcon(order.status)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{order.id}</h3>
                    <p className="text-sm text-muted-foreground">{order.customer}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">{order.items} items</p>
                    <p className="font-semibold">${order.total}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">{order.date}</p>
                    {getStatusBadge(order.status)}
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>
    </div>
  )
}
