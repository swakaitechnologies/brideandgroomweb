import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProfiles } from "@/store/profileSlice";
import type { RootState, AppDispatch } from "@/store";
import { AnimatePresence } from "framer-motion";
import MatchCard from "@/components/matches/MatchCard";
import HorizontalFilterBar from "@/components/matches/HorizontalFilterBar";
import { calculateAge } from "@/utils/matchUtils";
import UserLayout from "@/components/layout/UserLayout";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const NewMatchesPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { allProfiles, loading } = useSelector((state: RootState) => state.profile);

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

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    dispatch(fetchAllProfiles());
  }, [dispatch]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const filteredMatches = useMemo(() => {
    return allProfiles
      .map((profile) => ({
        id: profile.userId || profile.id || "",
        name: `${profile.firstName || ""} ${profile.lastName || ""}`.trim() || "Guest Member",
        age: calculateAge(profile.dob),
        height: profile.height || "5'5\"",
        profession: profile.profession || "Professional",
        location: [profile.city, profile.state].filter(Boolean).join(", ") || "Location not set",
        religion: profile.religion || "Not specified",
        education: profile.highestDegree || "Not specified",
        image: profile.photos?.[0]?.url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.firstName}`,
        compatibility: 88,
        online: profile.user?.isOnline ?? false,
        customId: profile.customId || "EM-000001",
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
        caste: profile.caste,
        bio: profile.bio,
        lastSeen: profile.user?.lastSeen
          ? new Date(profile.user.lastSeen).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "Recently",
        hasAstro: !!profile.zodiacSign || !!profile.horoscopeDob,
        zodiacSign: profile.zodiacSign,
      }))
      .filter((match) => {
        const matchesAge = match.age >= filters.ageRange[0] && match.age <= filters.ageRange[1];
        const matchesReligion = !filters.religion || match.rawReligion === filters.religion;
        const matchesCaste = !filters.caste || match.caste === filters.caste;
        const matchesMotherTongue = !filters.motherTongue || match.rawMotherTongue === filters.motherTongue;
        const matchesMaritalStatus = !filters.maritalStatus || match.maritalStatus === filters.maritalStatus;
        const matchesDiet = !filters.diet || match.rawDiet === filters.diet;
        const matchesEducation = !filters.education || match.rawEducation === filters.education;
        const matchesIncome = !filters.income || match.rawIncome === filters.income;
        const matchesProfession = !filters.profession || match.rawProfession?.toLowerCase().includes(filters.profession.toLowerCase());
        const matchesState = !filters.state || match.rawState?.toLowerCase().includes(filters.state.toLowerCase());
        const matchesCity = !filters.city || match.rawCity?.toLowerCase().includes(filters.city.toLowerCase());
        
        return matchesAge && matchesReligion && matchesCaste && matchesMotherTongue && 
               matchesMaritalStatus && matchesDiet && matchesEducation && matchesIncome && 
               matchesProfession && matchesState && matchesCity;
      });
  }, [allProfiles, filters]);

  const totalPages = Math.ceil(filteredMatches.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedMatches = filteredMatches.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <UserLayout className="max-w-none pt-0 pb-20 bg-white">
      <HorizontalFilterBar 
        filters={filters} 
        setFilters={setFilters} 
      />

      <div className="max-w-[1700px] px-8 sm:px-12 lg:px-20 mx-auto mt-12 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-8 border-b border-slate-100">
          <div className="space-y-2">
            <h1 className="text-xl md:text-2xl font-medium text-slate-900 tracking-tight">
              New <span className="text-primary italic">Arrivals</span>
            </h1>
            <p className="text-slate-500 font-medium tracking-wide text-xs">
              Freshly joined members from the last 30 days. ({filteredMatches.length})
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-40">
            <div className="w-10 h-10 border-4 border-slate-100 border-t-primary rounded-full animate-spin" />
          </div>
        ) : filteredMatches.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 gap-y-12">
            <AnimatePresence mode="popLayout">
              {paginatedMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="col-span-full py-40 flex flex-col items-center justify-center space-y-6 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-100">
            <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-slate-200" />
            </div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
              No new matches
            </p>
          </div>
        )}

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
                    ? "bg-slate-900 border-slate-900 text-white shadow-2xl scale-110"
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

export default NewMatchesPage;
