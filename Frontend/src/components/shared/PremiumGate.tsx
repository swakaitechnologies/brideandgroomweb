import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { Link } from "react-router-dom";
import { Crown, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface PremiumGateProps {
  children: React.ReactNode;
  feature?: string;
}

/**
 * PremiumGate — Wraps content that requires a premium subscription.
 * If the user is on the free tier, shows an upgrade prompt instead.
 */
const PremiumGate = ({ children, feature = "this feature" }: PremiumGateProps) => {
  const { isPremium } = useSelector((state: RootState) => state.payment);

  if (isPremium) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-linear-to-br from-amber-50 to-orange-50 rounded-3xl p-8 md:p-12 text-center border border-amber-200 space-y-6"
    >
      <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 flex items-center justify-center">
        <Crown className="w-8 h-8 text-amber-500" />
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-medium text-foreground tracking-tight">
          Upgrade to Premium
        </h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Access {feature} and much more with a premium membership. 
          Unlock unlimited messaging, see who viewed you, and get priority visibility.
        </p>
      </div>

      <Link to="/plans">
        <button className="inline-flex items-center gap-2 px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl text-sm font-medium tracking-wider transition-all hover:shadow-lg hover:shadow-amber-500/20">
          View Plans
          <ArrowRight size={16} />
        </button>
      </Link>
    </motion.div>
  );
};

export default PremiumGate;
