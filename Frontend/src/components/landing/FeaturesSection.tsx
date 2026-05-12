import {
  Shield,
  Zap,
  Lock,
  Globe,
  Users,
  Star,
  Heart,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

interface Feature {
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

const features: Feature[] = [
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Verified Profiles",
    desc: "Every profile is manually screened by our trust team for authenticity.",
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-100",
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "AI Smart Matching",
    desc: "Our algorithm learns your preferences to suggest highly compatible partners.",
    color: "text-amber-500",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-100",
  },
  {
    icon: <Lock className="w-8 h-8" />,
    title: "Privacy Control",
    desc: "Control exactly who sees your photos, contact details, and visibility.",
    color: "text-rose-500",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-100",
  },
  {
    icon: <Globe className="w-8 h-8" />,
    title: "Large Community",
    desc: "Access thousands of active members from your community and region.",
    color: "text-indigo-500",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-100",
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Direct Connect",
    desc: "Skip the formalities and start talking with potential soulmates directly.",
    color: "text-violet-500",
    bgColor: "bg-violet-50",
    borderColor: "border-violet-100",
  },
  {
    icon: <Star className="w-8 h-8" />,
    title: "Premium Features",
    desc: "Boost your visibility and get highlighted to the right matches with ease.",
    color: "text-yellow-500",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-100",
  },
];

const FeaturesSection = () => {
  return (
    <section className="relative py-16 md:py-32 overflow-hidden bg-background">
      {/* Background Decor (Matching Hero) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[100px] will-change-transform"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear",
            delay: 2,
          }}
          className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[100px] will-change-transform"
        />

        {/* Floating Background Icons */}
        <motion.div
          animate={{ y: [0, 15, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[40%] right-[5%] text-secondary/10 will-change-transform"
        >
          <Sparkles size={100} fill="currentColor" />
        </motion.div>
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 15, 0] }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-[20%] left-[8%] text-red-500/20 will-change-transform"
        >
          <Heart size={120} fill="currentColor" />
        </motion.div>
      </div>

      <div className="container relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20 space-y-4 md:space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 px-6 py-2.5 bg-white shadow-soft border border-primary/10 text-primary rounded-full text-sm font-medium backdrop-blur-md"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
            </span>
            WHY CHOOSE US
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-7xl font-heading font-medium text-foreground leading-[1.1] tracking-tight"
          >
            Features Tailored for{" "}
            <span className="text-primary relative inline-block">
              Success
              <svg
                className="absolute -bottom-2 left-0 w-full h-3 text-secondary/40 -z-10"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 5 Q 25 0, 50 5 T 100 5"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                />
              </svg>
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-black leading-relaxed font-medium max-w-2xl mx-auto"
          >
            We provide all the tools you need to find a meaningful relationship
            in a safe, premium, and modern environment.
          </motion.p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -10 }}
              className="group relative bg-white/40 backdrop-blur-md p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border border-primary/5 shadow-soft hover:shadow-elevated transition-all duration-500 overflow-hidden will-change-transform"
            >
              <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div
                  className={`w-12 h-12 ${feature.bgColor} rounded-full flex items-center justify-center`}
                >
                  <Sparkles className={`w-5 h-5 ${feature.color}`} />
                </div>
              </div>

              <div className="space-y-6 relative z-10">
                <div
                  className={`w-16 h-16 md:w-20 md:h-20 rounded-[1.5rem] md:rounded-[2rem] ${feature.bgColor} border ${feature.borderColor} flex items-center justify-center ${feature.color} group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 shadow-sm shadow-current/5`}
                >
                  {feature.icon}
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-medium text-foreground group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-black text-base leading-relaxed font-medium">
                    {feature.desc}
                  </p>
                </div>
              </div>

              <div
                className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-current to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ${feature.color}`}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
