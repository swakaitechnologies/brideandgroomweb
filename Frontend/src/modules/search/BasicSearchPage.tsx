"use client";

import { useState } from "react";

import UserLayout from "@/components/layout/UserLayout";
import {
  Search,
  User,
  Heart,
  Calendar,
  MapPin,
  Sparkles,
  Filter,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { searchProfiles } from "@/store/profileSlice";
import type { AppDispatch, RootState } from "@/store";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface SearchFieldProps {
  icon: React.ElementType;
  label: string;
  name: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => void;
}

const SearchField = ({ icon: Icon, label, name, options, value, onChange }: SearchFieldProps) => (
  <div className="space-y-2 group">
    <label className="text-[10px] font-medium  tracking-[0.2em] text-black group-hover:text-primary transition-colors flex items-center gap-2">
      <Icon size={12} className="text-primary/60" />
      {label}
    </label>
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full h-12 bg-slate-50 border border-border rounded-2xl px-4 font-medium text-black outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all appearance-none cursor-pointer text-sm"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-black">
        <ArrowRight size={14} className="rotate-90" />
      </div>
    </div>
  </div>
);

interface SearchFormData {
  [key: string]: string;
  minAge: string;
  maxAge: string;
  minHeight: string;
  maxHeight: string;
  maritalStatus: string;
  religion: string;
  motherTongue: string;
  country: string;
}

const BasicSearchPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const profileState = useSelector((state: RootState) => state.profile);
  const { loading  } = profileState;
  const [formData, setFormData] = useState<SearchFormData>({
    minAge: "21",
    maxAge: "30",
    minHeight: "5'0\"",
    maxHeight: "6'2\"",
    maritalStatus: "never_married",
    religion: "hindu",
    motherTongue: "hindi",
    country: "india",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setFormData({
      minAge: "21",
      maxAge: "30",
      minHeight: "5'0\"",
      maxHeight: "6'2\"",
      maritalStatus: "never_married",
      religion: "hindu",
      motherTongue: "hindi",
      country: "india",
    });
  };

  const handleExecuteSearch = async () => {
    try {
      const results = await dispatch(searchProfiles(formData)).unwrap();

      if (results && results.length > 0) {
        const searchParams = new URLSearchParams();
        Object.entries(formData).forEach(([key, value]) => {
          if (value && value !== "any") {
            searchParams.append(key, value);
          }
        });
        navigate(`/search/results?${searchParams.toString()}`);
      } else {
        toast.error("No profiles found matching your criteria.");
      }
    } catch (err: any) {
      toast.error(err || "Search failed");
    }
  };

  return (
    <UserLayout className="max-w-none pt-5">
      <div className="max-w-full pt-0 pb-16 px-4 sm:px-8 lg:px-12 mx-auto space-y-12">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-1">
            <h1 className="text-2xl font-medium text-foreground tracking-tight">
              Basic <span className="text-primary italic">Search</span>
            </h1>
            <p className="text-sm text-black font-medium max-w-2xl">
              Quickly find profiles matching your primary criteria. Simple,
              fast, and effective discovery.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Main Search Card */}
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-soft border border-border overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 p-12 text-primary/5 pointer-events-none rotate-12">
                <Search size={220} />
              </div>

              <div className="relative z-10 grid md:grid-cols-2 gap-x-10 gap-y-10">
                {/* Age Range */}
                <div className="space-y-3">
                  <label className="text-[10px] font-medium  tracking-[0.2em] text-black flex items-center gap-2">
                    <Calendar size={12} className="text-primary/60" />
                    Preferred Age Range
                  </label>
                  <div className="flex items-center gap-4">
                    <select
                      name="minAge"
                      value={formData.minAge}
                      onChange={handleChange}
                      className="flex-1 h-12 bg-slate-50 border border-border rounded-2xl px-4 font-medium text-black outline-none focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer text-sm"
                    >
                      {[...Array(50)].map((_, i) => (
                        <option key={i + 18} value={i + 18}>
                          {i + 18} Years
                        </option>
                      ))}
                    </select>
                    <span className="font-medium text-black text-xs ">
                      to
                    </span>
                    <select
                      name="maxAge"
                      value={formData.maxAge}
                      onChange={handleChange}
                      className="flex-1 h-12 bg-slate-50 border border-border rounded-2xl px-4 font-medium text-black outline-none focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer text-sm"
                    >
                      {[...Array(50)].map((_, i) => (
                        <option key={i + 18} value={i + 18}>
                          {i + 18} Years
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Height Range */}
                <div className="space-y-3">
                  <label className="text-[10px] font-medium  tracking-[0.2em] text-black flex items-center gap-2">
                    <Sparkles size={12} className="text-primary/60" />
                    Preferred Height
                  </label>
                  <div className="flex items-center gap-4">
                    <select
                      name="minHeight"
                      value={formData.minHeight}
                      onChange={handleChange}
                      className="flex-1 h-12 bg-slate-50 border border-border rounded-2xl px-4 font-medium text-black outline-none focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer text-sm"
                    >
                      {[
                        "4'0\"",
                        "4'5\"",
                        "5'0\"",
                        "5'5\"",
                        "6'0\"",
                        "6'5\"",
                      ].map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                    </select>
                    <span className="font-medium text-black text-xs ">
                      to
                    </span>
                    <select
                      name="maxHeight"
                      value={formData.maxHeight}
                      onChange={handleChange}
                      className="flex-1 h-12 bg-slate-50 border border-border rounded-2xl px-4 font-medium text-black outline-none focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer text-sm"
                    >
                      {[
                        "4'0\"",
                        "4'5\"",
                        "5'0\"",
                        "5'5\"",
                        "6'0\"",
                        "6'5\"",
                      ].map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <SearchField
                  icon={Heart}
                  label="Marital Status"
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={handleChange}
                  options={[
                    { label: "Never Married", value: "never_married" },
                    { label: "Divorced", value: "divorced" },
                    { label: "Widowed", value: "widowed" },
                    { label: "Awaiting Divorce", value: "awaiting_divorce" },
                  ]}
                />

                <SearchField
                  icon={Sparkles}
                  label="Religion"
                  name="religion"
                  value={formData.religion}
                  onChange={handleChange}
                  options={[
                    { label: "Hindu", value: "hindu" },
                    { label: "Muslim", value: "muslim" },
                    { label: "Christian", value: "christian" },
                    { label: "Sikh", value: "sikh" },
                    { label: "Jain", value: "jain" },
                  ]}
                />

                <SearchField
                  icon={User}
                  label="Mother Tongue"
                  name="motherTongue"
                  value={formData.motherTongue}
                  onChange={handleChange}
                  options={[
                    { label: "Hindi", value: "hindi" },
                    { label: "English", value: "english" },
                    { label: "Marathi", value: "marathi" },
                    { label: "Punjabi", value: "punjabi" },
                    { label: "Bengali", value: "bengali" },
                    { label: "Gujarati", value: "gujarati" },
                  ]}
                />

                <SearchField
                  icon={MapPin}
                  label="Country Living In"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  options={[
                    { label: "India", value: "india" },
                    { label: "USA", value: "usa" },
                    { label: "Canada", value: "canada" },
                    { label: "UAE", value: "uae" },
                    { label: "Australia", value: "australia" },
                  ]}
                />
              </div>

              <div className="mt-16 flex flex-col md:flex-row items-center justify-between gap-6 pt-10 border-t border-border/50">
                <Button
                  onClick={handleReset}
                  variant="ghost"
                  className="text-[10px] font-medium  tracking-widest text-black hover:text-primary transition-colors"
                >
                  Clear All Filters
                </Button>

                <Button
                  onClick={handleExecuteSearch}
                  disabled={loading}
                  className="w-full md:w-auto px-10 h-16 rounded-[1.25rem] bg-primary hover:bg-primary/90 text-white font-medium  tracking-[0.2em] text-[11px] group shadow-xl shadow-primary/20"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Execute Discovery
                      <ArrowRight
                        size={18}
                        className="ml-3 group-hover:translate-x-1 transition-transform"
                      />
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Sidebar / Info */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 text-white/5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                <Sparkles size={120} />
              </div>
              <div className="relative z-10 space-y-6">
                <h3 className="text-xl font-medium  tracking-tight leading-tight">
                  Why use <br />
                  <span className="text-primary italic">Basic Search?</span>
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      title: "Rapid Browsing",
                      desc: "Filter through thousands of profiles in milliseconds.",
                    },
                    {
                      title: "Crucial Filters",
                      desc: "We focus on the non-negotiables: age, religion, and status.",
                    },
                    {
                      title: "Saved History",
                      desc: "Your recent basic searches are remembered for convenience.",
                    },
                  ].map((item, i) => (
                    <div key={i} className="space-y-1">
                      <h4 className="text-[10px] font-medium  tracking-wider text-primary">
                        {item.title}
                      </h4>
                      <p className="text-xs font-medium text-white/70 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-10 border border-border shadow-soft flex flex-col items-center text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                <Filter size={32} />
              </div>
              <div className="space-y-2">
                <h4 className="font-medium  tracking-tight text-foreground">
                  Need more control?
                </h4>
                <p className="text-xs font-medium text-black leading-relaxed">
                  Switch to Advanced Search for deeper filters like education,
                  income, and lifestyle habits.
                </p>
              </div>
              <Button
                onClick={() => navigate("/search/advanced")}
                className="w-full h-12 rounded-xl bg-slate-50 hover:bg-slate-100 text-black border border-border font-medium  tracking-widest text-[9px]"
              >
                Go to Advanced Search
              </Button>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default BasicSearchPage;
