import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/navigation/Footer";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, MessageSquare } from "lucide-react";

const ContactPage = () => {
    const platformName = import.meta.env.VITE_PLATFORM_NAME || "Bride&Groom";
    const supportEmail = import.meta.env.VITE_SUPPORT_EMAIL || "info@swakai.in";
    const supportPhone = import.meta.env.VITE_SUPPORT_PHONE || "+91 8698891975";

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-16"
                >
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl md:text-5xl font-heading font-medium tracking-tight text-foreground">
                            Contact <span className="text-secondary italic">Us</span>
                        </h1>
                        <p className="text-black text-lg max-w-xl mx-auto">
                            We are here to assist you in your sacred journey. Reach out to the {platformName} support team for any inquiries.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: Mail, label: "Email Support", value: supportEmail, desc: "Our response time is typically 24 hours." },
                            { icon: Phone, label: "Phone Support", value: supportPhone, desc: "Available Mon-Fri, 9am - 6pm IST." },
                            { icon: MapPin, label: "Global Headquarters", value: "Heritage Plaza, Mumbai, India", desc: "Visit our flagship experience center." },
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white border border-border rounded-[2.5rem] p-8 text-center space-y-4 hover:shadow-xl transition-all duration-500">
                                <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-secondary mx-auto">
                                    <item.icon size={24} />
                                </div>
                                <div>
                                    <h3 className="font-medium text-foreground">{item.label}</h3>
                                    <p className="text-secondary font-medium mt-1">{item.value}</p>
                                    <p className="text-xs text-black mt-2 leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-primary rounded-[3.5rem] p-8 lg:p-16 relative overflow-hidden text-white shadow-2xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -mr-32 -mt-32" />
                        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                            <div className="space-y-6">
                                <h2 className="text-3xl font-heading font-medium">Send a Message</h2>
                                <p className="text-white/90">
                                    Have a specific question or feedback? Our specialists are ready to help you navigate your experience.
                                </p>
                                <div className="flex items-center gap-3 text-secondary">
                                    <MessageSquare size={20} />
                                    <span className="text-sm font-medium  tracking-widest">Priority Support Available</span>
                                </div>
                            </div>
                            <form className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-secondary/20 outline-none transition-all placeholder:text-white/80"
                                />
                                <input
                                    type="email"
                                    placeholder="Your Email"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-secondary/20 outline-none transition-all placeholder:text-white/80"
                                />
                                <textarea
                                    placeholder="Your Message..."
                                    rows={4}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-secondary/20 outline-none transition-all placeholder:text-white/80 resize-none"
                                />
                                <button className="w-full py-4 bg-secondary text-primary font-medium  tracking-widest rounded-2xl hover:bg-white transition-all shadow-xl">
                                    Transmit Inquiry
                                </button>
                            </form>
                        </div>
                    </div>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
};

export default ContactPage;
