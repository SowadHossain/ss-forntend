import React from "react"  
import { useState } from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Label } from "../components/ui/label"
import { Switch } from "../components/ui/switch"
import { Progress } from "../components/ui/progress"
import {
  Users,
  DollarSign,
  TrendingUp,
  Eye,
  Check,
  X,
  MessageSquare,
  Settings,
  BarChart3,
  Activity,
  Shield,
  Ban,
  UserCheck,
  Star,
  ShoppingCart,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Filter,
  Search,
  Download,
  RefreshCw,
  Bell,
  Zap,
  User,
} from "lucide-react"

// Mock Data
const mockProducts = [
  {
    id: 1,
    name: "Gaming Laptop Pro Max 🎮",
    seller: "TechZone",
    sellerRating: 4.8,
    sellerSales: "10k+",
    price: 1299.99,
    category: "Electronics",
    status: "pending",
    submittedAt: "2024-01-15",
    image: "/placeholder.svg?height=80&width=80",
    description:
      "High-performance gaming laptop with RTX 4080, 32GB RAM, and 1TB SSD. Perfect for gaming and content creation.",
    specifications: {
      processor: "Intel i9-13900H",
      graphics: "RTX 4080 16GB",
      ram: "32GB DDR5",
      storage: "1TB NVMe SSD",
      display: '17.3" 4K 144Hz',
    },
  },
  {
    id: 2,
    name: "Wireless Earbuds Elite ✨",
    seller: "AudioMax",
    sellerRating: 4.6,
    sellerSales: "8.5k+",
    price: 89.99,
    category: "Electronics",
    status: "pending",
    submittedAt: "2024-01-14",
    image: "/placeholder.svg?height=80&width=80",
    description: "Premium wireless earbuds with active noise cancellation and 30-hour battery life.",
    specifications: {
      battery: "30 hours total",
      connectivity: "Bluetooth 5.3",
      features: "ANC, Transparency Mode",
      waterproof: "IPX7",
      drivers: "12mm Dynamic",
    },
  },
]

const mockTickets = [
  {
    id: "TK-001",
    user: "John Doe",
    userEmail: "john@example.com",
    userPhone: "+1 234 567 8900",
    issueType: "Order Issue",
    priority: "high",
    status: "open",
    subject: "Order not delivered",
    description: "My order #12345 was supposed to arrive yesterday but I haven't received it yet.",
    createdAt: "2024-01-15 10:30",
    orderId: "ORD-12345",
    orderStatus: "shipped",
    trackingNumber: "TRK123456789",
    shippingAddress: "123 Main St, New York, NY 10001",
  },
  {
    id: "TK-002",
    user: "Jane Smith",
    userEmail: "jane@example.com",
    userPhone: "+1 234 567 8901",
    issueType: "Product Quality",
    priority: "medium",
    status: "in-progress",
    subject: "Defective product received",
    description: "The laptop I received has a cracked screen and won't turn on.",
    createdAt: "2024-01-14 15:45",
    orderId: "ORD-12346",
    orderStatus: "delivered",
    trackingNumber: "TRK123456790",
    shippingAddress: "456 Oak Ave, Los Angeles, CA 90210",
  },
]

const mockUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "buyer",
    status: "active",
    joinDate: "2023-06-15",
    totalOrders: 23,
    totalSpent: 2450.5,
    avatar: "/placeholder.svg?height=40&width=40",
    lastActive: "2024-01-15",
    tickets: 2,
    phone: "+1 234 567 8900",
    address: "123 Main St, New York, NY 10001",
  },
  {
    id: 2,
    name: "TechZone Store",
    email: "contact@techzone.com",
    role: "seller",
    status: "active",
    joinDate: "2023-03-20",
    totalOrders: 156,
    totalSpent: 45600.0,
    avatar: "/placeholder.svg?height=40&width=40",
    lastActive: "2024-01-15",
    tickets: 1,
    phone: "+1 234 567 8901",
    address: "789 Business Blvd, San Francisco, CA 94105",
  },
]

const mockAnalytics = {
  totalRevenue: 125000,
  revenueGrowth: 12.5,
  totalOrders: 1250,
  ordersGrowth: 8.3,
  activeUsers: 5420,
  usersGrowth: 15.2,
  conversionRate: 3.4,
  conversionGrowth: -2.1,
  productStats: {
    approved: 1240,
    pending: 45,
    rejected: 23,
  },
}

