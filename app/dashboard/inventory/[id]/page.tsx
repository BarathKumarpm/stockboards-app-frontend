"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import axios, { AxiosError } from "axios";
import { ArrowLeft, Plus, Loader2, MoreHorizontal, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

// --- TYPE DUMMIES ---
interface IAllocation { 
    id: number; 
    company: string; 
    qty: number; 
    rate: number; 
    discount: number; 
    amount: number; 
}
interface IProductStockEntry { 
    id: number; 
    product_name: string; // Top-level product name
    hsn_at_entry: string; 
    total_quantity: number; 
    product?: { available_stock: number; name: string }; 
    allocations: IAllocation[]; 
}
export interface TableRowData { 
    sNo: number; 
    itemId: number; 
    stockEntryId: number;
    product_name: string; 
    stock_type: 'Shared' | 'Normal (Unique)';
    company: string;
    qty_used: number; 
    stock_available: number; 
    rate_final: number; 
    discount_percent: number; 
    hsn_at_entry: string;
    total_amount: number; 
}
interface TallyGroupedData {
    companyName: string;
    tallyAccountName: string;
    totalItems: number;
    totalQuantityUsed: number;
    totalNetValue: number;
    entries: TableRowData[];
}
// --- END TYPE DUMMIES ---

// --- Helper Functions ---
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
const formatCurrency = (value: number | string | undefined) => `₹${(parseFloat(value as string) || 0).toFixed(2)}`;
const formatPercent = (value: number | string | undefined) => (parseFloat(value as string) || 0).toFixed(2) + '%';
// --- END Helper Functions ---


export default function InventoryLogDetail() {
    const params = useParams();
    const router = useRouter();
    
    const logId = (Array.isArray(params.id) ? params.id[0] : params.id)?.toString() || "";
    const { toast } = useToast();

    // Data States
    const [entries, setEntries] = useState<IProductStockEntry[]>([]);
    const [logName, setLogName] = useState(`Log ID: ${logId}`); 
    const [loading, setLoading] = useState(true);
    const [tallyImportLoading, setTallyImportLoading] = useState(false);
    
    // Filter States
    const [productFilter, setProductFilter] = useState<string>("");
    const [tallyCompanyFilter, setTallyCompanyFilter] = useState<string>(""); 
    
    // Tally State
    const [selectedTallyCompany, setSelectedTallyCompany] = useState<string>("");
    
    // State for custom column naming and selection
    const [tallyProductXmlKey, setTallyProductXmlKey] = useState("Product Name");
    const [selectedTallyColumns, setSelectedTallyColumns] = useState<string[]>([
        "product_name", 
        "qty_used", 
        "rate_final", 
        "discount_percent", 
        "total_amount"
    ]);

    // Metric States
    const [totalStockEntered, setTotalStockEntered] = useState(0);
    const [availableLeftoverStock, setAvailableLeftoverStock] = useState(0);
    const [totalStockUsed, setTotalStockUsed] = useState(0);
    const [uniqueCompaniesServed, setUniqueCompaniesServed] = useState(0);

    // --- Data Fetching ---
    const fetchLogDetails = useCallback(async () => {
        if (!logId) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE}/inventory-logs/${logId}/`);
            const logData = res.data;
            
            setLogName(logData.logName || logData.name || `Log ID: ${logId}`);
            
            if (Array.isArray(logData.stock_entries)) {
                const fetchedEntries = logData.stock_entries as IProductStockEntry[];
                setEntries(fetchedEntries);

                let totalStock = 0;
                let totalAllocated = 0;
                const companySet = new Set<string>();

                fetchedEntries.forEach(entry => {
                    totalStock += entry.total_quantity;
                    entry.allocations.forEach(alloc => {
                        if (alloc.company) {
                            companySet.add(alloc.company);
                        }
                        totalAllocated += alloc.qty;
                    });
                });

                setTotalStockEntered(totalStock);
                setTotalStockUsed(totalAllocated);
                setAvailableLeftoverStock(totalStock - totalAllocated);
                setUniqueCompaniesServed(companySet.size);

            } else {
                setEntries([]);
            }

        } catch (error) {
             const axiosErr = error as AxiosError<any>;
             const errorMsg = axiosErr.response?.data?.detail || axiosErr.message || "Could not fetch log details.";
             toast({ title: "API Error", description: errorMsg, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    }, [logId, toast]);

    useEffect(() => {
        fetchLogDetails();
    }, [fetchLogDetails]);

    // --- Data Transformation & Filtering for Main Table ---
    const filteredMainTableData: TableRowData[] = useMemo(() => {
        const transformedData: TableRowData[] = [];
        const lowerProductFilter = productFilter.toLowerCase().trim();
        const lowerCompanyFilter = tallyCompanyFilter.toLowerCase().trim();
        let sNo = 1;
        
        entries.forEach(entry => {
            const resolvedProductName = entry.product?.name || entry.product_name || `(Product ID: ${entry.id})`; 
            const productAvailableStock = entry.product?.available_stock ?? entry.total_quantity; 
            
            const matchesProduct = lowerProductFilter === '' || resolvedProductName.toLowerCase().includes(lowerProductFilter);

            entry.allocations.forEach((alloc) => {
                const matchesCompany = lowerCompanyFilter === '' || alloc.company.toLowerCase().includes(lowerCompanyFilter);

                if (matchesProduct && matchesCompany) {
                    const rateUsed = alloc.rate || 0;
                    const netAmount = alloc.amount || 0;
                    const grossAmount = alloc.qty * rateUsed;
                    
                    let discountPercent = 0;
                    if (grossAmount > 0) {
                        const totalDiscountAmount = grossAmount - netAmount; 
                        discountPercent = (totalDiscountAmount / grossAmount) * 100;
                    }

                    transformedData.push({
                        sNo: sNo++, 
                        itemId: alloc.id,
                        stockEntryId: entry.id,
                        product_name: resolvedProductName, 
                        stock_type: entry.allocations.length > 1 ? 'Shared' : 'Normal (Unique)', 
                        company: alloc.company,
                        qty_used: alloc.qty,
                        stock_available: productAvailableStock,
                        rate_final: rateUsed,
                        discount_percent: discountPercent,
                        hsn_at_entry: entry.hsn_at_entry,
                        total_amount: netAmount,
                    }); 
                }
            });
        });
        return transformedData;
    }, [entries, productFilter, tallyCompanyFilter]);

    // --- Data Grouping for Tally Sub-Table ---
    const groupedTallyData: TallyGroupedData[] = useMemo(() => {
        const grouped: { [key: string]: TallyGroupedData } = {};
        
        filteredMainTableData.forEach(item => {
             const companyKey = item.company.toLowerCase().trim();

            if (!grouped[companyKey]) {
                grouped[companyKey] = {
                    companyName: item.company,
                    tallyAccountName: item.company, 
                    totalItems: 0,
                    totalQuantityUsed: 0,
                    totalNetValue: 0,
                    entries: [],
                };
            }

            grouped[companyKey].totalItems += 1;
            grouped[companyKey].totalQuantityUsed += item.qty_used;
            grouped[companyKey].totalNetValue += item.total_amount;
            grouped[companyKey].entries.push(item);
        });

        return Object.values(grouped).sort((a, b) => a.companyName.localeCompare(b.companyName));
    }, [filteredMainTableData]);

    // --- Action Handlers ---
    const handleDeleteItem = async (itemId: number, productName: string, companyName: string) => {
        if (!window.confirm(`Are you sure you want to delete the allocation for '${productName}' for company '${companyName}'? This action is permanent.`)) return;

        try {
            await axios.delete(`${API_BASE}/inventory-items-audit/${itemId}/`); 
            toast({ title: "Deleted", description: `Item allocation for ${productName} removed.`, variant: "destructive" });
            fetchLogDetails(); 
        } catch (error) {
            const axiosErr = error as AxiosError<any>;
            const errorMsg = axiosErr.response?.data?.detail || axiosErr.message || "Failed to delete item.";
            toast({ title: "Error", description: errorMsg, variant: "destructive" });
        }
    };

    const handleImportToTally = async () => {
        if (!selectedTallyCompany) {
            toast({ title: "Import Failed", description: "Please select a Company/Tally Account to import to.", variant: "destructive" });
            return;
        }
        if (selectedTallyColumns.length === 0) {
             toast({ title: "Import Failed", description: "Please select at least one column to include in the Tally Invoice.", variant: "destructive" });
             return;
        }

        setTallyImportLoading(true);
        const companyDataToImport = groupedTallyData.find(d => d.tallyAccountName === selectedTallyCompany);

        if (!companyDataToImport) {
             toast({ title: "Import Failed", description: "Selected company data not found.", variant: "destructive" });
             setTallyImportLoading(false);
             return;
        }

        // --- TALLY XML/API PLACEHOLDER LOGIC ---
        try {
            const itemsPayload = companyDataToImport.entries.map(item => {
                const itemData: { [key: string]: any } = {};

                if (selectedTallyColumns.includes("product_name")) {
                    itemData[tallyProductXmlKey || 'Product Name'] = item.product_name;
                }
                if (selectedTallyColumns.includes("qty_used")) {
                    itemData['Quantity'] = item.qty_used;
                }
                if (selectedTallyColumns.includes("rate_final")) {
                    itemData['Rate'] = item.rate_final;
                }
                if (selectedTallyColumns.includes("discount_percent")) {
                    itemData['Discount_Percent'] = item.discount_percent;
                }
                if (selectedTallyColumns.includes("total_amount")) {
                    itemData['Amount'] = item.total_amount;
                }
                itemData['HSN'] = item.hsn_at_entry;

                return itemData;
            });

            const payload = {
                logId: logId,
                tallyAccount: selectedTallyCompany,
                tallyVoucherDate: new Date().toISOString().split('T')[0],
                items: itemsPayload
            };

            // Placeholder API call
            const res = await axios.post(`${API_BASE}/tally/import-inventory/`, payload);

            toast({
                title: "Tally Import Successful",
                description: `Successfully imported ${companyDataToImport.totalItems} transactions for ${selectedTallyCompany}.`,
                variant: "default"
            });
            
        } catch (error) {
            const axiosErr = error as AxiosError<any>;
            const errorMsg = axiosErr.response?.data?.detail || axiosErr.message || "Tally Import Failed. Check API connection.";
            toast({ title: "Tally Import Error", description: errorMsg, variant: "destructive" });
        } finally {
            setTallyImportLoading(false);
        }
    };
    
    // --- JSX Rendering ---
    if (loading) return <div className="flex justify-center items-center h-96"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    if (!logId) return <div className="p-8 text-center text-red-500">Error: Inventory Log ID not found in URL.</div>;

    return (
        <div className="space-y-6 p-8 max-w-7xl mx-auto">
            {/* Header and Log ID */}
            <div className="flex justify-between items-center border-b pb-4">
                <h1 className="text-3xl font-bold">Inventory Dashboard ({logName})</h1>
                <div className="flex gap-2">
                    <Link href="/dashboard/inventory">
                        <Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Logs</Button>
                    </Link>
                    <Link href={`/dashboard/inventory/add?logId=${logId}`}> 
                        <Button className="bg-black hover:bg-blue-600 text-white hover:text-white"><Plus className="w-4 h-4 mr-2" /> Add New Stock Entry</Button>
                    </Link>
                </div>
            </div>

            {/* --- 1. Search/Filter Controls --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="searchProduct">Search Product Name</Label>
                    <Input 
                        id="searchProduct"
                        placeholder="Enter Product Name to Filter"
                        value={productFilter}
                        onChange={(e) => setProductFilter(e.target.value)}
                    />
                </div>
            </div>

            {/* --- 2. Dashboard Metrics --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                <MetricCard 
                    title="Total Stock Entered (Batch Sum)" 
                    value={totalStockEntered.toLocaleString()} 
                />
                <MetricCard 
                    title="Available Leftover Stock" 
                    value={availableLeftoverStock.toLocaleString()} 
                />
                <MetricCard 
                    title="Total Stock Used (Allocated)" 
                    value={totalStockUsed.toLocaleString()} 
                />
                <MetricCard 
                    title="Unique Companies Served" 
                    value={uniqueCompaniesServed.toString()} 
                />
            </div>
            
            {/* --- 3. Main Log Entries Table (Whitespace Corrected) --- */}
            <div className="pt-2">
                <h3 className="text-xl font-semibold mb-4">Detailed Log Entries ({filteredMainTableData.length})</h3>
                
                <div className="overflow-x-auto border rounded-lg shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">S.No</TableHead>
                                <TableHead>Product Name</TableHead>
                                <TableHead>Stock Type</TableHead>
                                <TableHead>Company/Companies</TableHead>
                                <TableHead>Stock Used (Qty)</TableHead>
                                <TableHead>Stock Available</TableHead>
                                <TableHead>Rate/Unit (Final)</TableHead>
                                <TableHead>Discount %</TableHead>
                                <TableHead>HSN No</TableHead>
                                <TableHead>Total Amount</TableHead>
                                <TableHead className="text-center w-[50px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>{/* START FIX: Tight formatting for TBody children */}
                            {filteredMainTableData.map((item) => (
                                <TableRow key={item.itemId}>
                                    <TableCell>{item.sNo}</TableCell>
                                    <TableCell className="font-medium">{item.product_name}</TableCell>
                                    <TableCell>{item.stock_type}</TableCell>
                                    <TableCell>{item.company}</TableCell>
                                    <TableCell>{item.qty_used}</TableCell>
                                    <TableCell>{item.stock_available}</TableCell>
                                    <TableCell>{formatCurrency(item.rate_final)}</TableCell>
                                    <TableCell>{formatPercent(item.discount_percent)}</TableCell> 
                                    <TableCell>{item.hsn_at_entry}</TableCell>
                                    <TableCell className="font-semibold">{formatCurrency(item.total_amount)}</TableCell>
                                    <TableCell className="text-center">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="w-8 h-8 p-0"><MoreHorizontal className="w-4 h-4" /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem 
                                                    onClick={() => router.push(`/dashboard/inventory/${logId}/details/${item.itemId}`)}
                                                >View Details</DropdownMenuItem>
                                                <DropdownMenuItem 
                                                    onClick={() => router.push(`/dashboard/inventory/${logId}/update/${item.itemId}`)}
                                                >Update Entry</DropdownMenuItem>
                                                <DropdownMenuItem 
                                                    onClick={() => void handleDeleteItem(item.itemId, item.product_name, item.company)} 
                                                    className="flex items-center gap-2 text-red-600 focus:text-red-700"
                                                >Delete Entry</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredMainTableData.length === 0 && (
                                <TableRow><TableCell colSpan={11} className="text-center text-muted-foreground p-6">No entries match your current filters. Add a new stock entry or clear filters.</TableCell></TableRow>
                            )}
                        </TableBody>{/* END FIX: Tight formatting for TBody children */}
                    </Table>
                </div>
            </div>

            {/* --- 4. Tally Clubbing and Import Section --- */}
            <div className="pt-8 flex flex-col gap-4">
                <h3 className="text-xl font-semibold border-b pb-2">Tally Export</h3>
                
                {/* Company Filter */}
                <div className="w-full space-y-2">
                    <Label htmlFor="filterCompanyText" className="font-bold">Filter By Company Name (Club for Tally)</Label>
                    <Input 
                        id="filterCompanyText"
                        placeholder="Enter Company Name to Filter for Tally Export"
                        value={tallyCompanyFilter}
                        onChange={(e) => setTallyCompanyFilter(e.target.value)}
                    />
                </div>

                {/* Tally XML Field Customization Card */}
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-lg text-blue-700">Tally XML Field Customization</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="xmlProductKey" className="font-medium">
                                Custom Column Name for Product in Tally XML (e.g., Title/Author/Item Code)
                            </Label>
                            <Input 
                                id="xmlProductKey"
                                placeholder="e.g., Title, Author, ItemCode"
                                value={tallyProductXmlKey}
                                onChange={(e) => setTallyProductXmlKey(e.target.value)}
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label className="font-medium">Select Columns to Include in Tally XML Invoice</Label>
                            <div className="grid grid-cols-2 gap-3 p-3 border rounded-md">
                                {[
                                    { id: "product_name", name: "Product Name (Customizable)" },
                                    { id: "qty_used", name: "Quantity (Stock Used)" },
                                    { id: "rate_final", name: "Rate/Unit" },
                                    { id: "discount_percent", name: "Discount %" },
                                    { id: "total_amount", name: "Total Amount" },
                                ].map((col) => (
                                    <div key={col.id} className="flex items-center space-x-2">
                                        <Checkbox 
                                            id={`col-${col.id}`}
                                            checked={selectedTallyColumns.includes(col.id)}
                                            onCheckedChange={(checked) => {
                                                setSelectedTallyColumns((prev) => 
                                                    checked 
                                                        ? [...prev, col.id] 
                                                        : prev.filter(c => c !== col.id)
                                                );
                                            }}
                                        />
                                        <Label htmlFor={`col-${col.id}`} className="text-sm font-normal cursor-pointer">
                                            {col.name}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Tally Sub-Table (Whitespace Corrected) */}
                <Card className="shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">Filtered Company Accounts ({groupedTallyData.length})</CardTitle>
                        <Button 
                            onClick={handleImportToTally}
                            disabled={!selectedTallyCompany || tallyImportLoading || selectedTallyColumns.length === 0}
                            className="bg-green-600 hover:bg-green-700 text-white"
                        >
                            {tallyImportLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Download className="mr-2 h-4 w-4" />
                            )}
                            Import to Tally
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0 overflow-x-auto">
                         <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px] text-center">Select</TableHead>
                                    <TableHead>Filtered Company Name</TableHead>
                                    <TableHead>Linked Tally Account (Placeholder)</TableHead>
                                    <TableHead className="text-right">Total Quantity</TableHead>
                                    <TableHead className="text-right">Total Net Value</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>{/* START FIX: Tight formatting for TBody children */}
                                {groupedTallyData.length === 0 ? (
                                    <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground p-6">No company allocations match the filter.</TableCell></TableRow>
                                ) : (
                                    groupedTallyData.map((data) => (
                                        <TableRow key={data.companyName}>
                                            <TableCell className="text-center">
                                                <Checkbox
                                                    checked={selectedTallyCompany === data.tallyAccountName}
                                                    onCheckedChange={() => 
                                                        setSelectedTallyCompany(
                                                            selectedTallyCompany === data.tallyAccountName ? "" : data.tallyAccountName
                                                        )
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium">{data.companyName}</TableCell>
                                            <TableCell className="text-green-600 font-semibold">{data.tallyAccountName}</TableCell> 
                                            <TableCell className="text-right">{data.totalQuantityUsed.toLocaleString()}</TableCell>
                                            <TableCell className="text-right font-semibold">{formatCurrency(data.totalNetValue)}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>{/* END FIX: Tight formatting for TBody children */}
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

// --- Component for Dashboard Metric Cards ---
interface MetricCardProps {
    title: string;
    value: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value }) => (
    <Card className="shadow-lg bg-blue-300 border-blue-400 border-2 text-white"> 
        <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
                {title}
            </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{value}</div>
        </CardContent>
    </Card>
);