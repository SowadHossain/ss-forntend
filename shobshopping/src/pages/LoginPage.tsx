import React from "react"

import { useState } from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Checkbox } from "../components/ui/checkbox"
import { Eye, EyeOff, Mail, Lock, User, Store, Zap, ArrowRight, Shield, Star } from "lucide-react"
import { Link } from "react-router-dom"

export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loginData, setLoginData] = useState({ email: "", password: "", remember: false })
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "buyer",
    terms: false,
  })

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock login logic
    console.log("Login:", loginData)
    // Redirect based on user type
    if (loginData.email.includes("admin")) {
      window.location.href = "/admin"
    } else if (loginData.email.includes("seller")) {
      window.location.href = "/dashboard/seller"
    } else {
      window.location.href = "/dashboard/buyer"
    }
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Register:", registerData)
    // Mock registration logic
    if (registerData.userType === "seller") {
      window.location.href = "/dashboard/seller"
    } else {
      window.location.href = "/dashboard/buyer"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:block space-y-8">
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ShopVibe ✨
              </span>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to the Future of Shopping! 🚀</h1>
            <p className="text-xl text-gray-600 mb-8">
              Join millions of users who trust ShopVibe for their shopping needs. Discover, buy, and sell with
              confidence! 💫
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Secure & Trusted 🔒</h3>
                <p className="text-gray-600">Bank-level security for all transactions</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Premium Quality ⭐</h3>
                <p className="text-gray-600">Verified sellers and authentic products</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                <ArrowRight className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Fast Delivery 🚚</h3>
                <p className="text-gray-600">Quick shipping worldwide</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Forms */}
        <div className="w-full max-w-md mx-auto">
          <Card className="border-gray-200 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-2">
              <div className="lg:hidden flex items-center justify-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ShopVibe ✨
                </span>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-800">Get Started! 🎉</CardTitle>
              <CardDescription className="text-gray-600">Login to your account or create a new one</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100">
                  <TabsTrigger value="login" className="data-[state=active]:bg-white data-[state=active]:text-blue-600">
                    Login 🔑
                  </TabsTrigger>
                  <TabsTrigger
                    value="register"
                    className="data-[state=active]:bg-white data-[state=active]:text-blue-600"
                  >
                    Sign Up ✨
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          value={loginData.email}
                          onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                          className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-gray-700">
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={loginData.password}
                          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                          className="pl-10 pr-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white"
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
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="remember"
                          checked={loginData.remember}
                          onCheckedChange={(checked) => setLoginData({ ...loginData, remember: checked as boolean })}
                        />
                        <Label htmlFor="remember" className="text-sm text-gray-600">
                          Remember me
                        </Label>
                      </div>
                      <Link to="/auth/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
                        Forgot password?
                      </Link>
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                    >
                      Sign In 🚀
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="register">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-700">
                        Full Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          id="name"
                          type="text"
                          placeholder="John Doe"
                          value={registerData.name}
                          onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                          className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-email" className="text-gray-700">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          id="reg-email"
                          type="email"
                          placeholder="your@email.com"
                          value={registerData.email}
                          onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                          className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-700">I want to:</Label>
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          type="button"
                          variant={registerData.userType === "buyer" ? "default" : "outline"}
                          onClick={() => setRegisterData({ ...registerData, userType: "buyer" })}
                          className={
                            registerData.userType === "buyer"
                              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                              : "border-gray-200 text-gray-700 hover:bg-gray-50"
                          }
                        >
                          <User className="w-4 h-4 mr-2" />
                          Buy 🛍️
                        </Button>
                        <Button
                          type="button"
                          variant={registerData.userType === "seller" ? "default" : "outline"}
                          onClick={() => setRegisterData({ ...registerData, userType: "seller" })}
                          className={
                            registerData.userType === "seller"
                              ? "bg-gradient-to-r from-green-500 to-teal-600 text-white"
                              : "border-gray-200 text-gray-700 hover:bg-gray-50"
                          }
                        >
                          <Store className="w-4 h-4 mr-2" />
                          Sell 💰
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-password" className="text-gray-700">
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          id="reg-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={registerData.password}
                          onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                          className="pl-10 pr-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white"
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
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password" className="text-gray-700">
                        Confirm Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          id="confirm-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={registerData.confirmPassword}
                          onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                          className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="terms"
                        checked={registerData.terms}
                        onCheckedChange={(checked) => setRegisterData({ ...registerData, terms: checked as boolean })}
                        required
                      />
                      <Label htmlFor="terms" className="text-sm text-gray-600">
                        I agree to the{" "}
                        <Link to="/terms" className="text-blue-600 hover:text-blue-800">
                          Terms & Conditions
                        </Link>
                      </Label>
                    </div>
                    <Button
                      type="submit"
                      className={`w-full ${
                        registerData.userType === "seller"
                          ? "bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700"
                          : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                      } text-white`}
                    >
                      Create Account ✨
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Demo Accounts:
                  <span className="text-blue-600 font-medium"> admin@demo.com</span> |
                  <span className="text-green-600 font-medium"> seller@demo.com</span> |
                  <span className="text-purple-600 font-medium"> buyer@demo.com</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">Password: demo123</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
