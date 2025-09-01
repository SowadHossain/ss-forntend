import React, { useState } from "react"
import FooterSection from "../components/HomePage/FooterSection"
import NavbarSection from "../components/HomePage/NavbarSection"
import { Button } from "../components/ui/button"

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })
  const [status, setStatus] = useState<{ type: "idle" | "sending" | "success" | "error" ; message?: string }>(() => ({ type: "idle" }))

  const handleChange = (k: string, v: string) => setForm((s) => ({ ...s, [k]: v }))

  const validate = () => {
    if (!form.name.trim()) return "Please enter your name"
    if (!form.email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) return "Please enter a valid email"
    if (!form.message.trim() || form.message.trim().length < 10) return "Please enter a message (10+ characters)"
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const err = validate()
    if (err) {
      setStatus({ type: "error", message: err })
      return
    }

    setStatus({ type: "sending" })
    // Simulate send (replace with real API call)
    setTimeout(() => {
      setStatus({ type: "success", message: "Thanks — we received your message and will respond within 1-2 business days." })
      setForm({ name: "", email: "", subject: "", message: "" })
    }, 900)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-[#cd2733]/10">
      <NavbarSection />

      <main className="max-w-6xl mx-auto py-16 px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Get in touch</h1>
        <p className="text-gray-600 mb-8">We're here to help — send us a message and we'll get back to you shortly.</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="bg-white border rounded-lg p-6 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
              {status.type === "error" && (
                <div className="text-sm text-red-700 bg-red-50 border border-red-100 p-3 rounded">{status.message}</div>
              )}
              {status.type === "success" && (
                <div className="text-sm text-green-700 bg-green-50 border border-green-100 p-3 rounded">{status.message}</div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-200"
                  placeholder="Jane Doe"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-200"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => handleChange("subject", e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-200"
                  placeholder="Order inquiry, returns, partnership..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  value={form.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-200"
                  placeholder="How can we help?"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">Or reach us at <a href="mailto:support@shobshopping.com" className="text-red-600 underline">support@shobshopping.com</a></div>
                <Button type="submit" className="bg-gradient-to-r from-red-500 to-red-600 text-white" disabled={status.type === "sending"}>
                  {status.type === "sending" ? "Sending..." : "Send message"}
                </Button>
              </div>
            </form>
          </section>

          <aside className="space-y-6">
            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Contact details</h3>
              <p className="text-gray-700">ShobShopping, Inc.</p>
              <p className="text-gray-700">123 Market Street, Dhaka</p>
              <p className="text-gray-700">Phone: <a href="tel:+880123456789" className="text-red-600 underline">+880 1234 56789</a></p>
              <p className="text-gray-700">Email: <a href="mailto:support@shobshopping.com" className="text-red-600 underline">support@shobshopping.com</a></p>
            </div>

            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Opening hours</h3>
              <ul className="text-gray-700 space-y-1">
                <li>Mon–Fri: 9:00 — 18:00</li>
                <li>Sat: 10:00 — 16:00</li>
                <li>Sun: Closed</li>
              </ul>
            </div>

            {/* <div className="bg-white border rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Find us</h3>
              <div className="w-full h-40 bg-gray-100 rounded overflow-hidden">
                <img src="/map-placeholder.png" alt="Map" className="w-full h-full object-cover" />
              </div>
            </div> */}
          </aside>
        </div>
      </main>

      <FooterSection />
    </div>
  )
}
