import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMySubscription, fetchPaymentHistory } from "@/store/paymentSlice";
import type { AppDispatch, RootState } from "@/store";
import UserLayout from "@/components/layout/UserLayout";
import { motion } from "framer-motion";
import { Crown, Calendar, CreditCard, Clock, ChevronRight, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const SubscriptionPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentSubscription, isPremium, paymentHistory, pagination } = useSelector(
    (state: RootState) => state.payment
  );

  useEffect(() => {
    dispatch(fetchMySubscription());
    dispatch(fetchPaymentHistory(1));
  }, [dispatch]);

  const daysRemaining = currentSubscription
    ? Math.max(0, Math.ceil((new Date(currentSubscription.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  const statusColors: Record<string, string> = {
    paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
    created: "bg-amber-50 text-amber-700 border-amber-200",
    failed: "bg-red-50 text-red-700 border-red-200",
    refunded: "bg-slate-50 text-slate-700 border-slate-200",
  };

  return (
    <UserLayout className="max-w-none pt-5">
      <div className="max-w-4xl mx-auto px-4 sm:px-8 pb-20 space-y-10">
        {/* Header */}
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-medium tracking-tight text-foreground">
              My <span className="text-amber-600 italic">Subscription</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage your membership and view payment history.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Crown size={20} />
            </div>
          </div>
        </div>

        {/* Current Plan Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden ${
            isPremium
              ? "bg-linear-to-br from-amber-500 to-amber-600 text-white"
              : "bg-slate-50 border border-slate-200 text-foreground"
          }`}
        >
          <div className="absolute -top-10 -right-10 opacity-10 pointer-events-none">
            <Crown size={200} />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Shield size={24} />
                <h2 className="text-xl font-medium tracking-tight">
                  {isPremium
                    ? `${currentSubscription?.plan?.name || "Premium"} Plan`
                    : "Free Plan"}
                </h2>
              </div>

              {isPremium ? (
                <div className="flex flex-wrap gap-4 text-sm opacity-90">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    Expires: {new Date(currentSubscription!.endDate).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} />
                    {daysRemaining} days remaining
                  </span>
                </div>
              ) : (
                <p className="text-sm opacity-70">
                  5 profile views per day · Limited messaging
                </p>
              )}
            </div>

            <Link to="/plans">
              <Button
                className={`h-14 px-8 rounded-2xl font-medium tracking-wider text-sm ${
                  isPremium
                    ? "bg-white/20 hover:bg-white/30 text-white backdrop-blur"
                    : "bg-amber-500 hover:bg-amber-600 text-white"
                }`}
              >
                <Zap size={16} className="mr-2" />
                {isPremium ? "Change Plan" : "Upgrade to Premium"}
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Payment History */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium tracking-tight flex items-center gap-2">
            <CreditCard size={20} className="text-amber-500" />
            Payment History
          </h3>

          {paymentHistory.length === 0 ? (
            <div className="bg-white rounded-2xl border border-border p-10 text-center text-sm text-muted-foreground">
              No payment records yet.
            </div>
          ) : (
            <div className="space-y-3">
              {paymentHistory.map((payment, i) => (
                <motion.div
                  key={payment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-2xl border border-border p-5 flex items-center justify-between hover:border-amber-200 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                      <CreditCard size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {payment.plan?.name || "Premium Plan"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(payment.createdAt).toLocaleDateString("en-IN", {
                          year: "numeric", month: "short", day: "numeric",
                        })}
                        {" · "}
                        {payment.gateway.charAt(0).toUpperCase() + payment.gateway.slice(1)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-foreground">
                      {payment.currency === "INR" ? "₹" : "$"}
                      {Number(payment.amount).toLocaleString()}
                    </span>
                    <span
                      className={`px-3 py-1 text-[10px] font-medium rounded-lg border ${
                        statusColors[payment.status] || "bg-slate-50 text-slate-600"
                      }`}
                    >
                      {payment.status.toUpperCase()}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  );
};

export default SubscriptionPage;
