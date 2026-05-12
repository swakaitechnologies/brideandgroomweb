"use client";
import { Image } from "@/components/common/Image";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { NAV_ITEMS, type NavItem } from "../../constants/navigation";

import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/store";
import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { fetchNotifications } from "../../store/notificationSlice";
import { fetchProfile } from "../../store/profileSlice";
import {
  Search,
  Bell,
  User as UserIcon,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  X,
  MessageSquare,
  ArrowLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { unreadCount } = useSelector((state: RootState) => state.notification);
  const { chatList } = useSelector((state: RootState) => state.chat);
  const { data: profile } = useSelector((state: RootState) => state.profile);
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const totalChatUnread = chatList.reduce(
    (sum: number, chat) => sum + chat.unreadCount,
    0,
  );
  const totalBadgeCount = unreadCount + totalChatUnread;

  useEffect(() => {
    dispatch(fetchNotifications());
    dispatch(fetchProfile());
    // Polling for notifications every 30 seconds
    const interval = setInterval(() => {
      dispatch(fetchNotifications());
    }, 30000);
    return () => clearInterval(interval);
  }, [dispatch]);

  // Determine active main tab based on current path
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search/results?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const currentPath = location.pathname;
  const activeTabId =
    NAV_ITEMS.find((item: NavItem) => currentPath.startsWith(item.path))?.id ||
    "profile";

  const isSubPage = currentPath.split("/").length > 2 && activeTabId !== "profile";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-muted shadow-sm h-16">
      <div className="container h-full flex items-center justify-between px-4">
        {/* Mobile: Back Button or Logo */}
        <div className="flex items-center gap-3">
          {isSubPage ? (
            <button 
              onClick={() => navigate(-1)}
              className="lg:hidden p-2 hover:bg-muted rounded-full transition-colors text-black"
            >
              <ArrowLeft size={24} />
            </button>
          ) : (
            <Link to="/matches" className="flex items-center group relative h-10 w-24 md:w-36 lg:w-40 lg:h-14">
              <Image 
                src="/Logo.png" 
                alt="Bride&Groom" 
                fill
                priority
                className="object-contain transition-transform group-hover:scale-105" 
              />
            </Link>
          )}

          {/* Page Title for Mobile (Subpages) */}
          {isSubPage && (
            <span className="lg:hidden text-lg font-bold text-slate-900 truncate max-w-[150px]">
              {NAV_ITEMS.find(i => i.path === currentPath)?.label || 
               NAV_ITEMS.flatMap(i => i.subItems || []).find(s => s.path === currentPath)?.label || 
               "Back"}
            </span>
          )}
        </div>

        {/* Search Bar - Hidden on small screens */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 max-w-[280px] lg:max-w-md mx-4 lg:mx-8 relative"
        >
          <input
            type="text"
            placeholder="Search Profile"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-muted/30 border border-muted rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
          />
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-black/50"
            size={14}
          />
        </form>

        {/* Navigation & Actions */}
        <div className="flex items-center gap-2 md:gap-4 lg:gap-6">
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item: NavItem) => (
              <Link
                key={item.id}
                to={item.path}
                className={`relative px-3 py-2 text-[13px] font-semibold tracking-tight transition-colors ${
                  activeTabId === item.id
                    ? "text-primary"
                    : "text-black/70 hover:text-primary"
                }`}
              >
                {item.label}
                {activeTabId === item.id && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-3 border-none md:border-l md:border-muted md:pl-4 lg:pl-6">
            <button
              onClick={() => navigate("/notifications")}
              className="relative p-2 text-black hover:bg-muted rounded-full transition-colors hidden sm:block"
            >
              <Bell size={20} />
              {totalBadgeCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-primary rounded-full border-2 border-white text-[8px] font-medium text-white flex items-center justify-center">
                  {totalBadgeCount > 9 ? "9+" : totalBadgeCount}
                </span>
              )}
            </button>
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 p-1 rounded-2xl hover:bg-muted transition-all group"
              >
                <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center overflow-hidden ring-2 ring-transparent group-hover:ring-primary/20 transition-all border border-border relative">
                  {profile?.photos && profile.photos.length > 0 ? (
                    <Image
                      src={
                        profile.photos.find((p: { isMain: boolean; url: string }) => p.isMain)?.url ||
                        profile.photos[0].url
                      }
                      alt="Profile"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <UserIcon size={18} className="text-black" />
                  )}
                </div>
                <ChevronDown
                  size={14}
                  className={`text-black transition-transform duration-300 ${showDropdown ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {showDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowDropdown(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-elevated border border-border overflow-hidden z-50 p-2"
                    >
                      <div className="px-4 py-3 border-b border-muted mb-1">
                        <p className="text-xs font-medium  tracking-widest text-black mb-1">
                          Account
                        </p>
                        <p className="text-sm font-medium text-foreground truncate">
                          {profile?.firstName} {profile?.lastName}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          navigate("/profile/privacy");
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground hover:bg-primary/5 hover:text-primary rounded-xl transition-all"
                      >
                        <Settings size={18} />
                        Privacy Settings
                      </button>
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          navigate("/feedback");
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground hover:bg-primary/5 hover:text-primary rounded-xl transition-all"
                      >
                        <MessageSquare size={18} />
                        Feedback & Support
                      </button>

                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                      >
                        <LogOut size={18} />
                        Logout
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 text-black hover:bg-muted rounded-full transition-colors"
            >
              {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileMenu(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-[280px] bg-white z-50 shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-muted flex items-center justify-between">
                <span className="text-xl font-medium  tracking-tighter">
                  Menu
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                        setShowMobileMenu(false);
                        navigate("/notifications");
                    }}
                    className="relative p-2 text-black hover:bg-muted rounded-full transition-colors"
                  >
                    <Bell size={20} />
                    {totalBadgeCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-primary rounded-full border-2 border-white text-[8px] font-medium text-white flex items-center justify-center">
                        {totalBadgeCount > 9 ? "9+" : totalBadgeCount}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setShowMobileMenu(false)}
                    className="p-2 hover:bg-muted rounded-full"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-1">
                <p className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Navigation</p>
                {NAV_ITEMS.map((item: NavItem) => (
                  <Link
                    key={item.id}
                    to={item.path}
                    onClick={() => setShowMobileMenu(false)}
                    className={`flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      activeTabId === item.id
                        ? "text-primary bg-primary/5"
                        : "text-slate-700 hover:bg-muted"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="p-6 border-t border-muted bg-slate-50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center overflow-hidden relative">
                    {profile?.photos && profile.photos.length > 0 ? (
                      <Image
                        src={
                          profile.photos.find((p: { isMain: boolean; url: string }) => p.isMain)?.url ||
                          profile.photos[0].url
                        }
                        alt=""
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <UserIcon size={18} className="text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {profile?.firstName} {profile?.lastName}
                    </p>
                    <p className="text-[10px] font-medium text-black  tracking-widest">
                      Member
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 text-sm font-medium text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-xl transition-all"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;

