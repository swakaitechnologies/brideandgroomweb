import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotifications,
  markAsRead,
  markAllAsRead,
} from "@/store/notificationSlice";
import type { RootState, AppDispatch } from "@/store";
import UserLayout from "@/components/layout/UserLayout";
import {
  Bell,
  Heart,
  Phone,
  Info,
  CheckCircle2,
  Clock,
  ShieldAlert,
  MessageSquare,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const cn = (...classes: any[]) => classes.filter(Boolean).join(" ");

const NotificationsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { notifications } = useSelector(
    (state: RootState) => state.notification,
  );

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleMarkAsRead = (id: string) => {
    dispatch(markAsRead(id));
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "interest":
        return (
          <Heart size={20} className="text-pink-500" fill="currentColor" />
        );
      case "contact_request":
        return (
          <Phone size={20} className="text-indigo-500" fill="currentColor" />
        );
      case "message":
        return (
          <MessageSquare
            size={20}
            className="text-green-500"
            fill="currentColor"
          />
        );
      case "SYSTEM":
        return <ShieldAlert size={20} className="text-red-500" />;
      case "kyc":
        return <ShieldAlert size={20} className="text-secondary" />;
      default:
        return <Info size={20} className="text-blue-500" />;
    }
  };

  const getTimeAgo = (dateString: string) => {
    const seconds = Math.floor(
      (new Date().getTime() - new Date(dateString).getTime()) / 1000,
    );
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };

  return (
    <UserLayout className="max-w-none pt-5">
      <div className="max-w-full pt-0 pb-16 px-4 sm:px-8 lg:px-12 mx-auto space-y-12 animate-in fade-in duration-700">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-border pb-8">
          <div className="space-y-1">
            <h1 className="text-2xl font-medium text-foreground tracking-tight">
              Recent <span className="text-primary italic">Updates</span>
            </h1>
            <p className="text-sm text-black font-medium max-w-2xl">
              Keep track of your interactions and activity. Never miss a
              potential connection.
            </p>
          </div>
          {notifications.length > 0 && (
            <Button
              variant="outline"
              onClick={handleMarkAllAsRead}
              className="rounded-xl h-10 px-6 border-border hover:bg-slate-50 font-medium text-sm transition-all"
            >
              <CheckCircle2 size={16} className="mr-2" /> Mark all as read
            </Button>
          )}
        </div>

        <div className="max-w-4xl">
          {notifications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-32 flex flex-col items-center text-center space-y-6 bg-muted/10 rounded-[3rem] border-2 border-dashed border-border"
            >
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-black shadow-sm border border-border">
                <Bell size={32} className="text-black" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-medium text-foreground">
                  All quiet here
                </h3>
                <p className="text-sm text-black font-medium max-w-sm mx-auto">
                  No notifications yet. Express interest in someone to get the
                  ball rolling!
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={cn(
                      "p-6 flex items-start gap-6 bg-white rounded-[2.5rem] border border-border transition-all group relative overflow-hidden",
                      !notification.isRead
                        ? "shadow-md border-primary/20 ring-1 ring-primary/5"
                        : "shadow-soft hover:shadow-md",
                    )}
                  >
                    {!notification.isRead && (
                      <div className="absolute left-0 top-6 bottom-6 w-1 bg-primary rounded-r-full" />
                    )}

                    <div
                      className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border-2 border-white",
                        !notification.isRead
                          ? "bg-primary/5 ring-4 ring-primary/5"
                          : "bg-slate-50",
                      )}
                    >
                      {getIcon(notification.type)}
                    </div>

                    <div className="flex-1 space-y-3 min-w-0">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span
                            className={cn(
                              "px-2.5 py-0.5 rounded-lg text-[10px] font-medium  tracking-widest border",
                              !notification.isRead
                                ? "bg-primary text-white border-primary"
                                : "bg-slate-100 text-black border-transparent",
                            )}
                          >
                            {notification.type.replace("_", " ")}
                          </span>
                          <span className="text-[10px] font-medium text-black  tracking-widest flex items-center gap-1.5">
                            <Clock size={12} />{" "}
                            {getTimeAgo(notification.createdAt)}
                          </span>
                        </div>
                        {!notification.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="text-primary font-medium  tracking-widest text-[9px] hover:text-primary-hover hover:underline transition-all"
                          >
                            Mark Read
                          </button>
                        )}
                      </div>

                      <div className="space-y-4">
                        <p
                          className={cn(
                            "text-base font-medium leading-relaxed",
                            !notification.isRead
                              ? "text-foreground"
                              : "text-black",
                          )}
                        >
                          {notification.message}
                        </p>

                        <div className="flex items-center gap-3">
                          {notification.type === "interest" && (
                            <Link to="/inbox/received">
                              <Button
                                variant="default"
                                size="sm"
                                className="rounded-xl h-9 px-6 font-medium text-xs shadow-lg shadow-primary/20"
                              >
                                Respond Now{" "}
                                <ChevronRight size={14} className="ml-1" />
                              </Button>
                            </Link>
                          )}
                          {notification.type === "contact_request" && (
                            <Link to="/inbox/received">
                              <Button
                                variant="default"
                                size="sm"
                                className="rounded-xl h-9 px-6 font-medium text-xs bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100"
                              >
                                View Request{" "}
                                <ChevronRight size={14} className="ml-1" />
                              </Button>
                            </Link>
                          )}
                          {notification.type === "message" && (
                            <Link to="/inbox/chat">
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-xl h-9 px-6 font-medium text-xs text-green-600 border-green-200 hover:bg-green-50 shadow-sm"
                              >
                                Start Chatting{" "}
                                <MessageSquare size={14} className="ml-1" />
                              </Button>
                            </Link>
                          )}
                          {notification.type === "kyc" && (
                            <Link to="/profile">
                              <Button
                                variant="gold"
                                size="sm"
                                className="rounded-xl h-9 px-6 font-medium text-xs shadow-lg shadow-secondary/20"
                              >
                                Check Status{" "}
                                <ChevronRight size={14} className="ml-1" />
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  );
};

export default NotificationsPage;





