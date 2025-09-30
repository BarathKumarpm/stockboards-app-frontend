"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image"; 

// Kinde Auth Imports
// NOTE: We no longer pass postLogoutRedirectURL here, we rely on .env.local
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";

// --- TYPES ---
type KindeUser = {
  id: string;
  email: string | null;
  given_name: string | null;
  family_name: string | null;
  picture: string | null;
} | null;

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const { user } = useKindeAuth();
  const kindeUser = user as KindeUser;

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Inventory", href: "/dashboard/inventory", icon: Package2 },
    { name: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
    { name: "Reports", href: "/dashboard/reports", icon: BarChart3 },
    { name: "Automation", href: "/dashboard/automation", icon: Zap },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <motion.div
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-white border-r border-blue-600/20 flex flex-col h-screen shadow-lg" 
    >
      {/* Header */}
      <div className="p-6 bg-white">
        <div className="flex items-center justify-between">
          <motion.div
            initial={false}
            animate={{ opacity: collapsed ? 0 : 1 }}
            transition={{ duration: 0.2 }}
            className="flex items-center space-x-2"
          >
            <Image
              src="/stock-boards-logo.png"
              alt="Stock Boards Logo"
              width={32}
              height={32}
              className="w-8 h-8 flex-shrink-0"
              priority 
            />
            {!collapsed && (
              <span className="text-xl font-bold whitespace-nowrap">
                <span className="text-black">Stock</span>
                <span className="text-blue-700">Boards</span>
              </span>
            )}
          </motion.div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="text-black hover:bg-gray-100 p-2 h-auto"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start text-black transition-all duration-150",
                  "hover:bg-blue-50 hover:text-blue-700",
                  isActive && "bg-blue-600/10 border border-blue-600/20 text-blue-700 font-semibold",
                  collapsed ? "px-2 h-10 w-10 p-0" : "px-4 h-10"
                )}
              >
                <item.icon
                  className={cn("w-5 h-5 flex-shrink-0", !collapsed && "mr-3")}
                />
                {!collapsed && item.name}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* User Profile & Logout */}
      <div className="p-4 space-y-2 border-t border-gray-100">
        <div
          className={cn(
            "flex items-center",
            collapsed ? "justify-center" : "space-x-3",
            "h-8"
          )}
        >
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 border border-blue-400 overflow-hidden">
            {kindeUser?.picture ? (
              <Image
                src={kindeUser.picture}
                alt="User Avatar"
                width={32}
                height={32}
                className="rounded-full"
              />
            ) : (
              <User className="w-4 h-4 text-blue-700" />
            )}
          </div>
          
          {!collapsed && (
            <motion.div
              initial={false}
              animate={{ opacity: collapsed ? 0 : 1 }}
              transition={{ duration: 0.2 }}
              className="flex-1 min-w-0 overflow-hidden"
            >
              <p className="text-sm font-medium text-black truncate">
                {kindeUser?.given_name || kindeUser?.email || "Admin User"}
              </p>
            </motion.div>
          )}
        </div>

        {/* Logout Button (Kinde Functional) */}
        <div className={cn(collapsed ? "flex justify-center" : "w-full")}>
            {/* NO postLogoutRedirectURL PROP! Relying entirely on .env.local */}
            <LogoutLink> 
                <Button
                    variant="ghost"
                    className={cn(
                        "text-red-600 hover:bg-red-50 hover:text-red-700",
                        collapsed ? "w-10 h-10 p-0" : "w-full justify-start px-4 h-10"
                    )}
                >
                    <LogOut className={cn("w-5 h-5 flex-shrink-0", !collapsed && "mr-3")} />
                    {!collapsed && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2, delay: 0.1 }}>Log Out</motion.span>}
                </Button>
            </LogoutLink>
        </div>
      </div>
    </motion.div>
  );
}