"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"

type InventoryLog = {
  id: number
  logName: string
}

export default function AddInventoryItem() {
  const router = useRouter()
  const { toast } = useToast()
  const [logs, setLogs] = useState<InventoryLog[]>([])
  const [loading, setLoading] = useState(true)

  const [newItem, setNewItem] = useState({
    logId: 0,
    company: "",
    product: "",
    qty: 0,
    rate: 0,
    amount: 0,
    hsn: "",
  })

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api"

  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await axios.get(`${API_BASE}/logs/`)
        setLogs(res.data)
      } catch (error) {
        toast({ title: "Error", description: "Could not fetch logs.", variant: "destructive" })
      } finally {
        setLoading(false)
      }
    }
    fetchLogs()
  }, [])

  const handleAddItem = async () => {
    if (!newItem.logId || !newItem.company || !newItem.product || newItem.qty <= 0) {
      toast({ title: "Error", description: "Please fill all required fields." })
      return
    }

    try {
      const payload = {
        log: newItem.logId,
        company: newItem.company,
        product: newItem.product,
        qty: newItem.qty,
        rate: newItem.rate,
        amount: newItem.amount,
        hsn: newItem.hsn,
      }
      await axios.post(`${API_BASE}/items/`, payload)
      toast({ title: "Item Added", description: "Inventory item added successfully." })
      router.push(`/dashboard/inventory/${newItem.logId}`) // redirect to log detail page
    } catch (error) {
      toast({ title: "Error", description: "Could not add item.", variant: "destructive" })
    }
  }

  if (loading) return <p className="p-4">Loading logs...</p>

  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
      <Card className="p-4">
        <CardHeader><CardTitle>Add Inventory Item</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Select value={newItem.logId.toString()} onValueChange={(val) => setNewItem({ ...newItem, logId: Number(val) })}>
            <SelectTrigger><SelectValue placeholder="Select Inventory Log" /></SelectTrigger>
            <SelectContent>
              {logs.map((log) => (
                <SelectItem key={log.id} value={log.id.toString()}>{log.logName}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input placeholder="Company" value={newItem.company} onChange={(e) => setNewItem({ ...newItem, company: e.target.value })} />
          <Input placeholder="Product" value={newItem.product} onChange={(e) => setNewItem({ ...newItem, product: e.target.value })} />
          <Input type="number" placeholder="Qty" value={newItem.qty} onChange={(e) => setNewItem({ ...newItem, qty: Number(e.target.value) })} />
          <Input type="number" placeholder="Rate" value={newItem.rate} onChange={(e) => setNewItem({ ...newItem, rate: Number(e.target.value) })} />
          <Input type="number" placeholder="Amount" value={newItem.amount} onChange={(e) => setNewItem({ ...newItem, amount: Number(e.target.value) })} />
          <Input placeholder="HSN" value={newItem.hsn} onChange={(e) => setNewItem({ ...newItem, hsn: e.target.value })} />

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
            <Button onClick={handleAddItem}>Add Item</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
