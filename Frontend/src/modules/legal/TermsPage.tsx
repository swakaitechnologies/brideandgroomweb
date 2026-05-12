"use client";

import { motion } from "framer-motion";
import { ShieldCheck, FileText, Gavel, Scale, AlertCircle, Heart } from "lucide-react";
import UserLayout from "@/components/layout/UserLayout";

const TermsPage = () => {
  const lastUpdated = "April 6, 2026";
  const platformName = import.meta.env.VITE_PLATFORM_NAME || "Bride&Groom";
  const privacyEmail = import.meta.env.VITE_PRIVACY_EMAIL || "info@swakai.in";

  const sections = [
    {
      title: "1. Acceptance of Terms",
      icon: <ShieldCheck className="text-rose-500" />,
      content: `By accessing or using the ${platformName} platform, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use this service. This is a free matrimony platform intended for serious matrimonial purposes only.`
    },
    {
      title: "2. Eligibility",
      icon: <Scale className="text-rose-500" />,
      content: "You must be at least 18 years of age (for females) or 21 years of age (for males) to register. By creating an account, you represent and warrant that you have the right, authority, and legal capacity to enter into this agreement."
    },
    {
      title: "3. Account Security",
      icon: <Gavel className="text-rose-500" />,
      content: `You are responsible for maintaining the confidentiality of your login credentials. You are solely responsible for all activities that occur under your account. ${platformName} is not liable for any loss or damage arising from your failure to comply with this security obligation.`
    },
    {
      title: "4. Content & Conduct",
      icon: <FileText className="text-rose-500" />,
      content: "You are solely responsible for the content you publish or display. You agree not to post any defamatory, inaccurate, abusive, obscene, profane, offensive, sexually oriented, threatening, harassing, racially offensive, or illegal material."
    },
    {
      title: "5. Privacy & Data",
      icon: <AlertCircle className="text-rose-500" />,
      content: "Your privacy is important to us. Please refer to our Privacy Policy to understand how we collect, use, and disclose information about you. We comply with major data protection regulations including GDPR and DPDP."
    }
  ];

  return (
    <UserLayout className="py-0 max-w-none">
      <div className="bg-[#FFF5F7] min-h-screen pb-20">
        {/* Header Section */}
        <section className="bg-white border-b border-rose-100 pt-32 pb-20 px-6">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 bg-rose-50 px-4 py-1.5 rounded-full text-rose-600 text-[10px] font-bold uppercase tracking-widest border border-rose-100"
            >
              <Gavel size={14} />
              Legal Documentation
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-medium tracking-tighter text-slate-900">
              Terms of <span className="text-rose-600 italic">Service</span>
            </h1>
            <p className="text-slate-500 font-medium tracking-tight">
              Last Updated: {lastUpdated} • Version 1.0.0
            </p>
          </div>
        </section>

        {/* Content Section */}
        <div className="max-w-4xl mx-auto px-6 -mt-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-[3rem] shadow-2xl shadow-rose-200/20 border border-rose-50 p-8 md:p-16 space-y-12"
          >
            {sections.map((section, index) => (
              <div key={index} className="space-y-4">
                <div className="flex items-center gap-4 text-2xl font-medium text-slate-800">
                  {section.icon}
                  <h2>{section.title}</h2>
                </div>
                <p className="text-slate-600 leading-relaxed text-lg pl-10 border-l-2 border-rose-50">
                  {section.content}
                </p>
              </div>
            ))}

            <div className="pt-10 mt-10 border-t border-rose-50 text-center space-y-6">
              <Heart className="mx-auto text-rose-200" size={40} />
              <p className="text-slate-400 text-sm font-medium">
                Thank you for choosing {platformName}. We are committed to helping you find your perfect match in a safe and secure environment.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </UserLayout>
  );
};

export default TermsPage;
