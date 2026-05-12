import { useEffect, useState, useRef } from "react";
import { Search, RotateCcw, ChevronDown, Filter, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFilterMetadata } from "@/store/profileSlice";
import type { RootState, AppDispatch } from "@/store";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";

interface FilterBarProps {
  filters: Record<string, any>;
  setFilters: (filters: any) => void;
  onReset?: () => void;
}

const HorizontalFilterBar = ({ filters, setFilters, onReset }: FilterBarProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { filterMetadata } = useSelector((state: RootState) => state.profile);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!filterMetadata) {
      dispatch(fetchFilterMetadata());
    }
  }, [dispatch, filterMetadata]);

  // Click outside to close (Desktop only)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        // Delay closing slightly if it's the toggle button to avoid immediate re-open
        const target = event.target as HTMLElement;
        if (!target.closest('.filter-toggle-btn')) {
          setActiveCategory(null);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getOptionsForCategory = (catId: string | null): string[] => {
    if (!catId || !filterMetadata) return [];
    switch (catId) {
      case "community":
        // Combine all community options or just return religion as a primary group
        return [...(filterMetadata.religion || []), ...(filterMetadata.motherTongue || [])];
      case "identity":
        return ["Never Married", "Divorced", "Widowed", "Awaiting Divorce", "Veg", "Non-Veg", "Vegan", "Eggetarian"];
      case "success":
        return filterMetadata.profession || ["Software", "Engineer", "Doctor", "Manager", "Teacher"];
      default:
        return [];
    }
  };

  const categories = [
    { id: "basics", label: "Basics", icon: "Age & Location" },
    { id: "community", label: "Community", icon: "Religion & Caste" },
    { id: "identity", label: "Identity", icon: "Status & Diet" },
    { id: "success", label: "Profession", icon: "Job & Income" },
  ];

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev: Record<string, any>) => ({ ...prev, [key]: value }));
  };

  const defaultReset = () => {
    setFilters({
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
  };

  const activeCount = Object.entries(filters).filter(([key, val]) => {
    if (key === "ageRange") return val[0] !== 18 || val[1] !== 50;
    return val !== "";
  }).length;

  const renderFilterContent = (catId: string) => {
    switch (catId) {
      case "basics":
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Age Range</label>
                <span className="text-xs font-bold text-primary">{filters.ageRange[0]} - {filters.ageRange[1]}</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number" placeholder="Min"
                  value={filters.ageRange[0]}
                  onChange={(e) => handleFilterChange("ageRange", [parseInt(e.target.value) || 18, filters.ageRange[1]])}
                  className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs font-medium"
                />
                <span className="text-slate-300 px-1">to</span>
                <input
                  type="number" placeholder="Max"
                  value={filters.ageRange[1]}
                  onChange={(e) => handleFilterChange("ageRange", [filters.ageRange[0], parseInt(e.target.value) || 70])}
                  className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs font-medium"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase">State</label>
                <input
                  placeholder="State" value={filters.state}
                  onChange={(e) => handleFilterChange("state", e.target.value)}
                  className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase">City</label>
                <input
                  placeholder="City" value={filters.city}
                  onChange={(e) => handleFilterChange("city", e.target.value)}
                  className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs"
                />
              </div>
            </div>
          </div>
        );
      case "community":
        return (
          <div className="space-y-4">
            {[
              { key: "religion", label: "Religion", options: filterMetadata?.religion || ["Hindu", "Muslim", "Sikh", "Christian"] },
              { key: "motherTongue", label: "Mother Tongue", options: filterMetadata?.motherTongue || ["Marathi", "Hindi", "English"] },
              { key: "caste", label: "Caste", options: filterMetadata?.caste || [] }
            ].map((f) => (
              <div key={f.key} className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase">{f.label}</label>
                <select
                  value={(filters as any)[f.key]}
                  onChange={(e) => handleFilterChange(f.key, e.target.value)}
                  className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-2 text-xs"
                >
                  <option value="">All {f.label}s</option>
                  {f.options.map((o: string) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>
        );
      case "identity":
        return (
          <div className="space-y-4">
            {[
              { key: "maritalStatus", label: "Marital Status", options: ["Never Married", "Divorced", "Widowed"] },
              { key: "diet", label: "Diet", options: ["Veg", "Non-Veg", "Vegan"] },
              { key: "height", label: "Height", options: ["5'0\"", "5'5\"", "6'0\""] }
            ].map((f) => (
              <div key={f.key} className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase">{f.label}</label>
                <select
                  value={(filters as any)[f.key]}
                  onChange={(e) => handleFilterChange(f.key, e.target.value)}
                  className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-2 text-xs"
                >
                  <option value="">Any {f.label}</option>
                  {f.options.map((o: string) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>
        );
      case "success":
        return (
          <div className="space-y-4">
            {[
              { key: "profession", label: "Profession", options: ["Engineer", "Doctor", "Software", "Management"] },
              { key: "income", label: "Income", options: ["5-10 Lakh", "10-20 Lakh", "20-50 Lakh"] },
              { key: "education", label: "Education", options: ["Bachelors", "Masters", "Doctorate"] }
            ].map((f) => (
              <div key={f.key} className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase">{f.label}</label>
                <select
                  value={(filters as any)[f.key]}
                  onChange={(e) => handleFilterChange(f.key, e.target.value)}
                  className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-2 text-xs"
                >
                  <option value="">All {f.label}s</option>
                  {f.options.map((o: string) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="sticky top-[112px] md:top-[128px] z-40 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-[1700px] px-4 md:px-8 lg:px-20 mx-auto py-2">
        <div className="flex items-center justify-between gap-4 md:gap-8">
          {/* Left: Filter Toggle (Mobile) / Label (Desktop) */}
          <div className="flex items-center gap-3 shrink-0">
            <div className={clsx(
              "w-9 h-9 rounded-lg flex items-center justify-center transition-all",
              activeCount > 0 ? "bg-primary text-white" : "bg-slate-900 text-white shadow-sm"
            )}>
              {activeCount > 0 ? <Filter size={14} /> : <Search size={14} />}
            </div>
            <div className="hidden sm:block">
              <h2 className="text-sm font-semibold text-slate-900">Filter</h2>
              {activeCount > 0 && <p className="text-[10px] text-primary font-bold">{activeCount} applied</p>}
            </div>
          </div>

          {/* Center: Smart Categories - Scrollable on Mobile, Wrap on Desktop if needed */}
          <div className="flex-1 overflow-x-auto no-scrollbar md:overflow-visible">
            <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100 w-fit md:w-auto">
              {categories.map((cat) => (
                <div key={cat.id} className="relative shrink-0">
                  <button 
                    onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                    className={clsx(
                      "filter-toggle-btn h-10 px-4 md:px-6 rounded-lg text-xs font-medium transition-all flex flex-col items-center justify-center min-w-[100px] md:min-w-[120px] whitespace-nowrap",
                      activeCategory === cat.id 
                      ? "bg-white text-primary shadow-sm ring-1 ring-slate-200" 
                      : "text-slate-600 hover:text-primary hover:bg-white"
                    )}
                  >
                    <span className="flex items-center gap-2 pointer-events-none">
                      {cat.label}
                      <ChevronDown size={12} className={clsx("transition-transform duration-300", activeCategory === cat.id && "rotate-180")} />
                    </span>
                    <span className="text-[9px] text-slate-400 font-normal hidden lg:block pointer-events-none">
                      {cat.icon}
                    </span>
                  </button>

                  {/* Desktop Popover (Visible only on md+) */}
                  <div className="hidden md:block">
                    <AnimatePresence>
                      {activeCategory === cat.id && (
                        <motion.div 
                          ref={dropdownRef}
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 pt-2 z-50 w-[320px]"
                        >
                          <div className="bg-white border border-slate-200 shadow-2xl rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
                               <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest">{cat.label} Filters</h4>
                               <button onClick={() => setActiveCategory(null)} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400">
                                 <X size={14} />
                               </button>
                            </div>
                            <div className="max-h-[60vh] overflow-y-auto no-scrollbar pr-1">
                               {renderFilterContent(cat.id)}
                            </div>
                            <div className="mt-6">
                               <button 
                                onClick={() => setActiveCategory(null)}
                                className="w-full h-11 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                               >
                                  Apply Filters
                               </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onReset || defaultReset}
              className="text-xs font-bold text-rose-500 hover:text-rose-600 px-3 py-2 rounded-lg hover:bg-rose-50 transition-all"
            >
              Reset
            </button>
            <div className="hidden sm:block w-px h-5 bg-slate-200" />
            <button 
              onClick={onReset || defaultReset}
              className="hidden sm:flex text-slate-400 hover:text-slate-600 transition-colors"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Modal Overlay (Visible only on <md) */}
      <AnimatePresence>
        {activeCategory && (
          <div className="md:hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveCategory(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-998"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[2.5rem] z-999 h-[90vh] flex flex-col shadow-[0_-8px_30px_rgb(0,0,0,0.2)] overflow-hidden"
            >
              {/* Handle */}
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto my-4 shrink-0" />
              
              {/* Modal Header */}
              <div className="px-6 pb-4 flex items-center justify-between shrink-0">
                 <div className="space-y-1">
                    <h3 className="text-2xl font-black text-slate-900 leading-none">
                       {activeCategory ? activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1) : "Filters"}
                    </h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Refine your search</p>
                 </div>
                 <button 
                   onClick={() => setActiveCategory(null)}
                   className="p-3 bg-slate-50 text-slate-900 rounded-2xl hover:bg-slate-100 transition-colors"
                 >
                   <X size={20} />
                 </button>
              </div>

              {/* Modal Content - Scrollable */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                 <div className="grid grid-cols-1 gap-6">
                    {activeCategory === "basics" ? (
                      <div className="space-y-8">
                         {/* Age Filter */}
                         <div className="space-y-6">
                            <div className="flex justify-between items-end">
                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Age Range</p>
                               <p className="text-sm font-black text-primary">{filters.ageRange[0]} - {filters.ageRange[1]}</p>
                            </div>
                            <div className="flex items-center gap-4">
                               <input 
                                 type="number" 
                                 value={filters.ageRange[0]}
                                 onChange={(e) => setFilters({...filters, ageRange: [Number(e.target.value), filters.ageRange[1]]})}
                                 className="w-full h-14 px-5 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20"
                               />
                               <span className="text-slate-300 font-bold">to</span>
                               <input 
                                 type="number" 
                                 value={filters.ageRange[1]}
                                 onChange={(e) => setFilters({...filters, ageRange: [filters.ageRange[0], Number(e.target.value)]})}
                                 className="w-full h-14 px-5 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20"
                               />
                            </div>
                         </div>
                         
                         {/* State and City */}
                         <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">State</p>
                               <input 
                                 type="text" 
                                 placeholder="State"
                                 value={filters.state}
                                 onChange={(e) => setFilters({...filters, state: e.target.value})}
                                 className="w-full h-14 px-5 bg-slate-50 border-none rounded-2xl text-sm font-bold"
                               />
                            </div>
                            <div className="space-y-2">
                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">City</p>
                               <input 
                                 type="text" 
                                 placeholder="City"
                                 value={filters.city}
                                 onChange={(e) => setFilters({...filters, city: e.target.value})}
                                 className="w-full h-14 px-5 bg-slate-50 border-none rounded-2xl text-sm font-bold"
                               />
                            </div>
                         </div>
                      </div>
                    ) : (
                       /* Dynamic Options for Other Categories */
                       <div className="grid grid-cols-2 gap-3">
                          {getOptionsForCategory(activeCategory).map(option => (
                             <button
                               key={option}
                               onClick={() => setFilters({...filters, [activeCategory as string]: option === filters[activeCategory as keyof typeof filters] ? "" : option})}
                               className={clsx(
                                 "px-4 py-4 rounded-2xl text-xs font-bold transition-all text-center h-full flex items-center justify-center",
                                 filters[activeCategory as keyof typeof filters] === option
                                   ? "bg-slate-900 text-white shadow-lg shadow-slate-200"
                                   : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                               )}
                             >
                               {option}
                             </button>
                          ))}
                       </div>
                    )}
                 </div>
                 
                 {/* Safety Spacing for Footer */}
                 <div className="h-12" />
              </div>

              {/* Modal Footer - Fixed */}
              <div className="p-6 pt-4 bg-white border-t border-slate-100 shrink-0 mb-safe">
                  <button 
                   onClick={() => setActiveCategory(null)}
                   className="w-full h-14 bg-slate-900 text-white rounded-2xl text-sm font-bold shadow-xl shadow-slate-900/20 active:scale-[0.98] transition-all"
                  >
                     Apply Filters
                  </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HorizontalFilterBar;
