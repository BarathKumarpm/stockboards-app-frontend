"use client"

import { motion } from "framer-motion"
import { DashboardStats } from "@/components/dashboard-stats"
import { DashboardCharts } from "@/components/dashboard-charts"
import { QuickInventoryEntry } from "@/components/quick-inventory-entry"
import { RecentActivities } from "@/components/recent-activities"
import { LowStockAlerts } from "@/components/low-stock-alerts"

export default function DashboardPage() {
  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Overview of your inventory and recent activity</p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <DashboardStats />
      </motion.div>

      {/* Charts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <DashboardCharts />
      </motion.div>

      {/* Bottom Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid gap-8 lg:grid-cols-3"
      >
        <div className="lg:col-span-2 space-y-8">
          <RecentActivities />
          <QuickInventoryEntry />
        </div>
        <div>
          <LowStockAlerts />
        </div>
      </motion.div>
    </div>
  )
}
