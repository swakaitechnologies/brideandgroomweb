import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store";
import { AnimatePresence } from "framer-motion";
import MatchCard from "@/components/matches/MatchCard";
import UserLayout from "@/components/layout/UserLayout";
import { useEffect, useState, useMemo } from "react";
import { fetchInterests } from "@/store/interactionSlice";
import HorizontalFilterBar from "@/components/matches/HorizontalFilterBar";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const ShortlistedPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const shortlisted = useSelector(
    (state: RootState) => state.matches.shortlisted,
  );

  useEffect(() => {
    dispatch(fetchInterests("sent"));
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

  // Apply filtering to shortlisted matches
  const filteredShortlist = useMemo(() => {
    return shortlisted.filter((match: any) => {
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
  }, [shortlisted, filters]);

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(filteredShortlist.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedShortlist = filteredShortlist.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  return (
    <UserLayout className="max-w-none pt-0 pb-20 bg-white">
      <HorizontalFilterBar filters={filters} setFilters={setFilters} />

      <div className="max-w-[1700px] px-8 sm:px-12 lg:px-20 mx-auto mt-12 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-8 border-b border-slate-100">
          <div className="space-y-2">
            <h1 className="text-xl md:text-2xl font-medium text-slate-900 tracking-tight">
              My <span className="text-primary italic">Shortlist</span>
            </h1>
            <p className="text-slate-500 font-medium tracking-wide text-xs">
              Review saved profiles for future matches. ({filteredShortlist.length})
            </p>
          </div>
        </div>

        {paginatedShortlist.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 gap-y-12">
            <AnimatePresence mode="popLayout">
              {paginatedShortlist.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="col-span-full py-40 flex flex-col items-center justify-center space-y-6 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-100">
            <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center">
              <Star className="w-8 h-8 text-slate-200" />
            </div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest text-center max-w-xs">
              {shortlisted.length > 0 ? "No shortlisted profiles match filters" : "Your shortlist is currently empty"}
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

export default ShortlistedPage;
