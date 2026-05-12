import { useEffect, useState } from "react";
import UserLayout from "../../components/layout/UserLayout";
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Shield,
  BadgeCheck,
  Loader2,
  Users,
  Star,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { motion } from "framer-motion";
import api from "../../services/api";

import KYCModal from "../../components/profile/KYCModal";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface TrustBreakdown {
  score: number;
  details: {
    label: string;
    points: number;
    status: "verified" | "pending";
    action: {
      type: "navigate" | "api_call" | "modal";
      target: string;
    };
  }[];
}

const getStatusIcon = (status: string) => {
  return status === "verified" ? (
    <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-600 shadow-sm border border-green-100">
      <CheckCircle2 size={18} />
    </div>
  ) : (
    <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600 shadow-sm border border-amber-100">
      <AlertCircle size={18} />
    </div>
  );
};

const TrustCenterPage = () => {
  const [breakdown, setBreakdown] = useState<TrustBreakdown | null>(null);
  const [loading, setLoading] = useState(true);
  const [isKYCModalOpen, setIsKYCModalOpen] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchTrustData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/kyc/trust-breakdown");
      if (res.data.success) {
        setBreakdown(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch trust breakdown", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskAction = async (task: TrustBreakdown["details"][0]) => {
    const { action } = task;
    
    if (action.type === "navigate") {
      navigate(action.target);
    } else if (action.type === "modal") {
      if (action.target === "kyc") setIsKYCModalOpen(true);
    } else if (action.type === "api_call") {
      try {
        setIsActionLoading(task.label);
        const res = await api.post(action.target);
        if (res.data.success) {
          toast.success(res.data.message || "Action completed successfully");
        } else {
          toast.error(res.data.message || "Something went wrong");
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Internal server error");
      } finally {
        setIsActionLoading(null);
      }
    }
  };

  useEffect(() => {
    fetchTrustData();
  }, []);

  if (loading && !breakdown) {
    return (
      <UserLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-[3rem] bg-slate-900 p-8 md:p-14 text-white mb-12 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4" />
          
          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                <ShieldCheck size={16} className="text-primary-foreground" />
                <span className="text-[10px]  font-medium tracking-widest">Safe & Verified Community</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-medium leading-tight tracking-tighter">
                Your Trust <br /> <span className="text-primary">Matters.</span>
              </h1>
              <p className="text-white/90 text-lg font-medium leading-relaxed max-w-md">
                Verified profiles get up to 5x more responses. Boost your credibility by completing the verification tasks below.
              </p>
            </div>

            <div className="flex flex-col items-center justify-center p-8 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-inner">
               <div className="relative w-48 h-48 flex items-center justify-center">
                 <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      className="text-white/80"
                      strokeWidth="12"
                      stroke="currentColor"
                      fill="transparent"
                    />
                    <motion.circle
                      cx="96"
                      cy="96"
                      r="80"
                      className="text-primary"
                      strokeWidth="12"
                      strokeDasharray={2 * Math.PI * 80}
                      initial={{ strokeDashoffset: 2 * Math.PI * 80 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 80 * (1 - (breakdown?.score || 0) / 100) }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                    />
                 </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-medium">{breakdown?.score}%</span>
                    <span className="text-xs font-medium text-white/80  tracking-widest mt-1">Trust Score</span>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* Verification Tasks */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between mb-4">
               <div>
                  <h2 className="text-2xl font-medium tracking-tight">Verification Tasks</h2>
                  <p className="text-black text-sm font-medium">Complete these to reach 100% trust</p>
               </div>
            </div>

            <div className="space-y-4">
                {breakdown?.details?.map((task, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="group p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center gap-6">
                       {getStatusIcon(task.status)}
                       <div>
                         <h4 className="font-medium text-black">{task.label}</h4>
                         <p className="text-[10px] font-medium text-primary  tracking-widest mt-0.5">+{task.points} Points Score</p>
                       </div>
                    </div>
                    
                    {task.status === "verified" ? (
                      <div className="bg-green-50 text-green-600 px-4 py-1.5 rounded-full text-[10px] font-medium  tracking-widest flex items-center gap-1.5 border border-green-100">
                         <CheckCircle2 size={12} /> Verified
                      </div>
                    ) : (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        disabled={isActionLoading === task.label}
                        className="rounded-full text-[10px] font-medium  tracking-widest hover:bg-primary/10 hover:text-primary gap-2"
                        onClick={() => handleTaskAction(task)}
                      >
                        {isActionLoading === task.label ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <>Complete Task <ArrowRight size={14} /></>
                        )}
                      </Button>
                    )}
                  </motion.div>
                ))}
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-linear-to-br from-indigo-50 to-violet-50 rounded-[2.5rem] p-8 border border-indigo-100">
               <Shield size={32} className="text-indigo-600 mb-6" />
               <h3 className="text-xl font-medium text-black mb-4">Why get verified?</h3>
               <ul className="space-y-4">
                 {[
                   { icon: BadgeCheck, text: "Trust badge on your profile" },
                   { icon: Users, text: "High priority in searches" },
                   { icon: ShieldCheck, text: "Protection against bots" },
                   { icon: Star, text: "Unlock more contact info" }
                 ].map((item, i) => (
                    <li key={i} className="flex gap-3 text-sm font-medium text-black">
                       <item.icon size={18} className="text-indigo-600 shrink-0" />
                       {item.text}
                    </li>
                 ))}
               </ul>
            </div>

            <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-200">
               <h3 className="text-lg font-medium mb-4">Facing issues?</h3>
               <p className="text-sm text-black font-medium mb-6">Our verification team is available 24/7 to help you with identity verification issues.</p>
               <Button variant="outline" className="w-full rounded-2xl h-12 font-medium text-xs  tracking-widest"> Contact Support </Button>
            </div>
          </div>
        </div>
      </div>

      <KYCModal 
        isOpen={isKYCModalOpen} 
        onClose={() => setIsKYCModalOpen(false)} 
        onSuccess={fetchTrustData} 
      />
    </UserLayout>
  );
};

export default TrustCenterPage;
