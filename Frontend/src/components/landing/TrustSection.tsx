import { ShieldCheck, UserCheck, Lock, Award, Heart, Sparkles, Star } from "lucide-react";
import { motion } from "framer-motion";

interface TrustItem {
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

const items: TrustItem[] = [
  {
    icon: <ShieldCheck className="w-8 h-8" />,
    title: "Verified Identities",
    desc: "Multi-level verification including government ID checks.",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20"
  },
  {
    icon: <UserCheck className="w-8 h-8" />,
    title: "Profile Screening",
    desc: "Moderators review every profile within 24 hours.",
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20"
  },
  {
    icon: <Lock className="w-8 h-8" />,
    title: "Private & Secure",
    desc: "Encryption and strict data policies protect your info.",
    color: "text-rose-400",
    bgColor: "bg-rose-500/10",
    borderColor: "border-rose-500/20"
  },
  {
    icon: <Award className="w-8 h-8" />,
    title: "Award Winning",
    desc: "Most user-centric platform with highest engagement.",
    color: "text-indigo-400",
    bgColor: "bg-indigo-500/10",
    borderColor: "border-indigo-500/20"
  },
];

const TrustSection = () => {
  return (
    <section className="py-8 md:py-12 bg-background relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-primary/10 rounded-full blur-[100px] will-change-transform"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear", delay: 5 }}
          className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-secondary/10 rounded-full blur-[100px] will-change-transform"
        />
      </div>

      <div className="max-w-[1800px] mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-primary backdrop-blur-2xl rounded-[3rem] md:rounded-[4rem] lg:rounded-[5rem] p-6 md:p-10 lg:p-14 relative overflow-hidden border border-white/10 shadow-elevated will-change-transform"
        >
          {/* Internal Cinematic Ornaments */}
          <div className="absolute top-0 right-0 w-[40%] h-[60%] bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-[80px] pointer-events-none" />

          <motion.div
            animate={{ y: [0, -30, 0], rotate: [0, 20, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-10 left-[5%] text-red-500/20 pointer-events-none will-change-transform"
          >
            <Heart size={180} strokeWidth={1} fill="currentColor" />
          </motion.div>

          <motion.div
            animate={{ x: [0, 15, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-10 right-[25%] text-white/5 pointer-events-none will-change-transform"
          >
            <Sparkles size={120} />
          </motion.div>

          <div className="relative z-10 grid lg:grid-cols-[1fr_1.8fr] gap-12 items-center">

            {/* Left Narrative Area */}
            <div className="space-y-8">
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-3 px-6 py-2 bg-white/10 border border-white/20 text-white rounded-full text-[10px] font-medium  tracking-[0.25em] backdrop-blur-md"
                >
                  <Star size={14} className="text-secondary" fill="currentColor" />
                  OUR SACRED OATH
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="text-3xl md:text-4xl lg:text-6xl font-heading font-medium text-white leading-[1.05] tracking-tight"
                >
                  Trust is our{" "}
                  <span className="text-secondary relative inline-block italic">
                    Legacy
                    <svg className="absolute -bottom-3 left-0 w-full h-4 text-white/80 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                      <path d="M0 5 Q 25 0, 50 5 T 100 5" stroke="currentColor" strokeWidth="10" fill="transparent" />
                    </svg>
                  </span>
                </motion.h2>

                <p className="text-white/90 text-lg md:text-xl font-medium leading-relaxed max-w-xl">
                  We maintain a sanctuary of genuine connections through rigorous selection and absolute transparency.
                </p>
              </div>

              {/* Stats Row with Nested Glass */}
              <div className="flex flex-wrap gap-6">
                {[
                  { label: "Trust Monitoring", value: "24/7" },
                  { label: "Identity Verified", value: "100%" }
                ].map((stat, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    className="px-6 py-4 md:px-8 md:py-5 bg-white/5 rounded-[2rem] md:rounded-[2.5rem] border border-white/10 backdrop-blur-md group hover:bg-white/10 transition-all duration-500 shadow-xl will-change-transform"
                  >
                    <p className="text-secondary text-4xl font-medium mb-1 group-hover:scale-110 transition-transform">
                      {stat.value}
                    </p>
                    <p className="text-white/80 text-[9px] font-medium  tracking-widest">
                      {stat.label}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right Feature Card Grid (Layered Glass) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {items.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ delay: index * 0.08 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative bg-white/5 backdrop-blur-md p-5 md:p-6 lg:p-8 rounded-[2rem] md:rounded-[3rem] border border-white/10 shadow-2xl hover:bg-white/10 transition-all duration-700 overflow-hidden will-change-transform"
                >
                  {/* Subtle Inner Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                  <div className="flex flex-col gap-6 relative z-10">
                    <div className={`shrink-0 w-16 h-16 rounded-[2rem] ${item.bgColor} border ${item.borderColor} flex items-center justify-center ${item.color} group-hover:scale-110 group-hover:rotate-6 transition-transform duration-700 shadow-2xl shadow-current/10`}>
                      {item.icon}
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-2xl font-medium text-white group-hover:text-secondary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-white/90 text-base leading-relaxed font-medium">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-40 transition-all duration-500 group-hover:scale-125">
                    <Sparkles size={20} className={item.color} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustSection;





