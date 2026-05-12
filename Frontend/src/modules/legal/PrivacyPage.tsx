"use client";

import { motion } from "framer-motion";
import { Eye, ShieldCheck, Lock, Globe, Database, Trash2, Heart } from "lucide-react";
import UserLayout from "@/components/layout/UserLayout";

const PrivacyPage = () => {
  const lastUpdated = "April 6, 2026";
  const platformName = import.meta.env.VITE_PLATFORM_NAME || "Bride&Groom";
  const privacyEmail = import.meta.env.VITE_PRIVACY_EMAIL || "info@swakai.in";

  const sections = [
    {
      title: "1. Information We Collect",
      icon: <Database className="text-rose-500" />,
      content: "We collect information you provide directly to us when you create an account, update your profile, and use our communication features. This includes your name, email, phone, age, religion, location, and photos."
    },
    {
      title: "2. How We Use Your Information",
      icon: <Globe className="text-rose-500" />,
      content: "We use your information to provide, maintain, and improve our services, including matching you with potential partners, verifying your identity (KYC), and providing customer support."
    },
    {
      title: "3. Data Security",
      icon: <Lock className="text-rose-500" />,
      content: "We implement professional-grade security measures (including industry-standard encryption and firewalls) to protect your personal information from unauthorized access, loss, or disclosure."
    },
    {
      title: "4. Your Rights & Choices",
      icon: <Trash2 className="text-rose-500" />,
      content: `You have the right to access, update, or delete your personal information at any time. You can also request a copy of the data we hold about you by contacting our support team at ${privacyEmail}.`
    },
    {
      title: "5. Compliance & Trust",
      icon: <ShieldCheck className="text-rose-500" />,
      content: "We are committed to full compliance with global data protection standards, including GDPR and the India Digital Personal Data Protection (DPDP) Act."
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
              <Eye size={14} />
              Privacy Documentation
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-medium tracking-tighter text-slate-900">
              Privacy <span className="text-rose-600 italic">Policy</span>
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
                Thank you for choosing {platformName}. Your trust is our most valuable asset. We are dedicated to protecting your data with transparency and professional integrity.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </UserLayout>
  );
};

export default PrivacyPage;
