import React from "react";
import {
  Search,
  MapPin,
  Briefcase,
  RotateCcw,
  Filter,
  ChevronDown,
  User,
  Languages,
  Gem,
  GraduationCap,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface FilterState {
  ageRange: [number, number];
  religion: string;
  caste: string;
  motherTongue: string;
  maritalStatus: string;
  diet: string;
  education: string;
  income: string;
  height: string;
  profession: string;
  state: string;
  city: string;
}

interface MatchesSidebarFilterProps {
  onFilterChange: (filters: FilterState) => void;
  resultsCount?: number;
}

const MatchesSidebarFilter = ({
  onFilterChange,
  resultsCount = 0,
}: MatchesSidebarFilterProps) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [filters, setFilters] = React.useState<FilterState>({
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

  const handleReset = () => {
    const defaultFilters: FilterState = {
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
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const handleChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const activeFiltersCount = Object.values(filters).filter((v) =>
    Array.isArray(v) ? v[0] !== 18 || v[1] !== 50 : v !== "",
  ).length;

  return (
    <aside className="w-full md:w-[280px] lg:w-[320px] shrink-0 sticky top-24">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header - Clickable on Mobile */}
        <div
          onClick={() => window.innerWidth < 768 && setIsExpanded(!isExpanded)}
          className={`p-6 flex items-center justify-between cursor-pointer md:cursor-default transition-colors ${
            isExpanded ? "bg-slate-50" : "bg-white"
          } md:bg-white`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white">
              <Filter size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight text-slate-900 uppercase">
                Filter Criteria
              </h2>
              <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">
                {resultsCount} Matches Found
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleReset();
              }}
              className="hidden md:flex h-8 px-2 text-[10px] font-bold tracking-[0.2em] text-slate-400 hover:text-primary transition-colors group uppercase"
            >
              <RotateCcw
                size={12}
                className="mr-1.5 group-hover:-rotate-45 transition-transform"
              />
              Reset
            </Button>
            <div className="md:hidden">
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown size={20} className="text-slate-400" />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Filter Body */}
        <AnimatePresence initial={false}>
          {(isExpanded || (typeof window !== "undefined" && window.innerWidth >= 768)) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
              className="overflow-hidden"
            >
              <div className="p-6 pt-0 border-t border-slate-50 md:border-t-0 space-y-8 max-h-[70vh] md:max-h-none overflow-y-auto no-scrollbar">

                {/* Mobile Reset & Apply */}
                <div className="flex md:hidden gap-3 pb-4">
                  <Button
                    variant="outline"
                    className="flex-1 rounded-xl h-11 text-xs font-medium"
                    onClick={handleReset}
                  >
                    Reset All
                  </Button>
                  <Button
                    className="flex-1 rounded-xl h-11 text-xs font-medium shadow-lg shadow-primary/20"
                    onClick={() => setIsExpanded(false)}
                  >
                    Show Profiles
                  </Button>
                </div>

                {/* Filter Sections */}
                <div className="space-y-8">
                  {/* Age Range */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-medium tracking-[0.2em] text-black/50 uppercase">
                      Age Range
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="relative flex-1">
                        <input
                          type="number"
                          value={filters.ageRange[0]}
                          onChange={(e) =>
                            handleChange("ageRange", [
                              parseInt(e.target.value),
                              filters.ageRange[1],
                            ])
                          }
                          className="w-full h-11 bg-slate-50 border border-slate-100 rounded-xl px-4 text-xs font-medium text-black focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                          placeholder="Min"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-black/20">
                          MIN
                        </span>
                      </div>
                      <span className="text-black/20 font-bold">/</span>
                      <div className="relative flex-1">
                        <input
                          type="number"
                          value={filters.ageRange[1]}
                          onChange={(e) =>
                            handleChange("ageRange", [
                              filters.ageRange[0],
                              parseInt(e.target.value),
                            ])
                          }
                          className="w-full h-11 bg-slate-50 border border-slate-100 rounded-xl px-4 text-xs font-medium text-black focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                          placeholder="Max"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-black/20">
                          MAX
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Religion */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-medium tracking-[0.2em] text-black/50 uppercase flex items-center gap-2">
                      <User size={12} className="text-primary" /> Religion
                    </label>
                    <div className="relative group">
                      <select
                        value={filters.religion}
                        onChange={(e) =>
                          handleChange("religion", e.target.value)
                        }
                        className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl px-4 text-xs font-medium text-black appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                      >
                        <option value="">All Religions</option>
                        <option value="Hindu">Hindu</option>
                        <option value="Muslim">Muslim</option>
                        <option value="Sikh">Sikh</option>
                        <option value="Christian">Christian</option>
                        <option value="Jain">Jain</option>
                        <option value="Buddhist">Buddhist</option>
                      </select>
                      <ChevronDown
                        size={14}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-black/30 pointer-events-none group-hover:text-primary transition-colors"
                      />
                    </div>
                  </div>

                  {/* Caste */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-medium tracking-[0.2em] text-black/50 uppercase flex items-center gap-2">
                      <Search size={12} className="text-primary" /> Caste
                    </label>
                    <div className="relative group">
                      <select
                        value={filters.caste}
                        onChange={(e) => handleChange("caste", e.target.value)}
                        className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl px-4 text-xs font-medium text-black appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                      >
                        <option value="">All Castes</option>
                        <option value="Brahmin">Brahmin</option>
                        <option value="Kshatriya">Kshatriya</option>
                        <option value="Vaishya">Vaishya</option>
                        <option value="Shudra">Shudra</option>
                        <option value="Other">Other</option>
                      </select>
                      <ChevronDown
                        size={14}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-black/30 pointer-events-none group-hover:text-primary transition-colors"
                      />
                    </div>
                  </div>

                  {/* Marital Status */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-medium tracking-[0.2em] text-black/50 uppercase flex items-center gap-2">
                      <Heart size={12} className="text-primary" /> Marital
                      Status
                    </label>
                    <div className="relative group">
                      <select
                        value={filters.maritalStatus}
                        onChange={(e) =>
                          handleChange("maritalStatus", e.target.value)
                        }
                        className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl px-4 text-xs font-medium text-black appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                      >
                        <option value="">All Status</option>
                        <option value="Never Married">Never Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                        <option value="Awaiting Divorce">
                          Awaiting Divorce
                        </option>
                      </select>
                      <ChevronDown
                        size={14}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-black/30 pointer-events-none group-hover:text-primary transition-colors"
                      />
                    </div>
                  </div>

                  {/* Diet */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-medium tracking-[0.2em] text-black/50 uppercase flex items-center gap-2">
                      <Search size={12} className="text-primary" /> Diet
                    </label>
                    <div className="relative group">
                      <select
                        value={filters.diet}
                        onChange={(e) => handleChange("diet", e.target.value)}
                        className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl px-4 text-xs font-medium text-black appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                      >
                        <option value="">All Diets</option>
                        <option value="Veg">Vegetarian</option>
                        <option value="Non-Veg">Non-Vegetarian</option>
                        <option value="Eggetarian">Eggetarian</option>
                      </select>
                      <ChevronDown
                        size={14}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-black/30 pointer-events-none group-hover:text-primary transition-colors"
                      />
                    </div>
                  </div>

                  {/* Mother Tongue */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-medium tracking-[0.2em] text-black/50 uppercase flex items-center gap-2">
                      <Languages size={12} className="text-primary" /> Mother
                      Tongue
                    </label>
                    <div className="relative group">
                      <select
                        value={filters.motherTongue}
                        onChange={(e) =>
                          handleChange("motherTongue", e.target.value)
                        }
                        className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl px-4 text-xs font-medium text-black appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                      >
                        <option value="">All Languages</option>
                        <option value="Hindi">Hindi</option>
                        <option value="Marathi">Marathi</option>
                        <option value="Bengali">Bengali</option>
                        <option value="Gujarati">Gujarati</option>
                        <option value="Tamil">Tamil</option>
                        <option value="Telugu">Telugu</option>
                        <option value="Kannada">Kannada</option>
                        <option value="Malayalam">Malayalam</option>
                        <option value="Punjabi">Punjabi</option>
                      </select>
                      <ChevronDown
                        size={14}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-black/30 pointer-events-none group-hover:text-primary transition-colors"
                      />
                    </div>
                  </div>

                  {/* Location - State & City */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-medium tracking-[0.2em] text-black/50 uppercase flex items-center gap-2">
                      <MapPin size={12} className="text-primary" /> Location
                    </label>
                    <div className="space-y-2">
                      <div className="relative group">
                        <input
                          type="text"
                          placeholder="Enter State"
                          value={filters.state}
                          onChange={(e) =>
                            handleChange("state", e.target.value)
                          }
                          className="w-full h-11 bg-slate-50 border border-slate-100 rounded-xl px-4 pl-10 text-xs font-medium text-black focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                        <Search
                          size={14}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30 group-focus-within:text-primary transition-colors"
                        />
                      </div>
                      <div className="relative group">
                        <input
                          type="text"
                          placeholder="Enter City"
                          value={filters.city}
                          onChange={(e) => handleChange("city", e.target.value)}
                          className="w-full h-11 bg-slate-50 border border-slate-100 rounded-xl px-4 pl-10 text-xs font-medium text-black focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                        <Search
                          size={14}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30 group-focus-within:text-primary transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Education */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-medium tracking-[0.2em] text-black/50 uppercase flex items-center gap-2">
                      <GraduationCap size={12} className="text-primary" />{" "}
                      Education
                    </label>
                    <div className="relative group">
                      <select
                        value={filters.education}
                        onChange={(e) =>
                          handleChange("education", e.target.value)
                        }
                        className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl px-4 text-xs font-medium text-black appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                      >
                        <option value="">All Education</option>
                        <option value="Bachelors">Bachelors</option>
                        <option value="Masters">Masters</option>
                        <option value="Doctorate">Doctorate</option>
                        <option value="Diploma">Diploma</option>
                      </select>
                      <ChevronDown
                        size={14}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-black/30 pointer-events-none group-hover:text-primary transition-colors"
                      />
                    </div>
                  </div>

                  {/* Profession */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-medium tracking-[0.2em] text-black/50 uppercase flex items-center gap-2">
                      <Briefcase size={12} className="text-primary" />{" "}
                      Profession
                    </label>
                    <div className="relative group">
                      <select
                        value={filters.profession}
                        onChange={(e) =>
                          handleChange("profession", e.target.value)
                        }
                        className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl px-4 text-xs font-medium text-black appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                      >
                        <option value="">All Professions</option>
                        <option value="Engineer">Engineer</option>
                        <option value="Doctor">Doctor</option>
                        <option value="Business">Business</option>
                        <option value="Software">Software Professional</option>
                        <option value="Teacher">Teacher</option>
                        <option value="Other">Other</option>
                      </select>
                      <ChevronDown
                        size={14}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-black/30 pointer-events-none group-hover:text-primary transition-colors"
                      />
                    </div>
                  </div>

                  {/* Annual Income */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-medium tracking-[0.2em] text-black/50 uppercase flex items-center gap-2">
                      <Gem size={12} className="text-primary" /> Annual Income
                    </label>
                    <div className="relative group">
                      <select
                        value={filters.income}
                        onChange={(e) => handleChange("income", e.target.value)}
                        className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl px-4 text-xs font-medium text-black appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                      >
                        <option value="">All Income</option>
                        <option value="0-5">0 - 5 Lakhs</option>
                        <option value="5-10">5 - 10 Lakhs</option>
                        <option value="10-20">10 - 20 Lakhs</option>
                        <option value="20-50">20 - 50 Lakhs</option>
                        <option value="50+">50 Lakhs +</option>
                      </select>
                      <ChevronDown
                        size={14}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-black/30 pointer-events-none group-hover:text-primary transition-colors"
                      />
                    </div>
                  </div>

                  {/* Height Filter */}
                  <div className="space-y-3 pb-4">
                    <label className="text-[10px] font-medium tracking-[0.2em] text-black/50 uppercase flex items-center gap-2">
                      <Search size={12} className="text-primary" /> Height
                    </label>
                    <div className="relative group">
                      <select
                        value={filters.height}
                        onChange={(e) => handleChange("height", e.target.value)}
                        className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl px-4 text-xs font-medium text-black appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                      >
                        <option value="">All Heights</option>
                        <option value="4'5">4'5" and above</option>
                        <option value="5'0">5'0" and above</option>
                        <option value="5'5">5'5" and above</option>
                        <option value="6'0">6'0" and above</option>
                      </select>
                      <ChevronDown
                        size={14}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-black/30 pointer-events-none group-hover:text-primary transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Mobile Bottom Padding */}
                <div className="h-6 md:hidden" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  );
};

export default MatchesSidebarFilter;
