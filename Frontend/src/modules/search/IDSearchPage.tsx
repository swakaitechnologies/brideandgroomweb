import { useState } from "react";
import UserLayout from "@/components/layout/UserLayout";
import {
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Hash,
  Search,
  MapPin,
  User,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfileById, type ProfileData } from "@/store/profileSlice";
import type { AppDispatch, RootState } from "@/store";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const IDSearchPage = () => {
  const [profileId, setProfileId] = useState("");
  const [searchedProfile, setSearchedProfile] = useState<ProfileData | null>(
    null,
  );
  const dispatch = useDispatch<AppDispatch>();
  const profileState = useSelector((state: RootState) => state.profile);
  const { loading  } = profileState || {} as any;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const searchId = profileId.trim();
    if (searchId) {
      setSearchedProfile(null);
      try {
        const result = await dispatch(fetchProfileById(searchId)).unwrap();
        if (result) {
          setSearchedProfile(result);
          toast.success("Profile found!");
        }
      } catch (err: any) {
        toast.error(err || "Profile not found. Please check the ID.");
      }
    }
  };

  const calculateAge = (dob: string | undefined) => {
    if (!dob) return "N/A";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  return (
    <UserLayout className="max-w-none pt-5">
      <div className="max-w-full pt-0 pb-16 px-4 sm:px-8 lg:px-12 mx-auto space-y-12">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-1">
            <h1 className="text-2xl font-medium text-foreground tracking-tight">
              ID <span className="text-amber-600 italic">Lookup</span>
            </h1>
            <p className="text-sm text-black font-medium max-w-2xl">
              Know exactly who you're looking for? Enter their unique Bride&Groom
              ID to view their full profile.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
              <ShieldCheck size={20} />
            </div>
            <p className="text-[10px] font-medium  tracking-widest text-black">
              Secure 1:1 <br />
              Access
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] p-10 md:p-14 shadow-soft border border-border relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-12 text-amber-500/5 pointer-events-none">
                <Search size={200} />
              </div>

              <form
                onSubmit={handleSearch}
                className="relative z-10 space-y-10"
              >
                <div className="space-y-4">
                  <label className="text-[10px] font-medium  tracking-[0.3em] text-black text-center block">
                    Profile Reference ID
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={profileId}
                      onChange={(e) =>
                        setProfileId(e.target.value.toUpperCase())
                      }
                      placeholder="E.G. SMT-892341"
                      className="w-full h-24 bg-slate-50 border border-border rounded-4xl px-10 text-3xl font-medium text-center text-black focus:border-amber-500 focus:bg-white focus:ring-8 focus:ring-amber-500/5 transition-all outline-none placeholder:text-slate-200 tracking-wider"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={!profileId.trim() || loading}
                  className="w-full h-20 rounded-[1.8rem] bg-slate-900 hover:bg-black text-white text-lg font-medium  tracking-widest shadow-2xl transition-all disabled:opacity-50 group"
                >
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      Uncover Profile
                      <ArrowRight
                        size={22}
                        className="ml-3 group-hover:translate-x-2 transition-transform"
                      />
                    </>
                  )}
                </Button>
              </form>
            </motion.div>

            <AnimatePresence>
              {searchedProfile && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-[3rem] p-8 shadow-soft border-2 border-amber-500/10 overflow-hidden relative group hover:border-amber-500/30 transition-all duration-300"
                >
                  <div className="absolute top-0 right-0 p-6 text-amber-500/5 pointer-events-none group-hover:scale-110 transition-transform">
                    <Sparkles size={120} />
                  </div>
                  <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className="w-28 h-28 rounded-4xl overflow-hidden bg-slate-50 border-4 border-white shadow-xl shrink-0 group-hover:rotate-2 transition-transform">
                      {searchedProfile.photos?.[0] ? (
                        <img
                          src={searchedProfile.photos[0].url}
                          alt={searchedProfile.firstName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-200">
                          <User size={40} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 text-center md:text-left space-y-2">
                      <div className="flex items-center justify-center md:justify-start gap-3">
                        <h3 className="text-2xl font-medium text-black  tracking-tight">
                          {searchedProfile.firstName} {searchedProfile.lastName}
                        </h3>
                        <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[9px] font-medium rounded-lg border border-amber-100  tracking-widest">
                          {searchedProfile.customId}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-1 text-sm font-medium text-black  tracking-tighter">
                        <span className="flex items-center gap-1.5">
                          <MapPin size={14} className="text-amber-500" />
                          {searchedProfile.city}, {searchedProfile.country}
                        </span>
                        <span>•</span>
                        <span>{calculateAge(searchedProfile.dob)} Years</span>
                        <span>•</span>
                        <span>{searchedProfile.religion}</span>
                      </div>
                      <p className="text-[10px] font-medium text-amber-600  tracking-widest pt-1">
                        {searchedProfile.profession}
                      </p>
                    </div>
                    <Link
                      to={`/profile/${searchedProfile.userId}`}
                      className="w-full md:w-auto h-16 px-10 bg-slate-900 hover:bg-black text-white rounded-2xl flex items-center justify-center gap-3 font-medium  tracking-widest text-[10px] shadow-xl transition-all group"
                    >
                      View Full Details
                      <ChevronRight
                        size={18}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-amber-600 rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 p-8 text-white/80 pointer-events-none group-hover:scale-125 transition-transform duration-1000">
                <Hash size={180} />
              </div>
              <div className="relative z-10 space-y-6">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-medium  tracking-tight leading-tight mb-2">
                    Bride&Groom ID <br />
                    Security
                  </h3>
                  <p className="text-xs font-medium text-amber-50/70 leading-relaxed">
                    Every ID is unique and follows our strict privacy protocol.
                    Searching via ID allows you to bypass general discovery and
                    reach specific profiles instantly.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-[2.5rem] p-10 space-y-6">
              <h4 className="text-xs font-medium  tracking-widest text-black">
                Quick Instructions
              </h4>
              <ul className="space-y-4">
                {[
                  "IDs are usually found on the profile card.",
                  "Ensure you include the prefix (e.g. SMT-).",
                  "Deleted or hidden profiles won't appear.",
                ].map((text, i) => (
                  <li
                    key={i}
                    className="flex gap-3 text-[11px] font-medium text-black leading-snug"
                  >
                    <span className="text-amber-600">0{i + 1}.</span>
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default IDSearchPage;





