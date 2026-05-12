"use client";

import { motion } from "framer-motion";
import { RefreshCw, ServerCrash, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

const Page505 = () => {
  const handleReload = () => {
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden relative">
      {/* Brand Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.4, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: 360,
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/4 -left-1/4 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px]"
        />
      </div>

      <div className="relative z-10 max-w-2xl w-full space-y-12">
        {/* Animated Error Header */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "backOut" }}
            className="flex justify-center"
          >
            <div className="w-40 h-40 md:w-56 md:h-56 rounded-[3rem] bg-white shadow-elevated border-4 border-background flex items-center justify-center relative group overflow-hidden">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-accent/10 opacity-50"
              />
              <ServerCrash
                size={70}
                className="text-primary relative z-10 animate-float"
              />
            </div>
          </motion.div>
        </div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="space-y-4"
        >
          <h1 className="text-4xl md:text-5xl font-medium text-foreground tracking-tight ">
            Service Interruption
          </h1>
          <p className="text-black font-medium text-lg max-w-md mx-auto leading-relaxed">
            We're experiencing briefly disconnected heartbeats. Our technical
            matchmakers are working hard to reconnect you with your special
            someone.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            variant="hero"
            size="lg"
            onClick={handleReload}
            className="h-16 px-10 rounded-3xl font-medium  tracking-widest text-xs shadow-xl shadow-primary/20 flex items-center gap-3 w-full sm:w-auto transition-all active:scale-95"
          >
            <RefreshCw
              size={18}
              strokeWidth={3}
              className="animate-spin-slow"
            />
            Check Connection
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-16 px-10 rounded-3xl border-2 border-primary/20 hover:bg-primary/5 text-primary font-medium  tracking-widest text-xs flex items-center gap-3 w-full sm:w-auto transition-all active:scale-95"
          >
            <MessageSquare size={18} strokeWidth={3} />
            Notify Team
          </Button>
        </motion.div>

        {/* Backend Info Detail */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 1, duration: 1 }}
          className="pt-8 space-y-2"
        >
          <div className="flex items-center justify-center gap-2 text-[10px] font-medium  tracking-[0.2em] text-primary">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Infrastructure Maintenance in Progress
          </div>
          <p className="text-[9px] font-medium text-black  tracking-widest">
            System Registry: Protocol 505 / Critical Fault
          </p>
        </motion.div>
      </div>

      {/* Heritage Tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-10 left-0 w-full text-[10px] font-medium  tracking-[0.5em] text-black"
      >
        Bride&Groom / Tradition & Technology
      </motion.p>
    </div>
  );
};

export default Page505;





