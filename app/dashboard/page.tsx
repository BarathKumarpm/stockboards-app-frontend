// app/dashboard/page.tsx

"use client";

import { motion } from "framer-motion";
import {
    Package,
    ShoppingCart,
    Clock,
    DollarSign,
    Box,
    BarChart3,
    LucideIcon,
} from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";

// --- NAMED IMPORTS (Fixed Error) ---
import { DashboardStats } from "@/components/dashboard-stats";
import { DashboardCharts } from "@/components/dashboard-charts";
import { QuickInventoryEntry } from "@/components/quick-inventory-entry";
import { RecentActivities } from "@/components/recent-activities";
import { LowStockAlerts } from "@/components/low-stock-alerts";
// ------------------------------------

// --- 1. TYPES DEFINITION ---

type StatCard = {
    title: string;
    value: string | number;
    icon: LucideIcon;
};

type RecentActivity = {
    id: number;
    type: string;
    item: string;
    quantity: number;
    status: string;
    date: string;
    icon: LucideIcon;
};

type LowStockItem = {
    id: number;
    name: string;
    quantity: number;
    threshold: number;
};

type StockMovementData = {
    month: string;
    value: number;
}[];

type InventoryByProductData = {
    product: string;
    quantity: number;
}[];

type DashboardData = {
    stats: StatCard[];
    recent_activities: RecentActivity[];
    low_stock_items: LowStockItem[];
    stock_movement_data: StockMovementData;
    inventory_by_product_data: InventoryByProductData;
};

type DashboardAPIResponse = {
    success: boolean;
    stats: {
        total_items: number | null;
        total_stock_qty: number | null;
        total_stock_value: number | null;
    };
    recent_activities: any[];
    low_stock_items: any[];
    stock_movement_data: any[];
    inventory_by_product_data: any[];
};

// --- 2. UTILITY FUNCTION (MAPPING STAT TITLES TO ICONS) ---

function getIcon(title: string): LucideIcon {
    switch (title) {
        case "Total Items":
            return Box;
        case "Total Stock Quantity":
            return BarChart3;
        case "Total Stock Value":
            return DollarSign;
        default:
            return Clock;
    }
}

// --- 3. CUSTOM HOOK FOR DATA FETCHING (FIXED LOGIC) ---

function useDashboardData() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // CRITICAL: Replace with your actual Django backend URL
    const API_ENDPOINT = 'http://localhost:8000/api/dashboard/data/'; 

    const fetchDashboard = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(API_ENDPOINT);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result: DashboardAPIResponse = await response.json();

            // 🛑 FIX: Convert the aggregated stats object to an array 🛑
            const rawStats = result.stats;
            
            const transformedStatsArray: StatCard[] = [
                {
                    title: "Total Items",
                    value: rawStats.total_items || 0,
                    icon: getIcon("Total Items"),
                },
                {
                    title: "Total Stock Quantity",
                    value: rawStats.total_stock_qty || 0,
                    icon: getIcon("Total Stock Quantity"),
                },
                {
                    title: "Total Stock Value",
                    // Ensure currency formatting
                    value: `$${(Number(rawStats.total_stock_value) || 0).toLocaleString(undefined, {
                        minimumFractionDigits: 2, 
                        maximumFractionDigits: 2
                    })}`,
                    icon: getIcon("Total Stock Value"),
                },
            ];
            
            // Map recent activities data 
            const recent_activities: RecentActivity[] = (result.recent_activities || []).map((activity: any) => ({
                ...activity,
                // Assign icon based on type returned from backend
                icon: activity.type === "Restock" ? Package : ShoppingCart, 
            }));

            // Compile final data object
            const transformedData: DashboardData = {
                stats: transformedStatsArray, 
                recent_activities: recent_activities,
                // Use backend data or default to empty array
                low_stock_items: result.low_stock_items || [],
                stock_movement_data: result.stock_movement_data || [],
                inventory_by_product_data: result.inventory_by_product_data || [],
            };

            setData(transformedData);
        } catch (e: any) {
            console.error("Dashboard Fetch Error:", e);
            setError(`Failed to fetch dashboard data: ${e.message}`);
        } finally {
            setIsLoading(false);
        }
    }, [API_ENDPOINT]);

    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    return { data, isLoading, error };
}


// --- 4. MAIN PAGE COMPONENT ---

export default function DashboardPage() {
    const { data, isLoading, error } = useDashboardData();

    if (isLoading) {
        return (
            <div className="space-y-8 py-4 text-center">
                <h1 className="text-xl font-semibold text-foreground">Loading Dashboard...</h1>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-8 py-4 text-center text-red-500">
                <h1 className="text-xl font-semibold">Error Loading Data</h1>
                <p>{error}</p>
            </div>
        );
    }

    if (!data) {
        return null;
    }

    return (
        <div className="space-y-8 py-4">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                <p className="text-muted-foreground mt-2">Overview of your inventory and recent activity</p>
            </motion.div>

            {/* Stats Cards */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                <DashboardStats stats={data.stats} /> 
            </motion.div>

            {/* Charts */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                <DashboardCharts 
                    stockMovementData={data.stock_movement_data} 
                    inventoryByProductData={data.inventory_by_product_data} 
                />
            </motion.div>

            {/* Layout for Quick Entry & Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <motion.div className="lg:col-span-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
                    <RecentActivities activities={data.recent_activities} />
                </motion.div>
                <motion.div className="lg:col-span-1 space-y-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
                    <QuickInventoryEntry />
                    <LowStockAlerts lowStockItems={data.low_stock_items} />
                </motion.div>
            </div>
        </div>
    );
}