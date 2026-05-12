import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { verifyPayment, fetchMySubscription } from "@/store/paymentSlice";
import type { AppDispatch, RootState } from "@/store";
import UserLayout from "@/components/layout/UserLayout";
import { motion } from "framer-motion";
import { CheckCircle, Crown, ArrowRight, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentSubscription, loading } = useSelector(
    (state: RootState) => state.payment
  );

  useEffect(() => {
    const paymentId = searchParams.get("paymentId");
    const razorpay_order_id = searchParams.get("razorpay_order_id");
    const razorpay_payment_id = searchParams.get("razorpay_payment_id");
    const razorpay_signature = searchParams.get("razorpay_signature");
    const session_id = searchParams.get("session_id");

    if (paymentId) {
      dispatch(
        verifyPayment({
          paymentId,
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          stripe_session_id: session_id,
        })
      )
        .unwrap()
        .then(() => {
          toast.success("Payment verified! Welcome to Premium 🎉");
          dispatch(fetchMySubscription());
        })
        .catch((err) => {
          toast.error(err || "Payment verification failed");
        });
    }
  }, [searchParams, dispatch]);

  return (
    <UserLayout className="max-w-none pt-5">
      <div className="max-w-2xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[3rem] p-12 text-center shadow-soft border border-border space-y-8"
        >
          {loading ? (
            <div className="space-y-4">
              <Loader2 className="w-16 h-16 mx-auto animate-spin text-amber-500" />
              <h2 className="text-xl font-medium">Verifying your payment...</h2>
              <p className="text-sm text-muted-foreground">
                Please wait while we confirm your transaction.
              </p>
            </div>
          ) : (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-24 h-24 mx-auto rounded-full bg-emerald-50 flex items-center justify-center"
              >
                <CheckCircle className="w-12 h-12 text-emerald-500" />
              </motion.div>

              <div className="space-y-2">
                <h1 className="text-2xl font-medium text-foreground tracking-tight">
                  Payment Successful!
                </h1>
                <p className="text-sm text-muted-foreground">
                  Your premium membership has been activated.
                </p>
              </div>

              {currentSubscription && (
                <div className="bg-amber-50 rounded-2xl p-6 space-y-3 border border-amber-100">
                  <div className="flex items-center justify-center gap-2 text-amber-700">
                    <Crown size={18} />
                    <span className="font-medium text-sm tracking-wider">
                      {currentSubscription.plan?.name || "Premium"} Plan
                    </span>
                  </div>
                  <div className="text-xs text-amber-600 space-y-1">
                    <p>
                      Valid until:{" "}
                      <strong>
                        {new Date(currentSubscription.endDate).toLocaleDateString(
                          "en-IN",
                          { year: "numeric", month: "long", day: "numeric" }
                        )}
                      </strong>
                    </p>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  onClick={() => navigate("/matches")}
                  className="flex-1 h-14 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-medium tracking-wider"
                >
                  Start Exploring
                  <ArrowRight size={16} className="ml-2" />
                </Button>
                <Button
                  onClick={() => navigate("/subscription")}
                  variant="outline"
                  className="flex-1 h-14 rounded-2xl font-medium tracking-wider"
                >
                  <Download size={16} className="mr-2" />
                  View Receipt
                </Button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </UserLayout>
  );
};

export default PaymentSuccessPage;
