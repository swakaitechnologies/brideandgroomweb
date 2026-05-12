import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/navigation/Footer";
import { motion } from "framer-motion";
import { Scale, Users, Ban, Copyright } from "lucide-react";

const TermsOfUsePage = () => {
    const platformName = import.meta.env.VITE_PLATFORM_NAME || "Bride&Groom";
    const copyrightEmail = import.meta.env.VITE_COPYRIGHT_EMAIL || "info@swakai.in";

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
                            Terms of <span className="text-secondary italic">Use</span>
                        </h1>
                        <p className="text-black font-medium  tracking-[0.2em] text-xs">
                            Effective Date: February 25, 2026
                        </p>
                    </div>

                    <div className="prose prose-slate max-w-none space-y-8 text-black leading-relaxed">
                        <section className="bg-white/5 border border-border/50 rounded-3xl p-8 space-y-4">
                            <div className="flex items-center gap-3 text-foreground mb-4">
                                <Scale className="text-secondary" size={24} />
                                <h2 className="text-2xl font-medium m-0 text-foreground">1. Acceptance of Terms</h2>
                            </div>
                            <p>
                                Welcome to {platformName}. By accessing or using our Website and services, you agree to be bound by these Terms of Use. If you do not agree to all of these terms, do not use this Website.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <div className="flex items-center gap-3 text-foreground">
                                <Users className="text-secondary" size={20} />
                                <h2 className="text-xl font-medium m-0 text-foreground">2. Eligibility</h2>
                            </div>
                            <p className="font-medium text-foreground">
                                You must be at least 18 years of age (or the legal age of majority in your jurisdiction) to use our service.
                            </p>
                            <p>
                                This Website is intended solely for individuals who are legally marriageable. By using this service, you represent and warrant that you have the right, authority, and legal capacity to enter into this agreement and that you are not prohibited by any law from using the service.
                            </p>
                        </section>

                        <section className="bg-primary/5 border border-primary/10 rounded-3xl p-8 space-y-4">
                            <div className="flex items-center gap-3 text-foreground">
                                <Ban className="text-secondary" size={20} />
                                <h2 className="text-xl font-medium m-0 text-foreground">3. Purpose of Services</h2>
                            </div>
                            <p>
                                {platformName} is a platform designed to provide matrimonial matchmaking services to its members.
                            </p>
                            <p className="font-medium text-foreground underline decoration-secondary">
                                This is NOT a casual dating site or a "mail-order bride" service.
                            </p>
                            <p>
                                Any use of the Website for purposes other than finding a life partner for marriage is strictly prohibited. This includes, but is not limited to:
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Promoting or facilitating sexual services or compensated dating.</li>
                                <li>Engaging in harassment, stalking, or any form of abuse.</li>
                                <li>Creating fake profiles or providing misleading information.</li>
                                <li>Attempting to solicit money or financial assistance from other members.</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <div className="flex items-center gap-3 text-foreground">
                                <Copyright className="text-secondary" size={20} />
                                <h2 className="text-xl font-medium m-0 text-foreground">4. Intellectual Property & DMCA</h2>
                            </div>
                            <p>
                                All content on this Website, including text, graphics, logos, images, and software, is the property of {platformName} or its content suppliers and is protected by international copyright laws.
                            </p>
                            <p>
                                If you believe that your work has been copied in a way that constitutes copyright infringement, please contact our DMCA Agent at <a href={`mailto:${copyrightEmail}`} className="text-secondary hover:underline">{copyrightEmail}</a> with the required information under the Digital Millennium Copyright Act.
                            </p>
                        </section>

                        <section className="space-y-4 border-t border-border pt-8">
                            <h2 className="text-xl font-medium text-foreground">5. Contact Information</h2>
                            <p>
                                To ask questions or comment about these Terms of Use, contact us at: <a href={`mailto:${copyrightEmail}`} className="text-secondary font-medium">{copyrightEmail}</a>
                            </p>
                        </section>
                    </div>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
};

export default TermsOfUsePage;
