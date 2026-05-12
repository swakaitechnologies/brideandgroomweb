"use client";

import { useState } from "react";

import UserLayout from "@/components/layout/UserLayout";
import {
  GraduationCap,
  MapPin,
  ArrowRight,
  Calendar,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { searchProfiles } from "@/store/profileSlice";
import type { AppDispatch, RootState } from "@/store";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface SectionHeaderProps {
  icon: React.ElementType;
  title: string;
  desc: string;
}

const SectionHeader = ({ icon: Icon, title, desc }: SectionHeaderProps) => (
  <div className="flex items-center gap-4 mb-8">
    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm shadow-primary/5">
      <Icon size={20} strokeWidth={2.5} />
    </div>
    <div>
      <h3 className="text-lg font-medium  tracking-tight text-foreground">
        {title}
      </h3>
      <p className="text-[10px] font-medium text-black  tracking-widest leading-none">
        {desc}
      </p>
    </div>
  </div>
);

interface SearchFieldProps {
  label: string;
  name: string;
  options?: { label: string; value: string }[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => void;
}

const SearchField = ({ label, name, options, value, onChange }: SearchFieldProps) => (
  <div className="space-y-2 group">
    <label className="text-[10px] font-medium  tracking-widest text-black group-focus-within:text-primary transition-colors">
      {label}
    </label>
    {options ? (
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full h-12 bg-slate-50 border border-border rounded-xl px-5 font-medium text-black outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all appearance-none cursor-pointer text-sm"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-black">
          <ArrowRight size={12} className="rotate-90" />
        </div>
      </div>
    ) : (
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={`Enter ${label}`}
        className="w-full h-12 bg-slate-50 border border-border rounded-xl px-5 font-medium text-black outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-sm"
      />
    )}
  </div>
);

interface SearchFormData {
  [key: string]: string;
  minAge: string;
  maxAge: string;
  religion: string;
  motherTongue: string;
  education: string;
  workingWith: string;
  profession: string;
  annualIncome: string;
  diet: string;
  smoking: string;
  drinking: string;
  city: string;
  state: string;
  caste: string;
  familyType: string;
  fatherStatus: string;
}

const AdvancedSearchPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const profileState = useSelector((state: RootState) => state.profile);
  const { loading  } = profileState;
  const [formData, setFormData] = useState<SearchFormData>({
    minAge: "18",
    maxAge: "50",
    religion: "any",
    motherTongue: "any",
    education: "any",
    workingWith: "any",
    profession: "any",
    annualIncome: "any",
    diet: "any",
    smoking: "any",
    drinking: "any",
    city: "",
    state: "any",
    caste: "any",
    familyType: "any",
    fatherStatus: "any",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setFormData({
      minAge: "18",
      maxAge: "50",
      religion: "any",
      motherTongue: "any",
      education: "any",
      workingWith: "any",
      profession: "any",
      annualIncome: "any",
      diet: "any",
      smoking: "any",
      drinking: "any",
      city: "",
      state: "any",
      caste: "any",
      familyType: "any",
      fatherStatus: "any",
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
              Advanced <span className="text-primary italic">Filters</span>
            </h1>
            <p className="text-sm text-black font-medium max-w-2xl">
              Refine your search with precision. Apply multiple lifestyle,
              career, and family filters.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={handleReset}
              className="rounded-xl h-12 px-6 border border-border font-medium  tracking-widest text-[9px] hover:bg-slate-50 transition-all"
            >
              Reset All Filters
            </Button>
            <Button
              onClick={handleExecuteSearch}
              disabled={loading}
              className="rounded-xl h-12 px-8 bg-primary hover:bg-primary/90 text-white font-medium  tracking-widest text-[9px] shadow-lg shadow-primary/10"
            >
              Start Search
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Main Filter Column */}
          <div className="lg:col-span-12 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Basics Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[2.5rem] p-10 shadow-soft border border-border group"
              >
                <SectionHeader
                  icon={Calendar}
                  title="Basics & Community"
                  desc="Age, Religion and Language"
                />
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <SearchField
                      label="Min Age"
                      name="minAge"
                      value={formData.minAge}
                      onChange={handleChange}
                      options={[...Array(43)].map((_, i) => ({
                        label: (i + 18).toString(),
                        value: (i + 18).toString(),
                      }))}
                    />
                    <SearchField
                      label="Max Age"
                      name="maxAge"
                      value={formData.maxAge}
                      onChange={handleChange}
                      options={[...Array(43)].map((_, i) => ({
                        label: (i + 18).toString(),
                        value: (i + 18).toString(),
                      }))}
                    />
                  </div>
                  <SearchField
                    label="Religion"
                    name="religion"
                    value={formData.religion}
                    onChange={handleChange}
                    options={[
                      { label: "Any", value: "any" },
                      { label: "Hindu", value: "hindu" },
                      { label: "Muslim", value: "muslim" },
                      { label: "Christian", value: "christian" },
                      { label: "Sikh", value: "sikh" },
                    ]}
                  />
                  <SearchField
                    label="Mother Tongue"
                    name="motherTongue"
                    value={formData.motherTongue}
                    onChange={handleChange}
                    options={[
                      { label: "Any", value: "any" },
                      { label: "Hindi", value: "hindi" },
                      { label: "English", value: "english" },
                      { label: "Marathi", value: "marathi" },
                      { label: "Bengali", value: "bengali" },
                    ]}
                  />
                </div>
              </motion.div>

              {/* Career Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-[2.5rem] p-10 shadow-soft border border-border group"
              >
                <SectionHeader
                  icon={GraduationCap}
                  title="Career & Education"
                  desc="Filter by professional background"
                />
                <div className="space-y-6">
                  <SearchField
                    label="Highest Education"
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    options={[
                      { label: "Any", value: "any" },
                      { label: "Masters", value: "masters" },
                      { label: "Bachelors", value: "bachelors" },
                      { label: "Doctorate", value: "doctorate" },
                      { label: "Diploma", value: "diploma" },
                    ]}
                  />
                  <SearchField
                    label="Working With"
                    name="workingWith"
                    value={formData.workingWith}
                    onChange={handleChange}
                    options={[
                      { label: "Any", value: "any" },
                      { label: "Private Sector", value: "private" },
                      { label: "Government", value: "government" },
                      { label: "Business", value: "business" },
                      { label: "Self Employed", value: "self_employed" },
                    ]}
                  />
                  <SearchField
                    label="Annual Income"
                    name="annualIncome"
                    value={formData.annualIncome}
                    onChange={handleChange}
                    options={[
                      { label: "Any", value: "any" },
                      { label: "10L+ per year", value: "10l_plus" },
                      { label: "20L+ per year", value: "20l_plus" },
                      { label: "50L+ per year", value: "50l_plus" },
                    ]}
                  />
                </div>
              </motion.div>

              {/* Location Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-[2.5rem] p-10 shadow-soft border border-border group"
              >
                <SectionHeader
                  icon={MapPin}
                  title="Location & Habits"
                  desc="Refine by habitat and diet"
                />
                <div className="space-y-6">
                  <SearchField label="City" name="city" value={formData.city} onChange={handleChange} />
                  <SearchField
                    label="State / Province"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    options={[
                      { label: "Any", value: "any" },
                      { label: "Maharashtra", value: "maharashtra" },
                      { label: "Delhi", value: "delhi" },
                      { label: "Karnataka", value: "karnataka" },
                      { label: "Gujarat", value: "gujarat" },
                    ]}
                  />
                  <SearchField
                    label="Dietary Habits"
                    name="diet"
                    value={formData.diet}
                    onChange={handleChange}
                    options={[
                      { label: "Any", value: "any" },
                      { label: "Vegetarian", value: "veg" },
                      { label: "Non-Vegetarian", value: "non_veg" },
                      { label: "Eggetarian", value: "egg" },
                    ]}
                  />
                </div>
              </motion.div>
            </div>

            <Button
              onClick={handleExecuteSearch}
              disabled={loading}
              className="w-full h-24 rounded-[2.5rem] bg-slate-900 hover:bg-black text-white shadow-2xl flex flex-col items-center justify-center group transition-all"
            >
              {loading ? (
                <Loader2 className="w-8 h-8 animate-spin" />
              ) : (
                <>
                  <span className="text-[10px] font-medium  tracking-[0.4em] text-primary mb-1">
                    Process Deep Filters
                  </span>
                  <span className="text-2xl font-medium  tracking-tight flex items-center gap-3">
                    Start Advanced Search{" "}
                    <ArrowRight
                      size={24}
                      strokeWidth={3}
                      className="group-hover:translate-x-2 transition-transform"
                    />
                  </span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default AdvancedSearchPage;





