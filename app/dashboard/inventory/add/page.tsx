"use client";

import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios, { AxiosError } from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Loader2, ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { IStockEntryPayload } from "@/types/inventory"; // Assuming correct import now

// --- Helper Types ---
type CompanyAllocation = {
    company_name: string;
    qty: number;
    rate: number;
    discount: number; 
};

type FormState = {
    product_name: string;
    hsn_at_entry: string;
    total_quantity: number;
    total_discount_percent: number; 
    stock_for: "Self" | "Sale" | string;
    
    allocations: CompanyAllocation[];
    
    logLinkMode: "id" | "name"; 
    inventory_log_id: string; // Stored as string to handle initial URL param
    log_name: string; 
};
// --- END Helper Types ---

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

// --- NEW/UPDATED HELPER FUNCTIONS ---

/**
 * Safely converts input string to number, treating empty string/NaN as 0.
 * This is crucial for fixing the "Received NaN" error.
 */
const safeNumberConvert = (value: string | number): number => {
    if (value === "") return 0;
    
    const num = Number(value);
    return isNaN(num) ? 0 : num;
};

/**
 * Conditionally renders number input value. If the number is 0, returns "" 
 * to allow the user to clear the input field without seeing "0".
 */
const renderNumValue = (num: number) => (num === 0 ? "" : num);

// Helper function for amount calculation and formatting
const calculateAmount = (qty: number, rate: number, discount: number) => (qty * rate) - discount;
// Formats number to string with 2 decimals for Django Decimal fields
const formatValue = (value: number) => (value || 0).toFixed(2); 

