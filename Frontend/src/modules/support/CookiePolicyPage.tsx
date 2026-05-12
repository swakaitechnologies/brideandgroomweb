import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/navigation/Footer";
import { motion } from "framer-motion";
import { Cookie, Settings, Info } from "lucide-react";

const CookiePolicyPage = () => {
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
                            Cookie <span className="text-secondary italic">Policy</span>
                        </h1>
                        <p className="text-black font-medium  tracking-[0.2em] text-xs">
                            Last Updated: February 25, 2026
                        </p>
                    </div>

                    <div className="prose prose-slate max-w-none space-y-8 text-black leading-relaxed">
                        <section className="bg-white/5 border border-border/50 rounded-3xl p-8 space-y-4">
                            <div className="flex items-center gap-3 text-foreground mb-4">
                                <Cookie className="text-secondary" size={24} />
                                <h2 className="text-2xl font-medium m-0 text-foreground">What are Cookies?</h2>
                            </div>
                            <p>
                                Cookies are small text files that are stored on your computer or mobile device when you visit a website. They are widely used to make websites work, or work more efficiently, as well as to provide information to the owners of the site.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <div className="flex items-center gap-3 text-foreground">
                                <Info className="text-secondary" size={20} />
                                <h2 className="text-xl font-medium m-0 text-foreground">How We Use Cookies</h2>
                            </div>
                            <p>
                                We use cookies for several reasons. Some cookies are required for technical reasons in order for our Website to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our Website.
                            </p>
                        </section>

                        <section className="bg-primary/5 border border-primary/10 rounded-3xl p-8 space-y-4">
                            <div className="flex items-center gap-3 text-foreground">
                                <Settings className="text-secondary" size={20} />
                                <h2 className="text-xl font-medium m-0 text-foreground">Google AdSense Cookies</h2>
                            </div>
                            <p>
                                As part of using Google AdSense, third parties may be placing and reading cookies on your users' browsers, or using web beacons to collect information as a result of ad serving on our website.
                            </p>
                            <p>
                                Google uses cookies to help serve the ads it displays on the websites of its partners, such as websites displaying Google ads or participating in Google certified ad networks. When users visit a partner's website, a cookie may be dropped on that end user's browser.
                            </p>
                            <p className="font-medium text-foreground">
                                You can manage your preferences for these cookies via the <a href="https://www.google.com/settings/ads" className="text-secondary hover:underline" target="_blank" rel="noopener noreferrer">Google Ads Settings</a> page.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-medium text-foreground">Types of Cookies We Use</h2>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>Essential Cookies:</strong> Necessary for the website to function (e.g., authentication).</li>
                                <li><strong>Performance Cookies:</strong> Help us understand how visitors interact with our website.</li>
                                <li><strong>Advertising Cookies:</strong> Used to make advertising messages more relevant to you and your interests.</li>
                            </ul>
                        </section>

                        <section className="space-y-4 border-t border-border pt-8">
                            <h2 className="text-xl font-medium text-foreground">Managing Cookies</h2>
                            <p>
                                You can set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted.
                            </p>
                        </section>
                    </div>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
};

export default CookiePolicyPage;





