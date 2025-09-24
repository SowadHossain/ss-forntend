import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Separator } from "../components/ui/separator";

import { API } from "../lib/api";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([])
  const [promoCode, setPromoCode] = useState("")
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const isAuthenticated =
    !!sessionStorage.getItem("accessToken") || !!localStorage.getItem("accessToken")

  // Fetch cart items from API on mount
  useEffect(() => {
    if (!isAuthenticated) {
      // Not logged in — redirect to login page
      navigate("/login")
      return
    }

    const fetchCart = async () => {
      setLoading(true)
      try {
        const data = await API.getCart()
        console.log("API.getCart response:", data)

        const rawItems: any[] = Array.isArray(data)
          ? data
          : data.results || data.items || data.cart || []

        const normalized = rawItems.map(it => ({
          // keep cart item id for update/delete calls
          id: it.id,
          quantity: it.quantity ?? 1,
          addedAt: it.added_at,
          // flatten product fields for easier rendering
          productId: it.product?.id,
          name: it.product?.name,
          price: parseFloat(it.product?.price ?? 0),
          originalPrice: parseFloat(it.product?.original_price ?? 0) || undefined,
          image: it.product?.image,
          seller: it.product?.seller,
          inStock: (it.product?.stock_quantity ?? 0) > 0,
          freeShipping: !!it.product?.free_shipping
        }))

        setCartItems(normalized)
      } catch (err) {
        console.error("Failed to fetch cart:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchCart()
  }, [navigate, isAuthenticated])

  // Update quantity using API
  const updateQuantity = async (id: number, newQuantity: number) => {
    if (newQuantity < 1) return
    try {
      await API.updateCartItem(id, { product_id: id, quantity: newQuantity })
      setCartItems(items =>
        items.map(item => item.id === id ? { ...item, quantity: newQuantity } : item)
      )
    } catch (err) {
      // handle error
    }
  }

  // Remove item using API
  const removeItem = async (id: number) => {
    try {
      await API.deleteCartItem(id)
      setCartItems(items => items.filter(item => item.id !== id))
    } catch (err) {
      // handle error
    }
  }

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const savings = cartItems.reduce((sum, item) => {
    if (item.originalPrice) {
      return sum + (item.originalPrice - item.price) * item.quantity
    }
    return sum
  }, 0)
  const shippingCost = cartItems.some((item) => !item.freeShipping) ? 9.99 : 0
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + shippingCost + tax

  if (loading) {
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

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 text-gray-700 border-t border-red-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <ShoppingBag className="w-24 h-24 text-red-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
            <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-white">
              <Link to ="/products">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 text-gray-700 border-t border-red-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button variant="ghost" asChild className="mr-4 text-red-600">
            <Link to="/products">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Link>
          </Button>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-red-600">Shopping Cart</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card className="border border-red-100 bg-white">
              <CardHeader>
                <CardTitle className="text-red-600">Cart Items ({cartItems.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {cartItems.map((item) => (
                    <div key={item.id} className="p-6">
                      <div className="flex items-start space-x-4">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={100}
                          height={100}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <Link
                                to={`/products/${item.productId}`}
                                className="text-lg font-semibold text-gray-900 hover:text-red-600"
                              >
                                {item.name}
                              </Link>
                              <p className="text-sm text-gray-600 mt-1">
                                Sold by{" "}
                                <Link
                                  to={`/sellers/${item.seller?.toLowerCase().replace(" ", "-")}`}
                                  className="text-red-600 hover:underline"
                                >
                                  {item.seller}
                                </Link>
                              </p>
                              <div className="flex items-center mt-2 space-x-2">
                                {item.inStock ? (
                                  <Badge variant="secondary" className="text-red-700 bg-red-100">
                                    In Stock
                                  </Badge>
                                ) : (
                                  <Badge variant="destructive">Out of Stock</Badge>
                                )}
                                {item.freeShipping && <Badge variant="outline" className="text-red-600 border-red-100">Free Shipping</Badge>}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>

                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center space-x-3">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="w-12 text-center font-medium">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>

                            <div className="text-right">
                              <div className="text-lg font-bold text-gray-900">
                                BDT {(item.price * item.quantity).toFixed(2)}
                              </div>
                              {item.originalPrice && (
                                <div className="text-sm text-gray-500 line-through">
                                  BDT {(item.originalPrice * item.quantity).toFixed(2)}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Promo Code */}
            <Card className="mt-6 border border-red-100 bg-white">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 text-red-600">Promo Code</h3>
                <div className="flex space-x-4">
                  <Input
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline" className="text-red-600 border-red-100">Apply</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-8 border border-red-100 bg-white">
              <CardHeader>
                <CardTitle className="text-red-600">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span>BDT {subtotal.toFixed(2)}</span>
                </div>

                {savings > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Savings</span>
                    <span>- BDT {savings.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className={shippingCost === 0 ? "text-green-600" : ""}>{shippingCost === 0 ? "Free" : `BDT ${shippingCost.toFixed(2)}`}</span>
                </div>

                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>BDT {tax.toFixed(2)}</span>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>BDT {total.toFixed(2)}</span>
                </div>

                <Button size="lg" className="w-full bg-red-600 hover:bg-red-700 text-white" asChild>
                  <Link to="/checkout">Proceed to Checkout</Link>
                </Button>

                {/* <div className="text-center text-sm text-gray-600">
                  <p>Free shipping on orders over BDT 50</p>
                  <p>30-day return policy</p>
                </div> */}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