export default function AddInventoryItemPage() {
    const { toast } = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();
    const urlLogId = searchParams.get('logId');

    const [form, setForm] = useState<FormState>({
        product_name: "",
        hsn_at_entry: "",
        total_quantity: 0,
        total_discount_percent: 0,
        stock_for: "Sale",
        allocations: [],
        logLinkMode: urlLogId ? "id" : "name",
        inventory_log_id: urlLogId || "",
        log_name: "",
    });

    const [loading, setLoading] = useState(false);

    const totalAllocatedQty = useMemo(() => 
        form.allocations.reduce((sum, alloc) => sum + alloc.qty, 0)
    , [form.allocations]);

    // --- HANDLERS (UPDATED for NaN Fix) ---

    // Generic input handler for top-level fields
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        let processedValue: string | number = value;

        // Apply safe conversion to all numeric state fields (except log_id, which remains a string)
        if (type === "number" && name !== 'inventory_log_id') {
            processedValue = safeNumberConvert(value);
        }
        
        setForm(prev => ({
            ...prev,
            [name]: processedValue,
        }));
    };

    // Allocation Handlers
    const handleAddAllocation = () => {
        setForm(prev => ({
            ...prev,
            allocations: [...prev.allocations, { company_name: "", qty: 0, rate: 0, discount: 0 }]
        }));
    };

    const handleRemoveAllocation = (index: number) => {
        setForm(prev => ({
            ...prev,
            allocations: prev.allocations.filter((_, i) => i !== index)
        }));
    };

    // Receives raw string from input onChange and converts safely
    const handleAllocationChange = (index: number, field: keyof CompanyAllocation, value: string) => {
        setForm(prev => {
            const newAllocations = [...prev.allocations];
            
            let processedValue: string | number;
            
            if (field !== 'company_name') {
                // Use safe convert for all numeric fields
                processedValue = safeNumberConvert(value);
            } else {
                processedValue = value;
            }

            newAllocations[index] = {
                ...newAllocations[index],
                [field]: processedValue as any
            };
            return { ...prev, allocations: newAllocations };
        });
    };
    
    // Handler for Log Link Mode change
    const handleLogLinkModeChange = (mode: "id" | "name") => {
        setForm(prev => ({ 
            ...prev, 
            logLinkMode: mode,
            inventory_log_id: mode === "name" ? "" : (urlLogId || ""), 
            log_name: mode === "id" ? "" : prev.log_name,
        }));
    };

    // ---------------------------------------------------
    // Submission Logic
    // ---------------------------------------------------

    const handleSubmit = async () => {
        // 1. Basic Form Validation (Client-Side)
        if (!form.product_name || form.total_quantity <= 0) {
            toast({ title: "Error", description: "Please enter a Product Name and Total Quantity.", variant: "destructive" });
            return;
        }
        
        if (form.allocations.length === 0) {
            toast({ title: "Error", description: "Please add at least one Company Allocation.", variant: "destructive" });
            return;
        }

        // 2. Quantity Allocation Validation
        if (totalAllocatedQty !== form.total_quantity) {
             toast({ 
                 title: "Error", 
                 description: `Total allocated quantity (${totalAllocatedQty}) must equal Total Quantity (${form.total_quantity}).`, 
                 variant: "destructive" 
             });
            return;
        }

        let finalLogId: string | number; 
        setLoading(true);

        try {
            // 3. Handle Log Creation or Linking
            if (form.logLinkMode === "name") {
                if (!form.log_name) throw new Error("Log name is required to create a new log.");
                
                // API call to create log
                const logRes = await axios.post(`${API_BASE}/inventory-logs/`, { 
                    logName: form.log_name, // Assuming Django field is 'logName'
                    // Add other required fields (e.g., createdBy, status) as necessary
                });
                finalLogId = logRes.data.id; 
            } else { // logLinkMode === "id"
                if (!form.inventory_log_id) throw new Error("Log ID is required to link the entry.");
                finalLogId = form.inventory_log_id; 
            }
            
            // 4. Construct the Nested Payload (IStockEntryPayload)
            const payload: IStockEntryPayload = {
                product_name: form.product_name,
                hsn_at_entry: form.hsn_at_entry,
                total_quantity: form.total_quantity,
                // Send as string for Django Decimal field precision
                total_discount_percent: formatValue(form.total_discount_percent), 
                stock_for: form.stock_for,
                // Ensure log ID is a number if DRF expects it as a ForeignKey ID, though string is generally safer
                inventory_log: Number(finalLogId), 
                allocations: form.allocations.map(alloc => ({
                    company_name: alloc.company_name,
                    qty: alloc.qty,
                    // Send rate and discount as strings for precision
                    rate: formatValue(alloc.rate),      
                    discount: formatValue(alloc.discount), 
                })),
            };

            // 5. Submit to Django Stock Entry endpoint
            const apiPath = `${API_BASE}/stock-entries/add-to-log/${finalLogId}/`;
            
            await axios.post(apiPath, payload);

            toast({ title: "Success", description: `Stock Entry for ${form.product_name} added successfully!`, });
            
            router.push(`/dashboard/inventory/${finalLogId}`);

        } catch (err: any) {
            // 6. Error Handling
            const axiosErr = err as AxiosError<any>;
            
            let errorMsg = "Failed to add stock entry.";
            if (axiosErr.response?.data) {
                errorMsg = JSON.stringify(axiosErr.response.data);
            } else {
                errorMsg = axiosErr.message || err.message;
            }
            
            toast({ 
                title: "API Error", 
                description: `Error: ${errorMsg}`, 
                variant: "destructive" 
            });
        } finally {
            setLoading(false);
        }
    };

    // ---------------------------------------------------
    // Rendering (Uses renderNumValue for numeric inputs)
    // ---------------------------------------------------

    return (
        <div className="space-y-6 p-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-between border-b pb-4">
                <h1 className="text-3xl font-bold text-foreground">Add New Stock Entry</h1>
                <Button variant="outline" onClick={() => router.push(`/dashboard/inventory/${form.inventory_log_id || ''}`)}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>1. Product & Log Details</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                    
                    {/* Log Link/Creation Radio Group */}
                    <div className="col-span-2 flex items-center gap-4 p-2 bg-muted rounded-md">
                        <Label>Link by:</Label>
                        <div className="flex gap-4">
                            <label className="flex items-center space-x-2">
                                <Input
                                    type="radio"
                                    name="logLinkMode"
                                    value="name"
                                    checked={form.logLinkMode === "name"}
                                    onChange={() => handleLogLinkModeChange("name")}
                                    className="h-4 w-4"
                                />
                                <span>New Log Name</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <Input
                                    type="radio"
                                    name="logLinkMode"
                                    value="id"
                                    checked={form.logLinkMode === "id"}
                                    onChange={() => handleLogLinkModeChange("id")}
                                    className="h-4 w-4"
                                />
                                <span>Existing Log ID</span>
                            </label>
                        </div>
                    </div>

                    {/* Conditional Log Input */}
                    {form.logLinkMode === "name" ? (
                        <div className="col-span-2">
                            <Label htmlFor="log_name">New Log Name</Label>
                            <Input id="log_name" name="log_name" placeholder="E.g., Q3 2024 Inventory" value={form.log_name} onChange={handleInputChange} required />
                        </div>
                    ) : (
                        <div className="col-span-2">
                            <Label htmlFor="inventory_log_id">Existing Log ID</Label>
                            {/* Log ID state is intentionally a string here */}
                            <Input id="inventory_log_id" name="inventory_log_id" placeholder="Enter Log ID" value={form.inventory_log_id} onChange={handleInputChange} type="number" required />
                        </div>
                    )}

                    {/* Product Details */}
                    <div className="col-span-2">
                        <Label htmlFor="product_name">Product Name</Label>
                        <Input id="product_name" name="product_name" placeholder="Product Name" value={form.product_name} onChange={handleInputChange} required />
                    </div>
                    
                    <div>
                        <Label htmlFor="total_quantity">Total Quantity (Batch Size)</Label>
                        {/* FIX: Use renderNumValue */}
                        <Input 
                            id="total_quantity" 
                            name="total_quantity" 
                            type="number" 
                            placeholder="Total Quantity" 
                            value={renderNumValue(form.total_quantity)} 
                            onChange={handleInputChange} 
                            min="1" 
                            required 
                        />
                    </div>
                    
                    <div>
                        <Label htmlFor="hsn_at_entry">HSN Code</Label>
                        <Input id="hsn_at_entry" name="hsn_at_entry" placeholder="HSN" value={form.hsn_at_entry} onChange={handleInputChange} />
                    </div>
                    
                    <div>
                        <Label htmlFor="total_discount_percent">Total Discount % (Batch)</Label>
                        {/* FIX: Use renderNumValue */}
                        <Input 
                            id="total_discount_percent" 
                            name="total_discount_percent" 
                            type="number" 
                            placeholder="Total Discount % (0-100)" 
                            value={renderNumValue(form.total_discount_percent)} 
                            onChange={handleInputChange} 
                            min="0" 
                            max="100" 
                        />
                    </div>

                    <div>
                          <Label htmlFor="stock_for">Stock Purpose</Label>
                         <select id="stock_for" name="stock_for" value={form.stock_for} onChange={handleInputChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                             <option value="Sale">For Sale</option>
                             <option value="Self">Internal Use</option>
                             <option value="Other">Other</option>
                         </select>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>2. Company Allocations ({totalAllocatedQty} / {form.total_quantity} Qty Allocated)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {form.allocations.map((alloc, index) => (
                        <div key={index} className="border p-4 rounded-lg bg-secondary/10 grid grid-cols-12 gap-4 items-end">
                            <div className="col-span-3">
                                <Label htmlFor={`companyName-${index}`}>Company Name</Label>
                                <Input
                                    id={`companyName-${index}`}
                                    name="company_name"
                                    placeholder="Company Name"
                                    value={alloc.company_name}
                                    onChange={(e) => handleAllocationChange(index, 'company_name', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="col-span-2">
                                <Label htmlFor={`qty-${index}`}>Qty</Label>
                                {/* FIX: Use renderNumValue */}
                                <Input
                                    id={`qty-${index}`}
                                    name="qty"
                                    type="number"
                                    placeholder="Qty"
                                    value={renderNumValue(alloc.qty)}
                                    onChange={(e) => handleAllocationChange(index, 'qty', e.target.value)}
                                    min="1"
                                    required
                                />
                            </div>
                            <div className="col-span-3">
                                <Label htmlFor={`rate-${index}`}>Rate (per unit)</Label>
                                {/* FIX: Use renderNumValue */}
                                <Input
                                    id={`rate-${index}`}
                                    name="rate"
                                    type="number"
                                    placeholder="Rate"
                                    value={renderNumValue(alloc.rate)}
                                    onChange={(e) => handleAllocationChange(index, 'rate', e.target.value)}
                                    step="0.01"
                                    required
                                />
                            </div>
                            <div className="col-span-3">
                                <Label htmlFor={`discount-${index}`}>Discount (fixed)</Label>
                                {/* FIX: Use renderNumValue */}
                                <Input
                                    id={`discount-${index}`}
                                    name="discount"
                                    type="number"
                                    placeholder="Discount ($)"
                                    value={renderNumValue(alloc.discount)}
                                    onChange={(e) => handleAllocationChange(index, 'discount', e.target.value)}
                                    step="0.01"
                                />
                                <p className="text-xs text-muted-foreground mt-1">Net: ${formatValue(calculateAmount(alloc.qty, alloc.rate, alloc.discount))}</p>
                            </div>
                            <div className="col-span-1 flex justify-end">
                                <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveAllocation(index)}>
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                            </div>
                        </div>
                    ))}
                    <Button type="button" variant="outline" onClick={handleAddAllocation} className="w-full mt-2" disabled={form.total_quantity === 0}>
                        <Plus className="w-4 h-4 mr-2" /> Add Company Allocation
                    </Button>
                </CardContent>
            </Card>
            
            <div className="flex justify-end pt-4">
                <Button onClick={handleSubmit} disabled={loading || totalAllocatedQty !== form.total_quantity || form.total_quantity === 0 || (form.logLinkMode === 'id' && !form.inventory_log_id) || (form.logLinkMode === 'name' && !form.log_name)}>
                    {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Save Stock Entry"}
                </Button>
            </div>
        </div>
    );
}