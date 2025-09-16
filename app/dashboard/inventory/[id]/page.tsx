"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Trash2, Plus, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"
import Link from "next/link"

type InventoryLog = {
  id: number
  logName: string
}

type InventoryItem = {
  id: number
  company: string
  product: string
  qty: number
  rate: number
  amount: number
  hsn?: string
}

export default function InventoryLogDetail() {
  const { id } = useParams()  // log id
  const [items, setItems] = useState<InventoryItem[]>([])
  const [logs, setLogs] = useState<InventoryLog[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [newItem, setNewItem] = useState({ company: "", product: "", qty: 0, rate: 0, amount: 0, hsn: "" })
  const { toast } = useToast()

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api"

  // Fetch items for this log
  useEffect(() => {
    async function fetchItems() {
      try {
        const res = await axios.get(`${API_BASE}/logs/${id}/items/`)
        setItems(res.data)
      } catch (error) {
        console.error("Error fetching items:", error)
        toast({ title: "Error", description: "Could not fetch items.", variant: "destructive" })
      } finally {
        setLoading(false)
      }
    }
    fetchItems()
  }, [id])

  const handleAddItem = async () => {
    if (!newItem.company || !newItem.product || newItem.qty <= 0) {
      toast({ title: "Error", description: "Fill all required fields." })
      return
    }
    try {
      const payload = { ...newItem, log: Number(id) }
      const res = await axios.post(`${API_BASE}/items/`, payload)
      setItems((prev) => [...prev, res.data])
      setShowAdd(false)
      setNewItem({ company: "", product: "", qty: 0, rate: 0, amount: 0, hsn: "" })
      toast({ title: "Item Added", description: "Inventory item added to log." })
    } catch (error) {
      console.error("Add item error:", error)
      toast({ title: "Error", description: "Could not add item.", variant: "destructive" })
    }
  }

  const handleDeleteItem = async (itemId: number) => {
    try {
      await axios.delete(`${API_BASE}/items/${itemId}/`)
      setItems((prev) => prev.filter((i) => i.id !== itemId))
      toast({ title: "Deleted", description: "Item removed.", variant: "destructive" })
    } catch (error) {
      toast({ title: "Error", description: "Could not delete item.", variant: "destructive" })
    }
  }

  if (loading) return <p className="p-4">Loading items...</p>

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center gap-4">
          <Link href="/dashboard/inventory">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Logs
            </Button>
          </Link>
    </div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Inventory Items for Log #{id}</h1>
        <Button onClick={() => setShowAdd(!showAdd)}><Plus className="w-4 h-4 mr-2" />Add Item</Button>
      </div>

      {showAdd && (
        <Card className="p-4">
          <CardHeader><CardTitle>Add New Item</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <Input placeholder="Company" value={newItem.company} onChange={(e) => setNewItem({ ...newItem, company: e.target.value })} />
            <Input placeholder="Product" value={newItem.product} onChange={(e) => setNewItem({ ...newItem, product: e.target.value })} />
            <Input type="number" placeholder="Qty" value={newItem.qty} onChange={(e) => setNewItem({ ...newItem, qty: Number(e.target.value) })} />
            <Input type="number" placeholder="Rate" value={newItem.rate} onChange={(e) => setNewItem({ ...newItem, rate: Number(e.target.value) })} />
            <Input type="number" placeholder="Amount" value={newItem.amount} onChange={(e) => setNewItem({ ...newItem, amount: Number(e.target.value) })} />
            <Input placeholder="HSN" value={newItem.hsn} onChange={(e) => setNewItem({ ...newItem, hsn: e.target.value })} />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
              <Button onClick={handleAddItem}>Add</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle>Items</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>HSN</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.company}</TableCell>
                  <TableCell>{item.product}</TableCell>
                  <TableCell>{item.qty}</TableCell>
                  <TableCell>{item.rate}</TableCell>
                  <TableCell>{item.amount}</TableCell>
                  <TableCell>{item.hsn || "-"}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="w-8 h-8 p-0"><Trash2 className="w-4 h-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleDeleteItem(item.id)}>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
