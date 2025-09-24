import {
  Bell,
  CheckSquare,
  ChevronDown,
  CreditCard,
  DollarSign,
  Eye,
  HeadphonesIcon,
  Heart,
  LayoutDashboard,
  LockIcon,
  LogOut,
  MessageSquare,
  Package,
  Pencil,
  Plus,
  Rocket,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Star,
  Trash2,
  Truck,
  User
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Switch } from "../components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Textarea } from "../components/ui/textarea";
import { useCart } from "../context/CartContext";
import { API } from "../lib/api";

export default function BuyerDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("orders");
  const allowedTabs = ["orders", "wishlist", "support", "profile", "settings"];
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    avatar: "/placeholder.svg?height=100&width=100",
  });
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaveError, setProfileSaveError] = useState<string | null>(null);
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: false,
    newsletter: true,
    sms: false,
  });
  const [newTicket, setNewTicket] = useState({
    subject: "",
    issueType: "other",
    orderId: "",
    priority: "low",
    description: "",
  });
  const [showTicketForm, setShowTicketForm] = useState(false);

  // States for real data
  const [orders, setOrders] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [supportTickets, setSupportTickets] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingWishlist, setLoadingWishlist] = useState(true);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { addToCart, refreshCart } = useCart();

  // New: dropdown menu state + ref (like SellerDashboard)
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const isAuthenticated =
    !!sessionStorage.getItem("refreshtoken") || !!localStorage.getItem("accessToken")

  useEffect(() => {
    if (!isAuthenticated) {
      // Not logged in — redirect to login page
      navigate("/login")
      return
    }
  }, [isAuthenticated])

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab && allowedTabs.includes(tab) && tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [location.search]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  // Close menu on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowMenu(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const handleTabChange = (value: string) => {
    if (!allowedTabs.includes(value)) return;
    setActiveTab(value);
    const params = new URLSearchParams(location.search);
    params.set("tab", value);
    navigate(`${location.pathname}?${params.toString()}`, {replace: true});
  };

  // Logout handler (clear tokens and redirect)
  function handleLogout() {
    try {
      sessionStorage.removeItem("accessToken");
      localStorage.removeItem("accessToken");
      sessionStorage.removeItem("refreshtoken");
    } catch {}
    setShowMenu(false);
    navigate("/login");
  }

  // Fetch user profile
  useEffect(() => {
    let mounted = true;
    const fetchProfile = async () => {
      try {
        const data = await API.getProfile();
        if (!mounted) return;
        const name =
          data?.name ||
          [data?.first_name, data?.last_name].filter(Boolean).join(" ") ||
          data?.user?.name ||
          data?.user?.full_name ||
          data?.username ||
          (data?.email ? String(data.email).split("@")[0] : "User");
        const email = data?.email || data?.user?.email || "";
        const phone = data?.phone || data?.user?.phone || "";
        const address = data?.address || data?.user?.address || "";
        const avatar = data?.avatar || data?.user?.avatar || "/placeholder.svg?height=100&width=100";
        setProfile({ name, email, phone, address, avatar });
      } catch {
        // leave defaults
      } finally {
        if (mounted) setLoadingProfile(false);
      }
    };
    fetchProfile();
    return () => {
      mounted = false;
    };
  }, []);

  // Save profile handler
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileSaveError(null);
    setProfileSaveSuccess(false);
    try {
      await API.updateProfile({
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        address: profile.address,
        avatar: profile.avatar,
      });
      setProfileSaveSuccess(true);
      setTimeout(() => setProfileSaveSuccess(false), 2000);
    } catch (err: any) {
      setProfileSaveError(err?.message || "Failed to save profile");
    } finally {
      setSavingProfile(false);
    }
  };

  // Fetch orders, wishlist, and support tickets
  useEffect(() => {
    let mounted = true;

    const fetchOrders = async () => {
      try {
        setLoadingOrders(true);
        const data = await API.getOrders();
        if (!mounted) return;
        setOrders(data);
      } catch (e: any) {
        setError(e.message || "Failed to load orders");
      } finally {
        if (mounted) setLoadingOrders(false);
      }
    };

    const fetchWishlist = async () => {
      try {
        setLoadingWishlist(true);
        const data = await API.getWishlist();
        if (!mounted) return;
        setWishlist(data);
      } catch (e: any) {
        setError(e.message || "Failed to load wishlist");
      } finally {
        if (mounted) setLoadingWishlist(false);
      }
    };

    const fetchSupportTickets = async () => {
      try {
        setLoadingTickets(true);
        const data = await API.getSupportTickets();
        if (!mounted) return;
        setSupportTickets(data);
      } catch (e: any) {
        setError(e.message || "Failed to load support tickets");
      } finally {
        if (mounted) setLoadingTickets(false);
      }
    };

    fetchOrders();
    fetchWishlist();
    fetchSupportTickets();

    return () => {
      mounted = false;
    };
  }, []);

  // Calculate total spent from orders
  const totalSpent = orders.reduce((acc, order) => acc + (order.total || 0), 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "shipped":
        return "bg-[#cd2733]/10 text-[#cd2733] border-[#cd2733]/30";
      case "processing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "open":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200";
      case "closed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingTickets(true);
    const payload: any = {
      subject: newTicket.subject,
      type: newTicket.issueType || "other",
      description: newTicket.description,
      priority: newTicket.priority,
    };
    if (newTicket.orderId) payload.order = Number(newTicket.orderId);

    API.createSupportTicket(payload)
      .then(() => API.getSupportTickets())
      .then((data) => {
        setSupportTickets(data);
        setShowTicketForm(false);
        setNewTicket({ subject: "", issueType: "other", orderId: "", priority: "low", description: "" });
      })
      .catch((e: any) => {
        setError(e.message || "Failed to create support ticket");
      })
      .finally(() => {
        setLoadingTickets(false);
      });
  };

  // Add types
  interface Ticket {
    id: number;
    subject: string;
    status: string;
    orderId?: string;
    // ...other fields as needed
  }
  interface TicketMessage {
    id: number;
    ticket: number;
    sender?: string;
    message: string;
    attachment?: string | null;
    sent_at?: string;
  }

  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [ticketMessages, setTicketMessages] = useState<TicketMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [showMessageDialog, setShowMessageDialog] = useState(false);

  const handleViewDetails = async (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setShowMessageDialog(true);
    setLoadingMessages(true);
    try {
      const messages = await API.getSupportMessages(`ticket=${ticket.id}`);
      setTicketMessages(messages);
    } catch (e) {
      setTicketMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedTicket) return;
    setSendingMessage(true);
    try {
      await API.createSupportMessage({ ticket: selectedTicket.id, message: newMessage });
      const messages = await API.getSupportMessages(`ticket=${selectedTicket.id}`);
      setTicketMessages(messages);
      setNewMessage("");
    } catch (e) {
      // handle error
    } finally {
      setSendingMessage(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-red-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 hover:cursor-pointer" onClick={() => (window.location.href = "/")}>
                <img src="https://shobshopping.com/logo.png" alt="Logo" className="w-8 h-8" />
                <img src="https://shobshopping.com/text_ss.png" alt="Text Logo" className="h-5" />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* <Button variant="ghost" size="sm" className="text-gray-600 hover:text-red-600">
                <Bell className="w-5 h-5" />
                <Badge className="ml-1 bg-red-500 text-white">2</Badge>
              </Button> */}

              {/* Replaced simple anchor avatar with dropdown menu (like SellerDashboard) */}
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome back, {loadingProfile ? "..." : profile.name || "User"}!
          </h1>
          <p className="text-gray-600">Manage your orders, wishlist, and account settings</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-red-100 bg-white shadow-sm rounded-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders <Package className="inline-block w-4 h-4 ml-2" /></p>
                  <p className="text-2xl font-bold text-gray-900">{loadingOrders ? "..." : orders.length}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-rose-500 rounded-full flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-100 bg-white shadow-sm rounded-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Wishlist Items <Heart className="inline-block w-4 h-4 ml-2" /></p>
                  <p className="text-2xl font-bold text-gray-900">{loadingWishlist ? "..." : wishlist.length}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-red-500 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-100 bg-white shadow-sm rounded-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Support Tickets <HeadphonesIcon className="inline-block w-4 h-4 ml-2" /></p>
                  <p className="text-2xl font-bold text-gray-900">{loadingTickets ? "..." : supportTickets.length}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-100 bg-white shadow-sm rounded-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Spent <DollarSign className="inline-block w-4 h-4 ml-2" /></p>
                  <p className="text-2xl font-bold text-gray-900">BDT {totalSpent.toFixed(2)}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          {/* Tabs triggers */}
          <TabsList className="grid w-full grid-cols-5 bg-white border border-red-100 rounded-lg overflow-hidden">
            <TabsTrigger value="orders" className="data-[state=active]:bg-red-50 data-[state=active]:text-red-600">
              <Package className="w-4 h-4 mr-2" /> My Orders
            </TabsTrigger>
            <TabsTrigger value="wishlist" className="data-[state=active]:bg-red-50 data-[state=active]:text-red-600">
              <Heart className="w-4 h-4 mr-2" /> Wishlist
            </TabsTrigger>
            <TabsTrigger value="support" className="data-[state=active]:bg-red-50 data-[state=active]:text-red-600">
              <HeadphonesIcon className="w-4 h-4 mr-2" /> Support
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-red-50 data-[state=active]:text-red-600">
              <LayoutDashboard className="w-4 h-4 mr-2" /> Profile
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-red-50 data-[state=active]:text-red-600">
              <Settings className="w-4 h-4 mr-2" /> Settings
            </TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">My Orders <Package className="inline-block w-6 h-6 ml-2" /></h2>
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

            <div className="space-y-4">
              {loadingOrders && <p>Loading orders...</p>}
              {!loadingOrders && orders.length === 0 && <p>No orders found.</p>}
              {!loadingOrders &&
                orders.map((order) => (
                  <Card
                    key={order.id}
                    className="border-gray-200 bg-white hover:shadow-md transition-shadow"
                  >
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
                          <p className="font-bold text-gray-800">BDT {order.total}</p>
                          <p className="text-sm text-gray-500">{order.items} item(s)</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex -space-x-2">
                            {order.products?.slice(0, 3).map((product: any, index: number) => (
                              <img
                                key={index}
                                src={product.image || "/placeholder.svg"}
                                alt={product.name}
                                className="w-10 h-10 rounded-full border-2 border-white object-cover"
                              />
                            ))}
                            {order.products && order.products.length > 3 && (
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
                                <DialogTitle className="text-gray-800">
                                  Order Details: {selectedOrder?.id}
                                </DialogTitle>
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
                                      <p className="text-xl font-bold text-gray-800">{selectedOrder.total && selectedOrder.total.toString().startsWith("BDT") ? selectedOrder.total : `BDT ${selectedOrder.total}`}</p>
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
                                          <p className="font-bold text-gray-800">{product.price && product.price.toString().startsWith("BDT") ? product.price : `BDT ${product.price}`}</p>
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
                                      <p className="text-sm text-blue-700">
                                        Tracking Number: {selectedOrder.tracking}
                                      </p>
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
              <h2 className="text-2xl font-bold text-gray-800">My Wishlist <Heart className="inline-block w-6 h-6 text-gray-500" /></h2>
              <p className="text-gray-600">{loadingWishlist ? "..." : wishlist.length} items saved</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {loadingWishlist && <p>Loading wishlist...</p>}
              {!loadingWishlist && wishlist.length === 0 && <p>No wishlist items found.</p>}
              {!loadingWishlist &&
                wishlist.map((item) => {
                  // Support both shapes: item can be the product itself or { id, product, added_at }
                  const product: any = (item && (item.product || item.product_id)) ? item.product : item;
                  // Fallback if the API returns product at top-level
                  const image = product?.image_url || product?.image || "/placeholder.svg";
                  const name = product?.name || "Unnamed product";
                  const price = product?.price ?? product?.price_string ?? "0.00";
                  const originalPrice = product?.original_price ?? product?.originalPrice ?? null;
                  const rating = Math.floor(Number(product?.rating || 0));
                  const reviews = product?.reviews ?? 0;
                  const seller = product?.seller ?? "";
                  const inStock = typeof product?.stock_quantity === "number" ? product.stock_quantity > 0 : (product?.inStock ?? true);

                  return (
                    <Card key={item.id ?? product?.id} className="border-gray-200 bg-white hover:shadow-lg transition-shadow hover:cursor-pointer">
                      <CardContent className="p-0">
                        <div className="relative">
                          <div className="w-full aspect-square overflow-hidden rounded-t-lg bg-white flex items-center justify-center relative" onClick={() => navigate(`/products/${product?.id || ""}`)}>
                            {/* Blurred background using same image for a nicer look */}
                            <div className="absolute inset-0 rounded-t-lg overflow-hidden" aria-hidden>
                              <div
                                style={{ backgroundImage: `url(${image})` }}
                                className="w-full h-full bg-center bg-cover filter blur-2xl scale-105"
                              />
                              <div className="absolute inset-0 bg-white/30" />
                            </div>

                            <img
                              src={image}
                              alt={name}
                              className="relative z-10 max-w-full max-h-full object-contain"
                            />
                          </div>

                          <Button
                            size="sm"
                            variant="ghost"
                            className="absolute top-2 right-2 bg-white/80 hover:bg-white text-red-500 hover:text-red-600"
                          >
                            <Heart className="w-4 h-4 fill-current" />
                          </Button>

                          {!inStock && (
                            <div className="absolute inset-0 bg-black/50 rounded-t-lg flex items-center justify-center">
                              <Badge className="bg-red-500 text-white">Out of Stock</Badge>
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{name}</h3>
                          <div className="flex items-center mb-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500 ml-2">({reviews})</span>
                          </div>
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <span className="text-lg font-bold text-gray-800">{price && price.toString().startsWith("BDT") ? price : `BDT ${price}`}</span>
                              {originalPrice && (
                                <span className="text-sm text-gray-500 line-through ml-2">{originalPrice}</span>
                              )}
                            </div>
                            <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                              {seller}
                            </Badge>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              onClick={async () => {
                                // add to cart handler (1 quantity)
                                const wishlistEntryId = item && item.product ? item.id : null;
                                const productObj: any = (item && (item.product || item.product_id)) ? item.product : item;
                                try {
                                  if (!inStock) return;
                                  // If user is authenticated and wishlist entry exists, use dedicated move endpoint
                                  const token = sessionStorage.getItem("accessToken") || localStorage.getItem("accessToken");
                                  if (token && wishlistEntryId) {
                                    setLoadingWishlist(true);
                                    await API.moveWishlistItemToCart(wishlistEntryId, { quantity: 1 });
                                    await refreshCart();
                                    const data = await API.getWishlist();
                                    setWishlist(data);
                                  } else {
                                    // Local or generic flow: use cart context
                                    await addToCart({ product: productObj, quantity: 1 });
                                    // If wishlist entry exists on server but we couldn't use move endpoint, try deleting it
                                    if (wishlistEntryId && token) {
                                      await API.deleteWishlistItem(wishlistEntryId);
                                      const data = await API.getWishlist();
                                      setWishlist(data);
                                    } else {
                                      // Remove from local wishlist state if present
                                      setWishlist((prev) => prev.filter((w) => (w.id ?? w.product?.id ?? w.id) !== (item.id ?? productObj.id)));
                                    }
                                  }
                                } catch (e: any) {
                                  setError(e?.message || "Failed to add to cart");
                                } finally {
                                  setLoadingWishlist(false);
                                }
                              }}
                              className={
                                inStock
                                  ? "flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                                  : "flex-1 bg-gray-200 text-gray-500 cursor-not-allowed"
                              }
                              disabled={!inStock}
                            >
                              <ShoppingBag className="w-4 h-4 mr-2" />
                              {inStock ? "Add to Cart" : "Out of Stock"}
                            </Button>
                            <Button
                              onClick={async () => {
                                // delete wishlist item handler
                                const wishlistEntryId = item && item.product ? item.id : null;
                                try {
                                  setLoadingWishlist(true);
                                  const token = sessionStorage.getItem("accessToken") || localStorage.getItem("accessToken");
                                  if (token && wishlistEntryId) {
                                    await API.deleteWishlistItem(wishlistEntryId);
                                    const data = await API.getWishlist();
                                    setWishlist(data);
                                  } else {
                                    // Local-only or product-only shape: remove from UI state
                                    const productObj: any = (item && (item.product || item.product_id)) ? item.product : item;
                                    setWishlist((prev) => prev.filter((w) => (w.id ?? w.product?.id ?? w.id) !== (item.id ?? productObj.id)));
                                  }
                                } catch (e: any) {
                                  setError(e?.message || "Failed to remove wishlist item");
                                } finally {
                                  setLoadingWishlist(false);
                                }
                              }}
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
                  );
                })}
            </div>
          </TabsContent>

          {/* Support Tab */}
          <TabsContent value="support" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Support Center <HeadphonesIcon className="inline-block w-6 h-6 ml-2" /></h2>
              <Button
                onClick={() => setShowTicketForm(true)}
                className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Ticket
              </Button>
            </div>

            {showTicketForm && (
              <Card className="border-gray-200 bg-white">
                <CardHeader>
                  <CardTitle className="text-gray-800">Submit Support Ticket <Pencil className="inline-block w-4 h-4 ml-2" /></CardTitle>
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
                          className="bg-white border-gray-200 focus:border-red-500 focus:ring-red-500"
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
                            {orders.map((order) => (
                              <SelectItem key={order.id} value={String(order.id)}>
                                {order.id} - {order.total && order.total.toString().startsWith("BDT") ? order.total : `BDT ${order.total}`}
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
                            <SelectItem value="ISSUE">Issue</SelectItem>
                            <SelectItem value="CHANGE">Change</SelectItem>
                            <SelectItem value="OTHER">Other</SelectItem>
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
                        className="min-h-[120px] bg-white border-gray-200 focus:border-red-500 focus:ring-red-500"
                        required
                      />
                    </div>
                    <div className="flex space-x-3">
                      <Button
                        type="submit"
                        className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white"
                      >
                        Submit Ticket <Rocket className="inline-block w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowTicketForm(false)}
                        className="border-red-100 text-gray-700 hover:bg-red-50"
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
              {loadingTickets && <p>Loading support tickets...</p>}
              {!loadingTickets && supportTickets.length === 0 && <p>No support tickets found.</p>}
              {!loadingTickets &&
                supportTickets.map((ticket) => (
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
                          <Badge className={getStatusColor(ticket.status.toLowerCase())}>{ticket.status}</Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-200 text-gray-700 hover:bg-gray-50 bg-transparent"
                            onClick={() => handleViewDetails(ticket)}
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
              <h2 className="text-2xl font-bold text-gray-800">My Profile <User className="inline-block w-6 h-6 ml-2" /></h2>
              {/* <Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50 bg-transparent">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button> */}
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
                  <p className="text-gray-600 mb-4">Valued Customer <Heart className="inline-block w-4 h-4 text-red-500" /></p>
                  <Button variant="outline" size="sm" className="border-gray-200 text-gray-700 hover:bg-gray-50 bg-transparent">
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
                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-700">Full Name</Label>
                        <Input
                          value={profile.name}
                          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                          className="bg-white border-gray-200 focus:border-red-500 focus:ring-red-500"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-700">Email Address</Label>
                        <Input
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          className="bg-white border-gray-200 focus:border-red-500 focus:ring-red-500"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-gray-700">Phone Number</Label>
                      <Input
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="bg-white border-gray-200 focus:border-red-500 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700">Address</Label>
                      <Textarea
                        value={profile.address}
                        onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                        className="bg-white border-gray-200 focus:border-red-500 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <Button
                        type="submit"
                        className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white"
                        disabled={savingProfile}
                      >
                        {savingProfile ? "Saving..." : <span>Save Changes <CheckSquare className="inline-block w-4 h-4 text-green-200" /></span>}
                      </Button>
                    </div>
                    {profileSaveError && (
                      <p className="text-red-600 text-sm">{profileSaveError}</p>
                    )}
                    {profileSaveSuccess && (
                      <p className="text-green-600 text-sm">Profile updated successfully!</p>
                    )}
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Account Settings <Settings className="inline-block w-6 h-6 text-gray-500" /></h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-gray-200 bg-white">
                <CardHeader>
                  <CardTitle className="text-gray-800">Notification Preferences <Bell className="inline-block w-6 h-6 text-gray-500" /></CardTitle>
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
                      <Label className="text-gray-700">Promotions &amp; Deals</Label>
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
                  <CardTitle className="text-gray-800">Security Settings <LockIcon className="inline-block w-6 h-6 text-gray-500" /></CardTitle>
                  <CardDescription className="text-gray-600">Manage your account security</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-gray-700">Current Password</Label>
                    <Input
                      type="password"
                      placeholder="Enter current password"
                      className="bg-white border-gray-200 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700">New Password</Label>
                    <Input
                      type="password"
                      placeholder="Enter new password"
                      className="bg-white border-gray-200 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700">Confirm New Password</Label>
                    <Input
                      type="password"
                      placeholder="Confirm new password"
                      className="bg-white border-gray-200 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                  <Button className="w-full bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white">
                    Update Password <CheckSquare className="inline-block w-4 h-4 text-white" />
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-gray-200 text-gray-700 hover:bg-gray-50 bg-transparent"
                  >
                    Enable Two-Factor Authentication <ShieldCheck className="inline-block w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {showMessageDialog && selectedTicket && (
          <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Support Ticket #{selectedTicket.id}</DialogTitle>
                <DialogDescription>{selectedTicket.subject}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {loadingMessages ? (
                  <p>Loading messages...</p>
                ) : (
                  ticketMessages.length === 0 ? (
                    <p>No messages yet.</p>
                  ) : (
                    ticketMessages.map((msg) => (
                      <div key={msg.id} className="border-b pb-2 mb-2">
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>From: {msg.sender || "Unknown"}</span>
                          <span>{msg.sent_at ? new Date(msg.sent_at).toLocaleString() : ""}</span>
                        </div>
                        <div className="mt-1 text-gray-800">{msg.message}</div>
                        {msg.attachment && (
                          <a href={msg.attachment} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-xs">Attachment</a>
                        )}
                      </div>
                    ))
                  )
                )}
              </div>
              <div className="mt-4 flex space-x-2">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1"
                  minLength={1}
                />
                <Button onClick={handleSendMessage} disabled={sendingMessage || !newMessage.trim()}>
                  {sendingMessage ? "Sending..." : "Send"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
