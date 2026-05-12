import { Image } from "@/components/common/Image";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

import { ArrowRight, CheckCircle2, Heart, Sparkles, UserCircle, Calendar } from "lucide-react";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-24 pb-20 md:pt-32 md:pb-32 overflow-hidden">
      {/* Immersive Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/premium_couple_hero.png"
          alt="Premium Indian Couple"
          fill
          priority
          className="object-cover brightness-[0.35] contrast-[1.1]"
        />
        {/* Elite Royal Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-primary/60 via-primary/20 to-primary/80" />
        
        {/* Subtle Ornamental Pattern Overlay */}
        <div className="absolute inset-0 opacity-10 mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="container max-w-7xl relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-10">
          {/* Main Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h1 className="text-5xl md:text-6xl lg:text-8xl font-heading font-medium text-white leading-[1.05] tracking-tight">
              Your <span className="text-secondary italic">Sacred</span> Journey Starts <span className="text-secondary italic">Here</span>
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed font-light">
              We curate exceptional matches for matches who value tradition and genuine connection. Your story deserves a perfect beginning.
            </p>
            
            {/* Feature Pills (Centered) */}
            <div className="flex flex-wrap gap-4 justify-center pt-4">
              {[
                "Privacy First",
                "Strict Verification",
                "Human-Centric Search",
                "Trusted by NRIs Globally",
              ].map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white"
                >
                  <CheckCircle2 className="w-4 h-4 text-secondary" />
                  {feature}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Sovereign Search Bar (2-Row Design) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-full mt-12 bg-primary/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 sm:p-10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)]"
          >
            <h3 className="text-white text-center font-heading text-xl md:text-2xl uppercase tracking-[0.3em] mb-10 font-light">
              Find Your <span className="text-secondary font-medium italic tracking-normal capitalize ml-1">Ideal Match</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 text-left">
              {/* Row 1 - Basics */}
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-secondary uppercase tracking-[0.2em] ml-1">Looking For</label>
                <div className="relative group">
                  <select className="w-full bg-white/5 border border-white/10 focus:border-secondary/50 p-4 text-sm font-medium text-white outline-none rounded-xl appearance-none cursor-pointer transition-all">
                    <option value="" className="bg-primary">Select Gender</option>
                    <option value="female" className="bg-primary">Female</option>
                    <option value="male" className="bg-primary">Male</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 border-l border-white/10 pl-3">
                    <UserCircle size={14} className="text-secondary" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-bold text-secondary uppercase tracking-[0.2em] ml-1">Age Range</label>
                <div className="relative group">
                  <select className="w-full bg-white/5 border border-white/10 focus:border-secondary/50 p-4 text-sm font-medium text-white outline-none rounded-xl appearance-none cursor-pointer">
                    <option value="" className="bg-primary">Select Age</option>
                    <option value="18-25" className="bg-primary">18 - 25</option>
                    <option value="25-30" className="bg-primary">25 - 30</option>
                    <option value="30-40" className="bg-primary">30 - 40</option>
                    <option value="40+" className="bg-primary">40+</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 border-l border-white/10 pl-3">
                    <Calendar size={14} className="text-secondary" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-bold text-secondary uppercase tracking-[0.2em] ml-1">Religion</label>
                <div className="relative group">
                  <select className="w-full bg-white/5 border border-white/10 focus:border-secondary/50 p-4 text-sm font-medium text-white outline-none rounded-xl appearance-none cursor-pointer">
                    <option value="" className="bg-primary">Select Religion</option>
                    {["Hindu", "Muslim", "Sikh", "Christian", "Jain", "Buddhist"].map(r => (
                      <option key={r} value={r.toLowerCase()} className="bg-primary">{r}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 border-l border-white/10 pl-3">
                    <Sparkles size={14} className="text-secondary" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-bold text-secondary uppercase tracking-[0.2em] ml-1">Mother Tongue</label>
                <div className="relative group">
                  <select className="w-full bg-white/5 border border-white/10 focus:border-secondary/50 p-4 text-sm font-medium text-white outline-none rounded-xl appearance-none cursor-pointer">
                    <option value="" className="bg-primary">Select Language</option>
                    {["Hindi", "Marathi", "Gujarati", "Punjabi", "Bengali", "Tamil", "Telugu"].map(l => (
                      <option key={l} value={l.toLowerCase()} className="bg-primary">{l}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 border-l border-white/10 pl-3">
                    <Heart size={14} className="text-secondary" />
                  </div>
                </div>
              </div>

              {/* Row 2 - Community & Location */}
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-secondary uppercase tracking-[0.2em] ml-1">Community (Caste)</label>
                <input
                  type="text" placeholder="Search Community..."
                  className="w-full bg-white/5 border border-white/10 focus:border-secondary/50 p-4 text-sm font-medium text-white outline-none rounded-xl placeholder:text-white/30"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-bold text-secondary uppercase tracking-[0.2em] ml-1">Profession</label>
                <input
                  type="text" placeholder="e.g. Doctor, Engineer..."
                  className="w-full bg-white/5 border border-white/10 focus:border-secondary/50 p-4 text-sm font-medium text-white outline-none rounded-xl placeholder:text-white/30"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-bold text-secondary uppercase tracking-[0.2em] ml-1">City / Country</label>
                <div className="relative">
                   <input
                    type="text" placeholder="India, USA, UK..."
                    className="w-full bg-white/5 border border-white/10 focus:border-secondary/50 p-4 text-sm font-medium text-white outline-none rounded-xl placeholder:text-white/30"
                  />
                </div>
              </div>

              {/* Search Button */}
              <div className="flex items-end">
                <Button className="w-full py-7 bg-secondary hover:bg-secondary/90 text-primary font-bold text-xs tracking-[0.2em] rounded-xl shadow-lg shadow-secondary/20 group transition-all">
                  SEARCH PROFILES
                  <ArrowRight size={18} className="ml-3 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

