"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    LayoutDashboard,
    Package2,
    ShoppingCart,
    BarChart3,
    Settings,
    ChevronLeft,
    ChevronRight,
    User,
    Zap,
    LogOut, // ADDED: LogOut icon
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation" // ADDED: useRouter
import Image from "next/image"

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Inventory", href: "/dashboard/inventory", icon: Package2 },
    { name: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
    { name: "Reports", href: "/dashboard/reports", icon: BarChart3 },
    { name: "Automation", href: "/dashboard/automation", icon: Zap },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function Sidebar() {
    const [collapsed, setCollapsed] = useState(false)
    const pathname = usePathname()
    const router = useRouter() // INITIALIZED: useRouter

    // ADDED: Sign out logic
    const handleSignOut = () => {
        router.push("/")
    }

    return (
        <motion.div
            initial={false}
            animate={{ width: collapsed ? 80 : 280 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            // Sidebar background remains blue-400
            className="bg-white border-r border-blue-600 flex flex-col h-screen"
        >
            {/* Header */}
            <div 
                // Header background remains blue-400
                className="p-6 bg-white"
            >
                <div className="flex items-center justify-between">
                    <motion.div
                        initial={false}
                        animate={{ opacity: collapsed ? 0 : 1 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center space-x-2"
                    >
                        <Image src="/stock-boards-logo.png" alt="Stock Boards Logo" width={32} height={32} className="w-8 h-8" />
                        {!collapsed && (
                            <span className="text-xl font-bold">
                                <span className="text-black">Stock</span>
                                <span className="text-blue-700">Boards</span>
                            </span>
                        )}
                    </motion.div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCollapsed(!collapsed)}
                        className="text-black hover:bg-white/20"
                    >
                        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                    </Button>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {navigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link key={item.name} href={item.href}>
                            <Button
                                variant="ghost"
                                className={cn(
                                    "w-full justify-start text-black hover:bg-blue-400 hover:text-white",
                                    isActive && "bg-white border-blue-400 text-black",
                                    collapsed && "px-2",
                                )}
                            >
                                <item.icon className={cn("w-5 h-5", !collapsed && "mr-3")} />
                                {!collapsed && item.name}
                            </Button>
                        </Link>
                    )
                })}
            </nav>

            {/* User Profile & Logout */}
            <div className="p-4 space-y-2">
                <div className={cn("flex items-center", collapsed ? "justify-center" : "space-x-3", "h-8")}>
                    {/* Profile Avatar/Icon */}
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-black" />
                    </div>
                    {!collapsed && (
                        <motion.div
                            initial={false}
                            animate={{ opacity: collapsed ? 0 : 1 }}
                            transition={{ duration: 0.2 }}
                            className="flex-1 min-w-0 overflow-hidden"
                        >
                            {/* Display Username */}
                            <p className="text-sm font-medium text-black truncate">Admin User</p>
                        </motion.div>
                    )}
                </div>
                
                {/* Logout Button (Only visible when not collapsed) */}
                {!collapsed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2, delay: 0.1 }}
                    >
                        <Button
                            variant="ghost"
                            // Custom class for destructive action with black hover background
                            className="w-full justify-start text-black hover:bg-blue-200 hover:text-red-500"
                            onClick={handleSignOut}
                        >
                            <LogOut className="w-4 h-4 mr-3" />
                            Log Out
                        </Button>
                    </motion.div>
                )}
                
            </div>
        </motion.div>
    )
}