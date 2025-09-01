import React, { useEffect } from "react";
import FooterSection from "../components/HomePage/FooterSection";
import Navbar from "../components/ProductsPage/NavbarSection";

const DealsPage: React.FC = () => {
  
  // Scroll to top when the page mounts
  useEffect(() => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    } catch (e) {
      // fallback for environments without window
      // noop
    }
  }, []);

  return (
    <>
      <Navbar />

      <main className="flex items-center justify-center min-h-[60vh] p-8 bg-gray-50">
        <div className="text-center max-w-xl">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Deals — Coming Soon</h1>
          <p className="text-gray-600 mb-6">
            We're working on exclusive deals and offers for you. Check back soon — great savings are on the way!
          </p>

          <div className="mb-6 flex items-center justify-center gap-4">
            <img
              src="/logo.png"
              alt="SS mark"
              className="w-20 md:w-28 h-auto object-contain opacity-95"
            />

            <img
              src="/text_ss.png"
              alt="SS horizontal logo"
              className="w-40 md:w-64 h-auto object-contain opacity-95"
            />
          </div>

          <div>
            <button
              onClick={() => (window.location.href = "/")}
              className="inline-block text-white px-5 py-3 rounded-lg shadow bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
            >
              Back to Home
            </button>
          </div>
        </div>
      </main>

      <FooterSection />
    </>
  );
};

export default DealsPage;
