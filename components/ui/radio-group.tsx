"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  InputHTMLAttributes,
} from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

type StockMode = "Shared" | "Separate";

type InventoryItem = {
  id?: number;
  productName: string;
  companyName?: string;
  isbn: string;
  hsn: string;
  qty?: number;
  rate?: number;
  discount?: number;
  amount?: number;
  sharedQty?: number;
  stockMode: StockMode;
};

type RadioGroupContextType = {
  value: StockMode;
  onChange: (val: StockMode) => void;
};

const RadioGroupContext = createContext<RadioGroupContextType | undefined>(undefined);

interface RadioGroupProps {
  value?: StockMode;
  defaultValue?: StockMode;
  onValueChange?: (val: StockMode) => void;
  children: ReactNode;
  className?: string;
  logId?: number;
  apiBase?: string;
  onAdd?: (item: InventoryItem) => void;
}

export function RadioGroup({
  value: controlledValue,
  defaultValue,
  onValueChange,
  children,
  className,
  logId,
  apiBase,
  onAdd,
}: RadioGroupProps) {
  const [internalValue, setInternalValue] = useState<StockMode>(defaultValue ?? "Separate");
  const value = controlledValue ?? internalValue;
  const { toast } = useToast();

  const handleChange = (val: StockMode) => {
    setInternalValue(val);
    onValueChange?.(val);
  };

  // Form state
  const [form, setForm] = useState<InventoryItem>({
    productName: "",
    companyName: "",
    isbn: "",
    hsn: "",
    qty: 0,
    rate: 0,
    discount: 0,
    amount: 0,
    sharedQty: 0,
    stockMode: value,
  });

  const handleFormChange = (field: keyof InventoryItem, val: string | number) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: val };
      if (field !== "stockMode") {
        updated.amount =
          (Number(updated.qty || 0) * Number(updated.rate || 0) -
            Number(updated.discount || 0)) || 0;
      }
      return updated;
    });
  };

  const handleAdd = async () => {
    if (!form.productName || !form.isbn) {
      toast({ title: "Error", description: "Product Name and ISBN are required." });
      return;
    }

    const payload: any = {
      log: Number(logId),
      product_name: form.productName,
      isbn: form.isbn,
      hsn: form.hsn,
      stock_mode: form.stockMode,
    };

    if (form.stockMode === "Separate") {
      if (!form.companyName || form.qty! <= 0) {
        toast({ title: "Error", description: "Company and Quantity required." });
        return;
      }
      payload.company_name = form.companyName;
      payload.qty = form.qty;
      payload.rate = form.rate;
      payload.discount = form.discount;
      payload.amount = form.amount;
    } else {
      payload.shared_qty = form.sharedQty;
    }

    try {
      const res = await axios.post(`${apiBase ?? "/api"}/inventory-items/`, payload);

      const addedItem: InventoryItem = {
        ...form,
        id: res.data.id,
      };

      toast({ title: "Success", description: "Item added successfully." });
      onAdd?.(addedItem);

      // Reset form
      setForm({
        productName: "",
        companyName: "",
        isbn: "",
        hsn: "",
        qty: 0,
        rate: 0,
        discount: 0,
        amount: 0,
        sharedQty: 0,
        stockMode: value,
      });
    } catch (err: any) {
      toast({ title: "Error", description: err?.response?.data?.detail || "Failed to add item.", variant: "destructive" });
    }
  };

  // Sync stockMode
  React.useEffect(() => {
    setForm((prev) => ({ ...prev, stockMode: value }));
  }, [value]);

  return (
    <RadioGroupContext.Provider value={{ value, onChange: handleChange }}>
      <div className={className}>
        {/* Radio Buttons */}
        {children}

        {/* Conditional Form */}
        <Card className="mt-4 p-4">
          <CardHeader>
            <CardTitle>Add New Item ({value})</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            {/* Always visible */}
            <Input
              placeholder="Product Name"
              value={form.productName}
              onChange={(e) => handleFormChange("productName", e.target.value)}
            />
            <Input
              placeholder="ISBN"
              value={form.isbn}
              onChange={(e) => handleFormChange("isbn", e.target.value)}
            />
            <Input
              placeholder="HSN"
              value={form.hsn}
              onChange={(e) => handleFormChange("hsn", e.target.value)}
            />

            {value === "Separate" ? (
              <>
                <Input
                  placeholder="Company Name"
                  value={form.companyName}
                  onChange={(e) => handleFormChange("companyName", e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Quantity"
                  value={form.qty}
                  onChange={(e) => handleFormChange("qty", Number(e.target.value))}
                />
                <Input
                  type="number"
                  placeholder="Rate"
                  value={form.rate}
                  onChange={(e) => handleFormChange("rate", Number(e.target.value))}
                />
                <Input
                  type="number"
                  placeholder="Discount"
                  value={form.discount}
                  onChange={(e) => handleFormChange("discount", Number(e.target.value))}
                />
                <Input type="number" placeholder="Amount" value={form.amount} readOnly />
              </>
            ) : (
              <Input
                type="number"
                placeholder="Shared Quantity"
                value={form.sharedQty}
                onChange={(e) => handleFormChange("sharedQty", Number(e.target.value))}
              />
            )}

            <div className="flex justify-end col-span-2 gap-2 mt-2">
              <Button variant="outline" onClick={handleAdd}>
                Add Item
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </RadioGroupContext.Provider>
  );
}

interface RadioGroupItemProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: StockMode;
  children: ReactNode;
  className?: string;
}

export function RadioGroupItem({ value, children, className, ...props }: RadioGroupItemProps) {
  const ctx = useContext(RadioGroupContext);
  if (!ctx) throw new Error("RadioGroupItem must be used inside a RadioGroup");

  const isSelected = ctx.value === value;

  return (
    <label className={`flex items-center gap-2 cursor-pointer ${className ?? ""}`}>
      <input
        type="radio"
        value={value}
        checked={isSelected}
        onChange={() => ctx.onChange(value)}
        className="hidden"
        {...props}
      />
      <span className={`w-4 h-4 rounded-full border ${isSelected ? "bg-blue-500 border-blue-600" : "bg-white border-gray-400"}`} />
      {children}
    </label>
  );
}
