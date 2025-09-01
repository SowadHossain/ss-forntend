import FooterSection from "../components/HomePage/FooterSection"
import NavbarSection from "../components/HomePage/NavbarSection"

export default function RefundsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-[#cd2733]/10">
      <NavbarSection />
      <main className="max-w-4xl mx-auto py-16 px-4">
        <h1 className="text-3xl font-bold mb-4">Refunds & Returns</h1>
        <p className="text-gray-700 mb-4">If you're not satisfied, many items can be returned within 14 days of delivery. Read the conditions below.</p>

        <section className="bg-white border rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-2">Return conditions</h2>
          <p className="text-gray-600">Items must be unused and in original packaging unless otherwise specified.</p>
        </section>

        <section className="bg-white border rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-2">How to request a refund</h2>
          <p className="text-gray-600">Contact support or open a return request in your orders page. Refunds are issued after inspection.</p>
        </section>

        <section className="text-sm text-gray-500">Last updated: August 31, 2025</section>
      </main>
      <FooterSection />
    </div>
  )
}
