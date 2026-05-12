import { Image } from "@/components/common/Image";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleShortlist } from "@/store/matchesSlice";
import {
  sendInterest,
  sendContactRequest,
} from "@/store/interactionSlice";
import { openFloatingChatWith } from "@/store/chatSlice";
import type { RootState, AppDispatch } from "@/store";
import { motion, AnimatePresence } from "framer-motion";
import { calculateAge, getCompatibilityScore } from "@/utils/matchUtils";
import {
  MapPin,
  Briefcase,
  GraduationCap,
  Heart,
  Calendar,
  Users,
  Sparkles,
  MessageSquare,
  Star,
  ShieldCheck,
  Smartphone,
  Clock,
  User,
  Activity,
  Gem,
  BookOpen,
  Anchor,
  Compass,
  Info,
  Globe,
  Navigation,
  Quote,
  Lock,
  Flag,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { ProfileData } from "@/store/profileSlice";

interface InfoItemProps {
  icon: React.ElementType;
  label: string;
  value: string | undefined;
  colorClass?: string;
}

const InfoItem = ({
  icon: Icon,
  label,
  value,
  colorClass = "text-primary",
}: InfoItemProps) => (
  <div className="flex items-center gap-4 p-4 bg-white/50 backdrop-blur-sm border border-border/50 rounded-3xl hover:border-primary/30 transition-all hover:shadow-lg group">
    <div
      className={`w-12 h-12 rounded-2xl bg-muted flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform ${colorClass}`}
    >
      <Icon size={22} strokeWidth={2.5} />
    </div>
    <div>
      <p className="text-[10px] font-medium tracking-widest text-black mb-0.5">
        {label}
      </p>
      <p className="font-medium text-foreground text-sm tracking-tight">
        {value || "Not Specified"}
      </p>
    </div>
  </div>
);

interface FullProfileDetailedViewProps {
  profile: ProfileData;
  onReport?: () => void;
  showBackButton?: boolean;
}

const FullProfileDetailedView = ({ 
  profile, 
  onReport,
  showBackButton = true 
}: FullProfileDetailedViewProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const id = profile.userId || profile.id;

  const shortlisted = useSelector(
    (state: RootState) => state.matches.shortlisted,
  );
  const { sentInterests, receivedInterests, sentContactRequests } = useSelector(
    (state: RootState) => state.interaction,
  );

  const currentInterest = sentInterests.find((i) => i.receiverId === id);
  const receivedInterest = receivedInterests.find((i) => i.senderId === id);
  const isMutualMatch =
    currentInterest?.status === "accepted" &&
    receivedInterest?.status === "accepted";

  const currentContactRequest = sentContactRequests.find(
    (r) => r.receiverId === id,
  );

  const isShortlisted = shortlisted.some((m) => m.id === id);
  const [activeTab, setActiveTab] = useState("about");

  const handleShortlist = () => {
    if (!profile || !id) return;
    
    const matchData = {
      id: id,
      name: `${profile.firstName || ""} ${profile.lastName || ""}`.trim(),
      age: calculateAge(profile.dob),
      height: profile.height || "",
      profession: profile.profession || "",
      location: `${profile.city || ""}, ${profile.state || ""}`.replace(/^, |, $/, ""),
      religion: profile.religion || "",
      education: profile.highestDegree || "",
      image: profile.photos && profile.photos.length > 0
          ? profile.photos.find((p: any) => p.isMain)?.url || profile.photos[0].url
          : "",
      compatibility: getCompatibilityScore(id),
      online: profile.user?.isOnline ?? false,
      customId: profile.customId || "",
      photosLocked: profile.photosLocked,
      isKycVerified: profile.isKycVerified,
    };

    dispatch(toggleShortlist(matchData));
    if (!isShortlisted) {
      toast.success("Added to shortlist");
    } else {
      toast.info("Removed from shortlist");
    }
  };

  const handleRevealRequest = async () => {
    if (!id || currentContactRequest) return;
    try {
      await dispatch(sendContactRequest(id)).unwrap();
      toast.success("Contact request sent successfully");
    } catch (error: any) {
      toast.error(error || "Could not send request");
    }
  };

  const tabs = [
    { id: "about", label: "Overview", icon: User },
    { id: "career", label: "Professional", icon: Briefcase },
    { id: "family", label: "Family", icon: Users },
    { id: "religious", label: "Cultural", icon: Sparkles },
    { id: "expectations", label: "Partner Choice", icon: Heart },
  ];

  const profileImage = profile.photos && profile.photos.length > 0 
    ? profile.photos.find((p: any) => p.isMain)?.url || profile.photos[0].url
    : null;

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-12">
        <div className="flex items-center gap-2">
            {showBackButton && (
               <Button
                 variant="ghost"
                 size="sm"
                 onClick={() => navigate(-1)}
                 className="mr-4 rounded-full"
               >
                 <Navigation className="-rotate-90 mr-2" size={16} /> Back
               </Button>
            )}
            <div className="space-y-1">
              <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">
                {profile.firstName} {profile.lastName}
              </h1>
              <div className="flex items-center gap-4 text-sm text-slate-500 font-medium">
                <span>{profile.customId}</span>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <span>{calculateAge(profile.dob)} Yrs</span>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <span>{profile.city}, {profile.state}</span>
              </div>
            </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleShortlist}
            className={`rounded-xl border-slate-200 h-11 transition-all ${
              isShortlisted ? "bg-amber-50 text-amber-600 border-amber-200" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Star size={18} className={`mr-2 ${isShortlisted ? "fill-current" : ""}`} />
            Shortlist
          </Button>

          <Button
            variant={isMutualMatch ? "default" : currentInterest ? "outline" : "hero"}
            disabled={!!currentInterest && !isMutualMatch}
            onClick={() => {
              if (isMutualMatch) {
                if (id) dispatch(openFloatingChatWith(id));
              } else if (id && !currentInterest) {
                dispatch(sendInterest(id)).unwrap().then(() => toast.success("Interest sent"));
              }
            }}
            className="rounded-xl px-8 h-11 font-medium"
          >
            {isMutualMatch ? "Message" : currentInterest ? "Interest Sent" : "Send Interest"}
          </Button>
          
          {onReport && (
            <Button
              variant="outline"
              size="icon"
              onClick={onReport}
              className="rounded-xl border-slate-200 h-11 w-11 text-slate-400 hover:text-red-500 hover:bg-red-50"
            >
              <Flag size={18} />
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* LEFT: MEDIA & QUICK INFO */}
        <div className="lg:col-span-4 space-y-8">
          <div className="relative aspect-4/5 rounded-4xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
            {profileImage ? (
              <Image
                src={profileImage}
                alt={profile.firstName || "Profile"}
                fill
                className={`object-cover ${profile.photosLocked ? "blur-xl opacity-60" : ""}`}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                <User size={64} />
              </div>
            )}
            
            {profile.photosLocked && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/5 backdrop-blur-sm p-8 text-center">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-slate-800 mb-4 border border-white/30">
                  <Lock size={20} />
                </div>
                <p className="text-sm font-semibold text-slate-900">Photos Protected</p>
                <p className="text-xs text-slate-600 mt-1">Accept interest to view</p>
              </div>
            )}

            <div className="absolute bottom-6 left-6 flex flex-col gap-2">
              {profile.isKycVerified && (
                <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200/50 flex items-center gap-2 text-[10px] font-bold text-slate-900 uppercase tracking-wider shadow-sm">
                  <ShieldCheck size={14} className="text-green-600" /> Verified
                </div>
              )}
              <div className="bg-primary/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-primary/20 flex items-center gap-2 text-[10px] font-bold text-white uppercase tracking-wider shadow-sm">
                <Sparkles size={14} /> {getCompatibilityScore(id || "")}% Match
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="bg-white rounded-4xl border border-slate-100 p-8 space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-slate-400">Trust metrics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-400 shadow-sm">
                    <Smartphone size={16} />
                  </div>
                  <span className="text-sm font-medium text-slate-600">Contact</span>
                </div>
                {currentContactRequest?.status === "accepted" ? (
                   <span className="text-sm font-semibold text-slate-900">{profile.mobile}</span>
                ) : (
                   <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleRevealRequest}
                    disabled={!!currentContactRequest}
                    className="h-8 text-[10px] font-bold uppercase tracking-wider text-primary hover:bg-white"
                   >
                     {currentContactRequest ? "Pending" : "Reveal"}
                   </Button>
                )}
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-400 shadow-sm">
                    <Clock size={16} />
                  </div>
                  <span className="text-sm font-medium text-slate-600">Verification</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-green-600">Secure</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: TABS & DETAILS */}
        <div className="lg:col-span-8 space-y-12">
          {/* Bio Snippet */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-primary">A little something about me</h3>
            <p className="text-xl text-slate-600 leading-relaxed font-light">
              "{profile.bio || "Searching for a life partner who values both individual growth and shared traditions. I am a professional who enjoys the balance of career and family life."}"
            </p>
          </div>

          {/* Tabs Navigation */}
          <div className="space-y-8">
            <div className="flex items-center gap-1 border-b border-slate-100 overflow-x-auto no-scrollbar pb-px">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative px-6 py-4 text-sm font-medium transition-all flex items-center gap-2.5 whitespace-nowrap ${
                      activeTab === tab.id
                        ? "text-primary"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    <Icon size={16} />
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Tab Content Display */}
            <div className="min-h-[400px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10"
                >
                  {activeTab === "about" && (
                    <>
                      <InfoItem icon={Calendar} label="Date of Birth" value={profile.dob} />
                      <InfoItem icon={User} label="Lineage" value={profile.createdBy} />
                      <InfoItem icon={Compass} label="Mother Tongue" value={profile.motherTongue} />
                      <InfoItem icon={Heart} label="Marital Status" value={profile.maritalStatus} />
                      <InfoItem icon={Activity} label="Height / Weight" value={`${profile.height || "-"} / ${profile.weight || "-"}`} />
                      <InfoItem icon={Globe} label="Country / Relocate" value={`${profile.country || "-"} / ${profile.relocate || "Not specified"}`} />
                      <InfoItem icon={Compass} label="Interests" value={profile.hobbies || profile.hobby} />
                      <InfoItem icon={Activity} label="Habits" value={`Smoke: ${profile.smoking || "No"} / Drink: ${profile.drinking || "No"}`} />
                    </>
                  )}

                  {activeTab === "career" && (
                    <>
                      <InfoItem icon={GraduationCap} label="Qualification" value={profile.highestDegree} />
                      <InfoItem icon={Briefcase} label="Profession" value={profile.profession} />
                      <InfoItem icon={Anchor} label="Employer" value={profile.company} />
                      <InfoItem icon={Gem} label="Income" value={profile.income} />
                      <InfoItem icon={BookOpen} label="Institute" value={profile.college} />
                      <InfoItem icon={Info} label="Sector" value={profile.industry} />
                    </>
                  )}

                  {activeTab === "family" && (
                    <>
                      <InfoItem icon={Users} label="Family Structure" value={profile.familyType} />
                      <InfoItem icon={MapPin} label="Family Base" value={profile.familyLocation} />
                      <InfoItem icon={User} label="Father Account" value={profile.fatherStatus} />
                      <InfoItem icon={User} label="Mother Account" value={profile.motherStatus} />
                      <InfoItem icon={Users} label="Siblings" value={profile.siblings} />
                      <InfoItem icon={Users} label="Brothers / Sisters" value={`${profile.brothers || "0"} / ${profile.sisters || "0"}`} />
                      <InfoItem icon={Activity} label="Dining Habit" value={profile.diet} />
                      <InfoItem icon={Quote} label="About Family" value={profile.familyAbout} />
                    </>
                  )}

                  {activeTab === "religious" && (
                    <>
                      <InfoItem icon={Sparkles} label="Faith" value={profile.religion} />
                      <InfoItem icon={Sparkles} label="Community / Caste" value={profile.caste} />
                      <InfoItem icon={Sparkles} label="Sub-Caste / Culture" value={`${profile.subCaste || "-"} / ${profile.culture || "-"}`} />
                      <InfoItem icon={Compass} label="Sun Sign" value={profile.zodiacSign} />
                      <InfoItem icon={Clock} label="Birth Time / Date" value={`${profile.horoscopeTime || "-"} / ${profile.horoscopeDob || "-"}`} />
                      <InfoItem icon={MapPin} label="Birth City" value={profile.horoscopePlace} />
                    </>
                  )}

                  {activeTab === "expectations" && (
                    <div className="col-span-full space-y-10">
                       <div className="p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100 flex flex-col gap-6">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <Heart size={20} />
                             </div>
                             <h4 className="text-lg font-semibold text-slate-900">Partner Expectation</h4>
                          </div>
                          <p className="text-lg text-slate-600 leading-relaxed italic">
                             "{profile.expectations || "Seeking someone with a balanced outlook on life, who values family traditions while embracing modern growth."}"
                          </p>
                       </div>

                       {profile.partnerPreference && (
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <InfoItem 
                              icon={User} 
                              label="Age Range" 
                              value={`${profile.partnerPreference.minAge || "18"} - ${profile.partnerPreference.maxAge || "50"} Yrs`} 
                            />
                            <InfoItem 
                              icon={Activity} 
                              label="Min Height" 
                              value={profile.partnerPreference.minHeight} 
                            />
                            <InfoItem 
                              icon={Heart} 
                              label="Marital Status" 
                              value={Array.isArray(profile.partnerPreference.maritalStatus) ? profile.partnerPreference.maritalStatus.join(", ") : profile.partnerPreference.maritalStatus} 
                            />
                            <InfoItem 
                              icon={Sparkles} 
                              label="Religion / Community" 
                              value={`${profile.partnerPreference.religion || "Any"} / ${profile.partnerPreference.caste || (profile.partnerPreference.casteNoBar ? "Open to All" : "Any")}`} 
                            />
                             <InfoItem 
                              icon={Compass} 
                              label="Mother Tongue" 
                              value={profile.partnerPreference.motherTongue} 
                            />
                            <InfoItem 
                              icon={GraduationCap} 
                              label="Education" 
                              value={profile.partnerPreference.education} 
                            />
                            <InfoItem 
                              icon={Briefcase} 
                              label="Work Sector" 
                              value={Array.isArray(profile.partnerPreference.workSector) ? profile.partnerPreference.workSector.join(", ") : profile.partnerPreference.workSector} 
                            />
                             <InfoItem 
                              icon={MapPin} 
                              label="Preferred Location" 
                              value={`${profile.partnerPreference.city || ""} ${profile.partnerPreference.country || "Any"}`} 
                            />
                            <InfoItem 
                              icon={Activity} 
                              label="Diet Preference" 
                              value={profile.partnerPreference.diet} 
                            />
                            <InfoItem 
                              icon={Gem} 
                              label="Income Range" 
                              value={profile.partnerPreference.incomeRange} 
                            />
                         </div>
                       )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullProfileDetailedView;
