import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Home, Compass, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const Page404 = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden relative">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            rotate: [0, -45, 0],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] bg-violet-400/10 rounded-full blur-[100px]"
        />
      </div>

      <div className="relative z-10 max-w-2xl w-full space-y-12">
        {/* Animated 404 Header */}
        <div className="relative">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className="text-[12rem] md:text-[16rem] font-medium leading-none tracking-tighter text-slate-200 select-none"
          >
            404
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 1, ease: "backOut" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-white shadow-2xl flex items-center justify-center border-8 border-slate-50 relative group">
              <div className="absolute inset-2 rounded-full border-2 border-dashed border-primary/20 group-hover:rotate-180 transition-transform duration-[4000ms]" />
              <Compass size={80} className="text-primary animate-pulse" />
            </div>
          </motion.div>
        </div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="space-y-4"
        >
          <h2 className="text-3xl md:text-4xl font-medium text-black tracking-tight ">
            Lost in the Clouds?
          </h2>
          <p className="text-black font-medium text-lg max-w-md mx-auto leading-relaxed">
            The page you're searching for has floated away. Let's get you back
            on course to find your perfect match.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            variant="hero"
            size="lg"
            onClick={() => navigate("/")}
            className="h-16 px-10 rounded-[1.5rem] font-medium  tracking-widest text-xs shadow-xl shadow-primary/30 flex items-center gap-3 w-full sm:w-auto transition-all hover:scale-105 active:scale-95"
          >
            <Home size={18} strokeWidth={3} />
            Back to Home
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate(-1)}
            className="h-16 px-10 rounded-[1.5rem] font-medium  tracking-widest text-xs border-2 hover:bg-slate-100 flex items-center gap-3 w-full sm:w-auto transition-all active:scale-95"
          >
            <ArrowLeft size={18} strokeWidth={3} />
            Previous Page
          </Button>
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-10 left-0 w-full text-[10px] font-medium  tracking-[0.5em] text-black"
      >
        Bride&Groom / Error Protocol 404
      </motion.p>
    </div>
  );
};

export default Page404;





