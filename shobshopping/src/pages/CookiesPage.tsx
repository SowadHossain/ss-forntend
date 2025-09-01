import { useEffect, useState } from "react"
import FooterSection from "../components/HomePage/FooterSection"
import NavbarSection from "../components/HomePage/NavbarSection"
import { Button } from "../components/ui/button"

function readCookie(name: string) {
  if (typeof document === "undefined") return null
  const m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'))
  return m ? decodeURIComponent(m[1]) : null
}

function setCookie(name: string, value: string, maxAgeSeconds: number) {
  if (typeof document === "undefined") return
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}`
}

export default function CookiesPage() {
  const [consent, setConsent] = useState<boolean>(() => Boolean(readCookie("cookie_consent")))

  useEffect(() => {
    // sync initial state (in case of client-side navigation)
    setConsent(Boolean(readCookie("cookie_consent")))
  }, [])

  const withdraw = () => {
    // delete consent and refresh token
    if (typeof document === "undefined") return
    document.cookie = "cookie_consent=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;"
    document.cookie = "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;"
    setConsent(false)
    // notify other parts of the app
    try { window.dispatchEvent(new Event("cookie-consent-withdrawn")) } catch (e) {}
  }

  const accept = () => {
    // set consent for 1 year
    setCookie("cookie_consent", "1", 60 * 60 * 24 * 365)
    setConsent(true)
    try { window.dispatchEvent(new Event("cookie-consent-accepted")) } catch (e) {}
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-[#cd2733]/10">
      <NavbarSection />

      <main className="max-w-4xl mx-auto py-16 px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Cookie Policy</h1>
        <p className="text-gray-600 mb-6">
          We use cookies to improve your experience, keep you logged in when requested, and remember UI preferences. This page explains which cookies we use and how you can control them.
        </p>

        <section className="bg-white border rounded-lg p-6 mb-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Cookies we use</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>
              <strong>cookie_consent</strong> — stores whether you accepted our cookie policy (1 = accepted). Expires after 1 year.
            </li>
            <li>
              <strong>refreshToken</strong> — used when you select "Remember me" to keep you logged in. Only set after you accept cookies and choose "Remember me".
            </li>
            <li>
              <strong>sidebar:state</strong> — optional UI preference for sidebar open/collapsed state.
            </li>
          </ul>
        </section>

        <section className="bg-white border rounded-lg p-6 mb-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Manage your preferences</h2>
          <p className="text-gray-700 mb-4">You can accept or withdraw your consent below. Withdrawing consent will clear the consent cookie and any refresh tokens used for "Remember me".</p>

          <div className="flex items-center gap-3">
            <Button onClick={accept} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">Accept Cookies</Button>
            <Button onClick={withdraw} variant="outline">Withdraw Consent</Button>
            <div className="text-sm text-gray-600">Current: <span className={`font-medium ${consent ? 'text-green-600' : 'text-red-600'}`}>{consent ? 'Accepted' : 'Not accepted'}</span></div>
          </div>
        </section>

        <section className="bg-white border rounded-lg p-6 mb-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Why we use cookies</h2>
          <p className="text-gray-700">Cookies help us remember your session, preferences, and provide secure authentication. We do not sell cookie data to third parties. Some cookies are essential for the site to function properly (e.g., session-related cookies).</p>
        </section>

        <section className="text-sm text-gray-600">
          <p>If you have questions about our cookie policy or want personal assistance, please <a href="/contact" className="text-blue-600 underline">contact us</a>.</p>
        </section>
      </main>

      <FooterSection />
    </div>
  )
}
