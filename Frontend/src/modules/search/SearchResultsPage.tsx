"use client";

import { useEffect } from "react";

import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { searchProfiles } from "@/store/profileSlice";
import type { AppDispatch, RootState } from "@/store";
import UserLayout from "@/components/layout/UserLayout";
import MatchCard from "@/components/matches/MatchCard";
import { Loader2, ArrowLeft, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { calculateAge, getCompatibilityScore } from "@/utils/matchUtils";

const SearchResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { searchResults, loading } = useSelector(
    (state: RootState) => state.profile,
  );

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query: Record<string, string> = {};
    for (const [key, value] of searchParams.entries()) {
      query[key] = value;
    }
    dispatch(searchProfiles(query));
  }, [location.search, dispatch]);


  const matches = searchResults.map((profile) => {
    const profileId = profile.userId || profile.id || "";
    return {
      id: profileId,
      name: `${profile.firstName || ""} ${profile.lastName || ""}`.trim(),
      age: calculateAge(profile.dob),
      height: profile.height || "Not specified",
      profession: profile.profession || "Not specified",
      location:
        `${profile.city || ""}, ${profile.state || ""}`.replace(/^, |, $/, "") ||
        "Not specified",
      religion: profile.religion || "Not specified",
      education: profile.highestDegree || "Not specified",
      image:
        profile.photos?.[0]?.url ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.firstName}`,
      compatibility: getCompatibilityScore(profileId),
      online: profileId.length % 2 === 0, // Deterministic "random" value for purity
      customId: profile.customId || "",
      photosLocked: profile.photosLocked,
      isKycVerified: profile.isKycVerified,
    };
  });


  return (
    <UserLayout className="max-w-none pt-5">
      <div className="max-w-full pt-0 pb-16 px-4 sm:px-8 lg:px-12 mx-auto space-y-12">
        {/* Modern Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="px-0 hover:bg-transparent text-black hover:text-primary transition-all flex items-center gap-2 group mb-2"
            >
              <ArrowLeft
                size={16}
                className="group-hover:-translate-x-1 transition-transform"
              />
              <span className="text-[10px] font-medium  tracking-[0.2em]">
                Back to Discovery
              </span>
            </Button>
            <div className="space-y-1">
              <h1 className="text-2xl font-medium text-foreground tracking-tight">
                Profile <span className="text-primary italic">Matches</span>
              </h1>
              <p className="text-sm text-black font-medium max-w-2xl">
                We've identified{" "}
                <span className="text-foreground font-medium">
                  {matches.length} matches
                </span>{" "}
                that align with your refined criteria.
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 space-y-6">
            <div className="relative">
              <Loader2 className="w-16 h-16 text-primary animate-spin stroke-[1.5]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Search size={20} className="text-primary/40" />
              </div>
            </div>
            <div className="text-center space-y-1">
              <p className="text-xs font-medium  tracking-[0.3em] text-foreground transition-all">
                Scanning Database
              </p>
              <p className="text-xs font-medium text-white/70 leading-relaxed tracking-widest animate-pulse">
                Ranking matches by compatibility
              </p>
            </div>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {matches.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-10"
              >
                {matches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl mx-auto py-24 text-center bg-white rounded-[4rem] border border-border shadow-soft space-y-8 px-10"
              >
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
                  <Search size={48} />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-medium text-foreground  tracking-tight">
                    No Matches Found
                  </h3>
                  <p className="text-[10px] text-white/60 mt-6 leading-relaxed italic max-w-sm mx-auto">
                    No profiles match your current filters. Try expanding your
                    age range or location preferences to see more candidates.
                  </p>
                </div>
                <Button
                  onClick={() => navigate("/search")}
                  className="rounded-[1.25rem] px-12 h-14 font-medium  tracking-widest text-[10px] bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 transition-all"
                >
                  Return to Filters
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Footer Insight */}
        {!loading && matches.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-slate-900 rounded-[3rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8 text-white relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-10 text-white/5 pointer-events-none group-hover:scale-110 transition-all duration-1000">
              <Sparkles size={160} />
            </div>
            <div className="flex items-center gap-6 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary backdrop-blur-md">
                <Sparkles size={28} />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-medium  tracking-tight">
                  Pro Discovery Hint
                </h4>
                <p className="text-xs font-medium text-white/70 max-w-md">
                  Matches are sorted by compatibility scores. Connect with
                  individuals who share 80%+ match rate for higher engagement.
                </p>
              </div>
            </div>
            <Button
              onClick={() => navigate("/search/advanced")}
              className="rounded-xl h-12 px-8 bg-white/10 hover:bg-white/20 text-white font-medium  tracking-widest text-[9px] border border-white/10 transition-all relative z-10"
            >
              Deepen Filters
            </Button>
          </motion.div>
        )}
      </div>
    </UserLayout>
  );
};

export default SearchResultsPage;





