import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/navigation/Footer";
import { motion } from "framer-motion";
import { Shield, Lock, Eye, FileText } from "lucide-react";

const PrivacyPolicyPage = () => {
    const platformName = import.meta.env.VITE_PLATFORM_NAME || "Bride&Groom";
    const platformDomain = import.meta.env.VITE_PLATFORM_DOMAIN || "brideandgroom.co.in";
    const privacyEmail = import.meta.env.VITE_PRIVACY_EMAIL || "info@swakai.in";

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-12"
                >
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl md:text-5xl font-heading font-medium tracking-tight text-foreground">
                            Privacy <span className="text-secondary italic">Policy</span>
                        </h1>
                        <p className="text-black font-medium  tracking-[0.2em] text-xs">
                            Last Updated: February 25, 2026
                        </p>
                    </div>

                    <div className="prose prose-slate max-w-none space-y-8 text-black leading-relaxed">
                        <section className="bg-white/5 border border-border/50 rounded-3xl p-8 space-y-4">
                            <div className="flex items-center gap-3 text-foreground mb-4">
                                <Shield className="text-secondary" size={24} />
                                <h2 className="text-2xl font-medium m-0 text-foreground">Our Commitment</h2>
                            </div>
                            <p>
                                At {platformName}, we respect your privacy and are committed to protecting it through our compliance with this policy. This policy describes the types of information we may collect from you or that you may provide when you visit the website {platformDomain} and our practices for collecting, using, maintaining, protecting, and disclosing that information.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <div className="flex items-center gap-3 text-foreground">
                                <Eye className="text-secondary" size={20} />
                                <h2 className="text-xl font-medium m-0 text-foreground">Information We Collect</h2>
                            </div>
                            <p>
                                We collect several types of information from and about users of our Website, including:
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>Personal Identification Information:</strong> Name, email address, telephone number, and date of birth.</li>
                                <li><strong>Profile Information:</strong> Personal details required for matchmaking such as height, religion, caste, occupation, and family details.</li>
                                <li><strong>Device and Usage Data:</strong> IP addresses, browser types, and usage patterns collected through cookies and web beacons.</li>
                            </ul>
                        </section>

                        <section className="bg-primary/5 border border-primary/10 rounded-3xl p-8 space-y-4">
                            <div className="flex items-center gap-3 text-foreground">
                                <FileText className="text-secondary" size={20} />
                                <h2 className="text-xl font-medium m-0 text-foreground">Google AdSense & Cookies</h2>
                            </div>
                            <p>
                                We use Google AdSense to serve ads when you visit our website. Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our sites and/or other sites on the Internet.
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Third party vendors, including Google, use cookies to serve ads based on a user's prior visits to your website or other websites.</li>
                                <li>Google's use of advertising cookies enables it and its partners to serve ads to your users based on their visit to your sites and/or other sites on the Internet.</li>
                                <li>Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" className="text-secondary hover:underline" target="_blank" rel="noopener noreferrer">Ads Settings</a>.</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <div className="flex items-center gap-3 text-foreground">
                                <Lock className="text-secondary" size={20} />
                                <h2 className="text-xl font-medium m-0 text-foreground">Data Security</h2>
                            </div>
                            <p>
                                We have implemented measures designed to secure your personal information from accidental loss and from unauthorized access, use, alteration, and disclosure. All information you provide to us is stored on our secure servers behind firewalls and using SSL technology.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-medium text-foreground">Age Requirement</h2>
                            <p>
                                Our Website is not intended for individuals under 18 years of age. No one under age 18 may provide any information to or on the Website. We do not knowingly collect personal information from individuals under 18.
                            </p>
                        </section>

                        <section className="space-y-4 border-t border-border pt-8">
                            <h2 className="text-xl font-medium text-foreground">Contact Information</h2>
                            <p>
                                To ask questions or comment about this privacy policy and our privacy practices, contact us at: <a href={`mailto:${privacyEmail}`} className="text-secondary font-medium">{privacyEmail}</a>
                            </p>
                        </section>
                    </div>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
};

export default PrivacyPolicyPage;
