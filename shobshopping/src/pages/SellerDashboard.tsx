import {
  BarChart3,
  ChevronDown,
  DollarSign,
  Edit,
  Eye,
  LogOut,
  Package,
  Plus,
  Search,
  ShoppingCart,
  Star,
  TrendingUp,
  Upload
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import EditProductContentsDialog from "../components/EditProductContentsDialog";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Progress } from "../components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Textarea } from "../components/ui/textarea";
import { API } from "../lib/api";

const mockAnalytics = {
  totalRevenue: 46128.76,
  revenueGrowth: 15.2,
  totalOrders: 124,
  ordersGrowth: 8.7,
  totalProducts: 3,
  avgRating: 4.8,
  conversionRate: 3.2,
  conversionGrowth: 2.1,
};

export default function SellerDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    role: "",
    avatar: "/placeholder.svg?height=100&width=100",
  });
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
  original_price: "",
    stock_quantity: "",
    category_id: "",
    tag_ids: [] as number[],
    image: ""
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [showMenu, setShowMenu] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    API.getProfile()
      .then((data) => setProfile(data))
      .catch(() => {})
      .finally(() => setLoadingProfile(false))

    API.getCategories()
      .then((data) => {
        const items = data.results || data;
        const filtered = Array.isArray(items) ? items.filter((c: any) => c.parent === null) : [];
        setCategories(filtered);
      })
      .catch(() => {});
    API.getTags().then((data) => setTags(data.results || data)).catch(() => {})

    setLoadingProducts(true)
    API.getSellerProducts()
      .then((data) => {
        setProducts(data.results || data)
        setProductsError(null)
      })
      .catch((err) => {
        setProductsError(err.message || "Failed to fetch products")
      })
      .finally(() => setLoadingProducts(false))

    // Fetch orders from API
    API.getOrders()
      .then((data) => setOrders(data.results || data))
      .catch(() => setOrders([]));
  }, [])

  function handleLogout() {
    try {
      sessionStorage.removeItem("accessToken");
      localStorage.removeItem("accessToken");
      sessionStorage.removeItem("refreshtoken");
    } catch {}
    setShowMenu(false);
    navigate("/login");
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
      case "approved":
        return "bg-green-100 text-green-800 border-green-200 hover:bg-green-200"
      case "PENDING":
      case "IN_REVIEW":
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200"
      case "REJECTED":
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200 hover:bg-red-200"
      case "DRAFT":
      case "draft":
        return "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200"
      case "shipped":
        return "bg-[#cd2733]/10 text-[#cd2733] border-[#cd2733]/30 hover:bg-[#cd2733]/20"
      case "processing":
        return "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200"
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200 hover:bg-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200"
    }
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload = {
        name: newProduct.name,
        description: newProduct.description,
        // price here is the discounted price
        price: parseFloat(newProduct.price),
        original_price: newProduct.original_price ? parseFloat(newProduct.original_price) : undefined,
        stock_quantity: parseInt(newProduct.stock_quantity),
        category_id: parseInt(newProduct.category_id),
        tag_ids: newProduct.tag_ids,
        image_base64: newProduct.image, // Now base64 strings
        // image: newProduct.images
      }
      const created = await API.createProduct(payload)
      setProducts((prev) => [created, ...prev])
      setShowAddProduct(false)
      setNewProduct({ name: "", description: "", price: "", original_price: "", stock_quantity: "", category_id: "", tag_ids: [], image: "" })
    } catch (err) {
      alert(err.message || "Failed to add product")
    }
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setNewProduct((prev) => ({
          ...prev,
          image: reader.result as string, // Store as string, not array
        }));
      };
      reader.readAsDataURL(file);
    }
  }
  
  const userRole = (profile?.role || "").toString().toLowerCase()
  const isSeller = userRole === "seller"

  // Component to handle adding stock (only increase allowed)
  function StockUpdater({ product, onUpdated }: { product: any; onUpdated?: (p: any) => void }) {
    const [addAmount, setAddAmount] = useState<string>("")
    const [loadingAdd, setLoadingAdd] = useState(false)

    const handleAddStock = async (e: React.FormEvent) => {
      e.preventDefault()
      const amt = parseInt(addAmount)
      if (isNaN(amt) || amt <= 0) {
        alert("Please enter a positive number to increase stock")
        return
      }
      setLoadingAdd(true)
      try {
        const newStock = (product.stock_quantity || 0) + amt
        // Build a payload that includes required fields to satisfy servers that expect full object on update
        const payload: any = {
          stock_quantity: newStock,
          name: product.name,
        }

        // Ensure price is passed as a number when possible
        if (product.price !== undefined && product.price !== null) {
          const p = typeof product.price === 'number' ? product.price : parseFloat(String(product.price).replace(/[^0-9.-]/g, ''))
          if (!isNaN(p)) payload.price = p
        }

        // Try to determine category id from product object
        if (product.category && product.category.id) {
          payload.category_id = product.category.id
        } else if (product.category_id) {
          const cid = typeof product.category_id === 'number' ? product.category_id : parseInt(String(product.category_id))
          if (!isNaN(cid)) payload.category_id = cid
        }

        // Assumption: API.updateProduct exists and returns the updated product
        const updated = await API.updateProduct(product.id, payload)
        onUpdated && onUpdated(updated)
        setAddAmount("")
      } catch (err: any) {
        alert(err?.message || "Failed to update stock")
      } finally {
        setLoadingAdd(false)
      }
    }

    return (
      <div className="border-t border-gray-100 pt-4">
        <form onSubmit={handleAddStock} className="flex items-center space-x-2">
          <div className="flex-1">
            <Label className="text-gray-700">Increase Stock</Label>
            <Input
              type="number"
              min={1}
              value={addAmount}
              onChange={(e) => setAddAmount(e.target.value)}
              placeholder="Enter amount to add"
              className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
            />
            <p className="text-xs text-gray-500 mt-1">Only positive values allowed — stock can only be increased here, not decreased.</p>
          </div>
          <div className="w-36">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white"
              disabled={loadingAdd}
            >
              {loadingAdd ? "Updating..." : "Add Stock"}
            </Button>
          </div>
        </form>
      </div>
    )
  }

  // If profile is loading show a simple loader
  if (loadingProfile) {
    return (
      <div className="min-h-screen pt-20 flex justify-center items-center">
        <img
          src="https://shobshopping.com/logo.png"
          alt="Logo"
          className="w-20 h-20 animate-bounce mb-4"
        />
      </div>
    )
  }

  // If not a seller show Unauthorized message and button to go home
  if (!isSeller) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50 flex items-center justify-center p-6">
        <div className="max-w-lg w-full bg-white border border-gray-200 rounded-lg shadow-sm p-6 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Unauthorized Access</h2>
          <p className="text-gray-600 mb-6">You do not have permission to view the Seller Dashboard.</p>
          <div className="flex justify-center">
            <Button
              onClick={() => navigate("/")}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
            >
              Go to Home
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-red-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <img src="https://shobshopping.com/logo.png" alt="Logo" className="w-8 h-8 hover:cursor-pointer" onClick={() => (window.location.href = "/")} />
                <span className="text-xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                  Seller Hub
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setShowAddProduct(true)}
                className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
              <div className="relative" ref={menuRef}>
                <button
                  className="flex items-center space-x-2 focus:outline-none bg-white/80 border border-red-100 rounded-lg px-3 py-2 shadow"
                  aria-haspopup="true"
                  aria-expanded={showMenu}
                  onClick={() => setShowMenu((prev) => !prev)}
                  type="button"
                  title="Account menu"
                >
                  <Avatar style={{ cursor: "pointer" }} className="w-8 h-8">
                    <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.name} />
                    <AvatarFallback className="bg-gradient-to-r from-red-500 to-rose-600 text-white">
                      {profile.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline text-gray-700 font-medium">{profile.name.split(" ")[0]}</span>
                  <ChevronDown className={`ml-2 w-4 h-4 transition-transform ${showMenu ? 'rotate-180' : ''}`} />
                </button>

                {showMenu && typeof window !== "undefined" && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-red-100 rounded-lg shadow-lg z-50">
                    <div className="py-2">
                      <button
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 flex items-center"
                        onClick={handleLogout}
                      >
                        <LogOut className="w-4 h-4 mr-2 text-red-600" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#cd2733]">
            Seller Dashboard
          </h1>
          <p className="text-gray-600">Manage your products, orders, and grow your business</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-red-100 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  {/* replaced emoji with DollarSign icon */}
                  <p className="text-sm font-medium text-gray-600 flex items-center">
                    <DollarSign className="w-4 h-4 mr-2 text-red-500" />
                    Total Revenue
                  </p>
                  <p className="text-2xl font-bold text-gray-900">BDT {mockAnalytics.totalRevenue.toLocaleString()}</p>
                  <p className="text-xs text-red-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1 text-red-500" />+{mockAnalytics.revenueGrowth}% this month
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-red-400 to-rose-500 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-100 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  {/* replaced emoji with ShoppingCart icon */}
                  <p className="text-sm font-medium text-gray-600 flex items-center">
                    <ShoppingCart className="w-4 h-4 mr-2 text-red-500" />
                    Total Orders
                  </p>
                  <p className="text-2xl font-bold text-gray-900">{mockAnalytics.totalOrders}</p>
                  <p className="text-xs text-red-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1 text-red-500" />+{mockAnalytics.ordersGrowth}% this month
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-[#cd2733] to-purple-500 rounded-full flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-100 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  {/* replaced emoji with Package icon */}
                  <p className="text-sm font-medium text-gray-600 flex items-center">
                    <Package className="w-4 h-4 mr-2 text-red-500" />
                    Products Listed
                  </p>
                  <p className="text-2xl font-bold text-gray-900">{mockAnalytics.totalProducts}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {products.filter((p) => p.moderation_status === "APPROVED").length} approved
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-red-500 rounded-full flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-100 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  {/* replaced emoji with Star icon */}
                  <p className="text-sm font-medium text-gray-600 flex items-center">
                    <Star className="w-4 h-4 mr-2 text-yellow-400" />
                    Avg Rating
                  </p>
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
            <DialogContent className="max-w-2xl max-h-[90vh] bg-white overflow-hidden flex flex-col">
              <DialogHeader className="flex-shrink-0">
                <DialogTitle className="text-gray-800 flex items-center">
                  <Package className="w-5 h-5 mr-2 text-red-500" />
                  Add New Product
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  Fill in the details to list your product for sale
                </DialogDescription>
              </DialogHeader>
              <div className="flex-1 overflow-y-auto pr-2">
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
                      value={newProduct.category_id}
                      onValueChange={(value) => setNewProduct({ ...newProduct, category_id: value })}
                      required
                    >
                      <SelectTrigger className="bg-white border-gray-200">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label className="text-gray-700">Tags *</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag) => (
                      <label key={tag.id} className="flex items-center gap-1 text-sm bg-gray-100 px-2 py-1 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newProduct.tag_ids.includes(tag.id)}
                          onChange={(e) => {
                            setNewProduct((prev) => {
                              const tag_ids = e.target.checked
                                ? [...prev.tag_ids, tag.id]
                                : prev.tag_ids.filter((id) => id !== tag.id)
                              return { ...prev, tag_ids }
                            })
                          }}
                        />
                        {tag.name}
                      </label>
                    ))}
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-gray-700">Discounted Price (BDT) *</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      placeholder="0.00"
                      className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">This is the discounted price shown to customers.</p>
                  </div>

                  <div>
                    <Label className="text-gray-700">Original Price (BDT)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newProduct.original_price}
                      onChange={(e) => setNewProduct({ ...newProduct, original_price: e.target.value })}
                      placeholder="0.00"
                      className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Optional — the non-discounted price for comparison.</p>
                  </div>

                  <div>
                    <Label className="text-gray-700">Stock Quantity *</Label>
                    <Input
                      type="number"
                      value={newProduct.stock_quantity}
                      onChange={(e) => setNewProduct({ ...newProduct, stock_quantity: e.target.value })}
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
                          <span>Upload file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                          {/* <form onSubmit={handleFileUpload}>
                            <label htmlFor="file-upload">Select a file:</label>
                            <input
                              type="file"
                              id="file-upload"
                              name="file"
                              onChange={handleFileChange}
                              accept="image/*"
                            />
                            <button type="submit">Upload</button>
                          </form> */}
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                  {newProduct.image.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">1 file selected</p>
                    </div>
                  )}
                </div>
                  <div className="flex space-x-3 pt-4">
                    <Button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white flex items-center justify-center"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Product
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAddProduct(false)}
                      className="flex-1 border-red-100 text-gray-700 hover:bg-red-50"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </DialogContent>
          </Dialog>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-red-100">
            <TabsTrigger value="overview" className="data-[state=active]:bg-red-50 data-[state=active]:text-red-600">
              <BarChart3 className="w-4 h-4 mr-2" /> Overview
            </TabsTrigger>
            <TabsTrigger value="products" className="data-[state=active]:bg-red-50 data-[state=active]:text-red-600">
              <Package className="w-4 h-4 mr-2" /> Products
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-red-50 data-[state=active]:text-red-600">
              <ShoppingCart className="w-4 h-4 mr-2" /> Orders
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-red-50 data-[state=active]:text-red-600">
              <TrendingUp className="w-4 h-4 mr-2" /> Analytics
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-gray-200 bg-white">
                <CardHeader>
                  <CardTitle className="text-gray-800 flex items-center">
                    <Package className="w-5 h-5 mr-2 text-red-500" />
                    Recent Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders.slice(0, 3).map((order) => (
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
                          <p className="font-bold text-gray-800">{order.total && order.total.toString().startsWith("BDT") ? order.total : `BDT ${order.total}`}</p>
                          <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 bg-white">
                <CardHeader>
                  <CardTitle className="text-gray-800 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-red-500" />
                    Product Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {products.slice(0, 3).map((product) => (
                      <div key={product.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">{product.name}</span>
                          <span className="text-sm text-gray-500">{product.sales || 0} sales</span>
                        </div>
                        <Progress value={((product.sales || 0) / 100) * 100} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-gray-200 bg-white">
              <CardHeader>
                <CardTitle className="text-gray-800 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-red-500" />
                  Sales Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{String(mockAnalytics.totalRevenue).startsWith("BDT") ? mockAnalytics.totalRevenue : `BDT ${mockAnalytics.totalRevenue.toLocaleString()}`}</p>
                    <p className="text-sm text-gray-600">Total Revenue</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#cd2733]">{mockAnalytics.totalOrders}</p>
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
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <Package className="w-5 h-5 mr-2 text-red-500" />
                My Products
              </h2>
              {/* <div className="flex items-center space-x-2">
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
              </div> */}
            </div>

            <Card className="border-gray-200 bg-white">
              <CardContent className="p-0">
                <Table>
                  <div className="overflow-x-auto">
                    <Table className="min-w-[900px]">
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
                            <TableCell className="font-medium text-gray-800">{product.price && product.price.toString().startsWith("BDT") ? product.price : `BDT ${product.price}`}</TableCell>
                            <TableCell>
                              <span
                                className={`font-medium ${product.stock_quantity === 0 ? "text-red-600" : product.stock_quantity < 10 ? "text-yellow-600" : "text-green-600"}`}
                              >
                                {product.stock_quantity}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(product.moderation_status)}>{product.moderation_status}</Badge>
                            </TableCell>
                            <TableCell className="text-gray-800">{product.sales || 0}</TableCell>
                            <TableCell className="font-medium text-gray-800">{String((product.revenue || 0)).startsWith("BDT") ? (product.revenue || 0) : `BDT ${(product.revenue || 0).toLocaleString()}`}</TableCell>
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
                                      className="text-gray-600 hover:text-[#cd2733]"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="w-full max-w-md sm:max-w-lg md:max-w-2xl bg-white p-2 sm:p-6 overflow-y-auto max-h-[90vh]">
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
                                            <p className="text-gray-600 mb-2">ID: {selectedProduct.id}</p>
                                            <div className="flex items-center space-x-4">
                                              <Badge className={getStatusColor(selectedProduct.moderation_status)}>
                                                {selectedProduct.moderation_status}
                                              </Badge>
                                              <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                                                {selectedProduct.category?.name || 'No Category'}
                                              </Badge>
                                            </div>
                                          </div>
                                          <Badge
                                            variant="outline"
                                            className="bg-gray-50 text-gray-500 px-2 py-1 hover:cursor-pointer hover:bg-gray-100"
                                            onClick={() => window.open(`/products/${selectedProduct.id}`, "_blank")}
                                          >
                                            Visit Product
                                          </Badge>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                          <div className="space-y-3">
                                            <div>
                                              <Label className="text-gray-700">Pricing & Stock</Label>
                                              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-2">
                                                <div className="flex justify-between">
                                                  <span className="text-gray-600">Price:</span>
                                                  <span className="font-medium text-gray-800">
                                                    {selectedProduct.price && selectedProduct.price.toString().startsWith("BDT") ? selectedProduct.price : `BDT ${selectedProduct.price}`}
                                                  </span>
                                                </div>
                                                <div className="flex justify-between">
                                                  <span className="text-gray-600">Stock:</span>
                                                  <span
                                                    className={`font-medium ${selectedProduct.stock_quantity === 0 ? "text-red-600" : selectedProduct.stock_quantity < 10 ? "text-yellow-600" : "text-green-600"}`}
                                                  >
                                                    {selectedProduct.stock_quantity} units
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
                                                  <span className="font-medium text-gray-800">{selectedProduct.sales || 0}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                  <span className="text-gray-600">Revenue:</span>
                                                  <span className="font-medium text-gray-800">
                                                    {String((selectedProduct.revenue || 0)).startsWith("BDT") ? (selectedProduct.revenue || 0) : `BDT ${(selectedProduct.revenue || 0).toLocaleString()}`}
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
                                        {/* Stock updater — allow increasing stock only */}
                                        <StockUpdater product={selectedProduct} onUpdated={(updated) => {
                                          setProducts((prev) => prev.map((p) => p.id === updated.id ? updated : p))
                                          setSelectedProduct(updated)
                                        }} />
                                      </div>
                                    )}
                                  </DialogContent>
                                </Dialog>
                                {/* <Button variant="ghost" size="sm" className="text-gray-600 hover:text-green-600">
                                  <Edit className="w-4 h-4" />
                                </Button> */}
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button variant="ghost" size="sm" className="text-gray-600 hover:text-green-600">
                                        <Edit className="w-4 h-4" />
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-lg w-full">
                                      <DialogHeader>
                                        <DialogTitle>Edit Product Contents</DialogTitle>
                                        <DialogDescription>Add images and YouTube video links</DialogDescription>
                                      </DialogHeader>
                                      <EditProductContentsDialog product={product} onUpdated={(updated) => {
                                        setProducts((prev) => prev.map((p) => p.id === updated.id ? updated : p));
                                      }} />
                                    </DialogContent>
                                  </Dialog>
                                {/* <Button variant="ghost" size="sm" className="text-gray-600 hover:text-red-600">
                                  <Trash2 className="w-4 h-4" />
                                </Button> */}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Order Management <ShoppingCart className="inline-block" /></h2>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search orders..."
                    className="pl-10 w-64 bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                {/* <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-200 text-gray-700 hover:bg-gray-50 bg-transparent"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button> */}
              </div>
            </div>

            <Card className="border-gray-200 bg-white">
              <CardContent className="p-0">
                <Table>
                  <div className="overflow-x-auto">
                    <Table className="min-w-[900px]">
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
                        {orders.map((order) => (
                          <TableRow key={order.id} className="border-gray-200">
                            <TableCell className="font-mono text-sm text-gray-800">{order.id}</TableCell>
                            <TableCell className="font-medium text-gray-800">{order.user}</TableCell>
                            <TableCell className="text-gray-800">{order.status}</TableCell>
                            <TableCell className="text-gray-800">{order.payment_status}</TableCell>
                            <TableCell className="text-gray-800">{order.shipping_address}</TableCell>
                            <TableCell className="text-gray-600">{order.created_at}</TableCell>
                            <TableCell className="text-gray-600">{order.updated_at}</TableCell>
                            <TableCell className="text-gray-800">{order.items.map(item => item.product_name).join(', ')}</TableCell>
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
                  </div>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-red-500" />
                Sales Analytics
              </h2>
              {/* <div className="flex items-center space-x-2">
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
              </div> */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-gray-200 bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Revenue Growth</p>
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
                      <p className="text-sm font-medium text-gray-600">Order Growth</p>
                      <p className="text-2xl font-bold text-[#cd2733]">+{mockAnalytics.ordersGrowth}%</p>
                    </div>
                    <ShoppingCart className="w-8 h-8 text-[#cd2733]" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
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
                      <p className="text-sm font-medium text-gray-600">Avg Rating</p>
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
                  <CardTitle className="text-gray-800 flex items-center">
                    <Star className="w-5 h-5 mr-2 text-yellow-400" />
                    Top Performing Products
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {products
                      .sort((a, b) => (b.revenue || 0) - (a.revenue || 0))
                      .map((product, index) => (
                        <div
                          key={product.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-red-400 to-rose-500 rounded-full flex items-center justify-center text-white font-bold">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{product.name}</p>
                              <p className="text-sm text-gray-500">{product.sales || 0} sales</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-800">{String((product.revenue || 0)).startsWith("BDT") ? (product.revenue || 0) : `BDT ${(product.revenue || 0).toLocaleString()}`}</p>
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
                   <CardTitle className="text-gray-800">Sales Trends</CardTitle>
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
