import { Image } from "@/components/common/Image";
import { Link } from "react-router-dom";

import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ArrowRight,
  Mail,
  MapPin,
  Phone,
  Sparkles,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const platformName = import.meta.env.VITE_PLATFORM_NAME || "Bride&Groom";

  const footerSections = [
    {
      title: "Company",
      links: [
        { label: "About Us", path: "/about" },
        { label: "Success Stories", path: "/stories" },
        { label: "Contact Us", path: "/contact" },
      ],
    },
    {
      title: "Services",
      links: [
        { label: "Matchmaking", path: "/matches" },
        { label: "Search Profiles", path: "/search" },
        { label: "Premium Plans", path: "/plans" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Terms & Conditions", path: "/terms" },
        { label: "Privacy Policy", path: "/privacy" },
        { label: "Refund Policy", path: "/refund" },
        { label: "Cookie Policy", path: "/cookies" },
      ],
    },
  ];

  const socials = [
    { icon: Facebook, label: "Facebook", href: "#" },
    { icon: Twitter, label: "Twitter", href: "#" },
    { icon: Instagram, label: "Instagram", href: "#" },
    { icon: Linkedin, label: "LinkedIn", href: "#" },
  ];

  return (
    <footer className="relative bg-white text-slate-900 overflow-hidden border-t-4 border-secondary">
      {/* Subtle organic light-themed accents */}
      <div className="absolute inset-0 pointer-events-none select-none opacity-40">
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px]" />
      </div>

      {/* ── Top CTA Band ── */}
      <div className="relative z-10 border-b border-primary/5">
        <div className="container px-6 py-12 md:py-16">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="max-w-xl space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-[9px] font-bold uppercase tracking-[0.3em]">
                <Sparkles size={11} className="fill-current" />
                Join 25,000+ Happy Members
              </div>
              <h3 className="text-2xl md:text-3xl font-heading font-medium tracking-tight text-primary">
                Begin your journey to finding <br className="hidden md:block" />
                <span className="text-secondary italic">a lifelong partner</span>
              </h3>
            </div>
            <Link
              to="/register"
              className="group flex items-center gap-4 bg-primary text-secondary px-8 py-4 rounded-xl font-bold text-xs tracking-widest shadow-xl shadow-primary/10 hover:shadow-2xl transition-all duration-500 active:scale-[0.97]"
            >
              REGISTER FREE TODAY
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="relative z-10 container px-6 pt-16 pb-12 md:pt-20 md:pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-y-12 gap-x-8">

          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-6">
            <Link to="/" className="inline-flex items-center group">
              <div className="relative h-16 w-40 transition-transform group-hover:scale-105">
                <Image
                  src="/Logo.png"
                  alt={platformName}
                  fill
                  className="object-contain"
                />
              </div>
            </Link>

            <p className="text-[14px] text-slate-500 leading-relaxed max-w-xs font-medium italic">
              Where tradition meets technology. Find a meaningful, lasting connection in our trusted community.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <a href={`mailto:${import.meta.env.VITE_SUPPORT_EMAIL || "info@swakai.in"}`} className="flex items-center gap-3 text-sm text-slate-500 hover:text-primary transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary/40 group-hover:text-primary transition-colors">
                  <Mail size={14} />
                </div>
                {import.meta.env.VITE_SUPPORT_EMAIL || "info@swakai.in"}
              </a>
              <a href={`tel:${import.meta.env.VITE_SUPPORT_PHONE || "+91 8698891975"}`} className="flex items-center gap-3 text-sm text-slate-500 hover:text-primary transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary/40 group-hover:text-primary transition-colors">
                  <Phone size={14} />
                </div>
                {import.meta.env.VITE_SUPPORT_PHONE || "+91 8698891975"}
              </a>
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary/40">
                  <MapPin size={14} />
                </div>
                Jalgaon, India
              </div>
            </div>

            {/* Socials */}
            <div className="flex items-center gap-3 pt-2">
              {socials.map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center text-primary/40 hover:text-secondary hover:bg-primary hover:border-primary hover:-translate-y-0.5 transition-all duration-300"
                >
                  <social.icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {footerSections.map((section, idx) => (
            <div key={idx} className="lg:col-span-2 space-y-6">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <Link
                      to={link.path}
                      className="text-[14px] font-medium text-slate-500 hover:text-primary transition-colors duration-200 inline-flex items-center gap-0 hover:gap-1.5 group"
                    >
                      {link.label}
                      <ArrowRight size={12} className="opacity-0 group-hover:opacity-60 transition-all duration-200 -ml-3 group-hover:ml-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter Column */}
          <div className="lg:col-span-2 space-y-6">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary">
              Newsletter
            </h4>
            <p className="text-[13px] text-slate-500 font-medium leading-relaxed">
              Get curated success stories & matchmaking tips weekly.
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-primary placeholder:text-slate-400 focus:outline-none focus:border-primary/40 focus:bg-white transition-all font-medium"
              />
              <button
                type="submit"
                className="w-full bg-primary text-secondary border border-primary hover:bg-white hover:text-primary rounded-xl px-4 py-3 text-sm font-bold tracking-widest transition-all duration-300 active:scale-[0.97] shadow-lg shadow-primary/5"
              >
                SUBSCRIBE
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="relative z-10 border-t border-slate-100">
        <div className="container px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10px] text-slate-400 font-bold tracking-wider">
              <span>&copy; {currentYear} BRIDE&GROOM. ALL RIGHTS RESERVED.</span>
              <span className="hidden md:inline text-slate-200">|</span>
              <span>
                CRAFTED BY{" "}
                <Link
                  to={import.meta.env.VITE_DEVELOPER_URL || "https://swakai.in"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-secondary transition-colors"
                >
                  SWAKAI TECHNOLOGIES
                </Link>
              </span>
            </div>

            <div className="flex items-center gap-6 text-[10px] text-slate-400 font-bold tracking-widest">
              <Link to="/terms" className="hover:text-primary transition-colors">TERMS</Link>
              <Link to="/privacy" className="hover:text-primary transition-colors">PRIVACY</Link>
              <Link to="/refund" className="hover:text-primary transition-colors">REFUND & CANCELLATION</Link>
              <Link to="/cookies" className="hover:text-primary transition-colors">COOKIES</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
