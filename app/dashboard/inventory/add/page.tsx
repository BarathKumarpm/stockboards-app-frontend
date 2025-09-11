"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Save, Package } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function AddInventoryPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    quantity: "",
    price: "",
    supplier: "",
    sku: "",
    location: "",
    hsnCode: "",
    stockMode: "",
    initialSharedQuantity: "",
  })

  const [companyStocks, setCompanyStocks] = useState([
    { company: "Company A", quantity: "" },
    { company: "Company B", quantity: "" },
    { company: "Company C", quantity: "" },
  ])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    toast({
      title: "Item Added Successfully",
      description: `${formData.name} has been added to your inventory.`,
    })
    router.push("/dashboard/inventory")
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleCompanyStockChange = (index: number, quantity: string) => {
    setCompanyStocks((prev) => prev.map((stock, i) => (i === index ? { ...stock, quantity } : stock)))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-4"
      >
        <Link href="/dashboard/inventory">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Inventory
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Add New Item</h1>
          <p className="text-muted-foreground">Add a new item to your inventory</p>
        </div>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="bg-card/50 backdrop-blur-sm border-0 max-w-4xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Item Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Item Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter item name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU *</Label>
                  <Input
                    id="sku"
                    placeholder="Enter SKU"
                    value={formData.sku}
                    onChange={(e) => handleInputChange("sku", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter item description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Furniture">Furniture</SelectItem>
                      <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                      <SelectItem value="Equipment">Equipment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Storage Location</Label>
                  <Input
                    id="location"
                    placeholder="Enter storage location"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Initial Quantity *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="Enter quantity"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange("quantity", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Purchase Price</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="Enter price"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supplier">Supplier</Label>
                  <Input
                    id="supplier"
                    placeholder="Enter supplier name"
                    value={formData.supplier}
                    onChange={(e) => handleInputChange("supplier", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hsnCode">HSN Code *</Label>
                  <Input
                    id="hsnCode"
                    placeholder="Enter HSN code"
                    value={formData.hsnCode}
                    onChange={(e) => handleInputChange("hsnCode", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="stockMode">Stock Mode *</Label>
                  <Select value={formData.stockMode} onValueChange={(value) => handleInputChange("stockMode", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select stock mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Shared">Shared</SelectItem>
                      <SelectItem value="Separate">Separate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.stockMode === "Shared" && (
                  <div className="space-y-2">
                    <Label htmlFor="initialSharedQuantity">Initial Shared Quantity</Label>
                    <Input
                      id="initialSharedQuantity"
                      type="number"
                      placeholder="Enter shared quantity"
                      value={formData.initialSharedQuantity}
                      onChange={(e) => handleInputChange("initialSharedQuantity", e.target.value)}
                    />
                  </div>
                )}

                {formData.stockMode === "Separate" && (
                  <div className="space-y-2">
                    <Label>Initial Stock per Company</Label>
                    <Card className="p-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Company</TableHead>
                            <TableHead>Initial Quantity</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {companyStocks.map((stock, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{stock.company}</TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  placeholder="Enter quantity"
                                  value={stock.quantity}
                                  onChange={(e) => handleCompanyStockChange(index, e.target.value)}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Card>
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-1">
                  <Save className="w-4 h-4 mr-2" />
                  Save Item
                </Button>
                <Link href="/dashboard/inventory">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
