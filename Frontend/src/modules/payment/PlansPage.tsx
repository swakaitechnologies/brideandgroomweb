import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlans, createPaymentOrder } from "@/store/paymentSlice";
import type { AppDispatch, RootState } from "@/store";
import UserLayout from "@/components/layout/UserLayout";
import { motion } from "framer-motion";
import { Crown, Check, Sparkles, Loader2, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const PlansPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { plans, loading, isPremium, currentSubscription } = useSelector(
    (state: RootState) => state.payment
  );

  useEffect(() => {
    dispatch(fetchPlans());
  }, [dispatch]);

  const handleSelectPlan = async (planId: string) => {
    try {
      const result = await dispatch(
        createPaymentOrder({ planId, currency: "INR" })
      ).unwrap();

      if (result.gateway === "razorpay") {
        // Open Razorpay checkout
        const options = {
          key: result.key,
          amount: result.amount * 100,
          currency: result.currency,
          name: "Bride&Groom",
          description: "Premium Membership",
          order_id: result.orderId,
          handler: async (response: any) => {
            navigate(
              `/payment-success?paymentId=${result.paymentId}&razorpay_order_id=${response.razorpay_order_id}&razorpay_payment_id=${response.razorpay_payment_id}&razorpay_signature=${response.razorpay_signature}`
            );
          },
          theme: { color: "#d97706" },
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else if (result.url) {
        // Stripe redirect
        window.location.href = result.url;
      }
    } catch (err: any) {
      toast.error(err || "Failed to initiate payment");
    }
  };

  const formatPrice = (price: Record<string, number>) => {
    if (price.INR) return `₹${price.INR.toLocaleString("en-IN")}`;
    if (price.USD) return `$${price.USD}`;
    const first = Object.entries(price)[0];
    return first ? `${first[1]} ${first[0]}` : "Free";
  };

  return (
    <UserLayout className="max-w-none pt-5">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 pb-20">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium tracking-widest"
          >
            <Crown size={14} /> PREMIUM MEMBERSHIP
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-medium tracking-tight text-foreground"
          >
            Find Your <span className="text-amber-600 italic">Perfect Match</span> Faster
          </motion.h1>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Upgrade to premium and unlock unlimited messaging, see who viewed your profile,
            and get priority visibility in search results.
          </p>

          {isPremium && currentSubscription && (
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium">
              <Shield size={16} />
              You're on the <strong>{currentSubscription.plan?.name || "Premium"}</strong> plan
              (expires {new Date(currentSubscription.endDate).toLocaleDateString()})
            </div>
          )}
        </div>

        {/* Plans Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative bg-white rounded-[2.5rem] p-8 border-2 transition-all duration-300 hover:shadow-2xl group ${
                  plan.badge
                    ? "border-amber-400 shadow-xl shadow-amber-500/10"
                    : "border-border hover:border-amber-200"
                }`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 bg-amber-500 text-white text-[10px] font-bold tracking-widest rounded-full flex items-center gap-1.5">
                    <Sparkles size={12} /> {plan.badge.toUpperCase()}
                  </div>
                )}

                <div className="space-y-6">
                  {/* Plan Name */}
                  <div className="space-y-1">
                    <h3 className="text-xl font-medium tracking-tight text-foreground">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {plan.durationDays} days access
                    </p>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-foreground">
                      {formatPrice(plan.price)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      / {plan.durationDays > 30 ? `${Math.round(plan.durationDays / 30)} months` : `${plan.durationDays} days`}
                    </span>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-3 text-sm text-foreground">
                        <Check size={16} className="text-amber-500 mt-0.5 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Button
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={loading}
                    className={`w-full h-14 rounded-2xl text-sm font-medium tracking-wider transition-all group ${
                      plan.badge
                        ? "bg-amber-500 hover:bg-amber-600 text-white shadow-lg"
                        : "bg-slate-900 hover:bg-black text-white"
                    }`}
                  >
                    <Zap size={16} className="mr-2" />
                    {isPremium ? "Switch Plan" : "Get Started"}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Free Tier Info */}
        {!isPremium && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-16 text-center"
          >
            <p className="text-xs text-muted-foreground">
              Free accounts get 5 profile views per day. Upgrade anytime to remove limits.
            </p>
          </motion.div>
        )}
      </div>
    </UserLayout>
  );
};

export default PlansPage;
