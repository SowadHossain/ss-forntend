import { ArrowLeft, MapPin, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Separator } from "../components/ui/separator";

import { API } from "../lib/api";

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const isAuthenticated =
    !!sessionStorage.getItem("accessToken") || !!localStorage.getItem("accessToken");

  // Scroll to top when the page mounts
  useEffect(() => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    } catch (e) {
      // fallback for environments without window
      // noop
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const fetchCart = async () => {
      setLoading(true);
      try {
        const data = await API.getCart();
        const rawItems: any[] = Array.isArray(data)
          ? data
          : data.results || data.items || data.cart || [];

        const normalized = rawItems.map((it: any) => ({
          id: it.id,
          quantity: it.quantity ?? 1,
          productId: it.product?.id,
          name: it.product?.name,
          price: parseFloat(it.product?.price ?? 0),
          originalPrice: parseFloat(it.product?.original_price ?? 0) || undefined,
          image: it.product?.image,
          seller: it.product?.seller,
          inStock: (it.product?.stock_quantity ?? 0) > 0,
          freeShipping: !!it.product?.free_shipping,
        }));

        setCartItems(normalized);
      } catch (err) {
        console.error("Failed to fetch cart for checkout:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [navigate, isAuthenticated]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const savings = cartItems.reduce((sum, item) => {
    if (item.originalPrice) return sum + (item.originalPrice - item.price) * item.quantity;
    return sum;
  }, 0);
  const shippingCost = cartItems.some((item) => !item.freeShipping) ? 9.99 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shippingCost + tax;

  const placeOrder = async () => {
    if (cartItems.length === 0) return;
    if (!address || !contactName || !phone) {
      alert("Please fill shipping name, phone and address before placing order.");
      return;
    }

    setPlacing(true);
    try {
      // Build simple order payload
      const payload = {
        shipping_address: {
          name: contactName,
          phone,
          address,
          city,
          zip,
        },
        payment_method: "card",
        items: cartItems.map((it) => ({ product_id: it.productId, quantity: it.quantity })),
        note: "Placed from demo checkout",
      };

      const res = await API.createOrder(payload);
      console.log("Order created:", res);

      // Try to clear cart entries (best-effort)
      await Promise.all(
        cartItems.map((it) =>
          it.id ? API.deleteCartItem(it.id).catch(() => undefined) : Promise.resolve()
        )
      );

      // Navigate to home with success message
      alert("Order placed successfully!");
      navigate("/");
    } catch (err: any) {
      console.error("Failed to place order:", err);
      alert(err?.message || "Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex justify-center items-center">
        <img src="https://shobshopping.com/logo.png" alt="Logo" className="w-20 h-20 animate-bounce mb-4" />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 text-gray-700 border-t border-red-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <ShoppingBag className="w-24 h-24 text-red-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">Add items to your cart before checking out.</p>
            <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-white">
              <Link to="/products">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 text-gray-700 border-t border-red-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-8">
          <Button variant="ghost" asChild className="mr-4 text-red-600">
            <Link to="/cart">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Cart
            </Link>
          </Button>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-red-600">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="border border-red-100 bg-white">
              <CardHeader>
                <CardTitle className="text-red-600">Shipping Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input placeholder="Full name" value={contactName} onChange={(e) => setContactName(e.target.value)} />
                  <Input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  <Input placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} className="md:col-span-2" />
                  <Input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
                  <Input placeholder="ZIP / Postal code" value={zip} onChange={(e) => setZip(e.target.value)} />
                </div>

                <div className="mt-6">
                  <h3 className="font-semibold mb-2 text-red-600">Payment</h3>
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline">Card</Badge>
                    <span className="text-sm text-gray-600">We only simulate payment in this demo.</span>
                  </div>
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input placeholder="Card number" />
                    <Input placeholder="MM/YY - CVC" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6 border border-red-100 bg-white">
              <CardHeader>
                <CardTitle className="text-red-600">Order Items</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {cartItems.map((item) => (
                    <div key={item.id} className="p-6 flex items-start space-x-4">
                      <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-lg font-semibold text-gray-900">{item.name}</div>
                            <p className="text-sm text-gray-600">Sold by {item.seller}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold">BDT {(item.price * item.quantity).toFixed(2)}</div>
                            <div className="text-sm text-gray-600">Qty {item.quantity}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-8 border border-red-100 bg-white">
              <CardHeader>
                <CardTitle className="text-red-600">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between"><span>Subtotal</span><span>BDT {subtotal.toFixed(2)}</span></div>
                {savings > 0 && <div className="flex justify-between text-red-600"><span>Savings</span><span>- BDT {savings.toFixed(2)}</span></div>}
                <div className="flex justify-between"><span>Shipping</span><span className={shippingCost === 0 ? "text-green-600" : ""}>{shippingCost === 0 ? "Free" : `BDT ${shippingCost.toFixed(2)}`}</span></div>
                <div className="flex justify-between"><span>Tax</span><span>BDT {tax.toFixed(2)}</span></div>

                <Separator />

                <div className="flex justify-between text-lg font-bold"><span>Total</span><span>BDT {total.toFixed(2)}</span></div>

                <Button size="lg" className="w-full bg-red-600 hover:bg-red-700 text-white" onClick={placeOrder} disabled={placing}>
                  {placing ? "Placing order..." : "Place Order"}
                </Button>

                <div className="text-center text-sm text-gray-600">
                  <p>Estimated delivery: 3-7 business days</p>
                  <p className="flex items-center justify-center gap-2 mt-2"><MapPin /> Shipping address required</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
