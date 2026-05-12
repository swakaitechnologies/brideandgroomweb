import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Lock, Eye, EyeOff, ShieldCheck, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import api from "@/services/api";
import { Image } from "@/components/common/Image";
import { Link } from "react-router-dom";

const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams?.get("token");
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            toast.error("Invalid reset link");
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setIsLoading(true);
        try {
            await api.post("/auth/reset-password", { token, newPassword: password });
            toast.success("Password reset successfully. Please login with your new password.");
            navigate("/login");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to reset password");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-auth-majestic flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-royal overflow-hidden border border-white/20 animate-fade-in relative z-10">
                <div className="p-10 md:p-12 text-center space-y-8">
                     {/* Brand Logo */}
                     <div className="flex justify-center mb-2">
                        <Link to="/" className="relative h-16 w-36 transition-transform hover:scale-105 active:scale-95 duration-300">
                            <Image src="/Logo.png" alt="Bride&Groom" fill className="object-contain" />
                        </Link>
                    </div>

                    <div className="space-y-3">
                        <h1 className="text-3xl font-medium text-black tracking-tight leading-tight">
                            Reset <span className="text-primary italic">Password</span>
                        </h1>
                        <p className="text-black/60 font-medium text-sm leading-relaxed max-w-[280px] mx-auto">
                            Almost there! Please secure your account with a divine new password.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5 text-left pt-2">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-black uppercase tracking-[0.2em] ml-1 opacity-70">
                                New Password
                            </label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40 group-focus-within:text-primary transition-all duration-300" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    className="w-full pl-12 pr-12 h-14 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/5 focus:border-primary/30 focus:bg-white outline-none font-medium text-black transition-all duration-300 text-sm shadow-sm"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-black/40 hover:text-primary transition-all"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-black uppercase tracking-[0.2em] ml-1 opacity-70">
                                Confirm New Password
                            </label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40 group-focus-within:text-primary transition-all duration-300" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Repeat new password"
                                    className="w-full pl-12 pr-12 h-14 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/5 focus:border-primary/30 focus:bg-white outline-none font-medium text-black transition-all duration-300 text-sm shadow-sm"
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-14 rounded-2xl bg-primary text-white font-bold text-xs tracking-widest shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98]"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-3">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    RESETTING...
                                </div>
                            ) : (
                                "RESET PASSWORD"
                            )}
                        </Button>
                    </form>

                    <div className="pt-6 flex flex-col items-center gap-6">
                        <Link
                            to="/login"
                            className="text-[11px] font-bold text-black opacity-60 hover:opacity-100 hover:text-primary flex items-center gap-2 transition-all uppercase tracking-widest"
                        >
                            <ArrowLeft size={16} />
                            Return to Login
                        </Link>
                        
                        <div className="pt-6 border-t border-slate-100 w-full flex items-center justify-center gap-3 text-[9px] text-black/40 uppercase tracking-[0.3em] font-bold">
                            <ShieldCheck size={14} className="text-primary/40" />
                            Secure Reset Protocol
                        </div>
                    </div>
                </div>
            </div>

            {/* Subtle Footer Copy */}
            <div className="mt-8 text-white/40 text-[10px] uppercase font-bold tracking-[0.4em] z-10">
                &copy; 2026 BRIDE&GROOM LEGACY
            </div>
        </div>
    );
};

export default ResetPasswordPage;





