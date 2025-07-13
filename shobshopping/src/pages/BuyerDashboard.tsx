import React from "react"
import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Package,
  Heart,
  Star,
  Eye,
  MessageSquare,
  Bell,
  CreditCard,
  Truck,
  ShoppingBag,
  Filter,
  Download,
  Plus,
  Edit,
  Trash2,
  Zap,
} from "lucide-react"

// Mock Data
const mockOrders = [
  {
    id: "ORD-001",
    date: "2024-01-15",
    status: "delivered",
    total: 299.99,
    items: 2,
    seller: "TechZone",
    products: [
      { name: "Gaming Mouse Pro", price: 79.99, image: "/placeholder.svg?height=60&width=60" },
      { name: "Mechanical Keyboard", price: 220.0, image: "/placeholder.svg?height=60&width=60" },
    ],
    tracking: "TRK123456789",
    estimatedDelivery: "2024-01-20",
  },
  {
    id: "ORD-002",
    date: "2024-01-12",
    status: "shipped",
    total: 89.99,
    items: 1,
    seller: "AudioMax",
    products: [{ name: "Wireless Earbuds Elite", price: 89.99, image: "/placeholder.svg?height=60&width=60" }],
    tracking: "TRK987654321",
    estimatedDelivery: "2024-01-18",
  },
  {
    id: "ORD-003",
    date: "2024-01-10",
    status: "processing",
    total: 1299.99,
    items: 1,
    seller: "TechZone",
    products: [{ name: "Gaming Laptop Pro Max", price: 1299.99, image: "/placeholder.svg?height=60&width=60" }],
    tracking: "TRK456789123",
    estimatedDelivery: "2024-01-25",
  },
]

const mockWishlist = [
  {
    id: 1,
    name: "4K Webcam Ultra HD 📹",
    price: 149.99,
    originalPrice: 199.99,
    image: "/placeholder.svg?height=150&width=150",
    rating: 4.7,
    reviews: 67,
    seller: "StreamGear",
    inStock: true,
  },
  {
    id: 2,
    name: "Smart Watch Series X 📱",
    price: 299.99,
    originalPrice: 399.99,
    image: "/placeholder.svg?height=150&width=150",
    rating: 4.9,
    reviews: 89,
    seller: "WearTech",
    inStock: false,
  },
]

const mockTickets = [
  {
    id: "TK-001",
    subject: "Order not delivered",
    status: "open",
    priority: "high",
    createdAt: "2024-01-15",
    lastUpdate: "2024-01-15",
    orderId: "ORD-001",
  },
  {
    id: "TK-002",
    subject: "Product quality issue",
    status: "resolved",
    priority: "medium",
    createdAt: "2024-01-10",
    lastUpdate: "2024-01-12",
    orderId: "ORD-002",
  },
]

