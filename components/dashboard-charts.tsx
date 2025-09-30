// components/dashboard-charts.tsx

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import React from 'react';

type StockMovementData = {
    month: string;
    value: number;
}[];

type InventoryByProductData = {
    product: string;
    quantity: number;
}[];

interface DashboardChartsProps {
    stockMovementData: StockMovementData;
    inventoryByProductData: InventoryByProductData;
}

const DEFAULT_STOCK_MOVEMENT: StockMovementData = [
    { month: "Jan", value: 1200 },
    { month: "Feb", value: 1350 },
    { month: "Mar", value: 1180 },
    { month: "Apr", value: 1420 },
    { month: "May", value: 1380 },
    { month: "Jun", value: 1500 },
]

const DEFAULT_INVENTORY_BY_PRODUCT: InventoryByProductData = [
    { product: "Product A", quantity: 320 },
    { product: "Product B", quantity: 280 },
    { product: "Product C", quantity: 190 },
    { product: "Product D", quantity: 150 },
    { product: "Product E", quantity: 120 },
]

export function DashboardCharts({ 
    stockMovementData, 
    inventoryByProductData 
}: DashboardChartsProps) {
    
    const finalStockData = stockMovementData.length > 0 ? stockMovementData : DEFAULT_STOCK_MOVEMENT;
    const finalInventoryData = inventoryByProductData.length > 0 ? inventoryByProductData : DEFAULT_INVENTORY_BY_PRODUCT;

    return (
        <div className="grid gap-4 md:grid-cols-2">
            
            {/* --- Chart 1: Stock Movement --- */}
            <Card className="bg-card/50 backdrop-blur-sm border-0">
                <CardHeader>
                    <CardTitle>Stock Movement Over Time</CardTitle>
                    <CardDescription>Last 6 months inventory trends</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer
                        config={{
                            value: { label: "Stock Value", color: "hsl(var(--chart-1))" },
                        }}
                        className="h-[300px]"
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={finalStockData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="var(--color-chart-1)"
                                    strokeWidth={2}
                                    dot={{ fill: "var(--color-chart-1)" }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>

            {/* --- Chart 2: Inventory by Product --- */}
            <Card className="bg-card/50 backdrop-blur-sm border-0">
                <CardHeader>
                    <CardTitle>Inventory by Product</CardTitle>
                    <CardDescription>Current stock levels by product category</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer
                        config={{
                            quantity: { label: "Quantity", color: "hsl(var(--chart-2))" },
                        }}
                        className="h-[300px]"
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={finalInventoryData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="product" />
                                <YAxis />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Bar dataKey="quantity" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    )
}