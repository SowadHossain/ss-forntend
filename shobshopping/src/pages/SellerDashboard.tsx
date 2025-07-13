
import React from "react"

import { useState } from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
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
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Progress } from "../components/ui/progress"
import {
  Package,
  DollarSign,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Plus,
  Upload,
  Star,
  ShoppingCart,
  BarChart3,
  Filter,
  Search,
  Download,
  Store,
} from "lucide-react"

// Mock Data
const mockProducts = [
  {
    id: 1,
    name: "Gaming Laptop Pro Max 🎮",
    price: 1299.99,
    stock: 15,
    status: "approved",
    sales: 23,
    revenue: 29899.77,
    rating: 4.8,
    reviews: 45,
    image: "/placeholder.svg?height=80&width=80",
    category: "Electronics",
    sku: "GLX-001",
    dateAdded: "2024-01-10",
  },
  {
    id: 2,
    name: "Wireless Earbuds Elite ✨",
    price: 89.99,
    stock: 50,
    status: "pending",
    sales: 67,
    revenue: 6029.33,
    rating: 4.6,
    reviews: 89,
    image: "/placeholder.svg?height=80&width=80",
    category: "Electronics",
    sku: "WEB-002",
    dateAdded: "2024-01-12",
  },
  {
    id: 3,
    name: "Smart Watch Series X 📱",
    price: 299.99,
    stock: 0,
    status: "approved",
    sales: 34,
    revenue: 10199.66,
    rating: 4.9,
    reviews: 56,
    image: "/placeholder.svg?height=80&width=80",
    category: "Electronics",
    sku: "SWX-003",
    dateAdded: "2024-01-08",
  },
]

const mockOrders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    product: "Gaming Laptop Pro Max",
    quantity: 1,
    total: 1299.99,
    status: "shipped",
    date: "2024-01-15",
    shippingAddress: "123 Main St, New York, NY",
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    product: "Wireless Earbuds Elite",
    quantity: 2,
    total: 179.98,
    status: "processing",
    date: "2024-01-14",
    shippingAddress: "456 Oak Ave, Los Angeles, CA",
  },
]

const mockAnalytics = {
  totalRevenue: 46128.76,
  revenueGrowth: 15.2,
  totalOrders: 124,
  ordersGrowth: 8.7,
  totalProducts: 3,
  avgRating: 4.8,
  conversionRate: 3.2,
  conversionGrowth: 2.1,
}