export default function BuyerDashboard() {
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("orders")
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 234 567 8900",
    address: "123 Main St, New York, NY 10001",
    avatar: "/placeholder.svg?height=100&width=100",
  })
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: false,
    newsletter: true,
    sms: false,
  })
  const [newTicket, setNewTicket] = useState({
    subject: "",
    orderId: "",
    issueType: "",
    description: "",
    priority: "medium",
  })
  const [showTicketForm, setShowTicketForm] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200"
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "processing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      case "open":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200"
      case "closed":
        return "bg-gray-100 text-gray-800 border-gray-200"
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

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("New ticket:", newTicket)
    setShowTicketForm(false)
    setNewTicket({ subject: "", orderId: "", issueType: "", description: "", priority: "medium" })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
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
                  My Dashboard 🛍️
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600">
                <Bell className="w-5 h-5" />
                <Badge className="ml-1 bg-red-500 text-white">2</Badge>
              </Button>
              <Avatar>
                <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.name} />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                  {profile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome back, {profile.name}! 👋</h1>
          <p className="text-gray-600">Manage your orders, wishlist, and account settings</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-gray-200 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders 📦</p>
                  <p className="text-2xl font-bold text-gray-900">{mockOrders.length}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Wishlist Items 💝</p>
                  <p className="text-2xl font-bold text-gray-900">{mockWishlist.length}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-red-500 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Support Tickets 🎧</p>
                  <p className="text-2xl font-bold text-gray-900">{mockTickets.length}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Spent 💰</p>
                  <p className="text-2xl font-bold text-gray-900">$1,689</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white border border-gray-200">
            <TabsTrigger value="orders" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
              📦 My Orders
            </TabsTrigger>
            <TabsTrigger value="wishlist" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
              💝 Wishlist
            </TabsTrigger>
            <TabsTrigger value="support" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
              🎧 Support
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
              👤 Profile
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
              ⚙️ Settings
            </TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">My Orders 📦</h2>
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

            <div className="space-y-4">
              {mockOrders.map((order) => (
                <Card key={order.id} className="border-gray-200 bg-white hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-semibold text-gray-800">Order {order.id}</p>
                          <p className="text-sm text-gray-500">Placed on {order.date}</p>
                        </div>
                        <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-800">${order.total}</p>
                        <p className="text-sm text-gray-500">{order.items} item(s)</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex -space-x-2">
                          {order.products.slice(0, 3).map((product, index) => (
                            <img
                              key={index}
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              className="w-10 h-10 rounded-full border-2 border-white object-cover"
                            />
                          ))}
                          {order.products.length > 3 && (
                            <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
                              +{order.products.length - 3}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Sold by {order.seller}</p>
                          {order.status === "shipped" && (
                            <p className="text-sm text-blue-600">Tracking: {order.tracking}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedOrder(order)}
                              className="border-gray-200 text-gray-700 hover:bg-gray-50"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl bg-white">
                            <DialogHeader>
                              <DialogTitle className="text-gray-800">Order Details: {selectedOrder?.id}</DialogTitle>
                              <DialogDescription className="text-gray-600">
                                Complete information about your order
                              </DialogDescription>
                            </DialogHeader>
                            {selectedOrder && (
                              <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                                  <div>
                                    <p className="font-semibold text-gray-800">Order Status</p>
                                    <Badge className={getStatusColor(selectedOrder.status)}>
                                      {selectedOrder.status}
                                    </Badge>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm text-gray-600">Total Amount</p>
                                    <p className="text-xl font-bold text-gray-800">${selectedOrder.total}</p>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-semibold text-gray-800 mb-3">Order Items</h4>
                                  <div className="space-y-3">
                                    {selectedOrder.products.map((product: any, index: number) => (
                                      <div
                                        key={index}
                                        className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg border border-gray-200"
                                      >
                                        <img
                                          src={product.image || "/placeholder.svg"}
                                          alt={product.name}
                                          className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                                        />
                                        <div className="flex-1">
                                          <p className="font-medium text-gray-800">{product.name}</p>
                                          <p className="text-sm text-gray-600">Sold by {selectedOrder.seller}</p>
                                        </div>
                                        <p className="font-bold text-gray-800">${product.price}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {selectedOrder.status === "shipped" && (
                                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <div className="flex items-center space-x-2 mb-2">
                                      <Truck className="w-5 h-5 text-blue-600" />
                                      <p className="font-semibold text-blue-800">Shipping Information</p>
                                    </div>
                                    <p className="text-sm text-blue-700">Tracking Number: {selectedOrder.tracking}</p>
                                    <p className="text-sm text-blue-700">
                                      Estimated Delivery: {selectedOrder.estimatedDelivery}
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        {order.status === "delivered" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-200 text-gray-700 hover:bg-gray-50 bg-transparent"
                          >
                            <Star className="w-4 h-4 mr-2" />
                            Review
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Wishlist Tab */}
          <TabsContent value="wishlist" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">My Wishlist 💝</h2>
              <p className="text-gray-600">{mockWishlist.length} items saved</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockWishlist.map((item) => (
                <Card key={item.id} className="border-gray-200 bg-white hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="relative">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white text-red-500 hover:text-red-600"
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </Button>
                      {!item.inStock && (
                        <div className="absolute inset-0 bg-black/50 rounded-t-lg flex items-center justify-center">
                          <Badge className="bg-red-500 text-white">Out of Stock</Badge>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{item.name}</h3>
                      <div className="flex items-center mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(item.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500 ml-2">({item.reviews})</span>
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <span className="text-lg font-bold text-gray-800">${item.price}</span>
                          <span className="text-sm text-gray-500 line-through ml-2">${item.originalPrice}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                          {item.seller}
                        </Badge>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                          disabled={!item.inStock}
                        >
                          <ShoppingBag className="w-4 h-4 mr-2" />
                          {item.inStock ? "Add to Cart" : "Notify Me"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-200 text-gray-700 hover:bg-gray-50 bg-transparent"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Support Tab */}
          <TabsContent value="support" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Support Center 🎧</h2>
              <Button
                onClick={() => setShowTicketForm(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Ticket
              </Button>
            </div>

            {showTicketForm && (
              <Card className="border-gray-200 bg-white">
                <CardHeader>
                  <CardTitle className="text-gray-800">Submit Support Ticket 📝</CardTitle>
                  <CardDescription className="text-gray-600">
                    Describe your issue and we'll help you resolve it quickly
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleTicketSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-700">Subject *</Label>
                        <Input
                          value={newTicket.subject}
                          onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                          placeholder="Brief description of your issue"
                          className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <Label className="text-gray-700">Related Order (Optional)</Label>
                        <Select
                          value={newTicket.orderId}
                          onValueChange={(value) => setNewTicket({ ...newTicket, orderId: value })}
                        >
                          <SelectTrigger className="bg-white border-gray-200">
                            <SelectValue placeholder="Select an order" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            {mockOrders.map((order) => (
                              <SelectItem key={order.id} value={order.id}>
                                {order.id} - ${order.total}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-700">Issue Type *</Label>
                        <Select
                          value={newTicket.issueType}
                          onValueChange={(value) => setNewTicket({ ...newTicket, issueType: value })}
                          required
                        >
                          <SelectTrigger className="bg-white border-gray-200">
                            <SelectValue placeholder="Select issue type" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="order">Order Issue</SelectItem>
                            <SelectItem value="product">Product Quality</SelectItem>
                            <SelectItem value="shipping">Shipping Problem</SelectItem>
                            <SelectItem value="payment">Payment Issue</SelectItem>
                            <SelectItem value="account">Account Problem</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-gray-700">Priority</Label>
                        <Select
                          value={newTicket.priority}
                          onValueChange={(value) => setNewTicket({ ...newTicket, priority: value })}
                        >
                          <SelectTrigger className="bg-white border-gray-200">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label className="text-gray-700">Description *</Label>
                      <Textarea
                        value={newTicket.description}
                        onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                        placeholder="Please provide detailed information about your issue..."
                        className="min-h-[120px] bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div className="flex space-x-3">
                      <Button
                        type="submit"
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                      >
                        Submit Ticket 🚀
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowTicketForm(false)}
                        className="border-gray-200 text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">My Support Tickets</h3>
              {mockTickets.map((ticket) => (
                <Card key={ticket.id} className="border-gray-200 bg-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-semibold text-gray-800">{ticket.subject}</p>
                          <p className="text-sm text-gray-500">
                            Ticket {ticket.id} • Created {ticket.createdAt}
                          </p>
                        </div>
                        <Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge>
                        <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority} priority</Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-200 text-gray-700 hover:bg-gray-50 bg-transparent"
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                    {ticket.orderId && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Package className="w-4 h-4" />
                        <span>Related to order: {ticket.orderId}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">My Profile 👤</h2>
              <Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50 bg-transparent">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="border-gray-200 bg-white">
                <CardContent className="p-6 text-center">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.name} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xl">
                      {profile.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{profile.name}</h3>
                  <p className="text-gray-600 mb-4">Valued Customer 🌟</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-200 text-gray-700 hover:bg-gray-50 bg-transparent"
                  >
                    Change Photo
                  </Button>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2 border-gray-200 bg-white">
                <CardHeader>
                  <CardTitle className="text-gray-800">Personal Information</CardTitle>
                  <CardDescription className="text-gray-600">
                    Update your personal details and contact information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-700">Full Name</Label>
                      <Input
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700">Email Address</Label>
                      <Input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-700">Phone Number</Label>
                    <Input
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700">Address</Label>
                    <Textarea
                      value={profile.address}
                      onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                      className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                    Save Changes ✅
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Account Settings ⚙️</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-gray-200 bg-white">
                <CardHeader>
                  <CardTitle className="text-gray-800">Notification Preferences 🔔</CardTitle>
                  <CardDescription className="text-gray-600">Choose how you want to receive updates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-gray-700">Order Updates</Label>
                      <p className="text-sm text-gray-500">Get notified about order status changes</p>
                    </div>
                    <Switch
                      checked={notifications.orderUpdates}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, orderUpdates: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-gray-700">Promotions & Deals</Label>
                      <p className="text-sm text-gray-500">Receive special offers and discounts</p>
                    </div>
                    <Switch
                      checked={notifications.promotions}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, promotions: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-gray-700">Newsletter</Label>
                      <p className="text-sm text-gray-500">Weekly updates and product recommendations</p>
                    </div>
                    <Switch
                      checked={notifications.newsletter}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, newsletter: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-gray-700">SMS Notifications</Label>
                      <p className="text-sm text-gray-500">Urgent updates via text message</p>
                    </div>
                    <Switch
                      checked={notifications.sms}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, sms: checked })}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 bg-white">
                <CardHeader>
                  <CardTitle className="text-gray-800">Security Settings 🔒</CardTitle>
                  <CardDescription className="text-gray-600">Manage your account security</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-gray-700">Current Password</Label>
                    <Input
                      type="password"
                      placeholder="Enter current password"
                      className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700">New Password</Label>
                    <Input
                      type="password"
                      placeholder="Enter new password"
                      className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700">Confirm New Password</Label>
                    <Input
                      type="password"
                      placeholder="Confirm new password"
                      className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                    Update Password 🔐
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-gray-200 text-gray-700 hover:bg-gray-50 bg-transparent"
                  >
                    Enable Two-Factor Authentication 🛡️
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
