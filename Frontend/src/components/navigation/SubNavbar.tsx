"use client";

import { NAV_ITEMS } from "../../constants/navigation";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/store";
import { useEffect } from "react";
import { fetchWhoViewedMe, fetchAllProfiles } from "../../store/profileSlice";
import {
  fetchInterests,
  fetchContactRequests,
} from "../../store/interactionSlice";
import { fetchChatList } from "../../store/chatSlice";

const SubNavbar = () => {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const currentPath = location.pathname;

  useEffect(() => {
    // Fetch all profiles and viewers to keep counts updated across all sub-pages
    dispatch(fetchAllProfiles());
    dispatch(fetchWhoViewedMe());
    dispatch(fetchInterests("received"));
    dispatch(fetchContactRequests("received"));
    dispatch(fetchChatList());
  }, [dispatch]);

  // Get data from Redux
  const allProfilesCount = useSelector(
    (state: RootState) => state.profile.allProfiles.length,
  );
  const shortlistedCount = useSelector(
    (state: RootState) => state.matches.shortlisted.length,
  );
  const recentlyViewedCount = useSelector(
    (state: RootState) => state.matches.recentlyViewed.length,
  );
  const likedCount = useSelector(
    (state: RootState) => state.matches.liked.length,
  );
  const viewersCount = useSelector(
    (state: RootState) => state.profile.viewers.length,
  );
  const {
    receivedInterests,
    receivedContactRequests,
    sentInterests,
    sentContactRequests,
  } = useSelector((state: RootState) => state.interaction);

  const pendingRequestsCount =
    receivedInterests.filter((i) => i.status === "pending").length +
    receivedContactRequests.filter((r) => r.status === "pending").length;

  const acceptedCount =
    sentInterests.filter((i) => i.status === "accepted").length +
    receivedInterests.filter((i) => i.status === "accepted").length +
    sentContactRequests.filter((r) => r.status === "accepted").length +
    receivedContactRequests.filter((r) => r.status === "accepted").length;

  const declinedCount =
    sentInterests.filter((i) => i.status === "declined").length +
    receivedInterests.filter((i) => i.status === "declined").length +
    sentContactRequests.filter((r) => r.status === "declined").length +
    receivedContactRequests.filter((r) => r.status === "declined").length;

  const sentCount = sentInterests.length + sentContactRequests.length;

  const { chatList } = useSelector((state: RootState) => state.chat);
  const totalUnreadMessages = chatList.reduce(
    (sum, p) => sum + p.unreadCount,
    0,
  );

  const { unreadCount: notificationCount } = useSelector(
    (state: RootState) => state.notification,
  );

  const activeMainItem = 
    NAV_ITEMS.find((item) => 
      currentPath.startsWith(item.path) || 
      item.subItems?.some(sub => currentPath.startsWith(sub.path))
    ) || NAV_ITEMS[0];

  if (!activeMainItem || !activeMainItem.subItems) return null;

  // Map dynamic counts to subItems
  const displaySubItems = activeMainItem.subItems.map((subItem) => {
    let dynamicCount = subItem.count;

    if (activeMainItem.id === "matches") {
      switch (subItem.id) {
        case "all_profiles":
        case "todays_recommendations":
          dynamicCount = allProfilesCount;
          break;
        case "shortlisted":
          dynamicCount = shortlistedCount;
          break;
        case "recently_viewed":
          dynamicCount = recentlyViewedCount;
          break;
        case "likes":
          dynamicCount = likedCount;
          break;
        case "near_me":
          // Placeholder: roughly 30% of profiles are usually "near"
          dynamicCount = Math.ceil(allProfilesCount * 0.3);
          break;
        case "new_matches":
          // As per NewMatchesPage logic, it's limited to 20
          dynamicCount = Math.min(allProfilesCount, 20);
          break;
        case "viewed_you":
          dynamicCount = viewersCount;
          break;
      }
    } else if (activeMainItem.id === "inbox") {
      switch (subItem.id) {
        case "received":
          dynamicCount = pendingRequestsCount;
          break;
        case "accepted":
          dynamicCount = acceptedCount;
          break;
        case "declined":
          dynamicCount = declinedCount;
          break;
        case "sent":
          dynamicCount = sentCount;
          break;
        case "chat":
          dynamicCount = totalUnreadMessages;
          break;
        case "notifications":
          dynamicCount = notificationCount;
          break;
      }
    }
    return { ...subItem, count: dynamicCount };
  });

  return (
    <div className="bg-white border-b border-border/50 shadow-sm">
      <div className="container px-4 py-3">
        {/* Grid Layout for Mobile, Flex for Desktop */}
        {/* Horizontal Scrollable container for all screens, specifically mobile */}
        <div className="flex flex-nowrap items-center gap-2 md:gap-3 overflow-x-auto no-scrollbar scroll-smooth pb-1 -mb-1">
          {displaySubItems.map((subItem) => {
            const isActive = currentPath === subItem.path;

            return (
              <Link
                key={subItem.id}
                to={subItem.path}
                className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[12px] md:text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                  isActive
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "bg-slate-50/80 text-black hover:bg-slate-100 hover:text-primary"
                }`}
              >
                <span className="tracking-tight leading-none">
                  {subItem.label}
                </span>
                {subItem.count !== undefined && subItem.count > 0 && (
                  <span
                    className={`shrink-0 w-5 h-5 flex items-center justify-center rounded-full text-[9px] font-medium leading-none ${
                      isActive
                        ? "bg-white text-primary"
                        : "bg-slate-200 text-black"
                    }`}
                  >
                    {subItem.count > 99 ? "99+" : subItem.count}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SubNavbar;





