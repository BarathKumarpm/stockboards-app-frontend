"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, MoreHorizontal, Eye, Trash2, Copy, Filter } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"

type InventoryLog = {
  id: number
  logName: string
  createdDate: string
  createdBy: string
  status: string
  itemCount: number
}

export default function InventoryPage() {
  const [logs, setLogs] = useState<InventoryLog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [createdByFilter, setCreatedByFilter] = useState("all")
  const { toast } = useToast()

  // Modal state
  const [showModal, setShowModal] = useState(false)
  const [creating, setCreating] = useState(false)
  const [newLog, setNewLog] = useState({
    logName: "",
    createdBy: "",
    status: "Draft",
    itemCount: 0,
  })

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api"

  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await axios.get(`${API_BASE}/logs/`)
        // map backend fields to frontend-friendly names
        const mapped = res.data.map((log: any) => ({
          id: log.id,
          logName: log.name || "Untitled",
          createdBy: log.created_by || "Unknown",
          status: log.status || "Draft",
          createdDate: log.created_at || "",
          itemCount: log.itemCount || 0,
        }))
        setLogs(mapped)
      } catch (error) {
        console.error("Error fetching inventory logs:", error)
        toast({ title: "Error", description: "Could not fetch logs.", variant: "destructive" })
      } finally {
        setLoading(false)
      }
    }
    fetchLogs()
  }, [])

  // Filter logs safely
  const filteredLogs = logs.filter((log) => {
    const logName = log.logName || ""
    const status = log.status || ""
    const createdBy = log.createdBy || ""

    const matchesSearch = logName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || status === statusFilter
    const matchesCreatedBy = createdByFilter === "all" || createdBy === createdByFilter

    return matchesSearch && matchesStatus && matchesCreatedBy
  })

  // Create log handler
  const handleCreate = async () => {
    if (!newLog.logName || !newLog.createdBy) {
      toast({ title: "Error", description: "Please fill required fields." })
      return
    }
    try {
      setCreating(true)
      const payload = {
        name: newLog.logName,
        created_by: newLog.createdBy,
        status: newLog.status,
      }
      const res = await axios.post(`${API_BASE}/logs/`, payload)
      const createdLog = {
        id: res.data.id,
        logName: res.data.name,
        createdBy: res.data.created_by,
        status: res.data.status,
        createdDate: res.data.created_at,
        itemCount: res.data.itemCount || 0,
      }
      setLogs((prev) => [...prev, createdLog])
      setShowModal(false)
      setNewLog({ logName: "", createdBy: "", status: "Draft", itemCount: 0 })
      toast({ title: "Log Created", description: "New inventory log has been created." })
    } catch (error) {
      console.error("Create log error:", error)
      toast({ title: "Error", description: "Could not create log.", variant: "destructive" })
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (id: number, name: string) => {
    try {
      await axios.delete(`${API_BASE}/logs/${id}/`)
      setLogs((prev) => prev.filter((log) => log.id !== id))
      toast({ title: "Log Deleted", description: `${name} removed.`, variant: "destructive" })
    } catch (error) {
      toast({ title: "Error", description: "Could not delete log.", variant: "destructive" })
    }
  }

  const handleCopy = (log: any) => {
    navigator.clipboard.writeText(JSON.stringify(log, null, 2))
    toast({ title: "Log Copied", description: "Log details copied to clipboard." })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Active</Badge>
      case "Completed":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Completed</Badge>
      case "Draft":
        return <Badge variant="outline">Draft</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) return <p className="p-4">Loading logs...</p>

  return (
    <div className="space-y-10 p-2">
      {/* Header and create log modal */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Inventory Logs</h1>
          <p className="text-muted-foreground">Manage your inventory log sessions and track stock counts</p>
        </div>
        <div>
          <Button onClick={() => setShowModal(true)}><Plus className="w-4 h-4 mr-2" />Create New Log</Button>
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-card p-6 rounded-lg w-96 space-y-4">
                <h2 className="text-lg font-bold">Create New Inventory Log</h2>
                <Input placeholder="Log Name" value={newLog.logName} onChange={(e) => setNewLog({ ...newLog, logName: e.target.value })} />
                <Input placeholder="Created By" value={newLog.createdBy} onChange={(e) => setNewLog({ ...newLog, createdBy: e.target.value })} />
                <Select value={newLog.status} onValueChange={(val) => setNewLog({ ...newLog, status: val })}>
                  <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                  <Button onClick={handleCreate} disabled={creating}>{creating ? "Creating..." : "Create"}</Button>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        <Card className="bg-card/50 backdrop-blur-sm border-0">
          <CardHeader><CardTitle className="flex items-center gap-2"><Filter className="w-5 h-5" />Filters</CardTitle></CardHeader>
          <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input placeholder="Search logs..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
              </SelectContent>
            </Select>
            <Select value={createdByFilter} onValueChange={setCreatedByFilter}>
              <SelectTrigger><SelectValue placeholder="Created By" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                {Array.from(new Set(logs.map((log) => log.createdBy))).map((user, idx) => (
                  <SelectItem key={`${user}-${idx}`} value={user}>
                    {user || "Unknown"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </motion.div>

      {/* Logs Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
        <Card>
          <CardHeader><CardTitle>Logs</CardTitle></CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Log Name</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{log.logName}</TableCell>
                    <TableCell>{log.itemCount}</TableCell>
                    <TableCell>{getStatusBadge(log.status)}</TableCell>
                    <TableCell>{log.createdBy}</TableCell>
                    <TableCell>{log.createdDate}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="w-8 h-8 p-0"><MoreHorizontal className="w-4 h-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem><Link href={`/dashboard/inventory/${log.id}`} className="flex items-center gap-2"><Eye className="w-4 h-4" />View</Link></DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCopy(log)} className="flex items-center gap-2"><Copy className="w-4 h-4" />Copy</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(log.id, log.logName)} className="flex items-center gap-2"><Trash2 className="w-4 h-4" />Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
