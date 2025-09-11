"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, MoreHorizontal, Eye, ArrowLeft, Package, TrendingUp, Receipt } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useParams } from "next/navigation"

// Mock log details data
const logDetailsData = {
  id: 1,
  logName: "Q4 2024 Inventory Count",
  createdDate: "2024-12-15",
  createdBy: "John Smith",
  status: "Active",
  description: "Quarterly inventory count for all warehouse items",
}

// Mock items in this log
const logItemsData = [
  {
    id: 1,
    name: "Laptop Model X",
    sku: "LPT-001",
    category: "Electronics",
    quantity: 50,
    price: 1200,
    supplier: "Tech Supplier Inc.",
    hsnCode: "8471",
    stockMode: "Shared",
    location: "Warehouse A-1",
  },
  {
    id: 2,
    name: "Office Chair",
    sku: "CHR-002",
    category: "Furniture",
    quantity: 100,
    price: 150,
    supplier: "Furniture Co.",
    hsnCode: "9401",
    stockMode: "Separate",
    location: "Warehouse B-2",
  },
  {
    id: 3,
    name: "Printer Model Y",
    sku: "PRT-003",
    category: "Electronics",
    quantity: 25,
    price: 300,
    supplier: "Tech Supplier Inc.",
    hsnCode: "8443",
    stockMode: "Shared",
    location: "Warehouse A-3",
  },
]

export default function InventoryLogDetailsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()
  const params = useParams()

  const filteredItems = logItemsData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStockModeBadge = (mode: string) => {
    return mode === "Shared" ? (
      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
        Shared
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-green-100 text-green-800">
        Separate
      </Badge>
    )
  }

  return (
    <div className="space-y-10 p-2">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-4">
          <Link href="/dashboard/inventory">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Logs
            </Button>
          </Link>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{logDetailsData.logName}</h1>
            <p className="text-muted-foreground">
              Created by {logDetailsData.createdBy} on {logDetailsData.createdDate}
            </p>
          </div>
          <Link href="/dashboard/inventory/add">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Log Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card className="bg-card/50 backdrop-blur-sm border-0">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold">{logItemsData.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-0">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">
                  ${logItemsData.reduce((sum, item) => sum + item.quantity * item.price, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-0">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Receipt className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {logDetailsData.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="bg-card/50 backdrop-blur-sm border-0">
          <CardContent className="p-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search items by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Items Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="bg-card/50 backdrop-blur-sm border-0">
          <CardHeader>
            <CardTitle>Items in this Log</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>HSN Code</TableHead>
                  <TableHead>Stock Mode</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.sku}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>${item.price}</TableCell>
                    <TableCell>{item.hsnCode}</TableCell>
                    <TableCell>{getStockModeBadge(item.stockMode)}</TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <TrendingUp className="mr-2 h-4 w-4" />
                            Add Movement
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Receipt className="mr-2 h-4 w-4" />
                            Generate Bill
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
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-sm text-muted-foreground"
      >
        Showing {filteredItems.length} of {logItemsData.length} items in this log
      </motion.div>
    </div>
  )
}
