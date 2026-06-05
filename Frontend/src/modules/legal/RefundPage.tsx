"use client";

import { motion } from "framer-motion";
import { HelpCircle, RefreshCw, CreditCard, XCircle, AlertTriangle, Heart } from "lucide-react";
import UserLayout from "@/components/layout/UserLayout";

const RefundPage = () => {
  const lastUpdated = "June 5, 2026";
  const platformName = import.meta.env.VITE_PLATFORM_NAME || "Bride&Groom";
  const supportEmail = import.meta.env.VITE_SUPPORT_EMAIL || "info@swakai.in";

  const sections = [
    {
      title: "1. Premium Memberships",
      icon: <CreditCard className="text-rose-500" />,
      content: `Our matrimonial services offer premium subscription plans for predefined terms (such as 30, 90, 180, or 365 days). These paid memberships provide instant access to advanced communication features, contact views, and premium matchmaking services immediately upon payment.`
    },
    {
      title: "2. Refund Eligibility",
      icon: <RefreshCw className="text-rose-500" />,
      content: `Since premium features (such as sending messages, viewing phone numbers, and priority visibility) are provisioned and activated immediately upon a successful transaction, all payments made for premium memberships are final and generally non-refundable.`
    },
    {
      title: "3. Exceptions & Billing Errors",
      icon: <AlertTriangle className="text-rose-500" />,
      content: `In the event of duplicate billing, unauthorized charges, or technical errors where your paid subscription fails to activate, you may request a refund within 7 days of the transaction. Please contact our support team at ${supportEmail} with your payment details.`
    },
    {
      title: "4. Cancellation Policy",
      icon: <XCircle className="text-rose-500" />,
      content: `You may cancel your subscription renewal or request profile deletion at any time. However, please note that no partial refunds or credits will be provided for any unused duration or portion of the active subscription period.`
    },
    {
      title: "5. Processing Refunds",
      icon: <HelpCircle className="text-rose-500" />,
      content: `Upon approval of a refund request (e.g., in cases of duplicate payment), the amount will be credited back to your original payment method (bank account, card, or UPI) within 5 to 7 working days, depending on the processing time of our payment partners.`
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
              <RefreshCw size={14} className="animate-spin-slow" />
              Refund Documentation
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-medium tracking-tighter text-slate-900">
              Refund & <span className="text-rose-600 italic">Cancellation</span>
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
                Thank you for using {platformName}. We strive to provide transparent policies and high-quality services to support your matrimonial search.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </UserLayout>
  );
};

export default RefundPage;
