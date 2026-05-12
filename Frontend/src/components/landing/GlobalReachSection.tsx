import { Globe2, MapPin, Users2, ShieldCheck, Heart } from "lucide-react";
import { motion } from "framer-motion";

const COUNTRIES = [
  { name: "USA", code: "US" },
  { name: "UK", code: "GB" },
  { name: "Canada", code: "CA" },
  { name: "Australia", code: "AU" },
  { name: "UAE", code: "AE" },
  { name: "Singapore", code: "SG" },
  { name: "Germany", code: "DE" },
  { name: "New Zealand", code: "NZ" }
];

const GlobalReachSection = () => {
  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

      <div className="container max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Visual Side */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative aspect-square max-w-[500px] mx-auto">
              {/* Central Globe Icon with Pulsing Effect */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div 
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="w-64 h-64 bg-primary/10 rounded-full blur-3xl"
                />
                <Globe2 className="w-48 h-48 text-primary/20" strokeWidth={1} />
              </div>

              {/* Floating Country Tags */}
              {COUNTRIES.map((cty, idx) => {
                const angle = (idx / COUNTRIES.length) * Math.PI * 2;
                // Use smaller radius on small screens
                const radius = typeof window !== 'undefined' && window.innerWidth < 640 ? 120 : 180;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;

                return (
                  <motion.div
                    key={cty.name}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * idx, duration: 0.5 }}
                    className="absolute p-2 sm:p-3 bg-white shadow-xl rounded-xl sm:rounded-2xl border border-slate-100 flex items-center gap-1.5 sm:gap-2 whitespace-nowrap"
                    style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)`, transform: 'translate(-50%, -50%)' }}
                  >
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-secondary" />
                    <span className="text-[10px] sm:text-xs md:text-sm font-bold text-slate-700">{cty.name}</span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Content Side */}
          <div className="space-y-8">
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/5 text-primary rounded-full text-xs font-bold tracking-widest uppercase"
              >
                <Globe2 className="w-3.5 h-3.5" />
                Global NRI Matrimony
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl font-heading font-medium text-slate-900 leading-tight"
              >
                The Trusted Haven for <br />
                <span className="text-primary italic">Global Indians</span>
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-lg text-slate-600 leading-relaxed font-light"
              >
                Distance should never be a barrier to finding your soulmate. 
                Bride&Groom bridges the gap for heritage families across the 
                globe with hyper-localized matching and absolute verification.
              </motion.p>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-6">
              {[
                { 
                  icon: <Users2 className="w-5 h-5" />, 
                  title: "Elite NRI Database", 
                  desc: "Connect with high-profile professionals and families in top global hubs." 
                },
                { 
                  icon: <ShieldCheck className="w-5 h-5" />, 
                  title: "International Verification", 
                  desc: "Rigorous background checks tailored for global residencies." 
                },
                { 
                  icon: <Heart className="w-5 h-5" />, 
                  title: "Cultural Synergy", 
                  desc: "Filters for tradition, language, and heritage that transcend borders." 
                }
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  className="flex gap-4 items-start p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-primary border border-slate-100 shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 tracking-tight">{feature.title}</h4>
                    <p className="text-sm text-slate-500 font-light">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlobalReachSection;