export default function SellerDashboard() {
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    images: [] as File[],
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "processing":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("New product:", newProduct)
    setShowAddProduct(false)
    setNewProduct({ name: "", description: "", price: "", stock: "", category: "", images: [] })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewProduct({ ...newProduct, images: Array.from(e.target.files) })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <Store className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                  Seller Hub 💼
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setShowAddProduct(true)}
                className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
              <Avatar>
                <AvatarImage src="/placeholder.svg" alt="Seller" />
                <AvatarFallback className="bg-gradient-to-r from-green-500 to-teal-600 text-white">TS</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome back, TechZone! 🚀</h1>
          <p className="text-gray-600">Manage your products, orders, and grow your business</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-gray-200 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue 💰</p>
                  <p className="text-2xl font-bold text-gray-900">${mockAnalytics.totalRevenue.toLocaleString()}</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />+{mockAnalytics.revenueGrowth}% this month
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
                  <p className="text-2xl font-bold text-gray-900">{mockAnalytics.totalOrders}</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />+{mockAnalytics.ordersGrowth}% this month
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
                  <p className="text-sm font-medium text-gray-600">Products Listed 📋</p>
                  <p className="text-2xl font-bold text-gray-900">{mockAnalytics.totalProducts}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {mockProducts.filter((p) => p.status === "approved").length} approved
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Rating ⭐</p>
                  <p className="text-2xl font-bold text-gray-900">{mockAnalytics.avgRating}</p>
                  <p className="text-xs text-gray-500 mt-1">Based on customer reviews</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Product Modal */}
        {showAddProduct && (
          <Dialog open={showAddProduct} onOpenChange={setShowAddProduct}>
            <DialogContent className="max-w-2xl bg-white">
              <DialogHeader>
                <DialogTitle className="text-gray-800">Add New Product 📦</DialogTitle>
                <DialogDescription className="text-gray-600">
                  Fill in the details to list your product for sale
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-700">Product Name *</Label>
                    <Input
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      placeholder="Enter product name"
                      className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700">Category *</Label>
                    <Select
                      value={newProduct.category}
                      onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                      required
                    >
                      <SelectTrigger className="bg-white border-gray-200">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="fashion">Fashion</SelectItem>
                        <SelectItem value="home">Home & Garden</SelectItem>
                        <SelectItem value="sports">Sports</SelectItem>
                        <SelectItem value="books">Books</SelectItem>
                        <SelectItem value="toys">Toys</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label className="text-gray-700">Description *</Label>
                  <Textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    placeholder="Describe your product in detail..."
                    className="min-h-[100px] bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-700">Price ($) *</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      placeholder="0.00"
                      className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700">Stock Quantity *</Label>
                    <Input
                      type="number"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                      placeholder="0"
                      className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-gray-700">Product Images</Label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500"
                        >
                          <span>Upload files</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                  {newProduct.images.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">{newProduct.images.length} file(s) selected</p>
                    </div>
                  )}
                </div>
                <div className="flex space-x-3 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white"
                  >
                    Add Product 🚀
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddProduct(false)}
                    className="flex-1 border-gray-200 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-green-50 data-[state=active]:text-green-600"
            >
              📊 Overview
            </TabsTrigger>
            <TabsTrigger
              value="products"
              className="data-[state=active]:bg-green-50 data-[state=active]:text-green-600"
            >
              📦 Products
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-600">
              🛒 Orders
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-green-50 data-[state=active]:text-green-600"
            >
              📈 Analytics
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-gray-200 bg-white">
                <CardHeader>
                  <CardTitle className="text-gray-800">Recent Orders 📋</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockOrders.slice(0, 3).map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div>
                          <p className="font-medium text-gray-800">{order.product}</p>
                          <p className="text-sm text-gray-500">
                            {order.customer} • {order.date}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-800">${order.total}</p>
                          <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 bg-white">
                <CardHeader>
                  <CardTitle className="text-gray-800">Product Performance 🎯</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockProducts.slice(0, 3).map((product) => (
                      <div key={product.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">{product.name}</span>
                          <span className="text-sm text-gray-500">{product.sales} sales</span>
                        </div>
                        <Progress value={(product.sales / 100) * 100} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-gray-200 bg-white">
              <CardHeader>
                <CardTitle className="text-gray-800">Sales Overview 💹</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">${mockAnalytics.totalRevenue.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Total Revenue</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{mockAnalytics.totalOrders}</p>
                    <p className="text-sm text-gray-600">Total Orders</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">{mockAnalytics.conversionRate}%</p>
                    <p className="text-sm text-gray-600">Conversion Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">My Products 📦</h2>
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
                      <TableHead className="text-gray-700">Price</TableHead>
                      <TableHead className="text-gray-700">Stock</TableHead>
                      <TableHead className="text-gray-700">Status</TableHead>
                      <TableHead className="text-gray-700">Sales</TableHead>
                      <TableHead className="text-gray-700">Revenue</TableHead>
                      <TableHead className="text-gray-700">Rating</TableHead>
                      <TableHead className="text-gray-700">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockProducts.map((product) => (
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
                              <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium text-gray-800">${product.price}</TableCell>
                        <TableCell>
                          <span
                            className={`font-medium ${product.stock === 0 ? "text-red-600" : product.stock < 10 ? "text-yellow-600" : "text-green-600"}`}
                          >
                            {product.stock}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(product.status)}>{product.status}</Badge>
                        </TableCell>
                        <TableCell className="text-gray-800">{product.sales}</TableCell>
                        <TableCell className="font-medium text-gray-800">${product.revenue.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-gray-800">{product.rating}</span>
                            <span className="text-sm text-gray-500">({product.reviews})</span>
                          </div>
                        </TableCell>
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
                              <DialogContent className="max-w-2xl bg-white">
                                <DialogHeader>
                                  <DialogTitle className="text-gray-800">
                                    Product Details: {selectedProduct?.name}
                                  </DialogTitle>
                                  <DialogDescription className="text-gray-600">
                                    View and manage product information
                                  </DialogDescription>
                                </DialogHeader>
                                {selectedProduct && (
                                  <div className="space-y-6">
                                    <div className="flex items-start space-x-4">
                                      <img
                                        src={selectedProduct.image || "/placeholder.svg"}
                                        alt={selectedProduct.name}
                                        className="w-24 h-24 rounded-lg object-cover border border-gray-200"
                                      />
                                      <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-800">{selectedProduct.name}</h3>
                                        <p className="text-gray-600 mb-2">SKU: {selectedProduct.sku}</p>
                                        <div className="flex items-center space-x-4">
                                          <Badge className={getStatusColor(selectedProduct.status)}>
                                            {selectedProduct.status}
                                          </Badge>
                                          <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                                            {selectedProduct.category}
                                          </Badge>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-3">
                                        <div>
                                          <Label className="text-gray-700">Pricing & Stock</Label>
                                          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-2">
                                            <div className="flex justify-between">
                                              <span className="text-gray-600">Price:</span>
                                              <span className="font-medium text-gray-800">
                                                ${selectedProduct.price}
                                              </span>
                                            </div>
                                            <div className="flex justify-between">
                                              <span className="text-gray-600">Stock:</span>
                                              <span
                                                className={`font-medium ${selectedProduct.stock === 0 ? "text-red-600" : selectedProduct.stock < 10 ? "text-yellow-600" : "text-green-600"}`}
                                              >
                                                {selectedProduct.stock} units
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="space-y-3">
                                        <div>
                                          <Label className="text-gray-700">Performance</Label>
                                          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-2">
                                            <div className="flex justify-between">
                                              <span className="text-gray-600">Sales:</span>
                                              <span className="font-medium text-gray-800">{selectedProduct.sales}</span>
                                            </div>
                                            <div className="flex justify-between">
                                              <span className="text-gray-600">Revenue:</span>
                                              <span className="font-medium text-gray-800">
                                                ${selectedProduct.revenue.toLocaleString()}
                                              </span>
                                            </div>
                                            <div className="flex justify-between">
                                              <span className="text-gray-600">Rating:</span>
                                              <div className="flex items-center space-x-1">
                                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                <span className="font-medium text-gray-800">
                                                  {selectedProduct.rating}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                  ({selectedProduct.reviews})
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-green-600">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-red-600">
                              <Trash2 className="w-4 h-4" />
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

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Order Management 🛒</h2>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search orders..."
                    className="pl-10 w-64 bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
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
                      <TableHead className="text-gray-700">Order ID</TableHead>
                      <TableHead className="text-gray-700">Customer</TableHead>
                      <TableHead className="text-gray-700">Product</TableHead>
                      <TableHead className="text-gray-700">Quantity</TableHead>
                      <TableHead className="text-gray-700">Total</TableHead>
                      <TableHead className="text-gray-700">Status</TableHead>
                      <TableHead className="text-gray-700">Date</TableHead>
                      <TableHead className="text-gray-700">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockOrders.map((order) => (
                      <TableRow key={order.id} className="border-gray-200">
                        <TableCell className="font-mono text-sm text-gray-800">{order.id}</TableCell>
                        <TableCell className="font-medium text-gray-800">{order.customer}</TableCell>
                        <TableCell className="text-gray-800">{order.product}</TableCell>
                        <TableCell className="text-gray-800">{order.quantity}</TableCell>
                        <TableCell className="font-medium text-gray-800">${order.total}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                        </TableCell>
                        <TableCell className="text-gray-600">{order.date}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-gray-200 text-gray-700 hover:bg-gray-50 bg-transparent"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Select defaultValue={order.status}>
                              <SelectTrigger className="w-32 bg-white border-gray-200">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-white">
                                <SelectItem value="processing">Processing</SelectItem>
                                <SelectItem value="shipped">Shipped</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
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

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Sales Analytics 📈</h2>
              <div className="flex items-center space-x-2">
                <Select defaultValue="30days">
                  <SelectTrigger className="w-40 bg-white border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="7days">Last 7 days</SelectItem>
                    <SelectItem value="30days">Last 30 days</SelectItem>
                    <SelectItem value="90days">Last 90 days</SelectItem>
                    <SelectItem value="1year">Last year</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-200 text-gray-700 hover:bg-gray-50 bg-transparent"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-gray-200 bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Revenue Growth 📈</p>
                      <p className="text-2xl font-bold text-green-600">+{mockAnalytics.revenueGrowth}%</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Order Growth 📦</p>
                      <p className="text-2xl font-bold text-blue-600">+{mockAnalytics.ordersGrowth}%</p>
                    </div>
                    <ShoppingCart className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Conversion Rate 🎯</p>
                      <p className="text-2xl font-bold text-purple-600">{mockAnalytics.conversionRate}%</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avg Rating ⭐</p>
                      <p className="text-2xl font-bold text-yellow-600">{mockAnalytics.avgRating}</p>
                    </div>
                    <Star className="w-8 h-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-gray-200 bg-white">
                <CardHeader>
                  <CardTitle className="text-gray-800">Top Performing Products 🏆</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockProducts
                      .sort((a, b) => b.revenue - a.revenue)
                      .map((product, index) => (
                        <div
                          key={product.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{product.name}</p>
                              <p className="text-sm text-gray-500">{product.sales} sales</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-800">${product.revenue.toLocaleString()}</p>
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              <span className="text-sm text-gray-600">{product.rating}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 bg-white">
                <CardHeader>
                  <CardTitle className="text-gray-800">Sales Trends 📊</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-8 text-gray-500">
                      <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p>Sales chart visualization would go here</p>
                      <p className="text-sm">Connect your analytics to see detailed trends</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
