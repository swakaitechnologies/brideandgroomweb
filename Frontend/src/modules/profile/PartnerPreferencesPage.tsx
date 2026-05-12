"use client";

import UserLayout from "@/components/layout/UserLayout";

import { useAuthStore } from "@/store/authStore";
import {
  MapPin,
  Briefcase,
  Users,
  Save,
  RotateCcw,
  Star,
  Scale,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import {
  fetchPreferences,
  updatePreferences,
  resetPreferences,
  type PartnerPreferenceData,
} from "@/store/partnerPreferenceSlice";
import { toast } from "sonner";

const InputField = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  icon: Icon,
}: {
  label: string;
  value: string | number;
  onChange: (val: string) => void;
  type?: string;
  placeholder?: string;
  icon?: React.ElementType;
}) => (
  <div className="space-y-1.5 flex flex-col">
    <label className="text-[11px] font-medium  text-black tracking-wider ml-0.5">
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full ${Icon ? "pl-11" : "px-4"
          } pr-4 py-3 bg-muted/10 border border-border/80 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary/50 outline-none font-medium text-foreground transition-all duration-200 text-sm`}
      />
    </div>
  </div>
);

const SelectField = ({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: string[];
}) => (
  <div className="space-y-1.5 flex flex-col">
    <label className="text-[11px] font-medium  text-black tracking-wider ml-0.5">
      {label}
    </label>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 bg-muted/10 border border-border/80 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary/50 outline-none font-medium text-foreground appearance-none cursor-pointer text-sm transition-all duration-200"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-black">
        <svg
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 1L5 5L9 1"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  </div>
);

const PartnerPreferencesPage = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("basic");

  const dispatch = useDispatch<AppDispatch>();
  const { data, loading } = useSelector(
    (state: RootState) => state.partnerPreference,
  );

  const [formData, setFormData] = useState<PartnerPreferenceData>({
    minAge: 24,
    maxAge: 30,
    minHeight: "5' 5\" (165cm)",
    maritalStatus: [],
    diet: "Doesn't Matter",
    education: "Doesn't Matter",
    workSector: [],
    incomeRange: "Any",
    religion: "",
    caste: "",
    casteNoBar: false,
    motherTongue: "",
    country: "India",
    city: "",
  });

  useEffect(() => {
    if (user) {
      dispatch(fetchPreferences());
    }
  }, [dispatch, user]);

  useEffect(() => {
    // Wrap state update in setTimeout to avoid react-hooks/set-state-in-effect warning
    const timer = setTimeout(() => {
      if (data) {
        setFormData((prev) => ({
          ...prev,
          ...data,
        }));
      } else {
        setFormData({
          minAge: 24,
          maxAge: 30,
          minHeight: "5' 5\" (165cm)",
          maritalStatus: [],
          diet: "Doesn't Matter",
          education: "Doesn't Matter",
          workSector: [],
          incomeRange: "Any",
          religion: "",
          caste: "",
          casteNoBar: false,
          motherTongue: "",
          country: "India",
          city: "",
        });
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [data]);

  const handleChange = <K extends keyof PartnerPreferenceData>(field: K, value: PartnerPreferenceData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };


  const handleArrayToggle = (
    field: "maritalStatus" | "workSector",
    value: string,
  ) => {
    setFormData((prev) => {
      const currentArray = prev[field] || [];
      if (currentArray.includes(value)) {
        return {
          ...prev,
          [field]: currentArray.filter((item) => item !== value),
        };
      } else {
        return { ...prev, [field]: [...currentArray, value] };
      }
    });
  };

  const handleSave = async () => {
    try {
      await dispatch(updatePreferences(formData)).unwrap();
      toast.success("Preferences saved successfully!");
    } catch (err) {
      console.error("Failed to save preferences", err);
      toast.error("Failed to save preferences.");
    }
  };

  const handleReset = async () => {
    if (confirm("Are you sure you want to reset all preferences?")) {
      try {
        await dispatch(resetPreferences()).unwrap();
        toast.success("Preferences reset successfully!");
      } catch (err) {
        console.error("Failed to reset preferences", err);
        toast.error("Failed to reset preferences.");
      }
    }
  };

  if (!user) return null;

  const tabs = [
    {
      id: "basic",
      label: "Basic Details",
      icon: <Users size={16} />,
    },
    {
      id: "professional",
      label: "Professional",
      icon: <Briefcase size={16} />,
    },
    {
      id: "social",
      label: "Social Background",
      icon: <Star size={16} />,
    },
    {
      id: "location",
      label: "Location",
      icon: <MapPin size={16} />,
    },
  ];

  return (
    <UserLayout className="max-w-none pt-5">
      <div className="max-w-full pt-0 pb-8 px-4 sm:px-8 lg:px-12 mx-auto">
        {/* Simple Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b pb-6">
          <div>
            <h1 className="text-2xl font-medium text-foreground mb-2 flex items-center gap-2">
              <Heart className="text-red-500 fill-red-500" size={24} />
              Partner Preferences
            </h1>
            <p className="text-black">Define your ideal match to get better recommendations.</p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className="rounded-xl px-6 py-2 h-auto text-sm font-medium"
              onClick={handleReset}
              disabled={loading}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button
              className="rounded-xl px-6 py-2 h-auto text-sm font-medium shadow-sm"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Preferences
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Navigation Sidebar */}
          <aside className="w-full lg:w-72 lg:sticky lg:top-24 space-y-6">
            <div className="bg-white border border-border rounded-2xl p-2 space-y-1">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all group ${isActive
                      ? "bg-primary text-white shadow-md shadow-primary/10"
                      : "text-black hover:bg-muted hover:text-foreground"
                      }`}
                  >
                    <span className={`transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-105"}`}>
                      {tab.icon}
                    </span>
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 text-primary mb-2">
                <Star size={16} className="fill-current" />
                <span className="font-medium text-sm  tracking-wider">Match Score</span>
              </div>
              <p className="text-sm text-black leading-relaxed">
                Defining specific preferences increases your "Match Score" for incoming requests.
              </p>
            </div>
          </aside>

          {/* Main Content Form Card */}
          <div className="flex-1 w-full space-y-8">
            <div className="bg-white border border-border rounded-2xl shadow-sm min-h-[400px] overflow-hidden">
              <div className="p-6 md:p-8 bg-muted/5 border-b border-border flex items-center gap-3">
                {tabs.find(t => t.id === activeTab)?.icon}
                <h2 className="text-lg font-medium text-foreground">
                  {tabs.find(t => t.id === activeTab)?.label}
                </h2>
              </div>

              <div className="p-6 md:p-10">
                {/* Basic Details Section */}
                {activeTab === "basic" && (
                  <div className="space-y-8 animate-fade-in text-left">
                    <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                      <div className="space-y-1.5 flex flex-col">
                        <label className="text-[11px] font-medium  text-black tracking-wider ml-0.5">
                          Age Range
                        </label>
                        <div className="flex items-center gap-4">
                          <input
                            type="number"
                            value={formData.minAge || ""}
                            onChange={(e) => handleChange("minAge", parseInt(e.target.value) || undefined)}
                            className="w-full px-4 py-3 bg-muted/10 border border-border/80 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary/50 outline-none font-medium text-foreground text-sm transition-all duration-200"
                            placeholder="Min"
                          />
                          <span className="text-black text-xs font-medium">TO</span>
                          <input
                            type="number"
                            value={formData.maxAge || ""}
                            onChange={(e) => handleChange("maxAge", parseInt(e.target.value) || undefined)}
                            className="w-full px-4 py-3 bg-muted/10 border border-border/80 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary/50 outline-none font-medium text-foreground text-sm transition-all duration-200"
                            placeholder="Max"
                          />
                        </div>
                      </div>

                      <SelectField
                        label="Min Height"
                        value={formData.minHeight || "5' 5\" (165cm)"}
                        onChange={(v) => handleChange("minHeight", v)}
                        options={["5' 0\" (152cm)", "5' 5\" (165cm)", "5' 8\" (172cm)"]}
                      />

                      <div className="space-y-1.5 flex flex-col md:col-span-2">
                        <label className="text-[11px] font-medium  text-black tracking-wider ml-0.5">
                          Marital Status
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {["Never Married", "Divorced", "Awaiting Divorce", "Widowed"].map((status) => (
                            <button
                              key={status}
                              onClick={() => handleArrayToggle("maritalStatus", status)}
                              className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${formData.maritalStatus?.includes(status)
                                ? "bg-primary text-white border-primary shadow-sm"
                                : "bg-white text-black border-border hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                                }`}
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      </div>

                      <SelectField
                        label="Diet Preference"
                        value={formData.diet || "Doesn't Matter"}
                        onChange={(v) => handleChange("diet", v)}
                        options={["Doesn't Matter", "Vegetarian", "Non-Vegetarian"]}
                      />
                    </div>
                  </div>
                )}

                {/* Professional Section */}
                {activeTab === "professional" && (
                  <div className="space-y-8 animate-fade-in text-left">
                    <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                      <SelectField
                        label="Minimum Education"
                        value={formData.education || "Doesn't Matter"}
                        onChange={(v) => handleChange("education", v)}
                        options={["Doesn't Matter", "Bachelors", "Masters", "PhD / Doctorate"]}
                      />

                      <div className="space-y-1.5 flex flex-col md:col-span-2">
                        <label className="text-[11px] font-medium  text-black tracking-wider ml-0.5">
                          Work Sector
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {["Private", "Government", "Defense", "Business", "Self Employed"].map((sector) => (
                            <button
                              key={sector}
                              onClick={() => handleArrayToggle("workSector", sector)}
                              className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${formData.workSector?.includes(sector)
                                ? "bg-primary text-white border-primary shadow-sm"
                                : "bg-white text-black border-border hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                                }`}
                            >
                              {sector}
                            </button>
                          ))}
                        </div>
                      </div>

                      <SelectField
                        label="Min Annual Income"
                        value={formData.incomeRange || "Any"}
                        onChange={(v) => handleChange("incomeRange", v)}
                        options={["Any", "₹ 5L - 10L", "₹ 10L - 20L", "₹ 20L - 50L"]}
                      />
                    </div>
                  </div>
                )}

                {/* Social Section */}
                {activeTab === "social" && (
                  <div className="space-y-8 animate-fade-in text-left">
                    <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                      <InputField
                        label="Religion"
                        value={formData.religion || ""}
                        onChange={(v) => handleChange("religion", v)}
                        placeholder="e.g. Hindu"
                      />

                      <div className="space-y-1.5 flex flex-col">
                        <label className="text-[11px] font-medium  text-black tracking-wider ml-0.5">
                          Caste Preference
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="text"
                            value={formData.caste || ""}
                            onChange={(e) => handleChange("caste", e.target.value)}
                            className="flex-1 px-4 py-3 bg-muted/10 border border-border/80 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary/50 outline-none font-medium text-foreground text-sm transition-all duration-200"
                            placeholder="Caste Name"
                          />
                          <label className="flex items-center gap-2 cursor-pointer group whitespace-nowrap">
                            <input
                              type="checkbox"
                              className="w-4 h-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
                              checked={formData.casteNoBar || false}
                              onChange={(e) => handleChange("casteNoBar", e.target.checked)}
                            />
                            <span className="text-xs font-medium text-black group-hover:text-primary transition-colors">
                              Open to All
                            </span>
                          </label>
                        </div>
                      </div>

                      <InputField
                        label="Mother Tongue"
                        value={formData.motherTongue || ""}
                        onChange={(v) => handleChange("motherTongue", v)}
                        placeholder="e.g. Hindi, Marathi"
                      />
                    </div>
                  </div>
                )}

                {/* Location Section */}
                {activeTab === "location" && (
                  <div className="space-y-8 animate-fade-in text-left">
                    <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                      <SelectField
                        label="Preferred Country"
                        value={formData.country || "India"}
                        onChange={(v) => handleChange("country", v)}
                        options={["India", "United States", "United Kingdom", "Canada"]}
                      />

                      <InputField
                        label="City / Region Preference"
                        value={formData.city || ""}
                        onChange={(v) => handleChange("city", v)}
                        placeholder="Search for cities..."
                        icon={MapPin}
                      />
                    </div>
                    <p className="text-[11px] text-black font-medium  tracking-widest ml-1 pt-2">
                      You can add multiple cities separated by commas
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Premium Note */}
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-soft text-primary shrink-0">
                <Scale size={32} />
              </div>
              <div className="flex-1 space-y-1 text-center md:text-left">
                <h4 className="text-lg font-medium text-foreground">Perfect Match Filter</h4>
                <p className="text-sm text-black">
                  Activate "Perfect Match" mode to only see profiles that meet 100% of your saved criteria.
                </p>
              </div>
              <Button
                variant="outline"
                className="rounded-xl px-8 border-primary/20 text-primary hover:bg-primary hover:text-white transition-all font-medium whitespace-nowrap"
              >
                Upgrade Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default PartnerPreferencesPage;





