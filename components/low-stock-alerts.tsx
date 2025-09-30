// components/low-stock-alerts.tsx

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Plus } from "lucide-react"
import React from 'react';

type LowStockItem = {
    id: number;
    name: string;
    quantity: number;
    threshold: number;
};

interface LowStockAlertsProps {
    lowStockItems: LowStockItem[]; 
}

const DEFAULT_LOW_STOCK: LowStockItem[] = [
    { id: 1, name: "Product E", quantity: 10, threshold: 20 },
    { id: 2, name: "Product F", quantity: 5, threshold: 15 },
    { id: 3, name: "Product G", quantity: 8, threshold: 25 },
];

export function LowStockAlerts({ lowStockItems }: LowStockAlertsProps) {
    
    // Use the prop data if empty, otherwise use the fallback for visualization
    const finalLowStockItems = lowStockItems.length > 0 ? lowStockItems : DEFAULT_LOW_STOCK;

    return (
        <Card className="bg-card/50 backdrop-blur-sm border-0">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="w-5 h-5" />
                    Low Stock Alerts
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {finalLowStockItems.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-destructive/5 border border-destructive/20"
                        >
                            <div>
                                <p className="font-medium text-foreground">{item.name}</p>
                                <p className="text-sm text-destructive">Only {item.quantity} units remaining</p>
                            </div>
                            <Button size="sm" variant="outline" className="text-xs bg-transparent">
                                <Plus className="w-3 h-3 mr-1" />
                                Reorder
                            </Button>
                        </div>
                    ))}
                    
                    {lowStockItems.length === 0 && (
                        <p className="text-sm text-muted-foreground p-3 text-center">No low stock items reported.</p>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}