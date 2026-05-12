import { Image } from "@/components/common/Image";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import { Heart, Mail, Lock, ArrowRight, ShieldCheck, LockKeyhole, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import api from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import Navbar from "@/components/landing/Navbar";
import { toast } from "sonner";

import type { AxiosError } from "axios";

const LoginPage = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic Client-side Validation
    if (!formData.email || !formData.password) {
      toast.error("Please enter both email and password.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/login", formData);
      setAuth(response.data.user);
      navigate("/dashboard");
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      toast.error(
        error.response?.data?.message || "Invalid credentials. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative flex flex-col items-center justify-center p-2 sm:p-4 overflow-hidden">
      <Navbar />

      {/* Majestic Royal Background Background layer */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: 'url("/auth_bg_royal.png")' }}
        />
        <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-0 bg-white rounded-[2rem] overflow-hidden shadow-[0_30px_70px_-20px_rgba(75,0,130,0.15)] border border-slate-100 relative z-10"
      >
        {/* Brand Side (Luxury Visual) */}
        <div className="lg:col-span-4 relative p-6 flex flex-col justify-between overflow-hidden hidden lg:flex border-r border-slate-50">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent blur-3xl" />
          </div>
          
          <div className="relative z-10">
            <Link to="/" className="inline-block mb-8">
              <div className="relative h-16 w-36 p-1 transition-transform hover:scale-105">
                <Image 
                  src="/Logo.png" 
                  alt="Bride&Groom Logo" 
                  fill
                  priority
                  className="object-contain" 
                />
              </div>
            </Link>
            
            <div className="space-y-6">
              <h1 className="text-4xl xl:text-5xl font-heading font-medium text-primary leading-tight">
                Welcome <br />
                <span className="text-secondary italic font-light">Back</span>
              </h1>
              <div className="w-12 h-1 bg-secondary/50 rounded-full" />
              <p className="text-black/60 text-base leading-relaxed font-medium">
                Securely access your account to continue your pursuit of an eternal connection.
              </p>
            </div>
          </div>

          <div className="relative z-10 space-y-4 pt-12 border-t border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-primary text-xs font-bold">Safe & Verified</p>
                <p className="text-black/30 text-[10px] tracking-widest uppercase font-bold">Member Security</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Side */}
        <div className="lg:col-span-8 p-6 sm:p-8 lg:p-10 relative">
          <div className="max-w-sm mx-auto">
            <header className="mb-6 relative">
              <div className="lg:hidden mb-10">
                <Image src="/Logo.png" alt="Logo" width={120} height={60} className="mx-auto object-contain" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-medium text-primary tracking-tight mb-2">Member Login</h2>
              <p className="text-black/60 text-sm font-medium tracking-wide">Enter your credentials to enter the sovereign space.</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-black uppercase tracking-[0.2em] ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40 transition-colors group-focus-within:text-secondary" />
                    <input
                      type="email"
                      required
                      placeholder="your.email@example.com"
                      className="w-full bg-slate-50 border border-slate-100 focus:border-secondary/50 focus:bg-white p-3.5 pl-12 text-sm font-medium text-primary outline-none transition-all rounded-xl shadow-xs"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-bold text-black uppercase tracking-[0.2em]">Password</label>
                    <Link to="/forgot-password" title="Recover Password" className="text-[10px] font-semibold text-secondary hover:text-primary transition-colors uppercase tracking-wider">Forgot Password?</Link>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40 transition-colors group-focus-within:text-secondary" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-slate-100 focus:border-secondary/50 focus:bg-white p-3.5 pl-12 text-sm font-medium text-primary outline-none transition-all rounded-xl shadow-xs tracking-widest"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-6 items-center">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-10 py-5 bg-primary hover:bg-primary/95 text-white font-semibold text-xs tracking-[0.1em] rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-[0.98] group"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span className="flex items-center gap-3">
                      LOGIN TO ACCOUNT
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </Button>

                <Link to="/register" className="text-xs font-semibold text-black/60 hover:text-primary transition-all flex items-center gap-2 group">
                  No account? <span className="text-secondary group-hover:underline">Join exclusively</span>
                </Link>
              </div>
            </form>

            <footer className="mt-10 pt-6 border-t border-slate-50 flex items-center justify-between gap-6 opacity-60">
              <div className="flex items-center gap-4">
                <LockKeyhole size={14} className="text-primary" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-black">SSL Secured</span>
              </div>
              <div className="flex items-center gap-4 text-[9px] font-bold uppercase tracking-widest text-black">
                <span>Support</span>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <span>Privacy</span>
              </div>
            </footer>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;

