import {
  Bolt,
  ChevronLeft,
  ChevronRight,
  Heart,
  Lock,
  MapIcon,
  MessageCircle,
  Minus,
  Plus,
  Share2,
  ShoppingCart,
  Star
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import FooterSection from "../components/HomePage/FooterSection";
import Navbar from "../components/ProductsPage/NavbarSection";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { useCart } from "../context/CartContext";
import { API } from "../lib/api";

// Types for product data fetched from API
type ProductType = {
  id: number | string;
  name?: string;
  price?: number;
  originalPrice?: number;
  original_price?: number | string;
  rating?: number;
  reviews?: number;
  images?: string[];
  image?: string;
  image_url?: string;
  seller?: any;
  category?: { id?: number; name?: string } | string | null;
  inStock?: boolean;
  stockCount?: number;
  freeShipping?: boolean;
  description?: string;
  features?: string[];
  specifications?: Record<string, any>;
  variants?: any;
};


const reviews = [
  {
    id: 1,
    user: "John D.",
    rating: 5,
    date: "2024-01-15",
    comment:
      "Excellent sound quality and very comfortable to wear for long periods. The noise cancellation works great!",
    helpful: 12,
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 2,
    user: "Sarah M.",
    rating: 4,
    date: "2024-01-10",
    comment:
      "Good headphones overall. Battery life is impressive. Only minor complaint is they can feel a bit tight after extended use.",
    helpful: 8,
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 3,
    user: "Mike R.",
    rating: 5,
    date: "2024-01-05",
    comment:
      "Best headphones I've owned. Great value for money and the seller shipped very quickly.",
    helpful: 15,
    avatar: "/placeholder.svg?height=32&width=32",
  },
];

export default function ProductDetailPage() {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  // const [selectedColor, setSelectedColor] = useState("Black");
  const [quantity, setQuantity] = useState(1);
  const [addLoading, setAddLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Wishlist & Share state
  const [wishLoading, setWishLoading] = useState(false);
  const [wishAdded, setWishAdded] = useState(false);
  const [wishError, setWishError] = useState<string | null>(null);

  const [shareLoading, setShareLoading] = useState(false);
  const [shareMessage, setShareMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await API.getProductById(Number(id));
        if (!cancelled) setProduct(data);
      } catch (err: any) {
        if (!cancelled) setError(err.message || "Failed to load product");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  // Scroll to top when the page mounts or when the product id changes
  useEffect(() => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    } catch (e) {
      // fallback for environments without window
      // noop
    }
  }, [id]);

  // Keep quantity valid whenever product's stock changes.
  // This effect must run unconditionally to preserve hook order.
  useEffect(() => {
    const stockQuantity = Number((product as any)?.stock_quantity ?? product?.stockCount ?? 0);
    if (stockQuantity === 0) {
      setQuantity(0);
    } else if (quantity === 0) {
      setQuantity(1);
    } else if (quantity > stockQuantity) {
      setQuantity(Math.min(quantity, stockQuantity));
    }
  }, [product, quantity]);

  // Reviews
  const [reviewsList, setReviewsList] = useState<any[] | null>(null);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState<string | null>(null);

  // Review form
  const [ratingInput, setRatingInput] = useState<number>(5);
  const [commentInput, setCommentInput] = useState<string>("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  // Pagination for reviews
  const [reviewsPage, setReviewsPage] = useState<number>(1);
  const REVIEWS_PER_PAGE = 5;

  // Fetch reviews for this product (client-side filter by product id)
  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    const loadReviews = async () => {
      try {
        setReviewsLoading(true);
        setReviewsError(null);
        const all = await API.getReviews();
        if (cancelled) return;
        const filtered = Array.isArray(all)
          ? all.filter((r: any) => Number(r.product) === Number(id))
          : [];
        setReviewsList(filtered);
      } catch (err: any) {
        if (!cancelled) setReviewsError(err.message || "Failed to load reviews");
      } finally {
        if (!cancelled) setReviewsLoading(false);
      }
    };
    loadReviews();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] pt-20">
          <img
            src="https://shobshopping.com/logo.png"
            alt="Loading..."
            className="w-16 h-16 animate-bounce mb-4"
          />
          <p className="text-gray-600 text-lg">Loading product details...</p>
        </div>
        <FooterSection />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <p className="text-lg text-red-600">{error}</p>
          <div className="mt-6">
            <Link to="/products" className="text-blue-600 underline">Back to products</Link>
          </div>
        </div>
      </div>
    );
  }

  const p = product || ({} as ProductType);
  // Normalize fields returned by the API to convenient local variables
  // Product API may return a nested category with parent id and parent_name.
  // Build a normalized category object with helpful fallbacks.
  const rawCategory: any = typeof p.category === 'string' ? { name: p.category } : (p.category || null);
  const normalizedCategory = {
    id: rawCategory?.id ?? undefined,
    name: rawCategory?.name ?? '',
    parentId: rawCategory?.parent ?? null,
    parentName: rawCategory?.parent_name ?? null,
  };

  // Choose a display category for breadcrumb/badge/links.
  // Prefer parentName when present (so link goes to parent/top-level category),
  // otherwise use the category name.
  const categoryName = normalizedCategory.parentName || normalizedCategory.name || '';
  // Build a unified media list that includes images and media entries (images/videos)
  type MediaItem = { type: 'IMAGE' | 'VIDEO'; url: string };
  const rawImages: string[] = (p.images && (p.images as any).length) ? (p.images as string[]) : (
    p.image ? [p.image as string] : (p.image_url ? [p.image_url as string] : [])
  );

  const productMedia = (p as any).media || (p as any).media_items || [];
  const mediaItems: MediaItem[] = [];

  // Add raw image strings first (preserve existing order)
  for (const img of rawImages) {
    if (img) mediaItems.push({ type: 'IMAGE', url: img });
  }

  // Add explicit media objects from API (they may be images or videos)
  if (Array.isArray(productMedia)) {
    for (const m of productMedia) {
      const mt = (m.media_type || m.type || '').toString().toUpperCase();
      const url = m.media_url || m.url || m.file_path || m.filePath || '';
      if (!url) continue;
      if (mt === 'VIDEO' || mt === 'YOUTUBE' || /youtu/.test(url)) {
        mediaItems.push({ type: 'VIDEO', url: url });
      } else {
        mediaItems.push({ type: 'IMAGE', url: url });
      }
    }
  }

  // Fallback placeholder if nothing available
  if (mediaItems.length === 0) {
    mediaItems.push({ type: 'IMAGE', url: '/placeholder.svg?height=500&width=500' });
  }
  const price = p.price !== undefined ? Number(p.price) : undefined;
  const originalPrice = (p as any).original_price ?? p.originalPrice ?? undefined;
  const stockQuantity = Number((p as any).stock_quantity ?? p.stockCount ?? 0);
  const rating = p.rating !== undefined ? Number(p.rating) : 0;
  const reviewsCount = p.reviews ?? 0;
  const sellerName = typeof p.seller === "string" ? p.seller : p.seller?.name;

  const isAuthenticated = !!sessionStorage.getItem("accessToken") || !!localStorage.getItem("accessToken");

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (stockQuantity === 0) return;
    setAddLoading(true);
    try {
      await addToCart({ product: p as any, quantity });
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } catch (err) {
      // optional: show toast
    } finally {
      setAddLoading(false);
    }
  };

  const handleAddToWishlist = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (!p.id) return;
    setWishLoading(true);
    setWishError(null);
    try {
      await API.createWishlistItem({ product_id: Number(p.id) });
      setWishAdded(true);
      setTimeout(() => setWishAdded(false), 1500);
    } catch (err: any) {
      setWishError(err?.message || "Failed to add to wishlist");
    } finally {
      setWishLoading(false);
    }
  };

  const handleShare = async () => {
    setShareLoading(true);
    try {
      const url = typeof window !== 'undefined' ? window.location.href : '';
      const shareData = { title: p.name || 'Product', text: p.description || '', url };
      // Prefer Web Share API
      if (typeof navigator !== 'undefined' && (navigator as any).share) {
        await (navigator as any).share(shareData);
        setShareMessage('Shared');
      } else if (typeof navigator !== 'undefined' && (navigator as any).clipboard) {
        await (navigator as any).clipboard.writeText(url);
        setShareMessage('Link copied to clipboard');
      } else if (url) {
        // fallback to opening share dialog (Facebook) in new tab
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        setShareMessage('Opened share dialog');
      }
      setTimeout(() => setShareMessage(null), 1800);
    } catch (err: any) {
      setShareMessage(err?.message || 'Failed to share');
    } finally {
      setShareLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-green-50">
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="md:flex items-center space-x-2 text-sm text-gray-700 mb-8 hidden">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-blue-600">Products</Link>
            <span>/</span>
            <Link to={`/products?category=${categoryName.toString().toLowerCase()}`} className="hover:text-blue-600">{categoryName}</Link>
            <span>/</span>
            <span className="text-gray-900">{p.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-12 md:pt-0">
            {/* Product Images / Media Slider */}
            <div>
              <div className="mb-4">
                <div className="w-full aspect-square overflow-hidden rounded-lg border border-gray-200 bg-white flex items-center justify-center relative">
                  {/* Blurred background fill using the same image/video thumbnail */}
                  <div className="absolute inset-0 rounded-lg overflow-hidden" aria-hidden>
                    <div
                      style={{ backgroundImage: `url(${mediaItems[selectedImage]?.url || '/placeholder.svg?height=500&width=500'})` }}
                      className="w-full h-full bg-center bg-cover filter blur-2xl scale-105"
                    />
                    <div className="absolute inset-0 bg-white/30" />
                  </div>

                  {/* Prev/Next controls */}
                  <button
                    aria-label="previous"
                    onClick={() => setSelectedImage((s) => Math.max(0, s - 1))}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/80 rounded-full p-1 hover:scale-105"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    aria-label="next"
                    onClick={() => setSelectedImage((s) => Math.min(mediaItems.length - 1, s + 1))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/80 rounded-full p-1 hover:scale-105"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>

                  {/* Main media display: image or video embed */}
                  <div className="relative z-10 w-full h-full flex items-center justify-center">
                    {mediaItems[selectedImage]?.type === 'VIDEO' ? (
                      (() => {
                        const url = mediaItems[selectedImage].url;
                        // Try to extract YouTube id
                        const ytMatch = url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{6,})/);
                        const videoId = ytMatch ? ytMatch[1] : null;
                        const embedSrc = videoId ? `https://www.youtube.com/embed/${videoId}` : url;
                        return (
                          <iframe
                            title={p.name || 'product-video'}
                            src={embedSrc}
                            className="w-full h-full"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        );
                      })()
                    ) : (
                      <img
                        src={mediaItems[selectedImage]?.url || '/placeholder.svg?height=500&width=500'}
                        alt={p.name}
                        className="relative z-10 max-w-full max-h-full object-contain"
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {mediaItems.map((m, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`border-2 rounded-lg overflow-hidden transition ${selectedImage === index ? 'border-blue-500' : 'border-gray-200'}`}>
                    {m.type === 'VIDEO' ? (
                      <div className="relative w-full h-20 bg-gray-100">
                        {/* use YouTube thumbnail if possible */}
                        {(() => {
                          const url = m.url;
                          const ytMatch = url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{6,})/);
                          const id = ytMatch ? ytMatch[1] : null;
                          const thumb = id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : undefined;
                          return (
                            <>
                              <img src={thumb || url} alt={`video ${index + 1}`} className="w-full h-20 object-cover" />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <svg className="w-10 h-10 text-white/90" viewBox="0 0 24 24" fill="none">
                                  <circle cx="12" cy="12" r="12" fill="rgba(0,0,0,0.5)" />
                                  <path d="M10 8l6 4-6 4V8z" fill="white" />
                                </svg>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    ) : (
                      <img src={m.url} alt={`${p.name} ${index + 1}`} className="w-full h-20 object-cover" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div>
              {/* Title & Rating */}
              <div className="mb-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#cf2633] mb-2">{p.name}</h1>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                    ))}
                    <span className="ml-2 text-sm text-gray-700">{rating.toString()} ({reviewsCount.toString()} reviews)</span>
                  </div>
                  <Badge variant="secondary">{categoryName}</Badge>
                </div>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-center space-x-4">
                  <span className="text-3xl font-bold text-gray-900">BDT {price ?? ""}</span>
                  {originalPrice && (
                    <>
                      <span className="text-xl text-gray-500 line-through">BDT {originalPrice}</span>
                      <Badge className="bg-red-500">Save {(price && originalPrice ? (((Number(originalPrice) - Number(price)) / Number(originalPrice)) * 100).toFixed(0) + '%' : '')}</Badge>
                    </>
                  )}
                </div>
                {/* freeShipping not provided by API by default; hide if absent */}
              </div>

              {/* Seller Info */}
              <Card className="mb-6 border border-gray-200 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src="" />
                        <AvatarFallback>
                          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                            <circle cx="16" cy="16" r="16" fill="#e5e7eb" />
                            <path d="M16 17c3.314 0 6 2.686 6 6v1H10v-1c0-3.314 2.686-6 6-6zm0-2a4 4 0 100-8 4 4 0 000 8z" fill="#9ca3af"/>
                          </svg>
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        {/* <Link to={`/sellers/${(sellerName || "").toString().toLowerCase().replace(" ", "-")}`} className="font-semibold text-blue-600 hover:underline">{sellerName}</Link> */}
                        {sellerName}
                        {/* Seller rating/totalSales not provided by product API; omit if missing */}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => navigate('/buyer-dashboard?tab=support')}>
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Support Ticket
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Variants */}
              <div className="mb-6">
                {/* <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color: {selectedColor}</label>
                  <div className="flex space-x-2">
                    {(p.variants?.color || ["Default"]).map((color: string) => (
                      <button key={color} onClick={() => setSelectedColor(color)} className={`px-4 py-2 border rounded-md text-sm ${selectedColor === color ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-300 hover:border-gray-400"}`}>{color}</button>
                    ))}
                  </div>
                </div> */}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                  {stockQuantity > 0 ? (
                    <>
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          disabled={quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-12 text-center font-medium">{quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setQuantity(Math.min(stockQuantity, quantity + 1))}
                          disabled={quantity >= stockQuantity}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{stockQuantity} items available</p>
                    </>
                  ) : (
                    <p className="text-sm text-red-600 mt-1">Out of stock</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4 mb-6">
                <Button size="lg" onClick={handleAddToCart} disabled={stockQuantity === 0 || addLoading || added} className="w-full bg-red-600 text-white text-sm rounded-md hover:bg-red-700 hover:opacity-90 disabled:opacity-50">
                  {added ? (
                    "Added!"
                  ) : addLoading ? (
                    "Adding..."
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Add to Cart
                    </>
                  )}
                </Button>
                <div className="flex space-x-4">
                  <Button
                    variant={wishAdded ? 'default' : 'outline'}
                    size="lg"
                    className="flex-1"
                    onClick={handleAddToWishlist}
                    disabled={wishLoading}
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    {wishAdded ? 'Added' : (wishLoading ? 'Adding...' : 'Add to Wishlist')}
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    className="flex-1"
                    onClick={handleShare}
                    disabled={shareLoading}
                  >
                    <Share2 className="w-5 h-5 mr-2" />
                    {shareLoading ? 'Sharing...' : 'Share'}
                  </Button>
                </div>
                {wishError && <div className="text-sm text-red-600 mt-2">{wishError}</div>}
                {shareMessage && <div className="text-sm text-green-600 mt-2">{shareMessage}</div>}
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 text-center text-sm pt-6">
                <div className="flex flex-col items-center">
                  <MapIcon className="w-6 h-6 text-[#cf2633] mb-2" />
                  <span>Nationwide Shipping</span>
                </div>
                <div className="flex flex-col items-center">
                  <Bolt className="w-6 h-6 text-[#cf2633] mb-2" />
                  <span>Lightning-Fast Delivery</span>
                </div>
                <div className="flex flex-col items-center">
                  <Lock className="w-6 h-6 text-[#cf2633] mb-2" />
                  <span>100% Secure Checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section (improved layout) */}
        {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold">Customer reviews</h2>
                  <p className="text-sm text-gray-600">Read feedback from verified buyers</p>
                </div>
                <div className="text-right">
                  {(() => {
                    const list = reviewsList || [];
                    const avg = list.length ? (list.reduce((s: number, r: any) => s + Number(r.rating || 0), 0) / list.length) : rating || 0;
                    return (
                      <div className="inline-flex items-center space-x-3">
                        <div className="text-3xl font-bold text-yellow-500">{avg ? avg.toFixed(1) : '—'}</div>
                        <div className="text-sm text-gray-600">{(reviewsList && reviewsList.length) || reviewsCount} reviews</div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              <div className="space-y-4">
                {reviewsLoading ? (
                  <div className="p-6 bg-white border rounded-md">Loading reviews...</div>
                ) : reviewsError ? (
                  <div className="p-4 bg-red-50 text-red-600 rounded-md">{reviewsError}</div>
                ) : (reviewsList && reviewsList.length > 0) ? (
                  (() => {
                    const total = reviewsList.length;
                    const totalPages = Math.max(1, Math.ceil(total / REVIEWS_PER_PAGE));
                    const page = Math.min(reviewsPage, totalPages);
                    const start = (page - 1) * REVIEWS_PER_PAGE;
                    const end = start + REVIEWS_PER_PAGE;
                    const pageItems = reviewsList.slice(start, end);
                    return (
                      <div>
                        <div className="space-y-4">
                          {pageItems.map((r: any) => (
                            <article key={r.id} className="p-4 bg-white border rounded-lg shadow-sm">
                              <div className="flex items-start gap-4">
                                <Avatar>
                                  <AvatarImage src={r.avatar || "/placeholder.svg?height=48&width=48"} />
                                  <AvatarFallback className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100">{(r.user_name || r.user || "U").toString().charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <div className="font-medium text-gray-800">{r.user_name || `User ${r.user}`}</div>
                                    <time className="text-xs text-gray-500">{r.created_at ? new Date(r.created_at).toLocaleDateString() : ''}</time>
                                  </div>
                                  <div className="mt-2 flex items-center gap-2">
                                    <div className="flex items-center text-yellow-400">
                                      {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-4 h-4 ${i < Number(r.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
                                      ))}
                                    </div>
                                    <div className="text-sm text-gray-600">{r.rating} / 5</div>
                                  </div>
                                  <p className="mt-3 text-gray-700">{r.comment}</p>
                                </div>
                              </div>
                            </article>
                          ))}
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          <div className="text-sm text-gray-600">Showing {start + 1}–{Math.min(end, total)} of {total} reviews</div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setReviewsPage((p) => Math.max(1, p - 1))}
                              disabled={page <= 1}
                              className={`px-3 py-1 rounded-md border ${page <= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                            ><ChevronLeft /></button>

                            <div className="hidden sm:flex items-center space-x-1">
                              {Array.from({ length: totalPages }).map((_, i) => {
                                const num = i + 1;
                                return (
                                  <button key={num} onClick={() => setReviewsPage(num)} className={`px-3 py-1 rounded-md border ${num === page ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'}`}>{num}</button>
                                );
                              })}
                            </div>
                            <button
                              onClick={() => setReviewsPage((p) => Math.min(totalPages, p + 1))}
                              disabled={page >= totalPages}
                              className={`px-3 py-1 rounded-md border ${page >= totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                            ><ChevronRight /></button>
                          </div>
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <div className="p-6 bg-white border rounded-md text-gray-600">No reviews yet for this product.</div>
                )}
              </div>
            </div>

            <aside className="w-full lg:w-96">
              <Card className="sticky top-20 p-4">
                <CardContent>
                  <div className="mb-4">
                    <div className="text-sm text-gray-500">Write a review</div>
                    <h3 className="text-lg font-medium">Share your experience</h3>
                    <p className="text-xs text-gray-500 mt-1">Your review helps others make better choices.</p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Rating</label>
                      <select value={ratingInput} onChange={(e) => setRatingInput(Number(e.target.value))} className="mt-1 block w-full rounded-md border-gray-300">
                        {[5,4,3,2,1].map((n) => (
                          <option key={n} value={n}>{n} star{n>1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Comment</label>
                      <textarea
                      ref={(el) => {}}
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      rows={5}
                      className="mt-1 block w-full rounded-md border border-gray-300 focus:border-blue-500"
                      />
                    </div>

                    {submitError && <div className="text-sm text-red-600">{submitError}</div>}

                    <div className="flex items-center gap-3">
                      <Button
                        onClick={async () => {
                          if (!isAuthenticated) { navigate('/login'); return; }
                          if (!id) return;
                          setSubmitError(null);
                          setSubmittingReview(true);
                          try {
                            await API.createReview({ product: Number(id), rating: Number(ratingInput), comment: commentInput });
                            const all = await API.getReviews();
                            const filtered = Array.isArray(all) ? all.filter((r: any) => Number(r.product) === Number(id)) : [];
                            setReviewsList(filtered);
                            setCommentInput("");
                            setRatingInput(5);
                             setReviewsPage(1);
                             setReviewsPage(1);
                          } catch (err: any) {
                            setSubmitError(err.message || 'Failed to submit review');
                          } finally {
                            setSubmittingReview(false);
                          }
                        }}
                        className="flex-1"
                        disabled={submittingReview}
                      >
                        {submittingReview ? 'Submitting...' : 'Submit review'}
                      </Button>

                      <Button variant="outline" onClick={() => {
                        if (!isAuthenticated) { navigate('/login'); return; }
                        setCommentInput(''); setRatingInput(5);
                      }}>Reset</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div> */}
      </div>

      <FooterSection />

      {/* Chat widget — passes current product context for smarter answers */}
      {/* <ChatWidget product={{ id: p.id, name: p.name, price, stockQuantity, seller: sellerName }} /> */}
      
    </div>
  );
}
