"use client";

import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuthStore } from "@/store/authStore";
import {
  fetchChatList,
  fetchMessages,
  sendMessage,
  setFloatingOpen,
  setFloatingMinimized,
  setFloatingActivePartner,
} from "@/store/chatSlice";
import type { RootState, AppDispatch } from "@/store";
import {
  MessageCircleMore,
  X,
  Send,
  Minimize2,
  Maximize2,
  Search,
  ArrowLeft,
  ShieldCheck,
  CheckCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Image } from "../common/Image";
import { Button } from "../ui/button";
import { MessageSquare } from "lucide-react";

const cn = (...classes: (string | boolean | undefined | null)[]) =>
  classes.filter(Boolean).join(" ");

const FloatingChat = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    chatList,
    activeChatMessages,
    isFloatingOpen: isOpen,
    isFloatingMinimized: isMinimized,
    floatingActivePartnerId: activePartnerId,
  } = useSelector((state: RootState) => state.chat);

  const { user } = useAuthStore();
  const isAuthenticated = !!user;

  const scrollRef = useRef<HTMLDivElement>(null);
  const [messageInput, setMessageInput] = useState("");

  const setIsOpen = (val: boolean) => dispatch(setFloatingOpen(val));
  const setIsMinimized = (val: boolean) => dispatch(setFloatingMinimized(val));
  const setActivePartnerId = (val: string | null) =>
    dispatch(setFloatingActivePartner(val));

  const totalUnread = chatList.reduce(
    (sum, p) => sum + (p.unreadCount || 0),
    0,
  );

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      dispatch(fetchChatList());
      const interval = setInterval(() => dispatch(fetchChatList()), 15000);
      return () => clearInterval(interval);
    }
  }, [isOpen, isAuthenticated, dispatch]);

  useEffect(() => {
    if (activePartnerId && isAuthenticated) {
      dispatch(fetchMessages(activePartnerId));
      const interval = setInterval(
        () => dispatch(fetchMessages(activePartnerId)),
        10000,
      );
      return () => clearInterval(interval);
    }
  }, [activePartnerId, isAuthenticated, dispatch]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeChatMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (activePartnerId && messageInput.trim()) {
      dispatch(
        sendMessage({ receiverId: activePartnerId, content: messageInput }),
      );
      setMessageInput("");
    }
  };

  if (!isAuthenticated) return null;

  const activePartner = chatList.find((p) => p.userId === activePartnerId);

  const formatTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  return (
    <div className="fixed bottom-24 lg:bottom-6 right-6 z-100 flex flex-col items-end gap-4 pointer-events-none transition-all duration-300">
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={cn(
              "bg-white border border-border flex flex-col overflow-hidden pointer-events-auto",
              "fixed inset-0 z-110 md:relative md:inset-auto md:z-auto", // Fixed full screen on mobile, relative inside bubble parent on desktop
              "w-full h-full md:w-[380px] md:h-[550px] shadow-2xl md:rounded-3xl mb-0 md:mb-2"
            )}
          >
            {/* Header */}
            <div className="p-4 bg-primary text-white flex items-center justify-between shadow-lg shrink-0">
              <div className="flex items-center gap-3">
                {activePartnerId && (
                  <button
                    onClick={() => setActivePartnerId(null)}
                    className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <ArrowLeft size={18} />
                  </button>
                )}
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-xl bg-white/20 overflow-hidden border border-white/30">
                      {activePartner ? (
                        <Image
                          src={
                            activePartner.profile?.photos?.[0]?.url ||
                            `https://api.dicebear.com/7.x/avataaars/svg?seed=${activePartner.userId}`
                          }
                          alt=""
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <MessageCircleMore className="p-2 w-full h-full" />
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold truncate max-w-[150px]">
                      {activePartner
                        ? `${activePartner.profile.firstName} ${activePartner.profile.lastName}`
                        : "Conversations"}
                    </span>
                    {activePartner && (
                      <span className="text-[10px] opacity-80">Online</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMinimized(true)}
                  className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                >
                  <Minimize2 size={16} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* List or Chat View */}
            <div className="flex-1 overflow-hidden relative bg-slate-50/30 flex flex-col">
              {!activePartnerId ? (
                /* Conversations List */
                <div className="h-full overflow-y-auto no-scrollbar py-2">
                  <div className="px-4 mb-4 mt-2">
                    <div className="relative">
                      <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        size={14}
                      />
                      <input
                        type="text"
                        placeholder="Search chats..."
                        className="w-full pl-9 pr-4 py-2 bg-white border border-slate-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/10"
                      />
                    </div>
                  </div>
                  {chatList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[300px] text-slate-400 opacity-60">
                      <MessageSquare size={40} className="mb-2" />
                      <p className="text-xs font-medium uppercase tracking-widest">
                        No conversations yet
                      </p>
                    </div>
                  ) : (
                    chatList.map((partner) => (
                      <button
                        key={partner.userId}
                        onClick={() => setActivePartnerId(partner.userId)}
                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white transition-all group"
                      >
                        <div className="relative shrink-0">
                          <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-white shadow-sm ring-1 ring-slate-100">
                            <Image
                              src={
                                partner.profile?.photos?.[0]?.url ||
                                `https://api.dicebear.com/7.x/avataaars/svg?seed=${partner.userId}`
                              }
                              alt=""
                              fill
                              className="object-cover"
                            />
                          </div>
                          {partner.unreadCount > 0 && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white rounded-lg flex items-center justify-center text-[9px] font-bold border-2 border-white shadow-lg">
                              {partner.unreadCount}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <div className="flex justify-between items-baseline mb-0.5">
                            <h4 className="font-semibold text-slate-900 truncate text-xs flex items-center gap-1">
                              {partner.profile.firstName}{" "}
                              {partner.profile.lastName}
                              {partner.profile.isKycVerified && (
                                <ShieldCheck
                                  size={12}
                                  className="text-secondary"
                                />
                              )}
                            </h4>
                            {partner.lastMessageTime && (
                              <span className="text-[9px] text-slate-400">
                                {formatTime(partner.lastMessageTime)}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 truncate">
                            {partner.lastMessage || "Click to start chatting"}
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              ) : (
                /* Individual Chat window */
                <>
                  <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar"
                  >
                    {activeChatMessages.map((msg, idx) => {
                      const isMine = msg.senderId === user?.id;
                      return (
                        <div
                          key={msg.id || idx}
                          className={cn(
                            "flex",
                            isMine ? "justify-end" : "justify-start",
                          )}
                        >
                          <div
                            className={cn(
                              "max-w-[80%] space-y-1",
                              isMine
                                ? "items-end flex flex-col"
                                : "items-start flex flex-col",
                            )}
                          >
                            <div
                              className={cn(
                                "px-3 py-2 rounded-2xl text-[13px] shadow-sm",
                                isMine
                                  ? "bg-primary text-white rounded-tr-none"
                                  : "bg-white border text-slate-700 rounded-tl-none",
                              )}
                            >
                              {msg.content}
                            </div>
                            <div className="flex items-center gap-1.5 text-[9px] text-slate-400 px-1">
                              {formatTime(msg.createdAt)}
                              {isMine && (
                                <CheckCheck
                                  size={10}
                                  className={msg.isRead ? "text-blue-500" : ""}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Input */}
                  <div className="p-3 bg-white border-t border-slate-100">
                    <form
                      onSubmit={handleSendMessage}
                      className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100"
                    >
                      <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Your message..."
                        className="flex-1 bg-transparent border-none focus:outline-none text-xs px-2 h-9 text-slate-700"
                      />
                      <Button
                        type="submit"
                        size="icon"
                        className="w-9 h-9 rounded-xl shadow-lg shadow-primary/20"
                      >
                        <Send size={16} />
                      </Button>
                    </form>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bubble / Minimized Bar */}
      <div className="pointer-events-auto">
        {isMinimized && isOpen ? (
          <motion.button
            whileHover={{ y: -2 }}
            onClick={() => setIsMinimized(false)}
            className="flex items-center gap-3 px-5 py-2.5 bg-primary text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all border border-white/20"
          >
            <div className="relative">
              <MessageCircleMore size={18} />
              {totalUnread > 0 && (
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-primary shadow-md">
                  {totalUnread}
                </div>
              )}
            </div>
            <span className="text-sm font-semibold tracking-wide">
              Messages
            </span>
            <Maximize2 size={14} className="opacity-60" />
          </motion.button>
        ) : !isOpen ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setIsOpen(true);
              setIsMinimized(false);
            }}
            className="w-14 h-14 bg-primary text-white rounded-2xl shadow-2xl flex items-center justify-center relative hover:rotate-6 transition-all border-2 border-white/20"
          >
            <MessageCircleMore size={24} />
            {totalUnread > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white rounded-lg flex items-center justify-center text-[10px] font-bold border-2 border-white shadow-lg">
                {totalUnread}
              </div>
            )}
          </motion.button>
        ) : null}
      </div>
    </div>
  );
};

export default FloatingChat;
