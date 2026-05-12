import { Image } from "@/components/common/Image";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

import { ArrowRight, Sparkles, Heart, ShieldCheck, Users } from "lucide-react";
import { motion } from "framer-motion";

const CTASection = () => {
  return (
    <section className="py-12 md:py-20 relative overflow-hidden bg-background">
      {/* Background Decor - Luxurious Deep Bloom */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.1, 0.2, 0.1],
            x: [0, 50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] right-[-10%] w-[80%] h-[80%] bg-primary/20 rounded-full blur-[100px] will-change-transform"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.15, 0.1],
            x: [0, -50, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear",
            delay: 3,
          }}
          className="absolute bottom-[-10%] left-[-10%] w-[70%] h-[70%] bg-secondary/20 rounded-full blur-[100px] will-change-transform"
        />
      </div>

      <div className="max-w-[1800px] mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative group p-1"
        >
          {/* External Shadow/Glow Layer */}
          <div className="absolute inset-0 bg-linear-to-br from-primary/10 to-secondary/10 blur-[50px] opacity-40 group-hover:opacity-60 transition-opacity duration-1000" />

          {/* Main Container - Elevated Glassmorphism (Reduced Padding) */}
          <div className="relative bg-secondary overflow-hidden rounded-4xl md:rounded-[4rem] border border-white/10 shadow-elevated will-change-transform">
            {/* Animated Mesh Gradient Overlay */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none mix-blend-overlay" />

            <div className="absolute inset-0 bg-linear-to-br from-primary/15 via-transparent to-secondary/15 opacity-50" />

            {/* Intricate Floating Background Elements */}
            <motion.div
              animate={{
                y: [0, -30, 0],
                rotate: [0, 20, 0],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-10 left-[10%] text-red-500 will-change-transform"
            >
              <Heart
                size={80}
                strokeWidth={1}
                fill="currentColor"
                className="opacity-20 translate-z-0"
              />
            </motion.div>

            <motion.div
              animate={{
                y: [0, 40, 0],
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.3, 0.2],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
              }}
              className="absolute bottom-10 right-[15%] text-white will-change-transform"
            >
              <Sparkles size={120} className="opacity-20 translate-z-0" />
            </motion.div>

            <div className="relative z-10 flex flex-col items-center text-center p-6 md:p-10 space-y-4">
              {/* Compact Invitation Badge */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-3 px-4 py-1.5 bg-primary/10 border border-primary/20 text-primary rounded-full text-[9px] font-bold tracking-[0.4em] backdrop-blur-xl"
              >
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                ROYAL INVITATION
              </motion.div>

              <div className="space-y-3 max-w-4xl">
                <h2 className="text-3xl md:text-4xl lg:text-6xl font-heading font-medium text-primary leading-tight tracking-tight">
                  Find Your <span className="italic relative inline-block">Eternal</span> Partner
                </h2>
                <p className="text-primary/80 text-sm md:text-lg font-light max-w-xl mx-auto leading-relaxed italic">
                  An exclusive sanctuary for shared values and genuine connection.
                </p>
              </div>

              {/* Compact CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2 w-full max-w-md">
                <Link to="/register" className="grow">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant="hero"
                      className="w-full px-8 py-5 text-sm md:text-base font-bold rounded-lg shadow-xl shadow-primary/10 group relative overflow-hidden bg-primary text-secondary border-0"
                    >
                      <span className="relative z-10">START YOUR LEGACY</span>
                    </Button>
                  </motion.div>
                </Link>
                <Link to="/login" className="grow">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant="outline"
                      className="w-full px-8 py-5 text-sm md:text-base font-bold rounded-lg border-2 border-primary/20 text-primary hover:bg-primary/5 backdrop-blur-md transition-all"
                    >
                      MEMBER LOGIN
                    </Button>
                  </motion.div>
                </Link>
              </div>

              {/* Compact Trust Indicators */}
              <div className="flex flex-wrap justify-center gap-6 pt-6 border-t border-primary/10 w-full">
                <div className="flex items-center gap-2 group/trust">
                  <ShieldCheck size={16} className="text-primary" />
                  <span className="text-primary text-[9px] font-bold tracking-widest uppercase">100% Verified</span>
                </div>
                <div className="flex items-center gap-2 group/trust">
                  <Users size={16} className="text-primary" />
                  <span className="text-primary text-[9px] font-bold tracking-widest uppercase">Global Community</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
