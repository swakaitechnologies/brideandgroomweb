import UserLayout from "@/components/layout/UserLayout";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProfiles } from "@/store/profileSlice";
import { fetchInterests } from "@/store/interactionSlice";
import type { RootState, AppDispatch } from "@/store";
import { AnimatePresence } from "framer-motion";
import MatchCard from "@/components/matches/MatchCard";
import HorizontalFilterBar from "@/components/matches/HorizontalFilterBar";
import { calculateAge, getCompatibilityScore } from "@/utils/matchUtils";
import { LayoutGrid, Rows3 } from "lucide-react";
import { clsx } from "clsx";

const AllProfilesPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { allProfiles, loading } = useSelector(
    (state: RootState) => state.profile,
  );

  const [filters, setFilters] = useState({
    ageRange: [18, 50],
    religion: "",
    caste: "",
    motherTongue: "",
    maritalStatus: "",
    diet: "",
    education: "",
    income: "",
    height: "",
    profession: "",
    state: "",
    city: "",
  });

  useEffect(() => {
    dispatch(fetchAllProfiles());
    dispatch(fetchInterests("sent"));
  }, [dispatch]);

  const filteredMatches = useMemo(() => {
    return allProfiles
      .map((profile) => ({
        id: profile.userId || profile.id || "",
        name:
          `${profile.firstName || ""} ${profile.lastName || ""}`.trim() ||
          "Guest Member",
        age: calculateAge(profile.dob),
        height: profile.height || "5'5\"",
        profession: profile.profession || "Professional",
        location:
          [profile.city, profile.state, profile.country].filter(Boolean).join(", ") ||
          "Location not set",
        religion: profile.religion || "Not specified",
        education: profile.highestDegree || "Not specified",
        image:
          profile.photos && profile.photos.length > 0
            ? profile.photos.find((p: { isMain: boolean; url: string }) => p.isMain)?.url ||
              profile.photos[0].url
            : `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.firstName || profile.id}`,
        compatibility: getCompatibilityScore(
          profile.userId || profile.id || "",
        ),
        online: profile.user?.isOnline ?? false,
        customId: profile.customId || "EM-000001",
        photosLocked: profile.photosLocked,
        isKycVerified: profile.isKycVerified,
        rawReligion: profile.religion,
        rawMotherTongue: profile.motherTongue,
        rawProfession: profile.profession,
        rawState: profile.state,
        rawCity: profile.city,
        rawDiet: profile.diet,
        rawEducation: profile.highestDegree,
        rawIncome: profile.income,
        rawHeight: profile.height,
        maritalStatus: profile.maritalStatus || "Never Married",
        motherTongue: profile.motherTongue || "Marathi",
        bio: profile.bio,
        lastSeen: profile.user?.lastSeen
          ? new Date(profile.user.lastSeen).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "Recently",
        hasAstro: !!profile.zodiacSign || !!profile.horoscopeDob,
        zodiacSign: profile.zodiacSign,
        caste: profile.caste,
      }))
      .filter((match) => {
        const matchesAge =
          match.age >= filters.ageRange[0] && match.age <= filters.ageRange[1];
        const matchesReligion =
          !filters.religion || match.rawReligion === filters.religion;
        const matchesCaste = !filters.caste || match.caste === filters.caste;
        const matchesMotherTongue =
          !filters.motherTongue ||
          match.rawMotherTongue === filters.motherTongue;
        const matchesMaritalStatus =
          !filters.maritalStatus ||
          match.maritalStatus === filters.maritalStatus;
        const matchesDiet = !filters.diet || match.rawDiet === filters.diet;
        const matchesEducation =
          !filters.education || match.rawEducation === filters.education;
        const matchesIncome =
          !filters.income || match.rawIncome === filters.income;
        const matchesProfession =
          !filters.profession ||
          match.rawProfession
            ?.toLowerCase()
            .includes(filters.profession.toLowerCase());
        const matchesState =
          !filters.state ||
          match.rawState?.toLowerCase().includes(filters.state.toLowerCase());
        const matchesCity =
          !filters.city ||
          match.rawCity?.toLowerCase().includes(filters.city.toLowerCase());

        return (
          matchesAge &&
          matchesReligion &&
          matchesCaste &&
          matchesMotherTongue &&
          matchesMaritalStatus &&
          matchesDiet &&
          matchesEducation &&
          matchesIncome &&
          matchesProfession &&
          matchesState &&
          matchesCity
        );
      });
  }, [allProfiles, filters]);

  const [viewMode, setViewMode] = useState<"grid" | "scroll">("grid");

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = viewMode === "grid" ? 10 : 20; // More items for scroll mode
  const totalPages = Math.ceil(filteredMatches.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedMatches = filteredMatches.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  return (
    <UserLayout className="max-w-none pt-0 pb-20 bg-white">
      <HorizontalFilterBar 
        filters={filters} 
        setFilters={setFilters} 
      />

      {/* Layout Option & Grid */}
      <div className="max-w-[1700px] px-4 sm:px-12 lg:px-20 mx-auto mt-8 lg:mt-12 animate-fade-in">
        <div className="flex items-center justify-between mb-8">
           <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900">Discovery</h3>
              <p className="text-xs text-slate-400 font-medium">{filteredMatches.length} partners found</p>
           </div>
           
           <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100">
              <button 
                onClick={() => setViewMode("grid")}
                className={clsx(
                  "p-2 rounded-lg transition-all",
                  viewMode === "grid" ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-slate-600"
                )}
              >
                <LayoutGrid size={18} />
              </button>
              <button 
                onClick={() => setViewMode("scroll")}
                className={clsx(
                  "p-2 rounded-lg transition-all sm:hidden", // Scroll only useful on mobile
                  viewMode === "scroll" ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-slate-600"
                )}
              >
                <Rows3 size={18} />
              </button>
           </div>
        </div>

        <div className={clsx(
          "transition-all duration-500",
          viewMode === "grid" 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12"
            : "flex overflow-x-auto gap-6 no-scrollbar pb-8 snap-x snap-mandatory -mx-4 px-4"
        )}>
          <AnimatePresence mode="popLayout">
            {paginatedMatches.length > 0 ? (
              paginatedMatches.map((match) => (
                <div key={match.id} className={clsx("transition-all", viewMode === "scroll" && "min-w-[280px] snap-center")}>
                  <MatchCard match={match} />
                </div>
              ))
            ) : (
              <div className="col-span-full py-40 flex flex-col items-center justify-center space-y-6 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-100">
                <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center">
                  <Search className="w-8 h-8 text-slate-200" />
                </div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                  No profiles match
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Pagination - Premium Styled */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 pt-24 pb-12">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                onClick={() => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`w-14 h-14 rounded-2xl font-black text-xs transition-all ${
                  currentPage === page
                    ? "bg-slate-900 border-slate-900 text-white shadow-2xl shadow-slate-900/20 scale-110"
                    : "border-slate-100 text-slate-400 hover:border-primary hover:text-primary bg-white"
                }`}
              >
                {page.toString().padStart(2, "0")}
              </Button>
            ))}
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default AllProfilesPage;
