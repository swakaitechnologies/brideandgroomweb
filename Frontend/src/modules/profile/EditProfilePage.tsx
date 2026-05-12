"use client";

import UserLayout from "@/components/layout/UserLayout";

import { useAuthStore } from "@/store/authStore";
import {
  User,
  Briefcase,
  Save,
  ArrowLeft,
  Info,
  Users,
  Heart,
  Calendar,
  FileText,
  Globe,
  Star,
  Phone,
  Mail,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

import { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { fetchProfile, updateProfile } from "@/store/profileSlice";
import type { RootState, AppDispatch } from "@/store";
import { toast } from "sonner";
import api from "@/services/api";

// Helper components defined outside to prevent re-rendering issues
const InputField = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  icon: Icon,
  readOnly = false,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
  placeholder?: string;
  icon?: React.ElementType;
  readOnly?: boolean;
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
        readOnly={readOnly}
        className={`w-full ${Icon ? "pl-11" : "px-4"
          } pr-4 py-3 bg-muted/10 border border-border/80 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary/50 outline-none font-medium text-foreground transition-all duration-200 text-sm ${readOnly ? "cursor-not-allowed opacity-70" : ""}`}
      />
    </div>
  </div>
);


const SelectField = ({
  label,
  value,
  onChange,
  options,
  disabled = false,
  description = "",
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: string[];
  disabled?: boolean;
  description?: string;
}) => (
  <div className="space-y-1.5 flex flex-col">
    <div className="flex items-center justify-between ml-0.5">
      <label className="text-[11px] font-medium  text-black tracking-wider">
        {label}
      </label>
      {disabled && description && (
        <span className="text-[9px] font-medium text-primary bg-primary/5 px-2 py-0.5 rounded-full border border-primary/10">
          {description}
        </span>
      )}
    </div>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full px-4 py-3 bg-muted/10 border border-border/80 rounded-xl outline-none font-medium text-foreground appearance-none text-sm transition-all duration-200 ${disabled
          ? "cursor-not-allowed opacity-70 bg-muted/20"
          : "focus:ring-2 focus:ring-primary/10 focus:border-primary/50 cursor-pointer"
          }`}
      >
        <option value="" disabled>
          Select {label}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <div className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-black ${disabled ? "opacity-30" : ""}`}>
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

const TextAreaField = ({
  label,
  value,
  onChange,
  placeholder = "",
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  rows?: number;
}) => (
  <div className="space-y-1.5 flex flex-col col-span-full">
    <label className="text-[11px] font-medium  text-black tracking-wider ml-0.5">
      {label}
    </label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-4 py-3 bg-muted/10 border border-border/80 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary/50 outline-none font-medium text-foreground resize-none text-sm transition-all duration-200"
    />
  </div>
);

const EditProfilePage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { data: profileData, loading } = useSelector(
    (state: RootState) => state.profile,
  );

  const [activeTab, setActiveTab] = useState("basic");

  // Initial state structure
  const [formData, setFormData] = useState({
    basic: {
      firstName: "",
      lastName: "",
      dob: "",
      height: "",
      maritalStatus: "",
      gender: "",
      createdBy: "",
    },
    contact: {
      mobile: "",
      email: "",
      time: "",
    },
    location: {
      country: "",
      state: "",
      city: "",
      area: "",
      relocate: "",
    },
    religion: {
      religion: "",
      caste: "",
      subCaste: "",
      motherTongue: "",
      culture: "",
    },
    education: {
      highest: "",
      college: "",
      profession: "",
      industry: "",
      company: "",
      income: "",
    },
    family: {
      type: "",
      father: "",
      mother: "",
      siblings: "",
      location: "",
    },
    lifestyle: {
      diet: "",
      smoking: "",
      drinking: "",
      activity: "",
    },
    about: {
      bio: "",
      expectations: "",
      preferredAge: "",
      preferredLocation: "",
      dealBreakers: "",
    },
    horoscope: {
      dob: "",
      time: "",
      place: "",
      zodiacSign: "",
    },
  });

  const [showMobileModal, setShowMobileModal] = useState(false);
  const [mobileRequest, setMobileRequest] = useState({ newMobile: "", reason: "" });
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  // Sync Redux data to Local Form State
  useEffect(() => {
    if (profileData) {
      setFormData({
        basic: {
          firstName: profileData.firstName || user?.firstName || "",
          lastName: profileData.lastName || user?.lastName || "",
          dob: profileData.dob || "",
          height: profileData.height || "",
          maritalStatus: profileData.maritalStatus || "",
          gender: profileData.gender || "",
          createdBy: profileData.createdBy || "",
        },
        contact: {
          mobile: profileData.mobile || "",
          email: profileData.email || user?.email || "",
          time: profileData.contactTime || "",
        },
        location: {
          country: profileData.country || "",
          state: profileData.state || "",
          city: profileData.city || "",
          area: profileData.area || "",
          relocate: profileData.relocate || "",
        },
        religion: {
          religion: profileData.religion || "",
          caste: profileData.caste || "",
          subCaste: profileData.subCaste || "",
          motherTongue: profileData.motherTongue || "",
          culture: profileData.culture || "",
        },
        education: {
          highest: profileData.highestDegree || "",
          college: profileData.college || "",
          profession: profileData.profession || "",
          industry: profileData.industry || "",
          company: profileData.company || "",
          income: profileData.income || "",
        },
        family: {
          type: profileData.familyType || "",
          father: profileData.fatherStatus || "",
          mother: profileData.motherStatus || "",
          siblings: profileData.siblings || "",
          location: profileData.familyLocation || "",
        },
        lifestyle: {
          diet: profileData.diet || "",
          smoking: profileData.smoking || "",
          drinking: profileData.drinking || "",
          activity: profileData.activity || "",
        },
        about: {
          bio: profileData.bio || "",
          expectations: profileData.expectations || "",
          preferredAge: profileData.preferredAge || "",
          preferredLocation: profileData.preferredLocation || "",
          dealBreakers: profileData.dealBreakers || "",
        },
        horoscope: {
          dob: profileData.horoscopeDob || "",
          time: profileData.horoscopeTime || "",
          place: profileData.horoscopePlace || "",
          zodiacSign: profileData.zodiacSign || "",
        },
      });
    }
  }, [profileData, user]);

  const handleChange = (
    section: keyof typeof formData,
    field: string,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSave = () => {
    // Flatten data for backend
    const flatData = {
      ...formData.basic,
      ...formData.location,
      highestDegree: formData.education.highest,
      college: formData.education.college,
      profession: formData.education.profession,
      industry: formData.education.industry,
      company: formData.education.company,
      income: formData.education.income,

      familyType: formData.family.type,
      familyLocation: formData.family.location,
      fatherStatus: formData.family.father,
      motherStatus: formData.family.mother,
      siblings: formData.family.siblings,

      religion: formData.religion.religion,
      caste: formData.religion.caste,
      subCaste: formData.religion.subCaste,
      motherTongue: formData.religion.motherTongue,
      culture: formData.religion.culture,

      diet: formData.lifestyle.diet,
      smoking: formData.lifestyle.smoking,
      drinking: formData.lifestyle.drinking,
      activity: formData.lifestyle.activity,

      bio: formData.about.bio,
      expectations: formData.about.expectations,
      preferredAge: formData.about.preferredAge,
      preferredLocation: formData.about.preferredLocation,
      dealBreakers: formData.about.dealBreakers,

      mobile: formData.contact.mobile,
      email: formData.contact.email,
      contactTime: formData.contact.time,

      horoscopeDob: formData.horoscope.dob,
      horoscopeTime: formData.horoscope.time,
      horoscopePlace: formData.horoscope.place,
      zodiacSign: formData.horoscope.zodiacSign,
    };

    dispatch(updateProfile(flatData))
      .unwrap()
      .then(() => {
        toast.success("Profile updated successfully!");
        navigate("/profile");
      })
      .catch((err) => {
        console.error("Failed to save profile:", err);
        toast.error("Failed to save profile: " + err);
      });
  };

  const submitMobileChangeRequest = async () => {
    if (!mobileRequest.newMobile || !mobileRequest.reason) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmittingRequest(true);
    try {
      await api.post("profile/request-mobile-change", mobileRequest);
      toast.success("Change request submitted. It may take up to 48 hours for admin approval.");
      setShowMobileModal(false);
      setMobileRequest({ newMobile: "", reason: "" });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to submit request");
    } finally {
      setIsSubmittingRequest(false);
    }
  };

  if (!user) return null;

  const tabs = [
    {
      id: "basic",
      label: "Basic Info",
      icon: <User size={16} />,
      color: "bg-primary",
    },
    {
      id: "location",
      label: "Location & Religion",
      icon: <Globe size={16} />,
      color: "bg-primary/90",
    },
    {
      id: "education",
      label: "Career",
      icon: <Briefcase size={16} />,
      color: "bg-primary/80",
    },
    {
      id: "family",
      label: "Family",
      icon: <Users size={16} />,
      color: "bg-accent",
    },
    {
      id: "lifestyle",
      label: "Lifestyle",
      icon: <Heart size={16} />,
      color: "bg-accent/90",
    },
    {
      id: "about",
      label: "About & Prefs",
      icon: <FileText size={16} />,
      color: "bg-accent/80",
    },
  ];

  // Calculate Profile Completeness
  const calculateCompleteness = () => {
    let filled = 0;
    let total = 0;

    // Helper to count fields in a section
    const countSection = (section: any) => {
      const fields = Object.values(section);
      total += fields.length;
      filled += fields.filter(
        (val) => val && val.toString().trim() !== "",
      ).length;
    };

    countSection(formData.basic);
    countSection(formData.location);
    countSection(formData.religion);
    countSection(formData.education);
    countSection(formData.family);
    countSection(formData.lifestyle);
    countSection(formData.about);
    countSection(formData.contact);
    countSection(formData.horoscope);

    return Math.min(100, Math.round((filled / total) * 100));
  };

  const completeness = calculateCompleteness();

  const checklistItems = [
    { label: "Verify Mobile Number", done: user?.isMobileVerified || false },
    { label: "Verify Email ID", done: user?.isEmailVerified || false },
    {
      label: "Complete Basic Info",
      done: Object.values(formData.basic).every((v) => v !== ""),
    },
    {
      label: "Complete Family Details",
      done: Object.values(formData.family).every((v) => v !== ""),
    },
  ];

  return (
    <UserLayout className="max-w-none pt-5">
      <div className="max-w-full mx-auto pt-0 px-4 sm:px-6 lg:px-8 pb-32">
        {/* Simplified Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
          <div className="flex items-center gap-5">
            <button
              onClick={() => navigate("/profile")}
              className="p-2.5 bg-white rounded-xl border border-border hover:bg-muted transition-colors text-black"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-2xl font-medium tracking-tight text-foreground">
                Edit Profile
              </h1>
              <p className="text-black text-sm">
                Update your details to find better matches
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className="rounded-xl px-6 py-2 h-auto text-sm font-medium"
              onClick={() => navigate("/profile")}
            >
              Cancel
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
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Professional Navigation Sidebar */}
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

            {/* Compact Completeness Widget */}
            <div className="bg-muted/30 border border-border/60 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-medium  text-black tracking-wider">Completeness</span>
                <span className="text-sm font-medium text-primary">{completeness}%</span>
              </div>
              <div className="w-full h-2 bg-muted border border-border/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-700 ease-out shadow-[0_0_8px_rgba(var(--color-primary),0.2)]"
                  style={{ width: `${completeness}%` }}
                />
              </div>
              <p className="text-[11px] text-black/70 mt-3 flex items-center gap-1.5">
                <Info size={12} />
                Add more details to boost visibility.
              </p>
            </div>

            <div className="bg-white border border-border rounded-2xl p-6 hidden lg:block">
              <h3 className="text-xs font-medium  text-foreground mb-4 tracking-wider">
                Quick Checklist
              </h3>
              <ul className="space-y-3">
                {checklistItems.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-[13px] font-medium text-black/80"
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center border ${item.done
                        ? "bg-green-50 border-green-200 text-green-600"
                        : "bg-muted/50 border-border/50 text-black"
                        }`}
                    >
                      {item.done ? (
                        <Star size={10} className="fill-current" />
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-current" />
                      )}
                    </div>
                    <span className={item.done ? "line-through opacity-50" : ""}>
                      {item.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Main Content Form Card */}
          <div className="flex-1 w-full">
            <div className="bg-white border border-border rounded-2xl shadow-sm min-h-[500px] overflow-hidden">
              <div className="p-6 md:p-8 bg-muted/5 border-b border-border flex items-center gap-3">
                {tabs.find(t => t.id === activeTab)?.icon}
                <h2 className="text-lg font-medium text-foreground">
                  {tabs.find(t => t.id === activeTab)?.label}
                </h2>
              </div>
              <div className="p-6 md:p-10">
                {/* BASIC INFO TAB */}
                {activeTab === "basic" && (
                  <div className="space-y-8 animate-fade-in">
                    <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                      <InputField
                        label="First Name"
                        value={formData.basic.firstName}
                        onChange={(v) => handleChange("basic", "firstName", v)}
                      />
                      <InputField
                        label="Last Name"
                        value={formData.basic.lastName}
                        onChange={(v) => handleChange("basic", "lastName", v)}
                      />

                      <InputField
                        label="Date of Birth"
                        type="date"
                        value={formData.basic.dob}
                        onChange={(v) => handleChange("basic", "dob", v)}
                        icon={Calendar}
                      />
                      <InputField
                        label="Height"
                        value={formData.basic.height}
                        onChange={(v) => handleChange("basic", "height", v)}
                        placeholder="e.g. 5'8''"
                      />

                      <SelectField
                        label="Gender"
                        value={formData.basic.gender}
                        onChange={(v) => handleChange("basic", "gender", v)}
                        options={["Male", "Female", "Other"]}
                        disabled={profileData?.isGenderLocked}
                        description="Locked"
                      />
                      <SelectField
                        label="Marital Status"
                        value={formData.basic.maritalStatus}
                        onChange={(v) =>
                          handleChange("basic", "maritalStatus", v)
                        }
                        options={[
                          "Never Married",
                          "Divorced",
                          "Widowed",
                          "Awaiting Divorce",
                        ]}
                      />
                      <SelectField
                        label="Profile Created By"
                        value={formData.basic.createdBy}
                        onChange={(v) => handleChange("basic", "createdBy", v)}
                        options={[
                          "Self",
                          "Parent",
                          "Sibling",
                          "Relative",
                          "Friend",
                        ]}
                      />
                    </div>

                    <div className="pt-8 border-t border-muted">
                      <div className="flex items-center gap-3 mb-6">
                        <Phone className="text-primary/70" size={18} />
                        <h3 className="text-base font-medium text-foreground">
                          Contact Details
                        </h3>
                      </div>
                      <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                        <div className="relative group">
                          <InputField
                            label="Mobile Number"
                            value={formData.contact.mobile}
                            onChange={() => { }}
                            icon={Phone}
                            readOnly={true}
                          />
                          <button
                            type="button"
                            onClick={() => setShowMobileModal(true)}
                            className="absolute right-3 top-9 text-[10px] font-medium text-primary hover:underline  tracking-tighter"
                          >
                            Request Change
                          </button>
                        </div>
                        <InputField
                          label="Email Address"
                          value={formData.contact.email}
                          onChange={(v) => handleChange("contact", "email", v)}
                          icon={Mail}
                        />
                        <div className="md:col-span-2">
                          <InputField
                            label="Convenient Time to Call"
                            value={formData.contact.time}
                            onChange={(v) => handleChange("contact", "time", v)}
                            icon={Clock}
                            placeholder="e.g. Weekends 6-8 PM"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* LOCATION & RELIGION TAB */}
                {activeTab === "location" && (
                  <div className="space-y-8 animate-fade-in">
                    <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                      <InputField
                        label="Country"
                        value={formData.location.country}
                        onChange={(v) => handleChange("location", "country", v)}
                      />
                      <InputField
                        label="State"
                        value={formData.location.state}
                        onChange={(v) => handleChange("location", "state", v)}
                      />
                      <InputField
                        label="City"
                        value={formData.location.city}
                        onChange={(v) => handleChange("location", "city", v)}
                      />
                      <InputField
                        label="Area"
                        value={formData.location.area}
                        onChange={(v) => handleChange("location", "area", v)}
                      />
                      <SelectField
                        label="Willing to Relocate?"
                        value={formData.location.relocate}
                        onChange={(v) => handleChange("location", "relocate", v)}
                        options={["Yes", "No", "Depends"]}
                      />
                    </div>

                    <div className="pt-8 border-t border-muted">
                      <div className="flex items-center gap-3 mb-6">
                        <Star className="text-primary/70" size={18} />
                        <h3 className="text-base font-medium text-foreground">
                          Religious Background
                        </h3>
                      </div>
                      <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                        <SelectField
                          label="Religion"
                          value={formData.religion.religion}
                          onChange={(v) =>
                            handleChange("religion", "religion", v)
                          }
                          options={[
                            "Hindu",
                            "Muslim",
                            "Christian",
                            "Sikh",
                            "Jain",
                            "Other",
                          ]}
                        />
                        <InputField
                          label="Caste"
                          value={formData.religion.caste}
                          onChange={(v) => handleChange("religion", "caste", v)}
                        />
                        <InputField
                          label="Sub Caste"
                          value={formData.religion.subCaste}
                          onChange={(v) =>
                            handleChange("religion", "subCaste", v)
                          }
                        />
                        <InputField
                          label="Mother Tongue"
                          value={formData.religion.motherTongue}
                          onChange={(v) =>
                            handleChange("religion", "motherTongue", v)
                          }
                        />
                        <SelectField
                          label="Family Values"
                          value={formData.religion.culture}
                          onChange={(v) => handleChange("religion", "culture", v)}
                          options={[
                            "Orthodox",
                            "Traditional",
                            "Moderate",
                            "Liberal",
                          ]}
                        />
                      </div>
                    </div>

                    <div className="pt-8 border-t border-muted">
                      <div className="flex items-center gap-3 mb-6">
                        <Calendar className="text-primary/70" size={18} />
                        <h3 className="text-base font-medium text-foreground">
                          Horoscope Details
                        </h3>
                      </div>
                      <div className="grid md:grid-cols-3 gap-x-8 gap-y-6">
                        <InputField
                          label="Date of Birth"
                          type="date"
                          value={formData.horoscope.dob}
                          onChange={(v) => handleChange("horoscope", "dob", v)}
                        />
                        <InputField
                          label="Time of Birth"
                          type="time"
                          value={formData.horoscope.time}
                          onChange={(v) => handleChange("horoscope", "time", v)}
                        />
                        <InputField
                          label="Place of Birth"
                          value={formData.horoscope.place}
                          onChange={(v) => handleChange("horoscope", "place", v)}
                        />
                        <SelectField
                          label="Zodiac Sign"
                          value={formData.horoscope.zodiacSign}
                          onChange={(v) =>
                            handleChange("horoscope", "zodiacSign", v)
                          }
                          options={[
                            "Aries",
                            "Taurus",
                            "Gemini",
                            "Cancer",
                            "Leo",
                            "Virgo",
                            "Libra",
                            "Scorpio",
                            "Sagittarius",
                            "Capricorn",
                            "Aquarius",
                            "Pisces",
                          ]}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* CAREER TAB */}
                {activeTab === "education" && (
                  <div className="space-y-8 animate-fade-in">
                    <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                      <InputField
                        label="Highest Degree"
                        value={formData.education.highest}
                        onChange={(v) => handleChange("education", "highest", v)}
                      />
                      <InputField
                        label="College / University"
                        value={formData.education.college}
                        onChange={(v) => handleChange("education", "college", v)}
                      />
                      <InputField
                        label="Profession"
                        value={formData.education.profession}
                        onChange={(v) =>
                          handleChange("education", "profession", v)
                        }
                      />
                      <SelectField
                        label="Industry"
                        value={formData.education.industry}
                        onChange={(v) => handleChange("education", "industry", v)}
                        options={[
                          "IT / Software",
                          "Healthcare",
                          "Education",
                          "Banking / Finance",
                          "Business",
                          "Other",
                        ]}
                      />
                      <InputField
                        label="Company Name"
                        value={formData.education.company}
                        onChange={(v) => handleChange("education", "company", v)}
                      />
                      <SelectField
                        label="Annual Income"
                        value={formData.education.income}
                        onChange={(v) => handleChange("education", "income", v)}
                        options={[
                          "< 5 LPA",
                          "5L - 10L",
                          "10L - 15L",
                          "15L - 25L",
                          "25L - 50L",
                          "50L+",
                        ]}
                      />
                    </div>
                  </div>
                )}

                {/* FAMILY TAB */}
                {activeTab === "family" && (
                  <div className="space-y-8 animate-fade-in">
                    <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                      <SelectField
                        label="Family Type"
                        value={formData.family.type}
                        onChange={(v) => handleChange("family", "type", v)}
                        options={["Nuclear", "Joint"]}
                      />
                      <InputField
                        label="Family Location"
                        value={formData.family.location}
                        onChange={(v) => handleChange("family", "location", v)}
                      />
                      <InputField
                        label="Father's Status"
                        value={formData.family.father}
                        onChange={(v) => handleChange("family", "father", v)}
                      />
                      <InputField
                        label="Mother's Status"
                        value={formData.family.mother}
                        onChange={(v) => handleChange("family", "mother", v)}
                      />
                      <InputField
                        label="Siblings"
                        value={formData.family.siblings}
                        onChange={(v) => handleChange("family", "siblings", v)}
                      />
                    </div>
                  </div>
                )}

                {/* LIFESTYLE TAB */}
                {activeTab === "lifestyle" && (
                  <div className="space-y-8 animate-fade-in">
                    <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                      <SelectField
                        label="Dietary Habits"
                        value={formData.lifestyle.diet}
                        onChange={(v) => handleChange("lifestyle", "diet", v)}
                        options={[
                          "Vegetarian",
                          "Non-Vegetarian",
                          "Eggetarian",
                          "Vegan",
                        ]}
                      />
                      <SelectField
                        label="Smoking Habits"
                        value={formData.lifestyle.smoking}
                        onChange={(v) => handleChange("lifestyle", "smoking", v)}
                        options={["No", "Yes", "Occasionally"]}
                      />
                      <SelectField
                        label="Drinking Habits"
                        value={formData.lifestyle.drinking}
                        onChange={(v) => handleChange("lifestyle", "drinking", v)}
                        options={["No", "Yes", "Occasionally"]}
                      />
                      <SelectField
                        label="Physical Activity"
                        value={formData.lifestyle.activity}
                        onChange={(v) => handleChange("lifestyle", "activity", v)}
                        options={["Sedentary", "Moderate", "Active", "Athletic"]}
                      />
                    </div>
                  </div>
                )}

                {/* ABOUT TAB */}
                {activeTab === "about" && (
                  <div className="space-y-8 animate-fade-in">
                    <div className="grid gap-6">
                      <TextAreaField
                        label="About Me"
                        value={formData.about.bio}
                        onChange={(v) => handleChange("about", "bio", v)}
                        placeholder="Write something about yourself..."
                      />
                      <TextAreaField
                        label="Expectations"
                        value={formData.about.expectations}
                        onChange={(v) => handleChange("about", "expectations", v)}
                        placeholder="What are you looking for in a partner?"
                        rows={3}
                      />

                      <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                        <InputField
                          label="Preferred Age"
                          value={formData.about.preferredAge}
                          onChange={(v) =>
                            handleChange("about", "preferredAge", v)
                          }
                          placeholder="e.g. 24 - 29 Years"
                        />
                        <InputField
                          label="Preferred Location"
                          value={formData.about.preferredLocation}
                          onChange={(v) =>
                            handleChange("about", "preferredLocation", v)
                          }
                          placeholder="e.g. Bangalore, Mumbai"
                        />
                        <InputField
                          label="Deal Breakers"
                          value={formData.about.dealBreakers}
                          onChange={(v) =>
                            handleChange("about", "dealBreakers", v)
                          }
                          placeholder="e.g. Smoking, Drinking"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showMobileModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-border overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <h3 className="text-xl font-medium text-foreground">Change Mobile Number</h3>
                <p className="text-sm text-black">
                  Changes to mobile numbers require admin verification to maintain account security.
                </p>
              </div>

              <div className="space-y-4">
                <InputField
                  label="New Mobile Number"
                  value={mobileRequest.newMobile}
                  onChange={(v) => setMobileRequest({ ...mobileRequest, newMobile: v })}
                  placeholder="e.g. +91 9876543210"
                  icon={Phone}
                />
                <TextAreaField
                  label="Reason for Change"
                  value={mobileRequest.reason}
                  onChange={(v) => setMobileRequest({ ...mobileRequest, reason: v })}
                  placeholder="Please explain why you need to change your number..."
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  className="flex-1 rounded-xl py-6"
                  onClick={() => setShowMobileModal(false)}
                  disabled={isSubmittingRequest}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 rounded-xl py-6"
                  onClick={submitMobileChangeRequest}
                  disabled={isSubmittingRequest}
                >
                  {isSubmittingRequest ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Submit Request"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </UserLayout>
  );
};

export default EditProfilePage;





