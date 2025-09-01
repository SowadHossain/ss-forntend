import { useEffect, useState } from "react"
import { Button } from "./ui/button"

const CONSENT_COOKIE_NAME = "cookie_consent"
const CONSENT_MAX_AGE = 60 * 60 * 24 * 365 // 1 year

function readCookie(name: string) {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'))
  return match ? decodeURIComponent(match[1]) : null
}

function setCookie(name: string, value: string, maxAgeSeconds: number) {
  if (typeof document === "undefined") return
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}`
}

export default function CookieConsent() {
  // mounted controls whether element is rendered; visible controls animation state
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      const existing = readCookie(CONSENT_COOKIE_NAME)
      if (!existing) {
        // wait 2s after page load before showing the consent (mount + animate)
        const delay = 2000
        let mountTimer: ReturnType<typeof setTimeout> | null = null
        let showTimer: ReturnType<typeof setTimeout> | null = null
        mountTimer = setTimeout(() => {
          setMounted(true)
          // small tick so transition classes apply
          showTimer = setTimeout(() => setVisible(true), 10)
        }, delay)

        return () => {
          if (mountTimer) clearTimeout(mountTimer)
          if (showTimer) clearTimeout(showTimer)
        }
      }
    } catch (e) {
      // noop in non-browser environments
    }
  }, [])

  if (!mounted) return null

  const accept = () => {
    // trigger exit animation
    setVisible(false)
    // after animation ends, persist cookie and unmount
    setTimeout(() => {
      setCookie(CONSENT_COOKIE_NAME, "1", CONSENT_MAX_AGE)
      // notify other parts of the app that consent was accepted
      try {
        window.dispatchEvent(new Event("cookie-consent-accepted"))
      } catch (e) {}
      setMounted(false)
    }, 300)
  }

  return (
    <div className="fixed left-4 right-4 bottom-4 md:left-8 md:right-8 z-50 pointer-events-none">
      <div
        className={`max-w-3xl mx-auto bg-white/95 border rounded-lg px-4 py-3 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between space-y-3 md:space-y-0 transform-gpu transition-all duration-300 ease-out pointer-events-auto ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="text-sm text-gray-800">
          We use cookies to improve your experience. By continuing, you agree to our <a href="/cookies" className="text-red-600 underline">Cookie Policy</a>.
        </div>
        <div className="flex items-center space-x-2">
          <Button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-500 text-white" onClick={accept}>Accept</Button>
          <a href="/cookies" className="text-sm text-gray-600 hover:underline">Learn more</a>
        </div>
      </div>
    </div>
  )
}
