import { UserPlus, Search, MessageSquare, Heart, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface Step {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

const steps: Step[] = [
  {
    icon: <UserPlus className="w-8 h-8" />,
    title: "Create Profile",
    description: "Build your profile in minutes with our easy-to-use registration process.",
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-100",
  },
  {
    icon: <Search className="w-8 h-8" />,
    title: "Search & Match",
    description: "Explore profiles filtered by your preferences and smart recommendations.",
    color: "text-amber-500",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-100",
  },
  {
    icon: <MessageSquare className="w-8 h-8" />,
    title: "Start Chatting",
    description: "Connect safely with potential partners via our secure messaging system.",
    color: "text-purple-500",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-100",
  },
  {
    icon: <Heart className="w-8 h-8" />,
    title: "Find Your Soulmate",
    description: "Take the next step in your journey towards a lifetime of happiness.",
    color: "text-red-500",
    bgColor: "bg-red-50",
    borderColor: "border-red-100",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="relative py-16 md:py-32 overflow-hidden bg-background">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[80px] will-change-transform"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.05, 0.08, 0.05],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear", delay: 2 }}
          className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-secondary/20 rounded-full blur-[80px] will-change-transform"
        />

        {/* Floating Icons */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[15%] left-[5%] text-red-500/10 will-change-transform"
        >
          <Heart size={140} fill="currentColor" />
        </motion.div>
      </div>

      <div className="container relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20 space-y-4 md:space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            className="inline-flex items-center gap-3 px-6 py-2.5 bg-white shadow-soft border border-primary/10 text-primary rounded-full text-sm font-medium backdrop-blur-sm"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
            </span>
            STEP BY STEP GUIDE
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-7xl font-heading font-medium text-foreground leading-[1.1] tracking-tight"
          >
            How{" "}
            <span className="text-primary relative inline-block">
              Bride&Groom
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-secondary/40 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 25 0, 50 5 T 100 5" stroke="currentColor" strokeWidth="8" fill="transparent" />
              </svg>
            </span>{" "}
            Works
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-black leading-relaxed font-medium max-w-2xl mx-auto"
          >
            Finding your perfect life partner is simpler than you think. Follow
            these four easy steps to start your journey.
          </motion.p>
        </div>

        <div className="relative">
          {/* Animated Connecting Line (Desktop) */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-y-1/2 -z-0 hidden lg:block" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -12 }}
                className="group relative bg-white/40 backdrop-blur-md p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border border-primary/5 shadow-soft hover:shadow-elevated transition-all duration-500 overflow-hidden will-change-transform"
              >
                {/* Background Step Number */}
                <div className="absolute top-6 right-8 text-8xl font-heading font-medium text-foreground/[0.03] group-hover:text-primary/[0.05] transition-colors pointer-events-none">
                  0{index + 1}
                </div>

                {/* Decorative Sparkle */}
                <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className={`w-12 h-12 ${step.bgColor} rounded-full flex items-center justify-center`}>
                    <Sparkles className={`w-5 h-5 ${step.color}`} />
                  </div>
                </div>

                <div className="space-y-8 relative z-10">
                  <div
                    className={`w-16 h-16 md:w-20 md:h-20 rounded-[1.5rem] md:rounded-[2rem] ${step.bgColor} border ${step.borderColor} flex items-center justify-center ${step.color} group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 shadow-sm shadow-current/5`}
                  >
                    {step.icon}
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-2xl font-medium text-foreground group-hover:text-primary transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-black text-base leading-relaxed font-medium">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Status Bar */}
                <div className={`absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-current to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ${step.color}`} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;





