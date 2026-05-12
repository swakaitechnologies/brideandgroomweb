import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/services/api";
import { useAuthStore } from "@/store/authStore";

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams?.get("token");
  const navigate = useNavigate();

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");

  const { updateUser } = useAuthStore();

  useEffect(() => {
    const performVerification = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Verification token is missing.");
        return;
      }

      try {
        const response = await api.post("/auth/verify-email", { token });
        setStatus("success");
        setMessage(response.data.message);
        
        // Update local auth state so profile reflects the change immediately
        updateUser({ isEmailVerified: true });
        
        // Update user record in localStorage if needed (handled by zustand persist usually)
      } catch (err: any) {
        setStatus("error");
        setMessage(
          err.response?.data?.message ||
            "Failed to verify email. The link may be expired.",
        );
      }
    };

    performVerification();
  }, [token, updateUser]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100">
        {/* Branding indicator */}
        <div className="h-2 w-full bg-gradient-to-r from-primary via-secondary to-primary" />
        
        <div className="p-10 text-center space-y-8">
          {status === "loading" && (
            <div className="space-y-6">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto ring-1 ring-slate-100">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-heading font-semibold text-slate-900 tracking-tight">
                  Verifying Identity
                </h1>
                <p className="text-slate-500 font-medium leading-relaxed">
                  Please wait while we confirm your email address and secure your account.
                </p>
              </div>
            </div>
          )}

          {status === "success" && (
            <div className="space-y-8">
              <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto ring-4 ring-green-100">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-heading font-semibold text-slate-900 tracking-tight">
                  Email Verified!
                </h1>
                <p className="text-slate-500 font-medium leading-relaxed">
                  {message || "Your identity has been confirmed. You now have full access to your account."}
                </p>
              </div>
              <div className="pt-4">
                <Button
                  variant="hero"
                  className="w-full h-14 text-base font-bold shadow-xl shadow-primary/20 group rounded-2xl"
                  onClick={() => navigate("/dashboard")}
                >
                  Enter Your Dashboard
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-all" />
                </Button>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-8">
              <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto ring-4 ring-red-100">
                <XCircle className="w-12 h-12 text-red-600" />
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-heading font-semibold text-slate-900 tracking-tight">
                  Verification Failed
                </h1>
                <p className="text-slate-500 font-medium leading-relaxed">
                  {message}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4 pt-4">
                <Button
                  variant="outline"
                  className="h-14 text-base font-semibold border-slate-200 hover:bg-slate-50 transition-all rounded-2xl"
                  onClick={() => navigate("/login")}
                >
                  Return to Login
                </Button>
                <Link
                  to="/contact"
                  className="text-sm text-primary font-bold hover:text-primary/80 transition-all block underline decoration-primary/30 underline-offset-4"
                >
                  Contact Support for Help
                </Link>
              </div>
            </div>
          )}

          {/* Trust indicator */}
          <div className="pt-8 border-t border-slate-100 flex items-center justify-center gap-3 text-[11px] text-slate-400 uppercase tracking-[0.2em] font-bold">
            <ShieldCheck size={16} className="text-slate-300" />
            Protected by EternalGuard
          </div>
        </div>
      </div>
      
      {/* Brand footprint */}
      <div className="mt-8 text-slate-400 text-xs font-semibold uppercase tracking-widest">
        &copy; 2026 Bride&Groom
      </div>
    </div>
  );
};

export default VerifyEmailPage;





