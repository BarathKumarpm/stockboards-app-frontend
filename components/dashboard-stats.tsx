// components/dashboard-stats.tsx

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react"
import React from 'react';

type StatCard = {
    title: string;
    value: string | number;
    icon: LucideIcon;
};

interface DashboardStatsProps {
    stats: StatCard[];
}

export function DashboardStats({ stats }: DashboardStatsProps) {
    
    // Placeholder logic for 'change' and 'trend' since backend only sends title/value/icon
    const dynamicStats = stats.map((stat, index) => ({
        ...stat,
        change: index % 2 === 0 ? '+12%' : '-3%',
        trend: index % 2 === 0 ? 'up' : 'down',
    }));
    
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {dynamicStats.map((stat) => (
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