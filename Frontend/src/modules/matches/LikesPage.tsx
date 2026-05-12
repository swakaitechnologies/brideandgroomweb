import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store";
import { fetchInterests } from "@/store/interactionSlice";
import { useEffect, useState, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import UserLayout from "@/components/layout/UserLayout";
import MatchCard from "@/components/matches/MatchCard";
import HorizontalFilterBar from "@/components/matches/HorizontalFilterBar";
import { Button } from "@/components/ui/button";
import { Search, Heart, Loader2 } from "lucide-react";
import { calculateAge } from "@/utils/matchUtils";

const LikesPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { receivedInterests, loading } = useSelector(
    (state: RootState) => state.interaction,
  );

  useEffect(() => {
    dispatch(fetchInterests("received"));
  }, [dispatch]);

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

  // Transform interest data to match format
  const matches = useMemo(() => {
    return (receivedInterests || []).map((interest) => {
      const p = interest.profile;
      return {
        id: interest.id,
        senderId: interest.senderId,
        name: `${p?.firstName || ""} ${p?.lastName || ""}`.trim() || "Member",
        age: calculateAge(p?.dob),
        height: (p as any)?.height || "5'5\"",
        profession: p?.profession || "Professional",
        location: [p?.city, p?.state].filter(Boolean).join(", ") || "Location not set",
        religion: (p as any)?.religion || "Not specified",
        education: (p as any)?.highestDegree || "Not specified",
        image: p?.photos?.find((img: any) => img.isMain)?.url || 
               p?.photos?.[0]?.url || 
               `https://api.dicebear.com/7.x/avataaars/svg?seed=${p?.firstName || interest.id}`,
        compatibility: 88,
        online: (p as any)?.user?.isOnline ?? false,
        customId: (p as any)?.customId || "EM-123456",
        isKycVerified: p?.isKycVerified,
        rawReligion: (p as any)?.religion,
        rawMotherTongue: (p as any)?.motherTongue,
        rawProfession: p?.profession,
        rawState: p?.state,
        rawCity: p?.city,
        rawDiet: (p as any)?.diet,
        rawEducation: (p as any)?.highestDegree,
        rawIncome: (p as any)?.income,
        rawHeight: (p as any)?.height,
        maritalStatus: (p as any)?.maritalStatus || "Never Married",
        motherTongue: (p as any)?.motherTongue || "Marathi",
        caste: (p as any)?.caste,
        bio: (p as any)?.bio,
        lastSeen: "Recently",
        hasAstro: !!(p as any)?.zodiacSign || !!(p as any)?.horoscopeDob,
        zodiacSign: (p as any)?.zodiacSign,
      };
    });
  }, [receivedInterests]);

  // Apply filtering
  const filteredMatches = useMemo(() => {
    return matches.filter((match: any) => {
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
  }, [matches, filters]);

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(filteredMatches.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedMatches = filteredMatches.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <UserLayout className="max-w-none pt-0 pb-20 bg-white">
      {/* Prime Category Filter Bar */}
      <HorizontalFilterBar filters={filters} setFilters={setFilters} />

      <div className="max-w-[1700px] px-8 sm:px-12 lg:px-20 mx-auto mt-12 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-8 border-b border-slate-100">
          <div className="space-y-2">
            <h1 className="text-xl md:text-2xl font-medium text-slate-900 tracking-tight">
              Interest <span className="text-primary italic">Received</span>
            </h1>
            <p className="text-slate-500 font-medium tracking-wide text-xs">
              Showing {filteredMatches.length} profiles who liked you.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-40">
            <Loader2 className="w-10 h-10 animate-spin text-primary opacity-20" />
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
              {(receivedInterests || []).length > 0 ? <Search className="w-8 h-8 text-slate-200" /> : <Heart className="w-8 h-8 text-slate-200" />}
            </div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
              {(receivedInterests || []).length > 0 ? "No profiles match filters" : "No interests received yet"}
            </p>
          </div>
        )}

        {/* Pagination */}
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
                className={`w-14 h-14 rounded-2xl font-semibold text-xs transition-all ${
                  currentPage === page
                    ? "bg-slate-900 border-slate-900 text-white shadow-xl scale-110"
                    : "border-slate-100 text-slate-400 hover:border-primary hover:text-primary bg-white"
                }`}
              >
                {page.toString().padStart(2, '0')}
              </Button>
            ))}
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default LikesPage;
