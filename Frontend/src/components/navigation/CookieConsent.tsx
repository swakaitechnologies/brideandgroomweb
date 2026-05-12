import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    // @ts-ignore
    window.adsbygoogle = window.adsbygoogle || [];
    // If we had specific TCF logic, we'd fire it here
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    // Inform AdSense to serve non-personalized ads
    // @ts-ignore
    (window.adsbygoogle = window.adsbygoogle || []).requestNonPersonalizedAds = 1;
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:max-w-md z-[100]"
        >
          <div className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-[2rem] p-6 md:p-8 relative overflow-hidden group">
            {/* Background Decorative Gradient */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />
            
            <div className="relative flex flex-col gap-6">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <ShieldCheck size={24} />
                </div>
                <button 
                  onClick={() => setIsVisible(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors text-black/40 hover:text-black"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-medium tracking-tight text-black">
                  Privacy & Cookies
                </h3>
                <p className="text-sm text-black/60 leading-relaxed">
                  We use cookies to enhance your experience and serve personalized matrimonial recommendations. 
                  Complying with EEA, UK & Swiss regulations, we ensure your data is handled with the highest security standards.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={handleAccept}
                  className="flex-1 rounded-2xl h-12 bg-black text-white hover:bg-black/90 shadow-lg shadow-black/10 text-sm font-medium tracking-tight group"
                >
                  Accept All
                  <ChevronRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleDecline}
                  className="flex-1 rounded-2xl h-12 border-slate-200 text-black hover:bg-slate-50 text-sm font-medium tracking-tight"
                >
                  Preferences
                </Button>
              </div>

              <p className="text-[10px] text-center text-black/40 font-medium tracking-wider uppercase">
                Compliant with IAB TCF Framework
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
