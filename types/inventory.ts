// src/types/inventory.ts

// --- 1. Top-Level Log Container (from /api/inventory-logs/) ---
export type InventoryLog = {
    id: number;
    logName: string;
    createdDate: string;
    createdBy: string;
    status: 'Draft' | 'Active' | 'Completed' | string;
    itemCount: number;
    path: string; 
};

// --- 2. Log Creation Payload (for POST /api/inventory-logs/) ---
export type NewLogPayload = {
    logName: string;
    createdBy: string;
    status: 'Draft' | 'Active' | 'Completed' | string;
};

// --- 3. Product Entry (Batch/Stock Entry - nested inside the log) ---
export interface IProductStockEntry {
    id: number;
    product_name: string;
    hsn_at_entry: string;
    total_quantity: number; // The full batch quantity
    stock_for: string;
    allocations: IInventoryItem[]; // Array of allocated items
    // Django often provides available_stock directly on the product model
    product?: {
        available_stock: number; 
    }
}

// --- 4. Inventory Item (Allocation - the line item) ---
export interface IInventoryItem {
    id: number;
    company: string;
    qty: number;
    rate: number;          // Rate per unit (final rate after discount, or base rate)
    discount: number;      // Fixed discount amount ($)
    amount: number;        // Net total amount (qty * rate - discount)
}

// --- 5. Aggregated Table Row Data (for easy filtering/display in the dashboard) ---
export type TableRowData = IInventoryItem & {
    stockEntryId: number;
    product_name: string;
    hsn_at_entry: string;
    stock_type: 'Shared' | 'Normal (Unique)';
    available_stock_left: number;
    discount_percent: number;
    base_rate_used: number; 
};

// --- 6. Form Payload for New Item Entry (for POST /api/stock-entries/add-to-log/{id}/) ---
export interface IAllocationPayload {
    company_name: string;
    qty: number;
    rate: string;          // Send as string to maintain precision/decimal format
    discount: string;      // Send as string (fixed amount)
}

export interface IStockEntryPayload {
    product_name: string;
    hsn_at_entry: string;
    total_quantity: number;
    total_discount_percent: string; // Django expects this even if it's 0.00 (string)
    stock_for: string;
    allocations: IAllocationPayload[];
    // Correct type for the Foreign Key field: a number ID or a string ID
    inventory_log: number | string; 
}