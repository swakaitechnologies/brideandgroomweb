import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/navigation/Footer";
import { motion } from "framer-motion";
import { Heart, ShieldCheck, Award, Globe } from "lucide-react";

const AboutUsPage = () => {
    const platformName = import.meta.env.VITE_PLATFORM_NAME || "Bride&Groom";

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-20"
                >
                    <div className="text-center space-y-6">
                        <h1 className="text-5xl md:text-7xl font-heading font-medium tracking-tighter text-foreground">
                            Legacy of <span className="text-secondary italic">Connections</span>
                        </h1>
                        <p className="text-xl text-black max-w-2xl mx-auto font-medium leading-relaxed italic">
                            "Where tradition meets extraordinary. We invite you to find a connection that transcends time in our exclusive sanctuary."
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-medium tracking-tight text-foreground">Our Story</h2>
                            <p className="text-black text-lg leading-relaxed">
                                {platformName} was founded on the principle that finding a life partner is one of the most sacred journeys an individual can embark upon. In an era of fleeting connections, we stand as a sanctuary for those who value heritage, tradition, and profound compatibility.
                            </p>
                            <p className="text-black text-lg leading-relaxed">
                                Our platform combines ancient wisdom with modern technology to provide an elite matchmaking experience that prioritizes security, authenticity, and shared values.
                            </p>
                        </div>
                        <div className="bg-primary/5 rounded-[3rem] p-12 border border-primary/10 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000" />
                            <div className="relative z-10 space-y-8">
                                <div className="flex gap-4 items-center">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-red-500 shadow-xl">
                                        <Heart className="fill-current" />
                                    </div>
                                    <div className="text-sm font-medium  tracking-widest text-primary">Est. 2026</div>
                                </div>
                                <blockquote className="text-2xl font-heading font-medium italic text-primary leading-tight">
                                    "A commitment to finding the one who understands your soul's heritage."
                                </blockquote>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { icon: ShieldCheck, label: "100% Verified", desc: "Premium security" },
                            { icon: Award, label: "Heritage Focus", desc: "Traditional values" },
                            { icon: Globe, label: "Global Presence", desc: "Reach everywhere" },
                            { icon: Heart, label: "Matches Made", desc: "Success stories" },
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white border border-border rounded-3xl p-8 text-center space-y-4 hover:shadow-xl transition-all duration-500">
                                <item.icon className="mx-auto text-secondary" size={32} />
                                <div>
                                    <h3 className="font-medium text-foreground">{item.label}</h3>
                                    <p className="text-xs text-black font-medium  tracking-widest mt-1">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-primary text-white rounded-[4rem] p-12 lg:p-20 text-center space-y-8 relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10 pointer-events-none select-none">
                            <div className="absolute top-0 left-0 text-[15vw] font-medium tracking-tighter leading-none whitespace-nowrap -mt-10 -ml-10">{import.meta.env.VITE_PLATFORM_NAME || "Bride&Groom"}</div>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-heading font-medium tracking-tight relative z-10">Start Your Sacred Journey</h2>
                        <p className="text-white/90 text-lg max-w-xl mx-auto relative z-10">
                            Join our community of elite individuals and find a partner who shares your vision for a beautiful, tradition-rich future.
                        </p>
                        <div className="relative z-10 pt-4">
                            <button className="px-12 py-5 bg-secondary text-primary font-medium  tracking-widest rounded-2xl hover:bg-white transition-all shadow-2xl active:scale-95">
                                Join Now
                            </button>
                        </div>
                    </div>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
};

export default AboutUsPage;





