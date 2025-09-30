"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

// Icons
import { Package, Plus, Loader2, List, MoreHorizontal, Trash2, Eye, Save } from "lucide-react";

// Types
interface IInventoryLog {
    id: number;
    name: string;
    created_at: string;
    total_stock_entries: number; 
    is_active: boolean;
}

import { useToast } from "@/hooks/use-toast";

// Use the local storage to get the base URL, or use a default fallback
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

// --- Helper Functions ---
const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

// --- Component Definition ---

export default function InventoryLogListPage() {
    const router = useRouter();
    const { toast } = useToast();

    // Data States
    const [logs, setLogs] = useState<IInventoryLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newLogName, setNewLogName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // ---------------------------------------------------
    // 1. DATA FETCHING & API ACTIONS
    // ---------------------------------------------------

    const fetchInventoryLogs = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE}/inventory-logs/`);
            
            const logsData: IInventoryLog[] = res.data.map((log: any) => ({
                id: log.id,
                name: log.name,
                created_at: log.created_at,
                // Assuming the API returns a count or we can use the length of the nested list
                total_stock_entries: log.total_stock_entries || log.stock_entries?.length || 0,
                is_active: log.is_active ?? true, 
            }));

            setLogs(logsData);

        } catch (error) {
            console.error("Error fetching inventory logs:", error);
            toast({ 
                title: "Error", 
                description: `Could not fetch the list of inventory logs. Please check the API connection.`, 
                variant: "destructive" 
            });
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchInventoryLogs();
    }, [fetchInventoryLogs]);
    
    const handleCreateLog = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newLogName.trim()) return;

        setIsSubmitting(true);
        try {
            // API call to create a new log
            await axios.post(`${API_BASE}/inventory-logs/`, {
                name: newLogName.trim(),
                is_active: true, // Default to active
            });

            toast({ title: "Success", description: `Inventory Log "${newLogName}" created.` });
            setNewLogName("");
            setIsCreateModalOpen(false);
            fetchInventoryLogs(); // Refresh the list
        } catch (error) {
            console.error("Error creating log:", error);
            toast({ title: "Error", description: "Could not create the new inventory log.", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteLog = async (logId: number, logName: string) => {
        if (!confirm(`Are you sure you want to delete the log: "${logName}" (ID: ${logId})? This action cannot be undone.`)) return;

        try {
            // API call to delete the log
            await axios.delete(`${API_BASE}/inventory-logs/${logId}/`);
            toast({ title: "Log Deleted", description: `Log "${logName}" successfully removed.`, variant: "destructive" });
            fetchInventoryLogs(); // Refresh the data
        } catch (error) {
            console.error("Error deleting log:", error);
            toast({ title: "Error Deleting", description: "Could not delete the inventory log. Ensure it has no dependencies.", variant: "destructive" });
        }
    };
    
    // ---------------------------------------------------
    // 2. RENDERING
    // ---------------------------------------------------

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-2 text-lg text-muted-foreground">Loading Inventory Logs...</p>
        </div>
    );

    return (
        <div className="space-y-10 p-8 max-w-7xl mx-auto">
            
            {/* Header and Add Item Button */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex items-center justify-between border-b pb-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                        <List className="w-7 h-7 text-primary" />
                        Inventory Logs Overview
                    </h1>
                    <p className="text-muted-foreground">Manage and view detailed stock movements and allocations.</p>
                </div>
                <div className="flex gap-4">
                    <Button 
                        // UPDATED: Green background, black hover, white text
                        className="bg-blue-400 hover:bg-black text-white hover:text-white" 
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Create New Log
                    </Button>
                </div>
            </motion.div>

            {/* Metric Card (List Summary) */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                <Card 
                    // UPDATED: Green metric card styling
                    className="bg-blue-300 border-blue-400 border-2 text-white"
                >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-white">Total Logs</CardTitle>
                        <Package className="h-4 w-4 text-white" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {logs.length} Log{logs.length !== 1 ? 's' : ''}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Inventory Logs Table */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                {/* REMOVED: Outer Card Wrapper */}
                <h3 className="text-xl font-semibold mb-4">Inventory Records</h3>
                
                {/* The Table component itself provides the modern Mantine-style border and shadow */}
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Log ID</TableHead>
                            <TableHead>Log Name</TableHead>
                            <TableHead>Total Entries</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Created Date</TableHead>
                            <TableHead className="text-center">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {logs.length > 0 ? (
                            logs.map((log) => (
                                <TableRow key={log.id} className="cursor-pointer hover:bg-muted/50">
                                    <TableCell className="font-bold">{log.id}</TableCell>
                                    <TableCell className="font-medium">{log.name}</TableCell>
                                    <TableCell>{log.total_stock_entries}</TableCell>
                                    <TableCell>
                                        <Badge variant={log.is_active ? "default" : "secondary"}>
                                            {log.is_active ? 'Active' : 'Archived'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right text-sm text-muted-foreground">{formatDate(log.created_at)}</TableCell>
                                    <TableCell className="text-center">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="w-8 h-8 p-0" onClick={(e) => e.stopPropagation()}>
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                {/* View Details - Links to your existing detail page */}
                                                <Link href={`/dashboard/inventory/${log.id}`} legacyBehavior passHref>
                                                    <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                                                        <Eye className="w-4 h-4" />View & Edit Log
                                                    </DropdownMenuItem>
                                                </Link>
                                                <DropdownMenuSeparator />

                                                {/* Delete Action */}
                                                <DropdownMenuItem 
                                                    onClick={() => handleDeleteLog(log.id, log.name)} 
                                                    className="flex items-center gap-2 text-red-600 focus:text-red-700"
                                                >
                                                    <Trash2 className="w-4 h-4" />Delete Log
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center p-10 text-lg text-muted-foreground">
                                    No inventory logs found. Click "Create New Log" to start.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </motion.div>
            
            {/* --- Create Log Dialog (Unchanged) --- */}
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Create New Inventory Log</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateLog} className="space-y-4 py-4">
                        <div className="space-y-1">
                            <label htmlFor="logName" className="text-sm font-medium">Log Name (e.g., "Q4 2024 Stock", "Warehouse A Audit")</label>
                            <Input 
                                id="logName" 
                                type="text" 
                                placeholder="Enter log name..."
                                value={newLogName}
                                onChange={(e) => setNewLogName(e.target.value)}
                                required 
                            />
                        </div>
                        {/* Optional: Add a description or notes field here if needed */}
                        <DialogFooter className="pt-4">
                            <Button variant="outline" type="button" onClick={() => setIsCreateModalOpen(false)} disabled={isSubmitting}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting || newLogName.trim() === ""}>
                                {isSubmitting ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="mr-2 h-4 w-4" />
                                )}
                                Create Log
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}