export default function AdminDashboard() {
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [products, setProducts] = useState(mockProducts)
  const [tickets, setTickets] = useState(mockTickets)
  const [users, setUsers] = useState(mockUsers)
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    newRegistrations: true,
    autoApproval: false,
    emailNotifications: true,
    smsNotifications: false,
  })

  const handleProductAction = (productId: number, action: "approve" | "reject") => {
    setProducts(
      products.map((p) => (p.id === productId ? { ...p, status: action === "approve" ? "approved" : "rejected" } : p)),
    )
  }

  const handleTicketStatusUpdate = (ticketId: string, newStatus: string) => {
    setTickets(tickets.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t)))
  }

  const handleUserStatusToggle = (userId: number) => {
    setUsers(users.map((u) => (u.id === userId ? { ...u, status: u.status === "active" ? "banned" : "active" } : u)))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "approved":
        return "bg-green-100 text-green-800 border-green-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      case "open":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "in-progress":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "closed":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "banned":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Admin Panel 🛡️
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600">
                <Bell className="w-5 h-5" />
                <Badge className="ml-1 bg-red-500 text-white">3</Badge>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-200 text-gray-700 hover:bg-gray-50 bg-transparent"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white border border-gray-200">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
              📊 Overview
            </TabsTrigger>
            <TabsTrigger value="products" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
              📦 Products
            </TabsTrigger>
            <TabsTrigger value="tickets" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
              🎧 Support
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
              👥 Users
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
              ⚙️ Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-gray-200 bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Revenue 💰</p>
                      <p className="text-2xl font-bold text-gray-900">${mockAnalytics.totalRevenue.toLocaleString()}</p>
                      <p className="text-xs text-green-600 flex items-center mt-1">
                        <TrendingUp className="w-3 h-3 mr-1" />+{mockAnalytics.revenueGrowth}% from last month
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Orders 📦</p>
                      <p className="text-2xl font-bold text-gray-900">{mockAnalytics.totalOrders.toLocaleString()}</p>
                      <p className="text-xs text-green-600 flex items-center mt-1">
                        <TrendingUp className="w-3 h-3 mr-1" />+{mockAnalytics.ordersGrowth}% from last month
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                      <ShoppingCart className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Users 👥</p>
                      <p className="text-2xl font-bold text-gray-900">{mockAnalytics.activeUsers.toLocaleString()}</p>
                      <p className="text-xs text-green-600 flex items-center mt-1">
                        <TrendingUp className="w-3 h-3 mr-1" />+{mockAnalytics.usersGrowth}% from last month
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Conversion Rate 📈</p>
                      <p className="text-2xl font-bold text-gray-900">{mockAnalytics.conversionRate}%</p>
                      <p className="text-xs text-red-600 flex items-center mt-1">
                        <TrendingUp className="w-3 h-3 mr-1 rotate-180" />
                        {mockAnalytics.conversionGrowth}% from last month
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts and Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-gray-200 bg-white">
                <CardHeader>
                  <CardTitle className="text-gray-800">Product Status Overview 📊</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Approved Products</span>
                      <span className="font-semibold text-green-600">{mockAnalytics.productStats.approved}</span>
                    </div>
                    <Progress value={85} className="h-2" />

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Pending Review</span>
                      <span className="font-semibold text-yellow-600">{mockAnalytics.productStats.pending}</span>
                    </div>
                    <Progress value={15} className="h-2" />

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Rejected</span>
                      <span className="font-semibold text-red-600">{mockAnalytics.productStats.rejected}</span>
                    </div>
                    <Progress value={5} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 bg-white">
                <CardHeader>
                  <CardTitle className="text-gray-800">Recent Activity 🔔</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800">Product approved: Gaming Laptop Pro Max</p>
                        <p className="text-xs text-gray-500">2 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800">New support ticket from John Doe</p>
                        <p className="text-xs text-gray-500">5 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800">New seller registration: AudioMax</p>
                        <p className="text-xs text-gray-500">10 minutes ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Product Review Queue 📦</h2>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-200 text-gray-700 hover:bg-gray-50 bg-transparent"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-200 text-gray-700 hover:bg-gray-50 bg-transparent"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            <Card className="border-gray-200 bg-white">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-200">
                      <TableHead className="text-gray-700">Product</TableHead>
                      <TableHead className="text-gray-700">Seller</TableHead>
                      <TableHead className="text-gray-700">Price</TableHead>
                      <TableHead className="text-gray-700">Category</TableHead>
                      <TableHead className="text-gray-700">Status</TableHead>
                      <TableHead className="text-gray-700">Submitted</TableHead>
                      <TableHead className="text-gray-700">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id} className="border-gray-200">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <img
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                            />
                            <div>
                              <p className="font-medium text-gray-800">{product.name}</p>
                              <p className="text-sm text-gray-500">ID: {product.id}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-gray-800">{product.seller}</p>
                            <div className="flex items-center text-sm text-gray-500">
                              <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                              {product.sellerRating} • {product.sellerSales} sales
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium text-gray-800">${product.price}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                            {product.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(product.status)}>{product.status}</Badge>
                        </TableCell>
                        <TableCell className="text-gray-600">{product.submittedAt}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedProduct(product)}
                                  className="text-gray-600 hover:text-blue-600"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl bg-white">
                                <DialogHeader>
                                  <DialogTitle className="text-gray-800">
                                    Product Review: {selectedProduct?.name}
                                  </DialogTitle>
                                  <DialogDescription className="text-gray-600">
                                    Review product details and make approval decision
                                  </DialogDescription>
                                </DialogHeader>
                                {selectedProduct && (
                                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div>
                                      <img
                                        src={selectedProduct.image || "/placeholder.svg"}
                                        alt={selectedProduct.name}
                                        className="w-full h-64 object-cover rounded-lg border border-gray-200 mb-4"
                                      />
                                      <div className="space-y-3">
                                        <div>
                                          <Label className="text-gray-700">Product Name</Label>
                                          <p className="text-gray-800 font-medium">{selectedProduct.name}</p>
                                        </div>
                                        <div>
                                          <Label className="text-gray-700">Description</Label>
                                          <p className="text-gray-600 text-sm">{selectedProduct.description}</p>
                                        </div>
                                        <div>
                                          <Label className="text-gray-700">Price</Label>
                                          <p className="text-gray-800 font-bold text-lg">${selectedProduct.price}</p>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="space-y-4">
                                      <div>
                                        <Label className="text-gray-700">Seller Information</Label>
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                          <p className="font-medium text-gray-800">{selectedProduct.seller}</p>
                                          <div className="flex items-center text-sm text-gray-600 mt-1">
                                            <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                                            {selectedProduct.sellerRating} rating • {selectedProduct.sellerSales} total
                                            sales
                                          </div>
                                        </div>
                                      </div>
                                      <div>
                                        <Label className="text-gray-700">Specifications</Label>
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-2">
                                          {Object.entries(selectedProduct.specifications).map(([key, value]) => (
                                            <div key={key} className="flex justify-between">
                                              <span className="text-gray-600 capitalize">{key}:</span>
                                              <span className="text-gray-800 font-medium"></span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                      <div className="flex space-x-3 pt-4">
                                        <Button
                                          onClick={() => handleProductAction(selectedProduct.id, "approve")}
                                          className="flex-1 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white"
                                        >
                                          <Check className="w-4 h-4 mr-2" />
                                          Approve ✅
                                        </Button>
                                        <Button
                                          onClick={() => handleProductAction(selectedProduct.id, "reject")}
                                          variant="destructive"
                                          className="flex-1"
                                        >
                                          <X className="w-4 h-4 mr-2" />
                                          Reject ❌
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            {product.status === "pending" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleProductAction(product.id, "approve")}
                                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                >
                                  <Check className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleProductAction(product.id, "reject")}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Support Tickets Tab */}
          <TabsContent value="tickets" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Support Ticket Manager 🎧</h2>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-200 text-gray-700 hover:bg-gray-50 bg-transparent"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-200 text-gray-700 hover:bg-gray-50 bg-transparent"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>

            <Card className="border-gray-200 bg-white">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-200">
                      <TableHead className="text-gray-700">Ticket ID</TableHead>
                      <TableHead className="text-gray-700">User</TableHead>
                      <TableHead className="text-gray-700">Issue Type</TableHead>
                      <TableHead className="text-gray-700">Priority</TableHead>
                      <TableHead className="text-gray-700">Status</TableHead>
                      <TableHead className="text-gray-700">Created</TableHead>
                      <TableHead className="text-gray-700">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tickets.map((ticket) => (
                      <TableRow key={ticket.id} className="border-gray-200">
                        <TableCell className="font-mono text-sm text-gray-800">{ticket.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-gray-800">{ticket.user}</p>
                            <p className="text-sm text-gray-500">{ticket.userEmail}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                            {ticket.issueType}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge>
                        </TableCell>
                        <TableCell className="text-gray-600">{ticket.createdAt}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedTicket(ticket)}
                                  className="text-gray-600 hover:text-blue-600"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl bg-white">
                                <DialogHeader>
                                  <DialogTitle className="text-gray-800">
                                    Support Ticket: {selectedTicket?.id}
                                  </DialogTitle>
                                  <DialogDescription className="text-gray-600">
                                    Manage support ticket and related order details
                                  </DialogDescription>
                                </DialogHeader>
                                {selectedTicket && (
                                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                      <div>
                                        <Label className="text-gray-700">Customer Information</Label>
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-2">
                                          <div className="flex items-center space-x-2">
                                            <User className="w-4 h-4 text-gray-500" />
                                            <span className="text-gray-800">{selectedTicket.user}</span>
                                          </div>
                                          <div className="flex items-center space-x-2">
                                            <Mail className="w-4 h-4 text-gray-500" />
                                            <span className="text-gray-600">{selectedTicket.userEmail}</span>
                                          </div>
                                          <div className="flex items-center space-x-2">
                                            <Phone className="w-4 h-4 text-gray-500" />
                                            <span className="text-gray-600">{selectedTicket.userPhone}</span>
                                          </div>
                                        </div>
                                      </div>
                                      <div>
                                        <Label className="text-gray-700">Issue Details</Label>
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-2">
                                          <p className="font-medium text-gray-800">{selectedTicket.subject}</p>
                                          <p className="text-gray-600 text-sm">{selectedTicket.description}</p>
                                          <div className="flex items-center space-x-4 pt-2">
                                            <Badge className={getPriorityColor(selectedTicket.priority)}>
                                              {selectedTicket.priority} priority
                                            </Badge>
                                            <Badge className={getStatusColor(selectedTicket.status)}>
                                              {selectedTicket.status}
                                            </Badge>
                                          </div>
                                        </div>
                                      </div>
                                      <div>
                                        <Label className="text-gray-700">Update Status</Label>
                                        <Select
                                          value={selectedTicket.status}
                                          onValueChange={(value) => handleTicketStatusUpdate(selectedTicket.id, value)}
                                        >
                                          <SelectTrigger className="bg-white border-gray-200">
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent className="bg-white">
                                            <SelectItem value="open">Open</SelectItem>
                                            <SelectItem value="in-progress">In Progress</SelectItem>
                                            <SelectItem value="closed">Closed</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                    <div className="space-y-4">
                                      <div>
                                        <Label className="text-gray-700">Related Order Details</Label>
                                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 space-y-3">
                                          <div className="flex justify-between">
                                            <span className="text-gray-600">Order ID:</span>
                                            <span className="font-mono text-gray-800">{selectedTicket.orderId}</span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-gray-600">Status:</span>
                                            <Badge className={getStatusColor(selectedTicket.orderStatus)}>
                                              {selectedTicket.orderStatus}
                                            </Badge>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-gray-600">Tracking:</span>
                                            <span className="font-mono text-gray-800">
                                              {selectedTicket.trackingNumber}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                      <div>
                                        <Label className="text-gray-700">Shipping Address</Label>
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                          <div className="flex items-start space-x-2">
                                            <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                                            <span className="text-gray-600">{selectedTicket.shippingAddress}</span>
                                          </div>
                                        </div>
                                      </div>
                                      <div>
                                        <Label className="text-gray-700">Update Order Status</Label>
                                        <Select defaultValue={selectedTicket.orderStatus}>
                                          <SelectTrigger className="bg-white border-gray-200">
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent className="bg-white">
                                            <SelectItem value="processing">Processing</SelectItem>
                                            <SelectItem value="shipped">Shipped</SelectItem>
                                            <SelectItem value="delivered">Delivered</SelectItem>
                                            <SelectItem value="cancelled">Cancelled</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div>
                                        <Label className="text-gray-700">Update Tracking Number</Label>
                                        <Input
                                          defaultValue={selectedTicket.trackingNumber}
                                          className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            <Select
                              value={ticket.status}
                              onValueChange={(value) => handleTicketStatusUpdate(ticket.id, value)}
                            >
                              <SelectTrigger className="w-32 bg-white border-gray-200">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-white">
                                <SelectItem value="open">Open</SelectItem>
                                <SelectItem value="in-progress">In Progress</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">User Management 👥</h2>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search users..."
                    className="pl-10 w-64 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-200 text-gray-700 hover:bg-gray-50 bg-transparent"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            <Card className="border-gray-200 bg-white">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-200">
                      <TableHead className="text-gray-700">User</TableHead>
                      <TableHead className="text-gray-700">Role</TableHead>
                      <TableHead className="text-gray-700">Status</TableHead>
                      <TableHead className="text-gray-700">Join Date</TableHead>
                      <TableHead className="text-gray-700">Orders</TableHead>
                      <TableHead className="text-gray-700">Total Spent</TableHead>
                      <TableHead className="text-gray-700">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id} className="border-gray-200">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <img
                              src={user.avatar || "/placeholder.svg"}
                              alt={user.name}
                              className="w-10 h-10 rounded-full border border-gray-200"
                            />
                            <div>
                              <p className="font-medium text-gray-800">{user.name}</p>
                              <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={
                              user.role === "seller" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                            }
                          >
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                        </TableCell>
                        <TableCell className="text-gray-600">{user.joinDate}</TableCell>
                        <TableCell className="text-gray-800">{user.totalOrders}</TableCell>
                        <TableCell className="font-medium text-gray-800">${user.totalSpent.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedUser(user)}
                                  className="text-gray-600 hover:text-blue-600"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl bg-white">
                                <DialogHeader>
                                  <DialogTitle className="text-gray-800">
                                    User Details: {selectedUser?.name}
                                  </DialogTitle>
                                  <DialogDescription className="text-gray-600">
                                    View and manage user information
                                  </DialogDescription>
                                </DialogHeader>
                                {selectedUser && (
                                  <div className="space-y-6">
                                    <div className="flex items-center space-x-4">
                                      <img
                                        src={selectedUser.avatar || "/placeholder.svg"}
                                        alt={selectedUser.name}
                                        className="w-16 h-16 rounded-full border border-gray-200"
                                      />
                                      <div>
                                        <h3 className="text-lg font-semibold text-gray-800">{selectedUser.name}</h3>
                                        <p className="text-gray-600">{selectedUser.email}</p>
                                        <div className="flex items-center space-x-2 mt-1">
                                          <Badge className={getStatusColor(selectedUser.status)}>
                                            {selectedUser.status}
                                          </Badge>
                                          <Badge
                                            variant="secondary"
                                            className={
                                              selectedUser.role === "seller"
                                                ? "bg-green-100 text-green-800"
                                                : "bg-blue-100 text-blue-800"
                                            }
                                          >
                                            {selectedUser.role}
                                          </Badge>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-3">
                                        <div>
                                          <Label className="text-gray-700">Contact Information</Label>
                                          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-2">
                                            <div className="flex items-center space-x-2">
                                              <Phone className="w-4 h-4 text-gray-500" />
                                              <span className="text-gray-600">{selectedUser.phone}</span>
                                            </div>
                                            <div className="flex items-start space-x-2">
                                              <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                                              <span className="text-gray-600">{selectedUser.address}</span>
                                            </div>
                                          </div>
                                        </div>
                                        <div>
                                          <Label className="text-gray-700">Account Details</Label>
                                          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-2">
                                            <div className="flex items-center space-x-2">
                                              <Calendar className="w-4 h-4 text-gray-500" />
                                              <span className="text-gray-600">Joined: {selectedUser.joinDate}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                              <Clock className="w-4 h-4 text-gray-500" />
                                              <span className="text-gray-600">
                                                Last active: {selectedUser.lastActive}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="space-y-3">
                                        <div>
                                          <Label className="text-gray-700">Activity Summary</Label>
                                          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-2">
                                            <div className="flex justify-between">
                                              <span className="text-gray-600">Total Orders:</span>
                                              <span className="font-medium text-gray-800">
                                                {selectedUser.totalOrders}
                                              </span>
                                            </div>
                                            <div className="flex justify-between">
                                              <span className="text-gray-600">Total Spent:</span>
                                              <span className="font-medium text-gray-800">
                                                ${selectedUser.totalSpent.toLocaleString()}
                                              </span>
                                            </div>
                                            <div className="flex justify-between">
                                              <span className="text-gray-600">Support Tickets:</span>
                                              <span className="font-medium text-gray-800">{selectedUser.tickets}</span>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="pt-2">
                                          <Button
                                            onClick={() => handleUserStatusToggle(selectedUser.id)}
                                            variant={selectedUser.status === "active" ? "destructive" : "default"}
                                            className="w-full"
                                          >
                                            {selectedUser.status === "active" ? (
                                              <>
                                                <Ban className="w-4 h-4 mr-2" />
                                                Ban User 🚫
                                              </>
                                            ) : (
                                              <>
                                                <UserCheck className="w-4 h-4 mr-2" />
                                                Unban User ✅
                                              </>
                                            )}
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleUserStatusToggle(user.id)}
                              className={
                                user.status === "active"
                                  ? "text-red-600 hover:text-red-700 hover:bg-red-50"
                                  : "text-green-600 hover:text-green-700 hover:bg-green-50"
                              }
                            >
                              {user.status === "active" ? (
                                <Ban className="w-4 h-4" />
                              ) : (
                                <UserCheck className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Platform Settings ⚙️</h2>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                <Shield className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-gray-200 bg-white">
                <CardHeader>
                  <CardTitle className="text-gray-800">System Controls 🔧</CardTitle>
                  <CardDescription className="text-gray-600">Manage core platform functionality</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-gray-700">Maintenance Mode</Label>
                      <p className="text-sm text-gray-500">Temporarily disable site access</p>
                    </div>
                    <Switch
                      checked={settings.maintenanceMode}
                      onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-gray-700">New User Registrations</Label>
                      <p className="text-sm text-gray-500">Allow new users to sign up</p>
                    </div>
                    <Switch
                      checked={settings.newRegistrations}
                      onCheckedChange={(checked) => setSettings({ ...settings, newRegistrations: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-gray-700">Auto Product Approval</Label>
                      <p className="text-sm text-gray-500">Automatically approve products from trusted sellers</p>
                    </div>
                    <Switch
                      checked={settings.autoApproval}
                      onCheckedChange={(checked) => setSettings({ ...settings, autoApproval: checked })}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 bg-white">
                <CardHeader>
                  <CardTitle className="text-gray-800">Notification Settings 🔔</CardTitle>
                  <CardDescription className="text-gray-600">Configure admin alert preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-gray-700">Email Notifications</Label>
                      <p className="text-sm text-gray-500">Receive alerts via email</p>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-gray-700">SMS Notifications</Label>
                      <p className="text-sm text-gray-500">Receive urgent alerts via SMS</p>
                    </div>
                    <Switch
                      checked={settings.smsNotifications}
                      onCheckedChange={(checked) => setSettings({ ...settings, smsNotifications: checked })}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 bg-white">
                <CardHeader>
                  <CardTitle className="text-gray-800">Security Settings 🔒</CardTitle>
                  <CardDescription className="text-gray-600">Manage admin account security</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-gray-700">Change Password</Label>
                    <Input
                      type="password"
                      placeholder="New password"
                      className="mt-1 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700">Confirm Password</Label>
                    <Input
                      type="password"
                      placeholder="Confirm new password"
                      className="mt-1 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <Button
                    variant="outline"
                    className="w-full border-gray-200 text-gray-700 hover:bg-gray-50 bg-transparent"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Enable Two-Factor Authentication
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-gray-200 bg-white">
                <CardHeader>
                  <CardTitle className="text-gray-800">Activity Logs 📋</CardTitle>
                  <CardDescription className="text-gray-600">Recent admin actions and system events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800">Product approved: Gaming Laptop Pro Max</p>
                        <p className="text-xs text-gray-500">2 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800">Support ticket updated: TK-001</p>
                        <p className="text-xs text-gray-500">5 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800">User banned: spammer@example.com</p>
                        <p className="text-xs text-gray-500">10 minutes ago</p>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-4 border-gray-200 text-gray-700 hover:bg-gray-50 bg-transparent"
                  >
                    <Activity className="w-4 h-4 mr-2" />
                    View Full Activity Log
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
