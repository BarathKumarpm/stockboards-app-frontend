"use client";

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Package, Clock, CheckCircle, XCircle, Truck, Repeat2, Tag, MoreHorizontal, Info, ChevronDown, ChevronUp } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// Removed Popover import to fix the error
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";


// --- TYPE DEFINITIONS ---
interface TallyVoucherDetails {
    orderSlipNo?: string;
    documentsDirect?: string;
    transportMode?: 'Paid' | 'To Pay' | 'Free';
    lrNo?: string;
    boxDetails?: string; // e.g., "20 Boxes, l - 19/7/25"
    salesPerson: string;
    ref?: string;
    others?: string;
}

type OrderStatus = 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Returned';
type OrderType = 'Sales' | 'Purchase' | 'Client';

interface Order {
    id: string;
    customer: string;
    customerDetails: string; // Multi-line address/contact
    type: OrderType;
    itemsCount: number;
    total: number;
    status: OrderStatus;
    date: string;
    tallyDetails: TallyVoucherDetails;
    // Add a local state for toggling details, initialized in the main component
    isExpanded?: boolean; 
}
// --- END TYPE DEFINITIONS ---

// --- HELPER FUNCTIONS ---
const formatCurrency = (value: number) => `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
        case "Processing":
            return <Clock className="w-4 h-4 text-blue-500" />
        case "Shipped":
            return <Package className="w-4 h-4 text-yellow-600" />
        case "Delivered":
            return <CheckCircle className="w-4 h-4 text-green-500" />
        case "Cancelled":
            return <XCircle className="w-4 h-4 text-red-500" />
        case "Returned":
            return <Repeat2 className="w-4 h-4 text-orange-500" />
        default:
            return <Clock className="w-4 h-4 text-gray-500" />
    }
}

const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
        case "Processing":
            return <Badge variant="secondary" className="bg-blue-100 text-blue-700">Processing</Badge>
        case "Shipped":
            return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">Shipped</Badge>
        case "Delivered":
            return <Badge variant="secondary" className="bg-green-100 text-green-700">Delivered</Badge>
        case "Cancelled":
            return <Badge variant="destructive">Cancelled</Badge>
        case "Returned":
            return <Badge variant="secondary" className="bg-orange-100 text-orange-700">Returned</Badge>
        default:
            return <Badge variant="outline">{status}</Badge>
    }
}

const getTypeBadge = (type: OrderType) => {
    switch (type) {
        case "Client":
            return <Badge className="bg-purple-500 hover:bg-purple-600">Client Order</Badge>
        case "Sales":
            return <Badge className="bg-indigo-500 hover:bg-indigo-600">Sales Order</Badge>
        case "Purchase":
            return <Badge className="bg-red-500 hover:bg-red-600">Purchase Order</Badge>
        default:
            return <Badge variant="outline">{type}</Badge>
    }
}
// --- END HELPER FUNCTIONS ---

// --- DUMMY DATA ---
const initialOrders: Order[] = [
    {
        id: "SAL-1024",
        customer: "Eureka H. S. School",
        customerDetails: "Eureka higher secondary school\nindranagar, bengaluru - 560 032\nPH: 04532 - 234008",
        type: 'Client',
        itemsCount: 800,
        total: 80000.00,
        status: "Delivered",
        date: "2024-07-26",
        tallyDetails: {
            orderSlipNo: "OS-BGL-045",
            documentsDirect: "Fedex Transports",
            transportMode: 'Paid',
            lrNo: "22247310",
            boxDetails: "20 Boxes, l - 19/7/25",
            salesPerson: "Andrew",
            ref: "Book Order Q3",
        },
        isExpanded: false,
    },
    {
        id: "PO-345",
        customer: "Wholesale Distributors Ltd",
        customerDetails: "Distributor Hub, Chennai - 600 005",
        type: 'Purchase',
        itemsCount: 150,
        total: 15000.00,
        status: "Processing",
        date: "2024-07-25",
        tallyDetails: {
            salesPerson: "Ravi",
            transportMode: 'To Pay',
            documentsDirect: "Local Courier",
        },
        isExpanded: false,
    },
    {
        id: "RET-001",
        customer: "Quick Mart Retail",
        customerDetails: "Retail HQ, Mumbai - 400 001",
        type: 'Sales',
        itemsCount: 10,
        total: 1250.00,
        status: "Returned",
        date: "2024-07-24",
        tallyDetails: {
            salesPerson: "Andrew",
            transportMode: 'Paid',
            lrNo: "442998",
            documentsDirect: "Retailer Van",
        },
        isExpanded: false,
    },
    {
        id: "SAL-1025",
        customer: "Book Store Chain",
        customerDetails: "High Street, Delhi - 110 001",
        type: 'Sales',
        itemsCount: 50,
        total: 7500.00,
        status: "Shipped",
        date: "2024-07-27",
        tallyDetails: {
            salesPerson: "Andrew",
            transportMode: 'Paid',
            lrNo: "22247500",
            documentsDirect: "Fedex Transports",
            boxDetails: "5 Boxes, l - 20/7/25",
            ref: "Standard Sales Q3",
        },
        isExpanded: false,
    },
];

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>(initialOrders);
    const [filterStatus, setFilterStatus] = useState<OrderStatus | 'All'>('All');
    
    const filteredOrders = orders.filter(order => 
        filterStatus === 'All' || order.status === filterStatus
    );

    const toggleDetails = (orderId: string) => {
        setOrders(prevOrders => 
            prevOrders.map(order => 
                order.id === orderId ? { ...order, isExpanded: !order.isExpanded } : order
            )
        );
    };

    const handleTallySalesReturn = (orderId: string) => {
        console.log(`Processing Sales Return in Tally for Order: ${orderId}`);
        // In a real app, you would send an API request here to create a Credit Note in Tally
        alert(`Initiating Tally Sales Return (Credit Note) process for ${orderId}. (This would call your Tally API)`);
    }

    return (
        <div className="space-y-10 p-8 max-w-7xl mx-auto">
            {/* Header and Controls */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-between border-b pb-4"
            >
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Order Management Dashboard</h1>
                    <p className="text-muted-foreground">Track sales, purchase, and client orders and process returns via Tally integration.</p>
                </div>
                <Button className="bg-black hover:bg-blue-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    New Order / P.O.
                </Button>
            </motion.div>

            {/* Status Filters */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex gap-3 overflow-x-auto pb-2"
            >
                <Button 
                    variant={filterStatus === 'All' ? 'default' : 'outline'} 
                    onClick={() => setFilterStatus('All')}
                >All Orders ({orders.length})</Button>
                {['Processing', 'Shipped', 'Delivered', 'Returned', 'Cancelled'].map((status) => (
                    <Button 
                        key={status}
                        variant={filterStatus === status as OrderStatus ? 'default' : 'outline'} 
                        onClick={() => setFilterStatus(status as OrderStatus)}
                        className={filterStatus === status as OrderStatus ? 'bg-blue-500 hover:bg-blue-600' : ''}
                    >
                        {status}
                    </Button>
                ))}
            </motion.div>

            {/* Order Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="overflow-x-auto border rounded-lg shadow-sm"
            >
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Order ID</TableHead>
                            <TableHead>Customer / Partner</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead className="text-right">Items</TableHead>
                            <TableHead className="text-right">Total Amount</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="text-center w-[120px]">Details</TableHead>
                            <TableHead className="text-center w-[120px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredOrders.length === 0 && (
                            <TableRow><TableCell colSpan={9} className="text-center text-muted-foreground p-6">No orders match the current filter.</TableCell></TableRow>
                        )}
                        {filteredOrders.flatMap((order) => [
                            // 1. Main Table Row
                            <TableRow key={order.id} className={order.isExpanded ? 'bg-gray-50' : ''}>
                                <TableCell className="font-semibold">{order.id}</TableCell>
                                <TableCell>
                                    <p className="font-medium">{order.customer}</p>
                                    <p className="text-xs text-muted-foreground whitespace-pre-wrap">{order.customerDetails.split('\n')[0]}</p>
                                </TableCell>
                                <TableCell>{getTypeBadge(order.type)}</TableCell>
                                <TableCell className="text-right">{order.itemsCount}</TableCell>
                                <TableCell className="text-right font-bold">{formatCurrency(order.total)}</TableCell>
                                <TableCell className="text-muted-foreground">{order.date}</TableCell>
                                <TableCell className="text-center flex items-center justify-center gap-2">
                                    {getStatusIcon(order.status)}
                                    {getStatusBadge(order.status)}
                                </TableCell>
                                <TableCell className="text-center">
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="h-8"
                                        onClick={() => toggleDetails(order.id)}
                                    >
                                        {order.isExpanded ? <ChevronUp className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
                                        {order.isExpanded ? 'Hide' : 'Show'}
                                    </Button>
                                </TableCell>
                                <TableCell className="text-center">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="w-8 h-8 p-0"><MoreHorizontal className="w-4 h-4" /></Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>View Order Details</DropdownMenuItem>
                                            <DropdownMenuItem>Track Shipment <Truck className="w-3 h-3 ml-2" /></DropdownMenuItem>
                                            
                                            {order.status === 'Delivered' && (
                                                <DropdownMenuItem 
                                                    className="text-orange-600 focus:bg-orange-100"
                                                    onClick={() => handleTallySalesReturn(order.id)}
                                                >
                                                    Process Sales Return (Tally)
                                                </DropdownMenuItem>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>,

                            // 2. Expanded Details Row (Conditional)
                            order.isExpanded && (
                                <TableRow key={`${order.id}-details`} className="bg-gray-50 border-t-2 border-blue-500">
                                    <TableCell colSpan={9} className="p-4">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                                            {/* Tally Transport Details */}
                                            <div>
                                                <h4 className="font-bold border-b pb-1 text-blue-600 mb-2">Tally Transport Details</h4>
                                                <p className="flex justify-between"><strong>Slip No:</strong> <span>{order.tallyDetails.orderSlipNo || '-'}</span></p>
                                                <p className="flex justify-between"><strong>Transporter:</strong> <span>{order.tallyDetails.documentsDirect || '-'}</span></p>
                                                <p className="flex justify-between"><strong>Transport Mode:</strong> <span>{order.tallyDetails.transportMode || '-'}</span></p>
                                                <p className="flex justify-between"><strong>L.R. No:</strong> <span>{order.tallyDetails.lrNo || '-'}</span></p>
                                                {order.tallyDetails.boxDetails && <p className="text-xs text-muted-foreground mt-1">📦 {order.tallyDetails.boxDetails}</p>}
                                            </div>

                                            {/* Sales & Reference */}
                                            <div>
                                                <h4 className="font-bold border-b pb-1 text-blue-600 mb-2">Sales & Reference</h4>
                                                <p className="flex justify-between"><strong>Sales Person:</strong> <span>{order.tallyDetails.salesPerson}</span></p>
                                                <p className="flex justify-between"><strong>Ref:</strong> <span>{order.tallyDetails.ref || '-'}</span></p>
                                                <p className="flex justify-between"><strong>Others:</strong> <span>{order.tallyDetails.others || '-'}</span></p>
                                            </div>

                                            {/* To Details (Client Address) */}
                                            <div>
                                                <h4 className="font-bold border-b pb-1 text-blue-600 mb-2">Client 'To' Details</h4>
                                                <div className="text-xs whitespace-pre-wrap bg-white p-3 rounded border">
                                                    {order.customerDetails}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )
                        ])}
                    </TableBody>
                </Table>
            </motion.div>
        </div>
    )
}