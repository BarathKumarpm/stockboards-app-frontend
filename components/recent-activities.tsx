// components/recent-activities.tsx

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, ShoppingCart, LucideIcon } from "lucide-react"
import React from 'react';

type RecentActivity = {
    id: number;
    type: string;
    item: string;
    quantity: number;
    status: string;
    date: string;
    icon: LucideIcon;
};

interface RecentActivitiesProps {
    activities: RecentActivity[];
}


export function RecentActivities({ activities }: RecentActivitiesProps) {
    
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
                            <Badge 
                                variant={activity.status === "Shipped" || activity.status === "Sold" ? "default" : "secondary"} 
                                className="text-xs"
                            >
                                {activity.status}
                            </Badge>
                        </div>
                    ))}
                    {activities.length === 0 && (
                        <p className="text-sm text-muted-foreground p-3 text-center">No recent activities found.</p>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}