"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, MoreHorizontal, Eye, Trash2, Copy, Filter, FileText } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

const inventoryLogsData = [
  {
    id: 1,
    logName: "Q4 2024 Inventory Count",
    createdDate: "2024-12-15",
    createdBy: "John Smith",
    status: "Active",
    itemCount: 45,
  },
  {
    id: 2,
    logName: "Monthly Stock Check - December",
    createdDate: "2024-12-01",
    createdBy: "Sarah Johnson",
    status: "Completed",
    itemCount: 32,
  },
  {
    id: 3,
    logName: "New Product Launch Inventory",
    createdDate: "2024-11-28",
    createdBy: "Mike Wilson",
    status: "Active",
    itemCount: 18,
  },
  {
    id: 4,
    logName: "Warehouse Audit - November",
    createdDate: "2024-11-15",
    createdBy: "Emily Davis",
    status: "Completed",
    itemCount: 67,
  },
  {
    id: 5,
    logName: "Emergency Stock Check",
    createdDate: "2024-11-10",
    createdBy: "John Smith",
    status: "Draft",
    itemCount: 12,
  },
]

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [createdByFilter, setCreatedByFilter] = useState("all")
  const { toast } = useToast()

  const filteredLogs = inventoryLogsData.filter((log) => {
    const matchesSearch = log.logName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || log.status === statusFilter
    const matchesCreatedBy = createdByFilter === "all" || log.createdBy === createdByFilter

    return matchesSearch && matchesStatus && matchesCreatedBy
  })

  const handleDelete = (id: number, name: string) => {
    toast({
      title: "Log Deleted",
      description: `${name} has been removed.`,
      variant: "destructive",
    })
  }

  const handleCopy = (log: any) => {
    navigator.clipboard.writeText(JSON.stringify(log, null, 2))
    toast({
      title: "Log Copied",
      description: "Log details copied to clipboard.",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Active
          </Badge>
        )
      case "Completed":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Completed
          </Badge>
        )
      case "Draft":
        return <Badge variant="outline">Draft</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-10 p-2">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">Inventory Logs</h1>
          <p className="text-muted-foreground">Manage your inventory log sessions and track stock counts</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create New Log
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="bg-card/50 backdrop-blur-sm border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                </SelectContent>
              </Select>
              <Select value={createdByFilter} onValueChange={setCreatedByFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Created By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="John Smith">John Smith</SelectItem>
                  <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                  <SelectItem value="Mike Wilson">Mike Wilson</SelectItem>
                  <SelectItem value="Emily Davis">Emily Davis</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("all")
                  setCreatedByFilter("all")
                }}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Inventory Logs Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="bg-card/50 backdrop-blur-sm border-0">
          <CardContent className="p-8">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Log Name</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Item Count</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">{log.logName}</TableCell>
                    <TableCell>{log.createdDate}</TableCell>
                    <TableCell>{log.createdBy}</TableCell>
                    <TableCell>{getStatusBadge(log.status)}</TableCell>
                    <TableCell>{log.itemCount} items</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/inventory/${log.id}`}>
                              <FileText className="mr-2 h-4 w-4" />
                              Open Log
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCopy(log)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Copy
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(log.id, log.logName)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
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

      {/* Results Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-sm text-muted-foreground"
      >
        Showing {filteredLogs.length} of {inventoryLogsData.length} logs
      </motion.div>
    </div>
  )
}
