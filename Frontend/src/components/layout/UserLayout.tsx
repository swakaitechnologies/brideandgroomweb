import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import Navbar from "../navigation/Navbar";
import SubNavbar from "../navigation/SubNavbar";
import AdSenseContainer from "../ads/AdSenseContainer";
import CookieConsent from "../navigation/CookieConsent";
import FloatingChat from "../chat/FloatingChat";

import MobileBottomNav from "../navigation/MobileBottomNav";

interface UserLayoutProps {
  children: ReactNode;
  className?: string;
}

const UserLayout = ({ children, className = "container" }: UserLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      {/* Header Group */}
      <Navbar />
      <div className="mt-16 sticky top-16 z-45">
        <SubNavbar />
      </div>

      {/* Main Content Area */}
      <main className={`flex-1 pt-0 pb-28 lg:pb-8 ${className}`}>{children}</main>

      {/* Ad Placement - Footer Banner */}
      <div className="container max-w-4xl mx-auto px-4">
        <AdSenseContainer
          slot="0000000000" // Placeholder slot ID
          format="auto"
          className="mb-8"
        />
      </div>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-muted text-center text-sm text-black mb-16 lg:mb-0">
        <div className="container space-y-6">
          <div className="flex justify-center gap-8 font-medium">
             <Link to="/terms" className="hover:text-rose-600 transition-colors">Terms of Service</Link>
             <Link to="/privacy" className="hover:text-rose-600 transition-colors">Privacy Policy</Link>
             <Link to="/contact" className="hover:text-rose-600 transition-colors">Contact Support</Link>
          </div>
          <div className="text-slate-400">
            &copy; 2026 Bride&Groom. Built with Trust ❤️ by{" "}
            <a
              href="https://swakai.in"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-emerald-700 hover:underline"
            >
              SwaKai Technologies
            </a>
            .
          </div>
        </div>
      </footer>

      {/* Global Consent Management (IAB TCF Compliance) */}
      <CookieConsent />

      {/* Floating Chat Widget */}
      <FloatingChat />

      {/* App-like bottom navigation for mobile */}
      <MobileBottomNav />
    </div>
  );
};

export default UserLayout;





