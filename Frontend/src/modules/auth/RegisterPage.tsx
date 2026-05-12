import { Image } from "@/components/common/Image";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import {
  Heart,
  Mail,
  Phone,
  User,
  ArrowRight,
  ShieldCheck,
  UserCircle,
  Calendar,
  CheckCircle2,
  LockKeyhole,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import api from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import Navbar from "@/components/landing/Navbar";
import { toast } from "sonner";

import type { AxiosError } from "axios";

const RegisterPage = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    password: "",
    createdBy: "Self",
    dateOfBirth: "",
  });

  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const calculateAge = (dobString: string) => {
    if (!dobString) return 0;
    const dob = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  const currentAge = calculateAge(formData.dateOfBirth);
  const isUnderage = formData.dateOfBirth !== "" && currentAge < 18;

  const [loading, setLoading] = useState(false);

  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.dateOfBirth) {
        toast.error("Please fill all identity fields.");
        return;
      }
      if (isUnderage) {
        toast.error("You must be 18 years or older to proceed.");
        return;
      }
    }
    
    if (step === 2) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error("Please enter a valid email address.");
        return;
      }
      if (formData.mobile.length < 10) {
        toast.error("Please enter a valid 10-digit mobile number.");
        return;
      }
    }

    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const stepsHeader = [
    { title: "Identity", icon: User },
    { title: "Access", icon: Mail },
    { title: "Security", icon: LockKeyhole }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreedToTerms) {
      toast.error("Please agree to the Terms of Use and Privacy Policy.");
      return;
    }

    if (isUnderage) {
      toast.error("You must be at least 18 years old to register.");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/register", {
        ...formData,
        agreedToTerms,
        is18Plus: currentAge >= 18,
      });
      setAuth(response.data.user);
      navigate("/dashboard");
    } catch (err: unknown) {
      console.error("Registration Error:", err);
      const error = err as AxiosError<{ message?: string }>;
      toast.error(
        error.response?.data?.message ||
        (error as Error).message ||
        "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative flex flex-col items-center justify-center p-2 sm:p-4 overflow-hidden">
      <Navbar />

      {/* Majestic Royal Background Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: 'url("/auth_bg_royal.png")' }}
        />
        <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 bg-white rounded-[2rem] overflow-hidden shadow-[0_30px_70px_-20px_rgba(75,0,130,0.15)] border border-slate-100 relative z-10"
      >
        {/* Branding Sidebar (Condensed version) */}
        <div className="lg:col-span-4 p-6 xl:p-8 flex flex-col justify-between hidden lg:flex border-r border-slate-50">
          <div className="relative z-10">
            <Link to="/" className="inline-block mb-6">
              <div className="relative h-16 w-36 p-1 transition-transform hover:scale-105">
                <Image src="/Logo.png" alt="Logo" fill className="object-contain" />
              </div>
            </Link>
            <div className="space-y-4">
              <h1 className="text-3xl font-heading font-medium text-primary leading-tight">
                Join <br />
                <span className="text-secondary italic font-light">Eternal</span> <br />
                Match
              </h1>
              <div className="w-10 h-1 bg-secondary/50 rounded-full" />
              <p className="text-black/60 text-sm font-medium italic">
                Start your journey toward a lifelong sanctified union.
              </p>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-100 flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-primary" />
            </div>
            <p className="text-black/30 text-[8px] uppercase tracking-widest font-bold">Verified Profiles Only</p>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-8 p-4 sm:p-6 relative">
          <div className="max-w-3xl mx-auto">
            {/* Horizontal Pathway Progress */}
            <div className="mb-4 flex items-center justify-between relative px-2">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[1px] bg-slate-100" />
              <div 
                className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-secondary transition-all duration-700 shadow-[0_0_10px_rgba(212,175,55,0.5)]" 
                style={{ width: `${((step - 1) / (stepsHeader.length - 1)) * 100}%` }}
              />
              
              {stepsHeader.map((ProgressStep, i) => {
                const isActive = i + 1 === step;
                const isPassed = i + 1 < step;
                return (
                  <div key={i} className="relative z-10 flex flex-col items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 border-2 ${
                      isActive ? "bg-white border-secondary text-secondary scale-110 shadow-lg" : 
                      isPassed ? "bg-secondary border-secondary text-primary" : 
                      "bg-white border-slate-100 text-slate-300"
                    }`}>
                      <ProgressStep.icon size={14} />
                    </div>
                    <span className={`text-[9px] font-bold uppercase tracking-widest transition-colors ${isActive ? 'text-primary' : 'text-slate-400'}`}>
                      {ProgressStep.title}
                    </span>
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="reg-1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-10"
                  >
                    <header className="space-y-2">
                      <h3 className="text-2xl font-medium text-primary">Identity Details</h3>
                      <p className="text-black/50 text-sm">Tell us about yourself to begin curation.</p>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-black uppercase tracking-widest ml-1">First Name</label>
                          <input
                            type="text" required placeholder="FIRST NAME"
                            className="w-full bg-slate-50 border border-slate-100 focus:border-secondary/50 focus:bg-white p-2.5 text-sm font-medium rounded-lg outline-none transition-all"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-black uppercase tracking-widest ml-1">Last Name</label>
                          <input
                            type="text" required placeholder="LAST NAME"
                            className="w-full bg-slate-50 border border-slate-100 focus:border-secondary/50 focus:bg-white p-2.5 text-sm font-medium rounded-lg outline-none transition-all"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100 space-y-3">
                          <label className="text-[10px] font-bold text-secondary uppercase tracking-widest flex items-center justify-between">
                            Date of Birth
                            {currentAge > 0 && <span className="bg-secondary text-primary px-2 py-0.5 rounded-full text-[8px]">{currentAge} Yrs</span>}
                          </label>
                          <input
                            type="date" required
                            className="w-full bg-white border border-slate-200 p-4 text-sm font-medium rounded-xl outline-none"
                            value={formData.dateOfBirth}
                            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-6">
                      <Button type="button" onClick={handleNextStep} className="px-10 py-5 bg-primary text-white rounded-xl font-bold text-xs tracking-widest shadow-xl group">
                        CONTINUE JOURNEY
                        <ArrowRight size={16} className="ml-3 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="reg-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <header className="space-y-2">
                      <h3 className="text-2xl font-medium text-primary">Access & Connect</h3>
                      <p className="text-black/50 text-sm">How should we verify and reach you?</p>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-black uppercase tracking-widest ml-1">Email Address</label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                              type="email" required placeholder="email@example.com"
                              className="w-full bg-slate-50 border border-slate-100 focus:border-secondary/50 focus:bg-white p-2.5 pl-12 text-sm font-medium rounded-lg outline-none"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-black uppercase tracking-widest ml-1">Mobile Number</label>
                          <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                              type="tel" required placeholder="+91 0000 0000"
                              className="w-full bg-slate-50 border border-slate-100 focus:border-secondary/50 focus:bg-white p-2.5 pl-12 text-sm font-medium rounded-lg outline-none"
                              value={formData.mobile}
                              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-black uppercase tracking-widest ml-1">Created For</label>
                        <div className="grid grid-cols-2 gap-3">
                          {["Self", "Parent", "Sibling", "Friend"].map(val => (
                            <button
                              key={val} type="button"
                              onClick={() => setFormData({...formData, createdBy: val})}
                              className={`p-4 rounded-xl text-[10px] font-bold uppercase transition-all border ${
                                formData.createdBy === val ? "bg-primary text-white border-primary" : "bg-slate-50 text-slate-400 border-slate-100 hover:border-secondary"
                              }`}
                            >
                              {val}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 flex gap-4">
                      <button type="button" onClick={handlePrevStep} className="px-8 py-3 border border-slate-200 text-black/60 rounded-xl text-[10px] font-bold tracking-widest">BACK</button>
                      <Button type="button" onClick={handleNextStep} className="px-10 py-5 bg-primary text-white rounded-xl font-bold text-xs tracking-widest shadow-xl grow">
                        CONTINUE
                      </Button>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="reg-3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <header className="space-y-2">
                      <h3 className="text-2xl font-medium text-primary">Account Security</h3>
                      <p className="text-black/50 text-sm">Seal your profile with a strong password.</p>
                    </header>

                    <div className="max-w-md space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-black uppercase tracking-widest ml-1">Password</label>
                        <input
                          type="password" required placeholder="••••••••"
                          className="w-full bg-slate-50 border border-slate-100 focus:border-secondary/50 focus:bg-white p-5 text-xl tracking-[0.3em] font-medium rounded-[2rem] outline-none"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                      </div>

                      <div 
                        className="flex items-start gap-4 p-5 bg-slate-50 border border-slate-100 rounded-2xl cursor-pointer group"
                        onClick={() => setAgreedToTerms(!agreedToTerms)}
                      >
                        <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all shrink-0 ${agreedToTerms ? 'bg-secondary border-secondary' : 'border-slate-200 group-hover:border-secondary'}`}>
                          {agreedToTerms && <CheckCircle2 size={14} className="text-primary fill-current" />}
                        </div>
                        <p className="text-[10px] font-medium text-black/60 leading-relaxed uppercase tracking-wider">
                          I agree to the <span className="text-secondary underline">Terms of Use</span> and <span className="text-secondary underline">Privacy Policy</span>.
                        </p>
                      </div>
                    </div>

                    <div className="pt-6 flex gap-4">
                      <button type="button" onClick={handlePrevStep} className="px-8 py-3 border border-slate-200 text-black/60 rounded-xl text-[10px] font-bold tracking-widest">BACK</button>
                      <Button type="submit" disabled={loading} className="px-10 py-5 bg-primary text-white rounded-xl font-bold text-xs tracking-widest shadow-2xl grow shadow-primary/30">
                        {loading ? "CREATING ACCOUNT..." : "FINISH & START JOURNEY"}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>

            <footer className="mt-4 flex justify-center">
              <Link to="/login" className="text-xs font-semibold text-black/40 hover:text-primary transition-colors flex items-center gap-2">
                Already have an account? <span className="text-secondary font-bold">Log in here</span>
              </Link>
            </footer>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;

