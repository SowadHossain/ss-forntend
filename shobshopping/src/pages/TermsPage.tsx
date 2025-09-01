import FooterSection from "../components/HomePage/FooterSection"
import NavbarSection from "../components/HomePage/NavbarSection"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-[#cd2733]/10">
      <NavbarSection />
      <main className="max-w-4xl mx-auto py-16 px-4">
        <h1 className="text-3xl font-bold mb-4">Terms & Conditions</h1>
        <p className="text-gray-700 mb-4">These terms and conditions govern your use of ShobShopping. By using the site, you agree to these terms.</p>

        <section className="bg-white border rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-2">1. Use of the site</h2>
          <p className="text-gray-600">You agree to use the site only for lawful purposes and not to submit harmful content.</p>
        </section>

        <section className="bg-white border rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-2">2. Accounts</h2>
          <p className="text-gray-600">You are responsible for maintaining the security of your account and password.</p>
        </section>

        <section className="text-sm text-gray-500">Last updated: August 31, 2025</section>
      </main>
      <FooterSection />
    </div>
  )
}
