import Navbar from "@/components/landing/Navbar";
import SEOSchema from "@/components/seo/SEOSchema";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import GlobalReachSection from "@/components/landing/GlobalReachSection";
import TrustSection from "@/components/landing/TrustSection";
import CTASection from "@/components/landing/CTASection";
import KeywordsSection from "@/components/seo/KeywordsSection";
import Footer from "@/components/navigation/Footer";
import CookieConsent from "@/components/navigation/CookieConsent";

import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      navigate("/matches", { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <SEOSchema />
      <Navbar />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <FeaturesSection />
        <GlobalReachSection />
        <TrustSection />
        <CTASection />
        <KeywordsSection />
      </main>
      <Footer />
      <CookieConsent />
    </div>
  );
};

export default LandingPage;





