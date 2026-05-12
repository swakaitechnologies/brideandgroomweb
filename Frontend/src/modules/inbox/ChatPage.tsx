"use client";
import { Image } from "@/components/common/Image";
import { useSearchParams } from "react-router-dom";

import { useEffect, useState, useRef } from "react";

import { useDispatch, useSelector } from "react-redux";
import { fetchChatList, fetchMessages, sendMessage } from "@/store/chatSlice";
import type { RootState, AppDispatch } from "@/store";
import UserLayout from "@/components/layout/UserLayout";
import {
  Send,
  Search,
  MoreVertical,
  Smile,
  Paperclip,
  CheckCheck,
  UserX,
  Flag,
  ShieldAlert,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import api from "@/services/api";

const cn = (...classes: (string | boolean | undefined | null)[]) => classes.filter(Boolean).join(" ");

const ChatPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuthStore();
  const { chatList, activeChatMessages } = useSelector(
    (state: RootState) => state.chat,
  );
  const [searchParams] = useSearchParams();
  const partnerIdFromQuery = searchParams?.get("partnerId");

  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(
    partnerIdFromQuery || null,
  );
  const [messageInput, setMessageInput] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(fetchChatList());
  }, [dispatch]);

  useEffect(() => {
    if (partnerIdFromQuery && partnerIdFromQuery !== selectedPartnerId) {
      const timer = setTimeout(() => setSelectedPartnerId(partnerIdFromQuery), 0);
      return () => clearTimeout(timer);
    }
  }, [partnerIdFromQuery, selectedPartnerId]);

  useEffect(() => {
    if (selectedPartnerId) {
      dispatch(fetchMessages(selectedPartnerId));
      const interval = setInterval(() => {
        dispatch(fetchMessages(selectedPartnerId));
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [selectedPartnerId, dispatch]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeChatMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPartnerId && messageInput.trim()) {
      dispatch(
        sendMessage({ receiverId: selectedPartnerId, content: messageInput }),
      );
      setMessageInput("");
    }
  };

  const handleBlockUser = async () => {
    if (!selectedPartnerId) return;
    try {
      await api.post("/block/block", { blockedId: selectedPartnerId });
      toast.success("User blocked successfully");
      setShowOptions(false);
      dispatch(fetchChatList());
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to block user");
    }
  };

  const handleReportUser = async () => {
    if (!selectedPartnerId) return;
    try {
      await api.post("/block/report", {
        reportedId: selectedPartnerId,
        reason: "Reported from chat",
      });
      toast.success("User reported successfully");
      setShowOptions(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to report user");
    }
  };

  const selectedPartner = chatList.find((p) => p.userId === selectedPartnerId);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <UserLayout className="max-w-none pt-5">
      <div className="max-w-full pt-0 pb-16 px-4 sm:px-8 lg:px-12 mx-auto space-y-8 h-[calc(100vh-8rem)] flex flex-col">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 shrink-0">
          <div className="space-y-1">
            <h1 className="text-2xl font-medium text-foreground tracking-tight">
              Messages &{" "}
              <span className="text-primary italic">Conversations</span>
            </h1>
            <p className="text-sm text-black font-medium max-w-2xl">
              Connect with your matches and start meaningful conversations
              today.
            </p>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden rounded-[2.5rem] border border-border bg-white shadow-soft relative mb-4">
          {/* Conversations List */}
          <div
            className={cn(
              "w-full md:w-80 lg:w-96 border-r border-border flex flex-col bg-slate-50/30 shrink-0",
              selectedPartnerId ? "hidden md:flex" : "flex",
            )}
          >
            <div className="p-6 border-b border-border bg-white/50 backdrop-blur-sm">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-black"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-border text-sm focus:outline-none transition-all font-medium"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar py-2">
              {chatList.length === 0 ? (
                <div className="p-12 text-center space-y-4 grayscale opacity-40">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto">
                    <Smile size={32} className="text-black" />
                  </div>
                  <p className="text-[10px] font-medium  tracking-widest text-black">
                    No active chats
                  </p>
                </div>
              ) : (
                chatList.map((partner) => (
                  <button
                    key={partner.userId}
                    onClick={() => setSelectedPartnerId(partner.userId)}
                    className={cn(
                      "w-full p-4 flex items-center gap-4 transition-all relative group",
                      selectedPartnerId === partner.userId
                        ? "bg-white shadow-sm"
                        : "hover:bg-white/50",
                    )}
                  >
                    {selectedPartnerId === partner.userId && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute left-0 top-3 bottom-3 w-1 bg-primary rounded-r-xl"
                      />
                    )}
                    <div className="relative shrink-0">
                      <div className="w-14 h-14 rounded-2xl bg-muted overflow-hidden border-2 border-white shadow-sm group-hover:scale-105 transition-transform relative">
                        <Image
                          src={
                            partner.profile?.photos &&
                              partner.profile.photos.length > 0
                              ? partner.profile.photos.find(
                                (p: { isMain: boolean; url: string }) => p.isMain,
                              )?.url || partner.profile.photos[0].url
                              : `https://api.dicebear.com/7.x/avataaars/svg?seed=${partner.userId}`
                          }
                          alt=""
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      {partner.unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-lg bg-primary flex items-center justify-center text-[9px] font-medium text-white shadow-lg border-2 border-white">
                          {partner.unreadCount}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex justify-between items-baseline mb-1">
                        <h4 className="font-medium text-foreground truncate text-sm flex items-center gap-1.5">
                          {partner.profile?.firstName}{" "}
                          {partner.profile?.lastName}
                          {partner.profile?.isKycVerified && (
                            <ShieldCheck size={12} className="text-secondary" />
                          )}
                        </h4>
                        {partner.lastMessageTime && (
                          <span className="text-[9px] font-medium text-black  tracking-tighter">
                            {new Date(
                              partner.lastMessageTime,
                            ).toLocaleDateString() ===
                              new Date().toLocaleDateString()
                              ? formatTime(partner.lastMessageTime)
                              : new Date(
                                partner.lastMessageTime,
                              ).toLocaleDateString([], {
                                month: "short",
                                day: "numeric",
                              })}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-black truncate font-medium group-hover:text-foreground/70 transition-colors">
                        {partner.lastMessage || "Start a conversation..."}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat Window */}
          <div
            className={cn(
              "flex-1 flex flex-col bg-white relative",
              !selectedPartnerId ? "hidden md:flex" : "flex",
            )}
          >
            {selectedPartner ? (
              <>
                {/* Chat Header */}
                <div className="p-4 md:px-8 border-b border-border flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedPartnerId(null)}
                      className="md:hidden p-2 text-black hover:bg-slate-50 rounded-xl transition-colors"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <div className="relative shrink-0">
                      <div className="w-10 h-10 rounded-xl bg-muted overflow-hidden border-2 border-white shadow-sm relative">
                        <Image
                          src={
                            selectedPartner.profile?.photos &&
                              selectedPartner.profile.photos.length > 0
                              ? selectedPartner.profile.photos.find(
                                (p: { isMain: boolean; url: string }) => p.isMain,
                              )?.url || selectedPartner.profile.photos[0].url
                              : `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedPartner.userId}`
                          }
                          alt=""
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-green-500 border-2 border-white shadow-sm" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-foreground flex items-center gap-1.5 leading-none mb-1">
                        {selectedPartner.profile?.firstName}{" "}
                        {selectedPartner.profile?.lastName}
                        {selectedPartner.profile?.isKycVerified && (
                          <ShieldCheck size={14} className="text-secondary" />
                        )}
                      </h3>
                      <span className="text-[10px] text-green-500 font-medium  tracking-widest">
                        Online Now
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowOptions(!showOptions)}
                      className={cn(
                        "rounded-xl transition-all h-10 w-10",
                        showOptions
                          ? "bg-slate-100 text-primary"
                          : "text-black hover:bg-slate-50",
                      )}
                    >
                      <MoreVertical size={18} />
                    </Button>

                    <AnimatePresence>
                      {showOptions && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setShowOptions(false)}
                          />
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-elevated border border-border overflow-hidden z-20"
                          >
                            <button
                              onClick={handleBlockUser}
                              className="w-full px-4 py-3 text-left text-sm font-medium text-foreground hover:bg-slate-50 flex items-center gap-3 transition-colors"
                            >
                              <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500">
                                <UserX size={16} />
                              </div>
                              Block User
                            </button>
                            <button
                              onClick={handleReportUser}
                              className="w-full px-4 py-3 text-left text-sm font-medium text-foreground hover:bg-slate-50 flex items-center gap-3 transition-colors border-t border-border"
                            >
                              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500">
                                <Flag size={16} />
                              </div>
                              Report User
                            </button>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Messages Area */}
                <div
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 no-scrollbar bg-slate-50/20"
                >
                  <AnimatePresence initial={false}>
                    {selectedPartner.isBlocked ? (
                      <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4 h-full">
                        <div className="w-20 h-20 rounded-4xl bg-red-50 flex items-center justify-center text-red-500 shadow-sm">
                          <ShieldAlert size={32} />
                        </div>
                        <div className="space-y-2 text-center max-w-xs">
                          <p className="text-sm font-medium  tracking-tight text-foreground">
                            {selectedPartner.iBlocked
                              ? "Communication Blocked"
                              : "Restricted Access"}
                          </p>
                          <p className="text-xs text-black font-medium  tracking-widest leading-relaxed">
                            {selectedPartner.iBlocked
                              ? "You have blocked this contact. Unblock from privacy settings to resume conversation."
                              : "This user has restricted communication. You can no longer send or receive messages."}
                          </p>
                        </div>
                      </div>
                    ) : (
                      activeChatMessages.map((msg, idx) => {
                        const isMine = msg.senderId === user?.id;
                        return (
                          <motion.div
                            key={msg.id || idx}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className={cn(
                              "flex",
                              isMine ? "justify-end" : "justify-start",
                            )}
                          >
                            <div
                              className={cn(
                                "max-w-[75%] md:max-w-[60%] space-y-1.5",
                                isMine
                                  ? "items-end flex flex-col"
                                  : "items-start flex flex-col",
                              )}
                            >
                              <div
                                className={cn(
                                  "p-4 rounded-[1.75rem] text-sm font-medium shadow-sm transition-all leading-relaxed",
                                  isMine
                                    ? "bg-primary text-white rounded-tr-none shadow-primary/10"
                                    : "bg-white border border-border text-foreground rounded-tl-none shadow-slate-100",
                                )}
                              >
                                {msg.content}
                              </div>
                              <div className="flex items-center gap-2 text-[9px] font-medium  tracking-widest text-black px-2">
                                {formatTime(msg.createdAt)}
                                {isMine && (
                                  <CheckCheck
                                    size={12}
                                    className={
                                      msg.isRead ? "text-blue-500" : ""
                                    }
                                  />
                                )}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })
                    )}
                  </AnimatePresence>
                </div>

                {/* Message Input Container */}
                {!selectedPartner.isBlocked && (
                  <div className="p-6 border-t border-border bg-white">
                    <form
                      onSubmit={handleSendMessage}
                      className="relative flex items-center gap-3 bg-slate-50 p-2 rounded-[2.25rem] border border-border hover:border-primary/20 transition-all group shadow-inner"
                    >
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="rounded-full h-11 w-11 shrink-0 text-black hover:text-primary hover:bg-white"
                      >
                        <Paperclip size={20} />
                      </Button>
                      <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-transparent border-none focus:outline-none text-sm font-medium h-11 px-1 text-foreground placeholder:text-black"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="rounded-full h-11 w-11 shrink-0 text-black hover:text-secondary hover:bg-white"
                      >
                        <Smile size={20} />
                      </Button>
                      <Button
                        type="submit"
                        size="icon"
                        disabled={!messageInput.trim()}
                        className="rounded-full h-11 w-11 shrink-0 bg-primary hover:bg-primary-hover shadow-lg shadow-primary/20 disabled:grayscale disabled:opacity-30 transition-all active:scale-95"
                      >
                        <Send size={18} />
                      </Button>
                    </form>
                  </div>
                )}
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-8 bg-slate-50/10">
                <div className="relative">
                  <div className="w-24 h-24 rounded-[3rem] bg-slate-100 flex items-center justify-center text-black shadow-inner">
                    <Smile size={48} strokeWidth={1} />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-white shadow-elevated border border-border flex items-center justify-center">
                    <MessageSquare size={18} className="text-secondary" />
                  </div>
                </div>
                <div className="max-w-xs space-y-3">
                  <h4 className="text-xl font-medium text-foreground tracking-tight">
                    Select a Conversation
                  </h4>
                  <p className="text-xs text-black font-medium  tracking-[0.15em] leading-relaxed">
                    Pick someone from the left panel to start sharing your
                    journey.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

// Simplified MessageSquare for the empty state
const MessageSquare = ({
  size,
  className,
}: {
  size: number;
  className: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

export default ChatPage;

