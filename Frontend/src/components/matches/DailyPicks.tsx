import { Image } from "@/components/common/Image";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { 
  Sparkles, 
  ChevronRight, 
  Heart, 
  ShieldCheck,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/services/api";
import { motion, AnimatePresence } from "framer-motion";

interface Photo {
  url: string;
  isMain?: boolean;
}

interface Pick {
  id: string;
  customId: string;
  firstName: string;
  lastName: string;
  compatibilityScore: number;
  trustScore: number;
  photos: Photo[];
  city: string;
  profession: string;
}

const DailyPicks = () => {
  const [picks, setPicks] = useState<Pick[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPicks = async () => {
      try {
        const res = await api.get("/profile/daily-picks");
        if (res.data.success) {
          setPicks(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch daily picks", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPicks();
  }, []);

  if (loading) return (
     <div className="space-y-6">
        <div className="h-10 w-48 bg-slate-100 rounded-xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {[1, 2, 3].map(i => <div key={i} className="h-96 bg-slate-50 rounded-4xl animate-pulse border border-slate-100" />)}
        </div>
     </div>
  );

  if (picks.length === 0) return null;

  return (
    <div className="space-y-8 py-4">
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-amber-400 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-rose-200">
               <Sparkles size={24} />
            </div>
            <div>
               <h2 className="text-2xl font-medium text-black tracking-tight leading-none mb-1">Daily Top Picks</h2>
               <p className="text-black text-xs font-medium  tracking-widest">Selected just for you today</p>
            </div>
         </div>
         <Link to="/matches">
            <Button variant="ghost" className="text-rose-600 font-medium text-xs  tracking-widest gap-2 hover:bg-rose-50 rounded-xl px-4">
                View All Matches <ChevronRight size={16} />
            </Button>
         </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         <AnimatePresence>
            {picks.map((pick, index) => (
               <motion.div
                key={pick.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5, ease: "backOut" }}
                className="relative group"
               >
                  {/* Glowing background effect for high compatibility */}
                  <div className="absolute -inset-1 bg-linear-to-r from-rose-500 to-amber-500 rounded-4xl blur opacity-10 group-hover:opacity-30 transition duration-1000 group-hover:duration-200" />
                  
                  <div className="relative bg-white rounded-4xl overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col h-full">
                     <div className="h-56 relative overflow-hidden">
                        <Image 
                           src={pick.photos?.[0]?.url || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop"} 
                           alt={pick.firstName}
                           fill
                           className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                           <Zap size={10} className="text-amber-500 fill-amber-500" />
                           <span className="text-[10px] font-medium  tracking-widest text-black">{pick.compatibilityScore}% Match</span>
                        </div>
                        {pick.trustScore > 80 && (
                           <div className="absolute top-4 right-4 bg-blue-500 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg shadow-blue-200">
                              <ShieldCheck size={10} className="text-white" />
                              <span className="text-[9px] font-medium  tracking-widest text-white">Trust Verified</span>
                           </div>
                        )}
                        <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-8">
                            <Button size="sm" className="rounded-full bg-white text-rose-600 font-medium hover:bg-rose-50 shadow-xl">
                               View Profile
                            </Button>
                        </div>
                     </div>

                     <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                           <div className="flex items-center justify-between mb-2">
                              <h3 className="text-lg font-medium text-black">{pick.firstName} {pick.lastName}</h3>
                              <span className="text-[10px] font-medium text-black  tracking-widest">{pick.customId}</span>
                           </div>
                           <div className="flex gap-2 flex-wrap mb-4">
                              <span className="bg-slate-50 text-black px-3 py-1 rounded-lg text-[10px] font-medium border border-slate-100">{pick.profession}</span>
                              <span className="bg-slate-50 text-black px-3 py-1 rounded-lg text-[10px] font-medium border border-slate-100">{pick.city}</span>
                           </div>
                        </div>

                        <div className="pt-4 border-t border-slate-50 flex items-center gap-3">
                           <Button className="flex-1 rounded-2xl bg-rose-600 hover:bg-rose-700 font-medium  tracking-widest text-[10px] h-10 shadow-lg shadow-rose-200">
                              Connect Now
                           </Button>
                           <Button variant="outline" size="icon" className="w-10 h-10 rounded-2xl border-slate-200 text-rose-500 hover:bg-rose-50">
                              <Heart size={18} />
                           </Button>
                        </div>
                     </div>
                  </div>
               </motion.div>
            ))}
         </AnimatePresence>
      </div>
    </div>
  );
};

export default DailyPicks;

