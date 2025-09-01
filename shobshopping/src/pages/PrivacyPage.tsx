import FooterSection from "../components/HomePage/FooterSection"
import NavbarSection from "../components/HomePage/NavbarSection"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-[#cd2733]/10">
      <NavbarSection />
      <main className="max-w-4xl mx-auto py-16 px-4">
        <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-gray-700 mb-4">This privacy policy explains how we collect, use, and protect your personal information.</p>

        <section className="bg-white border rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-2">Information we collect</h2>
          <p className="text-gray-600">We collect contact information, order details, and metadata necessary to provide services.</p>
        </section>

        <section className="bg-white border rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-2">How we use information</h2>
          <p className="text-gray-600">We use information to process orders, communicate with you, and improve the site.</p>
        </section>

        <section className="text-sm text-gray-500">Last updated: August 31, 2025</section>
      </main>
      <FooterSection />
    </div>
  )
}
