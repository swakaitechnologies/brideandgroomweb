import { Image } from "@/components/common/Image";
import { useNavigate } from "react-router-dom";
import UserLayout from "@/components/layout/UserLayout";
import { useAuthStore } from "@/store/authStore";
import {
  User,
  Briefcase,
  Calendar,
  Edit3,
  Camera,
  Users,
  Info,
  Shield,
  CheckCircle,
  Coffee,
  Lock,
  Phone,
  Mail,
  Star,
  Map,
  ShieldCheck,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "@/store/profileSlice";
import type { RootState, AppDispatch } from "@/store";

import { useEffect, useState } from "react";
import api from "@/services/api";
import KYCModal from "@/components/profile/KYCModal";

interface Photo {
  id: string;
  url: string;
  isMain: boolean;
}

interface ProfileData {
  customId?: string;
  firstName?: string;
  lastName?: string;
  dob?: string;
  height?: string;
  maritalStatus?: string;
  createdBy?: string;
  gender?: string;
  country?: string;
  state?: string;
  city?: string;
  area?: string;
  relocate?: string;
  highestDegree?: string;
  college?: string;
  profession?: string;
  industry?: string;
  company?: string;
  income?: string;
  diet?: string;
  smoking?: string;
  drinking?: string;
  activity?: string;
  bio?: string;
  expectations?: string;
  preferredAge?: string;
  preferredLocation?: string;
  dealBreakers?: string;
  religion?: string;
  caste?: string;
  subCaste?: string;
  motherTongue?: string;
  culture?: string;
  familyType?: string;
  fatherStatus?: string;
  motherStatus?: string;
  siblings?: string;
  familyLocation?: string;
  mobile?: string;
  email?: string;
  contactTime?: string;
  horoscopeDob?: string;
  horoscopeTime?: string;
  horoscopePlace?: string;
  zodiacSign?: string;
  verificationStatus?: string;
  rejectionReason?: string;
}

interface ProfileState {
  data: ProfileData | null;
  loading: boolean;
  error: string | null;
}

const MetricItem = ({ icon: Icon, label, verified }: { icon: React.ElementType; label: string; verified: boolean }) => (
  <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/30 border border-transparent hover:border-border/50 transition-all">
    <div className="flex items-center gap-2.5">
      <Icon size={14} className="text-black" />
      <span className="text-[13px] font-medium text-foreground">
        {label}
      </span>
    </div>
    {verified ? (
      <CheckCircle size={14} className="text-green-500" />
    ) : (
      <Info size={14} className="text-amber-500" />
    )}
  </div>
);

const DetailItem = ({
  label,
  value,
  fullWidth = false,
}: {
  label: string;
  value: string;
  fullWidth?: boolean;
}) => (
  <div className={`${fullWidth ? "col-span-full" : ""} space-y-1`}>
    <p className="text-[11px] font-medium  text-black tracking-wider">
      {label}
    </p>
    <p className="font-medium text-foreground text-sm leading-relaxed">
      {value}
    </p>
  </div>
);

const ProfilePage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();
  const { data: profileData, loading, error } = useSelector((state: RootState) => state.profile);

  useEffect(() => {
    if (user) {
      dispatch(fetchProfile());
    }
  }, [dispatch, user]);

  const [photos, setPhotos] = useState<Photo[]>([]);
  const [kycStatus, setKycStatus] = useState<{ status: string; rejectionReason?: string } | null>(null);
  const [isKycModalOpen, setIsKycModalOpen] = useState(false);

  const fetchKYCStatus = async () => {
    try {
      const res = await api.get("/kyc/status");
      if (res.data.success) {
        setKycStatus(res.data.data || { status: "not_submitted" });
      }
    } catch (err) {
      console.error("Failed to fetch KYC status", err);
    }
  };

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res = await api.get("/photos");
        if (res.data.success) {
          setPhotos(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch photos", err);
      }
    };
    
    // Using setTimeout to defer the fetching until after initial hydration
    // to prevent react-hooks/set-state-in-effect warnings.
    const timer = setTimeout(() => {
      fetchPhotos();
      fetchKYCStatus();
    }, 0);
    
    return () => clearTimeout(timer);
  }, []);

  if (!user) return null;

  if (loading && !profileData) {
    return (
      <UserLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </UserLayout>
    );
  }

  if (error && !profileData) {
    return (
      <UserLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <div className="text-red-500 font-medium text-lg">
            Failed to load profile
          </div>
          <p className="text-black">{error}</p>
          <Button onClick={() => dispatch(fetchProfile())} variant="outline">
            Retry
          </Button>
        </div>
      </UserLayout>
    );
  }

  // Calculate dynamic trust score
  const calculateTrustScore = () => {
    let score = 0;
    const total = 100;

    // Weighted points for fields
    const points = {
      verified: 20, // Mobile/Email verified
      basic: 10,
      photo: 15, // Photo ID / Profile Pic
      education: 15,
      career: 15,
      family: 10,
      location: 10,
      about: 5,
    };

    if (user?.isMobileVerified && user?.isEmailVerified)
      score += points.verified;
    if (profileData?.firstName && profileData?.lastName) score += points.basic;
    if (photos.length > 0) score += points.photo; // Based on photo count now

    if (profileData?.highestDegree) score += points.education;
    if (profileData?.profession && profileData?.company) score += points.career;

    // Check if sections are filled (simple check)
    if (profileData?.familyType && profileData?.familyLocation)
      score += points.family;
    if (profileData?.city && profileData?.state) score += points.location;
    if (profileData?.bio) score += points.about;

    return Math.min(score, total);
  };

  const trustScore = calculateTrustScore();

  // Construct profile object from Redux data or fallback to defaults
  const profile = {
    ...user,
    basic: {
      dob: profileData?.dob || "Not specified",
      age: profileData?.dob
        ? new Date().getFullYear() - new Date(profileData.dob).getFullYear()
        : "N/A",
      height: profileData?.height || "Not specified",
      maritalStatus: profileData?.maritalStatus || "Not specified",
      createdBy: profileData?.createdBy || "Not specified",
      gender: profileData?.gender || "Not specified",
    },
    location: {
      country: profileData?.country || "Not specified",
      state: profileData?.state || "Not specified",
      city: profileData?.city || "Not specified",
      area: profileData?.area || "Not specified",
      relocate: profileData?.relocate || "Not specified",
    },
    education: {
      highest: profileData?.highestDegree || "Not specified",
      college: profileData?.college || "Not specified",
      profession: profileData?.profession || "Not specified",
      industry: profileData?.industry || "Not specified",
      company: profileData?.company || "Not specified",
      income: profileData?.income || "Not specified",
    },
    lifestyle: {
      diet: profileData?.diet || "Not specified",
      smoking: profileData?.smoking || "Not specified",
      drinking: profileData?.drinking || "Not specified",
      activity: profileData?.activity || "Not specified",
    },
    about: {
      bio: profileData?.bio || "No bio added yet.",
      expectations: profileData?.expectations || "Not specified",
      preferredAge: profileData?.preferredAge || "Not specified",
      preferredLocation: profileData?.preferredLocation || "Not specified",
      dealBreakers: profileData?.dealBreakers || "Not specified",
    },
    religion: {
      religion: profileData?.religion || "Not specified",
      caste: profileData?.caste || "Not specified",
      subCaste: profileData?.subCaste || "Not specified",
      motherTongue: profileData?.motherTongue || "Not specified",
      culture: profileData?.culture || "Not specified",
    },
    family: {
      type: profileData?.familyType || "Not specified",
      father: profileData?.fatherStatus || "Not specified",
      mother: profileData?.motherStatus || "Not specified",
      siblings: profileData?.siblings || "Not specified",
      location: profileData?.familyLocation || "Not specified",
    },
    contact: {
      mobile: profileData?.mobile || user?.mobile || "Not specified",
      mobileVerified: user?.isMobileVerified || false,
      email: profileData?.email || user?.email || "Not specified",
      emailVerified: user?.isEmailVerified || false,
      time: profileData?.contactTime || "Not specified",
    },
    horoscope: {
      dob: profileData?.horoscopeDob || "Not specified",
      time: profileData?.horoscopeTime || "Not specified",
      place: profileData?.horoscopePlace || "Not specified",
      zodiacSign: profileData?.zodiacSign || "Not specified",
      chartAvailable: true,
    },
    trust: {
      score: trustScore,
      totalScore: 100,
      verified: true,
    },
  };

  return (
    <UserLayout className="max-w-none pt-5">
      <div className="max-w-full pt-0 pb-8 px-4 sm:px-8 lg:px-12 mx-auto">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b pb-6">
          <div>
            <h1 className="text-2xl font-medium text-foreground mb-2 flex items-center gap-2">
              <User className="text-primary" size={24} />
              My Profile
            </h1>
            <p className="text-black">
              Manage your personal information and profile visibility.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              className="rounded-xl px-6 py-2 h-auto text-sm font-medium shadow-sm"
              onClick={() => navigate("/profile/edit")}
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* LEFT SIDEBAR - Identity & Identity Widget */}
          <aside className="w-full lg:w-80 lg:sticky lg:top-24 space-y-6">
            {/* Identity Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-border p-6 text-center overflow-hidden relative group">
              <div className="absolute top-0 left-0 w-full h-20 bg-linear-to-br from-primary/5 to-secondary/5 -z-10" />

              <div className="relative inline-block mb-4">
                <div className="w-28 h-28 rounded-full border-4 border-white shadow-md overflow-hidden bg-white mx-auto relative">
                  <Image
                    src={
                      photos.find((p) => p.isMain)?.url ||
                      photos[0]?.url ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.firstName}`
                    }
                    alt="Profile"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div
                  className={`absolute bottom-1 right-1 p-1.5 rounded-full border-2 border-white shadow-sm ${user.isOnline !== false ? "bg-green-500" : "bg-gray-400"
                    }`}
                  title={user.isOnline !== false ? "Online" : "Offline"}
                />
              </div>

              <h2 className="text-xl font-medium text-foreground">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-[10px] font-medium text-secondary  tracking-widest mt-1 mb-3">
                ID: {profileData?.customId || "SMT-000000"}
              </p>
              <p className="text-sm font-medium text-black mb-6">
                {profile.education.profession}
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex justify-center">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-medium  tracking-widest border flex items-center gap-1.5 ${profileData?.verificationStatus === "approved"
                        ? "bg-green-50 text-green-600 border-green-100"
                        : profileData?.verificationStatus === "rejected"
                          ? "bg-red-50 text-red-600 border-red-100"
                          : "bg-amber-50 text-amber-600 border-amber-100"
                      }`}
                  >
                    <Shield size={10} className="fill-current" />
                    {profileData?.verificationStatus || "Pending Verification"}
                  </span>
                </div>
                {profileData?.verificationStatus === "rejected" &&
                  profileData?.rejectionReason && (
                    <div className="bg-red-50/50 p-2 rounded-xl border border-red-100/50 text-left">
                      <p className="text-[10px] text-red-600 font-medium flex items-center gap-1">
                        <Info size={10} /> Rejection Reason
                      </p>
                      <p className="text-[10px] text-red-500 mt-0.5 leading-tight italic">
                        {profileData.rejectionReason}
                      </p>
                    </div>
                  )}

                {/* KYC Status Section */}
                <div className="mt-4 pt-4 border-t border-border/50">
                  {kycStatus?.status === "approved" ? (
                    <div className="bg-green-50 p-3 rounded-2xl border border-green-100 flex items-center gap-2.5">
                      <ShieldCheck size={18} className="text-green-600" />
                      <div className="text-left">
                        <p className="text-[11px] font-medium text-green-700  tracking-tight">
                          Account Verified
                        </p>
                        <p className="text-[10px] text-green-600/80 font-medium">
                          KYC documents approved
                        </p>
                      </div>
                    </div>
                  ) : kycStatus?.status === "pending" ? (
                    <div className="bg-blue-50 p-3 rounded-2xl border border-blue-100 flex items-start gap-2.5">
                      <Loader2
                        size={18}
                        className="text-blue-600 animate-spin mt-0.5"
                      />
                      <div className="text-left">
                        <p className="text-[11px] font-medium text-white/60  tracking-tight">
                          KYC Submitted
                        </p>
                        <p className="text-[10px] text-blue-600/80 font-medium leading-tight">
                          Verification may take 48 Hours. Thank You For Patience
                        </p>
                      </div>
                    </div>
                  ) : kycStatus?.status === "rejected" ? (
                    <div className="space-y-2">
                      <div className="bg-red-50 p-3 rounded-2xl border border-red-100 flex items-start gap-2.5 text-left">
                        <AlertCircle
                          size={18}
                          className="text-red-600 mt-0.5 shrink-0"
                        />
                        <div>
                          <p className="text-[11px] font-medium text-red-700  tracking-tight">
                            KYC Rejected
                          </p>
                          <p className="text-[10px] text-red-600/80 font-medium leading-tight">
                            {kycStatus.rejectionReason ||
                              "Please re-upload valid documents."}
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-auto p-0 text-[11px] font-medium text-primary hover:text-primary/80"
                        onClick={() => setIsKycModalOpen(true)}
                      >
                        Re-submit KYC Documents
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-3 h-12 rounded-2xl bg-amber-50/50 hover:bg-amber-100/50 border border-amber-100/50 text-amber-700 font-medium text-xs"
                      onClick={() => setIsKycModalOpen(true)}
                    >
                      <ShieldCheck size={18} className="text-amber-600" />
                      Verify account with KYC
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 rounded-xl text-xs font-medium h-10"
                  onClick={() => navigate("/profile/photos")}
                >
                  <Camera className="w-3.5 h-3.5 mr-1.5 text-primary" />
                  Photos
                </Button>
                <Button
                  className="flex-1 rounded-xl text-xs font-medium h-10 shadow-sm"
                  onClick={() => navigate("/profile/edit")}
                >
                  Edit
                </Button>
              </div>
            </div>

            {/* Trust Tracker */}
            <div className="bg-white rounded-2xl shadow-sm border border-border p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-green-500" />
                  <span className="text-xs font-medium text-black  tracking-wider">
                    Trust Score
                  </span>
                </div>
                <span className="text-lg font-medium text-foreground">
                  {profile.trust.score}%
                </span>
              </div>

              <div className="w-full bg-muted h-2 rounded-full mb-6 overflow-hidden">
                <div
                  className="bg-green-500 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${profile.trust.score}%` }}
                />
              </div>

              <div className="space-y-2">
                <MetricItem
                  icon={Phone}
                  label="Mobile"
                  verified={!!user?.isMobileVerified}
                />
                <MetricItem
                  icon={Mail}
                  label="Email"
                  verified={!!user?.isEmailVerified}
                />
                <MetricItem
                  icon={Camera}
                  label="Photo ID"
                  verified={photos.length > 0}
                />
              </div>

            </div>

            {/* Private Contact Card */}
            <div className="bg-slate-900 rounded-2xl p-6 text-white overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl group-hover:bg-white/10 transition-colors" />
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/10">
                  <Lock size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-medium text-white/70  tracking-widest">
                    Confidential
                  </p>
                  <p className="text-base font-medium">Contact Details</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { label: "Phone", value: profile.contact.mobile },
                  {
                    label: "Email",
                    value: profile.contact.email,
                    isVerified: user?.isEmailVerified
                  },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <p className="text-[9px] font-medium text-white/80  tracking-tight">
                        {item.label}
                      </p>
                      {item.isVerified && (
                        <span className="flex items-center gap-1 text-[8px] font-medium text-green-400  tracking-tighter bg-green-400/10 px-1.5 py-0.5 rounded-full border border-green-400/20">
                          <CheckCircle size={8} className="fill-current" />
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="font-mono text-sm tracking-tight text-white/90">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-white/80 mt-6 leading-relaxed italic">
                Only visible to members whose interest you've accepted.
              </p>
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <div className="flex-1 w-full space-y-8">
            {/* About Profile Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
              <div className="p-6 md:p-8 bg-muted/5 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-primary">
                    <Info size={18} />
                  </span>
                  <h2 className="text-lg font-medium text-foreground">
                    About Me
                  </h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-lg h-8 text-xs font-medium hover:text-primary transition-colors"
                  onClick={() => navigate("/profile/edit")}
                >
                  <Edit3 size={14} className="mr-1.5" />
                  Edit
                </Button>
              </div>
              <div className="p-6 md:p-8 space-y-8">
                <p className="text-black leading-relaxed text-[15px] max-w-4xl italic">
                  "{profile.about.bio}"
                </p>

                <div className="grid sm:grid-cols-2 gap-8 items-start">
                  <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10 relative">
                    <div className="absolute -top-3 left-4 bg-primary text-white text-[10px] font-medium  tracking-widest px-3 py-1 rounded-full shadow-sm">
                      Expectations
                    </div>
                    <p className="text-sm text-foreground leading-relaxed mt-1">
                      {profile.about.expectations}
                    </p>
                  </div>
                  <div className="space-y-6 px-2">
                    <DetailItem
                      label="Preferred Partner Age"
                      value={profile.about.preferredAge}
                    />
                    <DetailItem
                      label="Preferred Location"
                      value={profile.about.preferredLocation}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary Profile Sections Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Basic Background */}
              <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
                <div className="p-5 bg-muted/5 border-b border-border flex items-center gap-3">
                  <span className="text-primary">
                    <User size={16} />
                  </span>
                  <h3 className="font-medium text-foreground">
                    Basic Information
                  </h3>
                </div>
                <div className="p-6 grid grid-cols-2 gap-y-6 gap-x-4">
                  <DetailItem
                    label="Current Age"
                    value={`${profile.basic.age} Years`}
                  />
                  <DetailItem
                    label="Physical Height"
                    value={profile.basic.height}
                  />
                  <DetailItem
                    label="Marital Status"
                    value={profile.basic.maritalStatus}
                  />
                  <DetailItem
                    label="Living Gender"
                    value={profile.basic.gender}
                  />
                  <DetailItem
                    label="Birth Date"
                    value={profile.basic.dob}
                    fullWidth
                  />
                </div>
              </div>

              {/* Geographical Data */}
              <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
                <div className="p-5 bg-muted/5 border-b border-border flex items-center gap-3">
                  <span className="text-primary">
                    <Map size={16} />
                  </span>
                  <h3 className="font-medium text-foreground">
                    Location Details
                  </h3>
                </div>
                <div className="p-6 grid grid-cols-2 gap-y-6 gap-x-4">
                  <DetailItem
                    label="Current City"
                    value={profile.location.city}
                  />
                  <DetailItem
                    label="Current State"
                    value={profile.location.state}
                  />
                  <DetailItem
                    label="Base Country"
                    value={profile.location.country}
                  />
                  <DetailItem
                    label="Open to Relocate"
                    value={profile.location.relocate}
                  />
                  <DetailItem
                    label="Living Area"
                    value={profile.location.area}
                    fullWidth
                  />
                </div>
              </div>

              {/* Career Path */}
              <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden md:col-span-2">
                <div className="p-5 bg-muted/5 border-b border-border flex items-center gap-3">
                  <span className="text-primary">
                    <Briefcase size={16} />
                  </span>
                  <h3 className="font-medium text-foreground">
                    Education & Professional Career
                  </h3>
                </div>
                <div className="p-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-8">
                  <DetailItem
                    label="Highest Qualification"
                    value={profile.education.highest}
                  />
                  <DetailItem
                    label="College / University"
                    value={profile.education.college}
                  />
                  <DetailItem
                    label="Work Industry"
                    value={profile.education.industry}
                  />
                  <DetailItem
                    label="Professional Role"
                    value={profile.education.profession}
                  />
                  <DetailItem
                    label="Current Organization"
                    value={profile.education.company}
                  />
                  <DetailItem
                    label="Annual Net Income"
                    value={profile.education.income}
                  />
                </div>
              </div>

              {/* Heritage & Lifestyle */}
              <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
                <div className="p-5 bg-muted/5 border-b border-border flex items-center gap-3">
                  <span className="text-primary">
                    <Star size={16} />
                  </span>
                  <h3 className="font-medium text-foreground">
                    Religion & Culture
                  </h3>
                </div>
                <div className="p-6 grid grid-cols-2 gap-y-6 gap-x-4">
                  <DetailItem
                    label="Religion"
                    value={profile.religion.religion}
                  />
                  <DetailItem
                    label="Caste Group"
                    value={profile.religion.caste}
                  />
                  <DetailItem
                    label="Sub Caste"
                    value={profile.religion.subCaste}
                  />
                  <DetailItem
                    label="Mother Tongue"
                    value={profile.religion.motherTongue}
                  />
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
                <div className="p-5 bg-muted/5 border-b border-border flex items-center gap-3">
                  <span className="text-primary">
                    <Coffee size={16} />
                  </span>
                  <h3 className="font-medium text-foreground">
                    Personal Lifestyle
                  </h3>
                </div>
                <div className="p-6 grid grid-cols-2 gap-y-6 gap-x-4">
                  <DetailItem
                    label="Dietary Pattern"
                    value={profile.lifestyle.diet}
                  />
                  <DetailItem
                    label="Smoking Habit"
                    value={profile.lifestyle.smoking}
                  />
                  <DetailItem
                    label="Drinking Habit"
                    value={profile.lifestyle.drinking}
                  />
                  <DetailItem
                    label="Daily Activity"
                    value={profile.lifestyle.activity}
                  />
                </div>
              </div>

              {/* Family Background */}
              <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden md:col-span-2">
                <div className="p-5 bg-muted/5 border-b border-border flex items-center gap-3">
                  <span className="text-primary">
                    <Users size={16} />
                  </span>
                  <h3 className="font-medium text-foreground">
                    Family Background
                  </h3>
                </div>
                <div className="p-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-8">
                  <DetailItem label="Family Type" value={profile.family.type} />
                  <DetailItem
                    label="Family Location"
                    value={profile.family.location}
                  />
                  <DetailItem
                    label="Siblings Status"
                    value={profile.family.siblings}
                  />
                  <DetailItem
                    label="Father's Profession"
                    value={profile.family.father}
                  />
                  <DetailItem
                    label="Mother's Profession"
                    value={profile.family.mother}
                  />
                </div>
              </div>
            </div>

            {/* Gallery Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
              <div className="p-5 bg-muted/5 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-primary">
                    <Camera size={16} />
                  </span>
                  <h3 className="font-medium text-foreground">Photo Gallery</h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-lg h-8 text-xs font-medium"
                  onClick={() => navigate("/profile/photos")}
                >
                  Manage Photos
                </Button>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                  {photos.slice(0, 4).map((photo) => (
                    <div
                      key={photo.id}
                      className="aspect-square rounded-2xl bg-muted overflow-hidden relative group cursor-pointer shadow-sm border border-border"
                    >
                      <Image
                        src={photo.url}
                        alt="Gallery"
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    </div>
                  ))}
                  <div
                    onClick={() => navigate("/profile/photos")}
                    className="aspect-square rounded-2xl bg-muted/40 border-2 border-dashed border-border flex flex-col items-center justify-center text-black hover:bg-white hover:border-primary/40 hover:text-primary transition-all cursor-pointer group shadow-sm"
                  >
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-1 shadow-sm border border-border group-hover:border-primary/20">
                      <Camera size={18} />
                    </div>
                    <span className="text-[10px] font-medium  tracking-widest mt-1">
                      Add More
                    </span>
                  </div>
                </div>
                {photos.length === 0 && (
                  <p className="text-sm text-black italic mt-4 text-center">
                    No photos added to your gallery yet.
                  </p>
                )}
              </div>
            </div>

            {/* Astrology / Horoscope Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
              <div className="p-5 bg-muted/5 border-b border-border flex items-center gap-3">
                <span className="text-secondary">
                  <Calendar size={16} />
                </span>
                <h3 className="font-medium text-foreground">
                  Horoscope & Astrology
                </h3>
              </div>
              <div className="p-8 flex items-center gap-10">
                <div className="hidden sm:flex w-20 h-20 rounded-2xl bg-secondary/5 border border-secondary/20 items-center justify-center text-secondary rotate-3">
                  <Star size={32} className="fill-current/20" />
                </div>
                <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-y-6 gap-x-4">
                  <DetailItem
                    label="Date of Birth"
                    value={profile.horoscope.dob}
                  />
                  <DetailItem
                    label="Exact Birth Time"
                    value={profile.horoscope.time}
                  />
                  <DetailItem
                    label="Place of Birth"
                    value={profile.horoscope.place}
                  />
                  <DetailItem
                    label="Zodiac / Rasi"
                    value={profile.horoscope.zodiacSign}
                  />
                </div>
              </div>
            </div>

            {/* Bottom Quick Action */}
            <div className="bg-primary p-8 rounded-2xl text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md shadow-primary/20">
              <div className="text-center md:text-left">
                <h4 className="text-lg font-medium mb-1">
                  Make your profile stand out
                </h4>
                <p className="text-white/90 text-sm">
                  Members with complete profiles get 5x more responses.
                </p>
              </div>
              <Button
                variant="outline"
                className="bg-white border-none text-primary hover:bg-secondary hover:text-white transition-all font-medium rounded-xl px-8"
                onClick={() => navigate("/profile/edit")}
              >
                Complete Profile
              </Button>
            </div>
          </div>
        </div>
      </div>
      <KYCModal
        isOpen={isKycModalOpen}
        onClose={() => setIsKycModalOpen(false)}
        onSuccess={fetchKYCStatus}
      />
    </UserLayout>
  );
};

export default ProfilePage;

