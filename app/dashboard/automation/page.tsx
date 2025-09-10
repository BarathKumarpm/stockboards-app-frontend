"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit, Plus, Mail, LinkIcon, Zap } from "lucide-react"

export default function AutomationPage() {
  const [emailAutomation, setEmailAutomation] = useState(false)
  const [linkIntegration, setLinkIntegration] = useState(false)
  const [dataParsing, setDataParsing] = useState(true)
  const [lowStockNotify, setLowStockNotify] = useState(true)
  const [deliveryNotify, setDeliveryNotify] = useState(false)
  const [emailInput, setEmailInput] = useState("")
  const [linkInput, setLinkInput] = useState("")

  // Sample data for tables
  const emailAccounts = [
    { email: "orders@company.com", status: "Active" },
    { email: "invoices@supplier.com", status: "Inactive" },
  ]

  const links = [
    { url: "https://api.supplier.com/webhook", type: "Webhook", status: "Active" },
    { url: "https://tracking.fedex.com/api", type: "Tracking", status: "Active" },
  ]

  return (
    <div className="space-y-10 p-2">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-foreground">Automation Settings</h1>
        <p className="text-xl text-muted-foreground">Configure automated data entry from multiple sources.</p>
      </div>

      {/* Email Integration */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card>
          <CardHeader className="p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Mail className="w-6 h-6 text-primary" />
                <div>
                  <CardTitle className="text-2xl">Email Integration</CardTitle>
                  <CardDescription className="text-base mt-2">
                    Automatically extract order and invoice data from emails.
                  </CardDescription>
                </div>
              </div>
              <Switch checked={emailAutomation} onCheckedChange={setEmailAutomation} className="scale-125" />
            </div>
          </CardHeader>
          <CardContent className="p-8 pt-0 space-y-6">
            <div className="flex space-x-4">
              <div className="flex-1">
                <Label htmlFor="email-input" className="text-base">
                  Email Address
                </Label>
                <Input
                  id="email-input"
                  placeholder="Enter email address"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="mt-2"
                  disabled={!emailAutomation}
                />
              </div>
              <div className="flex items-end">
                <Button disabled={!emailAutomation} className="flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Add Email Account</span>
                </Button>
              </div>
            </div>

            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email Address</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {emailAccounts.map((account, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{account.email}</TableCell>
                      <TableCell>
                        <Badge variant={account.status === "Active" ? "default" : "secondary"}>{account.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Link/Webhook Integration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardHeader className="p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <LinkIcon className="w-6 h-6 text-primary" />
                <div>
                  <CardTitle className="text-2xl">Link / Webhook Integration</CardTitle>
                  <CardDescription className="text-base mt-2">
                    Provide webhook URLs or order tracking links for auto-import.
                  </CardDescription>
                </div>
              </div>
              <Switch checked={linkIntegration} onCheckedChange={setLinkIntegration} className="scale-125" />
            </div>
          </CardHeader>
          <CardContent className="p-8 pt-0 space-y-6">
            <div className="flex space-x-4">
              <div className="flex-1">
                <Label htmlFor="link-input" className="text-base">
                  Link or Webhook URL
                </Label>
                <Input
                  id="link-input"
                  placeholder="Enter link or webhook URL"
                  value={linkInput}
                  onChange={(e) => setLinkInput(e.target.value)}
                  className="mt-2"
                  disabled={!linkIntegration}
                />
              </div>
              <div className="flex items-end">
                <Button disabled={!linkIntegration} className="flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Add Link</span>
                </Button>
              </div>
            </div>

            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Link/URL</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {links.map((link, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium max-w-xs truncate">{link.url}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{link.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={link.status === "Active" ? "default" : "secondary"}>{link.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Data Parsing & Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader className="p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Zap className="w-6 h-6 text-primary" />
                <div>
                  <CardTitle className="text-2xl">Data Parsing & Notifications</CardTitle>
                  <CardDescription className="text-base mt-2">
                    Automatically parse vendor, item, quantity, and price from incoming data.
                  </CardDescription>
                </div>
              </div>
              <Switch checked={dataParsing} onCheckedChange={setDataParsing} className="scale-125" />
            </div>
          </CardHeader>
          <CardContent className="p-8 pt-0 space-y-8">
            {/* Preview Pane */}
            <div>
              <Label className="text-base font-medium">Preview Parsed Data</Label>
              <div className="mt-3 p-6 bg-muted/50 rounded-lg border-2 border-dashed border-muted-foreground/20">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Vendor</p>
                    <p className="font-medium">Acme Supplies</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Item</p>
                    <p className="font-medium">Product A</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Quantity</p>
                    <p className="font-medium">50</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p className="font-medium">$500</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Status</p>
                    <div className="flex space-x-2 mt-1">
                      <Badge>Received</Badge>
                      <Badge variant="destructive">Unpaid</Badge>
                      <Badge variant="secondary">Shipped</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div>
              <Label className="text-base font-medium">Notification Settings</Label>
              <div className="mt-4 space-y-4">
                <div className="flex items-center space-x-3">
                  <Checkbox id="low-stock" checked={lowStockNotify} onCheckedChange={setLowStockNotify} />
                  <Label htmlFor="low-stock" className="text-base">
                    Notify me on Low Stock Alerts
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox id="deliveries" checked={deliveryNotify} onCheckedChange={setDeliveryNotify} />
                  <Label htmlFor="deliveries" className="text-base">
                    Notify me on Order Deliveries
                  </Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex justify-end space-x-4 pb-8"
      >
        <Button variant="outline" size="lg">
          Cancel
        </Button>
        <Button size="lg">Save Changes</Button>
      </motion.div>
    </div>
  )
}
