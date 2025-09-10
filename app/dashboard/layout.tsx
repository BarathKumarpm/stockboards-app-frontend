"use client"

import type React from "react"

import { Sidebar } from "@/components/sidebar"
import { Toaster } from "@/components/ui/toaster"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-8 max-w-7xl min-h-full">{children}</div>
      </main>
      <Toaster />
    </div>
  )
}
