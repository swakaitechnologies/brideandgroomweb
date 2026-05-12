"use client";

import { Link, useLocation } from "react-router-dom";
import { 
  Users, 
  Search, 
  MessageSquare, 
  User as UserIcon, 
  Grid 
} from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { motion } from "framer-motion";
import { clsx } from "clsx";

const MobileBottomNav = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { unreadCount } = useSelector((state: RootState) => state.notification);
  const { chatList } = useSelector((state: RootState) => state.chat);

  const totalChatUnread = chatList.reduce((sum, chat) => sum + chat.unreadCount, 0);
  const totalInboxCount = unreadCount + totalChatUnread;

  const navItems = [
    {
      id: "matches",
      label: "Matches",
      icon: <Users size={22} />,
      path: "/matches/all",
      activePaths: ["/matches", "/matches/all", "/matches/new", "/matches/near", "/matches/shortlisted", "/matches/likes", "/matches/viewed-you", "/matches/recently-viewed"]
    },
    {
      id: "search",
      label: "Search",
      icon: <Search size={22} />,
      path: "/search/basic",
      activePaths: ["/search"]
    },
    {
      id: "inbox",
      label: "Inbox",
      icon: <MessageSquare size={22} />,
      path: "/inbox/chat",
      activePaths: ["/inbox", "/inbox/received", "/inbox/accepted", "/inbox/sent", "/inbox/declined", "/inbox/chat"],
      badge: totalInboxCount
    },
    {
      id: "profile",
      label: "Profile",
      icon: <UserIcon size={22} />,
      path: "/profile",
      activePaths: ["/profile"]
    }
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 pb-2 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-around h-16 w-full relative">
        {navItems.map((item) => {
          const isActive = item.activePaths.some(p => currentPath.startsWith(p));
          
          return (
            <Link
              key={item.id}
              to={item.path}
              className="relative flex flex-col items-center justify-center w-full h-full"
            >
              <div className={clsx(
                "relative transition-all duration-300",
                isActive ? "-translate-y-0.5 text-primary" : "text-slate-500"
              )}>
                {item.icon}
                
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary text-white text-[8px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                )}
              </div>
              
              <span className={clsx(
                "text-[10px] font-bold mt-1 transition-all duration-300",
                isActive ? "text-primary opacity-100" : "text-slate-500 opacity-80"
              )}>
                {item.label}
              </span>

              {isActive && (
                <motion.div 
                   layoutId="bottomNavTab"
                   className="absolute top-0 w-8 h-1 bg-primary rounded-full"
                />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;
