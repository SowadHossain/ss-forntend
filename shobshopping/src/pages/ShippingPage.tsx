import FooterSection from "../components/HomePage/FooterSection"
import NavbarSection from "../components/HomePage/NavbarSection"

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-[#cd2733]/10">
      <NavbarSection />
      <main className="max-w-4xl mx-auto py-16 px-4">
        <h1 className="text-3xl font-bold mb-4">Shipping Information</h1>
        <p className="text-gray-700 mb-4">We offer nationwide shipping. Delivery times and fees vary by product and location.</p>

        <section className="bg-white border rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-2">Delivery times</h2>
          <p className="text-gray-600">Most orders ship within 1-3 business days. Estimated delivery times are shown at checkout.</p>
        </section>

        <section className="bg-white border rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-2">Shipping fees</h2>
          <p className="text-gray-600">Shipping fees depend on weight, dimensions, and destination. Free shipping promotions may apply.</p>
        </section>

        <section className="text-sm text-gray-500">Last updated: August 31, 2025</section>
      </main>
      <FooterSection />
    </div>
  )
}
