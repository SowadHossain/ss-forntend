import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Eye, EyeOff, Lock, Mail, Star, User
} from "lucide-react"
import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import CookieConsent from "../components/CookieConsent"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Checkbox } from "../components/ui/checkbox"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { API } from "../lib/api"

/** Status banner component */
function StatusMessage({ type, message, onClose }: { 
  type: "error" | "success"; 
  message: string; 
  onClose?: () => void 
}) {
  const styles = type === "error"
    ? "bg-red-50 text-red-700 border-red-200"
    : "bg-green-50 text-green-700 border-green-200"
  const Icon = type === "error" ? AlertCircle : CheckCircle2

  return (
    <div className={`flex items-center justify-between p-3 mb-4 text-sm border rounded-lg ${styles}`}>
      <div className="flex items-center space-x-2">
        <Icon className="w-5 h-5" />
        <span>{message}</span>
      </div>
      {onClose && (
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      )}
    </div>
  )
}

export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [status, setStatus] = useState<{ type: "error" | "success"; message: string } | null>(null)

  const [loginData, setLoginData] = useState({ email: "", password: "", remember: false })
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  })

  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [cookieAccepted, setCookieAccepted] = useState(false)

  // Scroll to top when the page mounts
  useEffect(() => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    } catch (e) {
      // fallback for environments without window
      // noop
    }
    // initialize cookieAccepted from existing cookie
    try {
      const match = document.cookie.match(/(?:^|; )cookie_consent=([^;]*)/);
      if (match) setCookieAccepted(Boolean(match[1]))
    } catch (e) {}
    // listen for accept event from CookieConsent
    const onAccept = () => setCookieAccepted(true)
    window.addEventListener("cookie-consent-accepted", onAccept)
    return () => window.removeEventListener("cookie-consent-accepted", onAccept)
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus(null)
    setIsLoggingIn(true)
    try {
      const data = await API.login(loginData.email, loginData.password)
      const access = (data as any)?.access || (data as any)?.access_token
      const refresh = (data as any)?.refresh || (data as any)?.refresh_token
      if (access) sessionStorage.setItem("accessToken", access)
      // Only persist refresh token if user checked "Remember me" and cookie consent exists
      if (loginData.remember && refresh && cookieAccepted) {
        document.cookie = `refreshToken=${refresh}; path=/; max-age=${60 * 60 * 24 * 30}`
      } else {
        // clear any existing refresh token
        document.cookie = "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;"
      }

      let role: string | undefined
      try {
        const profile = await API.getProfile()
        role = (profile as any)?.role || (profile as any)?.user?.role
      } catch {}

      setStatus({ type: "success", message: "Login successful! Redirecting..." })
      setTimeout(() => {
        if (role?.toLowerCase() === "admin") window.location.href = "/admin"
        else if (role?.toLowerCase() === "seller") window.location.href = "/seller-dashboard"
        else window.location.href = "/buyer-dashboard"
      }, 1200)
    } catch (err: any) {
      setStatus({ type: "error", message: err?.message || "Login failed. Check your credentials." })
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus(null)

    if (registerData.password !== registerData.confirmPassword) {
      setStatus({ type: "error", message: "Passwords do not match!" })
      return
    }
    if (!registerData.terms) {
      setStatus({ type: "error", message: "Please accept the terms and conditions!" })
      return
    }

    setIsRegistering(true)
    const payload = {
      name: registerData.name,
      email: registerData.email,
      password: registerData.password,
      role: "BUYER",
    }

    try {
      await API.register(payload)
      setStatus({ type: "success", message: "Registration successful! Redirecting to login..." })
      setTimeout(() => (window.location.href = "/login"), 1500)
    } catch (err: any) {
      setStatus({ type: "error", message: err?.message || "Registration failed. Try again." })
    } finally {
      setIsRegistering(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center p-4">
      <CookieConsent />
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* LEFT BRANDING SECTION */}
        <div className="hidden lg:flex flex-col justify-center space-y-8">
          <div className="flex items-center space-x-3 mb-3 hover:cursor-pointer" onClick={() => (window.location.href = "/")}>
            <img src="/logo.png" alt="Logo" className="w-12 h-12" />
            <span className="text-3xl font-bold text-[#cd2733]">ShobShopping</span>
          </div>
          <h1 className="text-4xl font-bold text-[#cd2733]">Welcome to the Future of Shopping</h1>
          <p className="text-lg text-gray-600">
            Join millions of users who trust us for buying and selling products securely.
          </p>

          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-red-400 to-pink-500">
                <Star className="text-white w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Premium Quality</h3>
                <p className="text-gray-600 text-sm">Verified sellers and authentic products</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-orange-400 to-red-500">
                <ArrowRight className="text-white w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Fast Delivery</h3>
                <p className="text-gray-600 text-sm">Worldwide shipping made simple</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT AUTH CARD */}
        <div className="w-full max-w-md mx-auto">
          <Card className="border-gray-200 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-2">
              <div className="lg:hidden flex items-center justify-center space-x-2 mb-4 hover:cursor-pointer" onClick={() => (window.location.href = "/")}>
                <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-lg" />
                <span className="text-xl font-bold text-[#cd2733]">ShobShopping</span>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-800">Get Started</CardTitle>
              <CardDescription className="text-gray-600">Sign in or create an account</CardDescription>
            </CardHeader>
            <CardContent>
              {status && <StatusMessage type={status.type} message={status.message} onClose={() => setStatus(null)} />}

              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100">
                  <TabsTrigger value="login" className="data-[state=active]:bg-white data-[state=active]:text-red-600">Login</TabsTrigger>
                  <TabsTrigger value="register" className="data-[state=active]:bg-white data-[state=active]:text-red-600">Sign Up</TabsTrigger>
                </TabsList>

                {/* LOGIN FORM */}
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <Label>Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input 
                          type="email"
                          value={loginData.email}
                          onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                          placeholder="you@example.com"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input 
                          type={showPassword ? "text" : "password"}
                          value={loginData.password}
                          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                          placeholder="••••••••"
                          className="pl-10 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={loginData.remember}
                          onCheckedChange={(c) => {
                            if (!cookieAccepted) return
                            setLoginData({ ...loginData, remember: c as boolean })
                          }}
                          id="remember"
                          disabled={!cookieAccepted}
                        />
                        <Label htmlFor="remember" className={`text-sm ${!cookieAccepted ? "text-gray-400" : ""}`}>Remember me</Label>
                      </div>
                      <Link to="/auth/forgot-password" className="text-sm text-red-600 hover:underline">Forgot password?</Link>
                    </div>
                    <Button disabled={isLoggingIn} className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white">
                      {isLoggingIn ? "Signing In..." : "Sign In"}
                    </Button>
                  </form>
                </TabsContent>

                {/* REGISTER FORM */}
                <TabsContent value="register">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                      <Label>Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          value={registerData.name}
                          onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                          placeholder="John Doe"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          type="email"
                          value={registerData.email}
                          onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                          placeholder="you@example.com"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    {/* Account type removed - registrations are buyers by default */}

                    <div>
                      <Label>Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          value={registerData.password}
                          onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                          placeholder="••••••••"
                          className="pl-10 pr-10"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          value={registerData.confirmPassword}
                          onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                          placeholder="••••••••"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={registerData.terms}
                        onCheckedChange={(c) => setRegisterData({ ...registerData, terms: c as boolean })}
                        id="terms"
                      />
                      <Label htmlFor="terms" className="text-sm">
                        I agree to the <Link to="/terms" className="text-red-600 hover:underline">Terms & Conditions</Link>
                      </Label>
                    </div>

                    <Button disabled={isRegistering} className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white">
                      {isRegistering ? "Creating Account..." : "Create Account"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              {/* DEMO ACCOUNTS */}
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">Demo Accounts:</p>
                <p className="text-xs text-gray-500 mt-1">
                  admin@demo.com | seller@demo.com | buyer@demo.com <br /> Password: demo123
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
