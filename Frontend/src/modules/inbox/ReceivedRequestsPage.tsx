import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchInterests,
  fetchContactRequests,
  respondToInterest,
  respondToContactRequest,
} from "@/store/interactionSlice";
import type { RootState, AppDispatch } from "@/store";
import UserLayout from "@/components/layout/UserLayout";
import {
  Check,
  X,
  Phone,
  Heart,
  Clock,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const cn = (...classes: any[]) => classes.filter(Boolean).join(" ");

const ReceivedRequestsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { receivedInterests, receivedContactRequests, loading } = useSelector(
    (state: RootState) => state.interaction,
  );
  const [activeSegment] = useState<"interests" | "contacts">("interests");

  useEffect(() => {
    dispatch(fetchInterests("received"));
    dispatch(fetchContactRequests("received"));
  }, [dispatch]);

  const handleInterestResponse = (
    interestId: string,
    status: "accepted" | "declined",
  ) => {
    dispatch(respondToInterest({ interestId, status }));
  };

  const handleContactResponse = (
    requestId: string,
    status: "accepted" | "declined",
  ) => {
    dispatch(respondToContactRequest({ requestId, status }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <UserLayout className="max-w-none pt-5">
      <div className="max-w-full pt-0 pb-16 px-4 sm:px-8 lg:px-12 mx-auto space-y-12">
        {/* Modern Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-1">
            <h1 className="text-2xl font-medium text-foreground tracking-tight">
              Incoming <span className="text-primary italic">Interests</span>
            </h1>
            <p className="text-sm text-black font-medium max-w-2xl">
              Review and manage people who want to establish a meaningful
              connection with you.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Interests Section */}
          <section
            className={cn(
              "space-y-8 transition-opacity duration-300",
              activeSegment === "contacts" &&
                "lg:opacity-100 opacity-0 hidden lg:block",
            )}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-medium flex items-center gap-4 text-foreground  tracking-tight">
                <div className="w-12 h-12 rounded-2xl bg-pink-100 flex items-center justify-center text-pink-600 shadow-sm">
                  <Heart size={24} fill="currentColor" />
                </div>
                Profile Interests
              </h2>
            </div>

            {loading ? (
              <div className="grid gap-4">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-32 bg-white rounded-4xl border border-border animate-pulse"
                  />
                ))}
              </div>
            ) : receivedInterests.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-20 rounded-[3rem] border border-border border-dashed text-center space-y-6 shadow-soft"
              >
                <div className="w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center mx-auto text-pink-200">
                  <Heart size={48} />
                </div>
                <div className="space-y-2">
                  <p className="text-xl font-medium text-foreground capitalize">
                    The heart is quiet
                  </p>
                  <p className="text-black font-medium max-w-xs mx-auto text-sm">
                    No incoming interest requests yet. Keep your profile
                    detailed to attract matches!
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="grid gap-5">
                <AnimatePresence mode="popLayout">
                  {receivedInterests.map((interest) => (
                    <motion.div
                      key={interest.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="bg-white p-6 rounded-[2.5rem] shadow-soft border border-border hover:shadow-elevated hover:border-pink-200 transition-all duration-300 group relative overflow-hidden"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-5">
                          <div className="relative shrink-0">
                            <div className="w-24 h-24 rounded-4xl bg-muted overflow-hidden border-4 border-white shadow-xl group-hover:scale-105 transition-transform duration-500">
                              <img
                                src={
                                  interest.profile?.photos &&
                                  interest.profile.photos.length > 0
                                    ? interest.profile.photos.find(
                                        (p: any) => p.isMain,
                                      )?.url || interest.profile.photos[0].url
                                    : `https://api.dicebear.com/7.x/avataaars/svg?seed=${interest.senderId}`
                                }
                                alt="User"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-9 h-9 bg-pink-500 rounded-xl border-4 border-white flex items-center justify-center text-white shadow-lg">
                              <Heart size={14} fill="currentColor" />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-xl text-foreground  tracking-tighter leading-none group-hover:text-pink-600 transition-colors">
                                {interest.profile
                                  ? `${interest.profile.firstName} ${interest.profile.lastName}`
                                  : `USER_${interest.senderId.substring(0, 6)}`}
                              </h4>
                              {interest.profile?.isKycVerified && (
                                <ShieldCheck
                                  size={18}
                                  className="text-secondary fill-secondary/10"
                                />
                              )}
                            </div>

                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] font-medium text-black  tracking-widest flex items-center gap-1.5">
                                <Clock size={12} />{" "}
                                {formatDate(interest.createdAt)}
                              </span>
                              {interest.status !== "pending" && (
                                <span
                                  className={cn(
                                    "w-fit px-2 py-0.5 rounded-lg text-[8px] font-medium  tracking-tighter border",
                                    interest.status === "accepted"
                                      ? "bg-green-50 text-green-600 border-green-100"
                                      : "bg-red-50 text-red-600 border-red-100",
                                  )}
                                >
                                  {interest.status}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <Link to={`/profile/${interest.senderId}`}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="rounded-2xl h-12 w-12 hover:bg-pink-50 hover:text-pink-600 border border-transparent hover:border-pink-100"
                            >
                              <ExternalLink size={18} />
                            </Button>
                          </Link>
                        </div>
                      </div>

                      {interest.status === "pending" && (
                        <div className="mt-8 pt-6 border-t border-slate-50 flex items-center gap-4">
                          <Button
                            onClick={() =>
                              handleInterestResponse(interest.id, "accepted")
                            }
                            className="flex-1 rounded-[1.25rem] bg-pink-500 hover:bg-pink-600 shadow-lg shadow-pink-200 h-14 font-medium  tracking-widest text-[10px]"
                          >
                            <Check size={18} className="mr-2" /> Accept Interest
                          </Button>
                          <Button
                            onClick={() =>
                              handleInterestResponse(interest.id, "declined")
                            }
                            variant="outline"
                            className="flex-1 rounded-[1.25rem] border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 h-14 font-medium  tracking-widest text-[10px] transition-all"
                          >
                            <X size={18} className="mr-2" /> Decline
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </section>

          {/* Contact Requests Section */}
          <section
            className={cn(
              "space-y-8 transition-opacity duration-300",
              activeSegment === "interests" &&
                "lg:opacity-100 opacity-0 hidden lg:block",
            )}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-medium flex items-center gap-4 text-foreground  tracking-tight">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
                  <Phone size={24} fill="currentColor" />
                </div>
                Reveal Requests
              </h2>
            </div>

            {loading ? (
              <div className="grid gap-4">
                {[1].map((i) => (
                  <div
                    key={i}
                    className="h-32 bg-white rounded-4xl border border-border animate-pulse"
                  />
                ))}
              </div>
            ) : receivedContactRequests.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-20 rounded-[3rem] border border-border border-dashed text-center space-y-6 shadow-soft"
              >
                <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto text-indigo-200">
                  <Phone size={48} />
                </div>
                <div className="space-y-2">
                  <p className="text-xl font-medium text-foreground capitalize">
                    Queue is empty
                  </p>
                  <p className="text-black font-medium max-w-xs mx-auto text-sm">
                    No one has requested for your contact reveal yet. This
                    usually happens after an interest is accepted.
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="grid gap-5">
                <AnimatePresence mode="popLayout">
                  {receivedContactRequests.map((request) => (
                    <motion.div
                      key={request.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="bg-white p-6 rounded-[2.5rem] shadow-soft border border-border hover:shadow-elevated hover:border-indigo-200 transition-all duration-300 group"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-5">
                          <div className="relative shrink-0">
                            <div className="w-24 h-24 rounded-4xl bg-muted overflow-hidden border-4 border-white shadow-xl group-hover:rotate-2 transition-transform duration-500">
                              <img
                                src={
                                  request.profile?.photos &&
                                  request.profile.photos.length > 0
                                    ? request.profile.photos.find(
                                        (p: any) => p.isMain,
                                      )?.url || request.profile.photos[0].url
                                    : `https://api.dicebear.com/7.x/avataaars/svg?seed=${request.senderId}`
                                }
                                alt="User"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-9 h-9 bg-indigo-500 rounded-xl border-4 border-white flex items-center justify-center text-white shadow-lg">
                              <Phone size={14} fill="currentColor" />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-xl text-foreground  tracking-tighter leading-none group-hover:text-indigo-600 transition-colors">
                                {request.profile
                                  ? `${request.profile.firstName} ${request.profile.lastName}`
                                  : `USER_${request.senderId.substring(0, 6)}`}
                              </h4>
                              {request.profile?.isKycVerified && (
                                <ShieldCheck
                                  size={18}
                                  className="text-secondary fill-secondary/10"
                                />
                              )}
                            </div>

                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] font-medium text-black  tracking-widest flex items-center gap-1.5">
                                <Clock size={12} />{" "}
                                {formatDate(request.createdAt)}
                              </span>
                              {request.status !== "pending" && (
                                <span
                                  className={cn(
                                    "w-fit px-2 py-0.5 rounded-lg text-[8px] font-medium  tracking-tighter border",
                                    request.status === "accepted"
                                      ? "bg-green-50 text-green-600 border-green-100"
                                      : "bg-red-50 text-red-600 border-red-100",
                                  )}
                                >
                                  {request.status}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <Link to={`/profile/${request.senderId}`}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-2xl h-12 w-12 hover:bg-indigo-50 hover:text-indigo-600 border border-transparent hover:border-indigo-100"
                          >
                            <ChevronRight size={18} />
                          </Button>
                        </Link>
                      </div>

                      {request.status === "pending" && (
                        <div className="mt-8 pt-6 border-t border-slate-50 flex items-center gap-4">
                          <Button
                            onClick={() =>
                              handleContactResponse(request.id, "accepted")
                            }
                            className="flex-1 rounded-[1.25rem] bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 h-14 font-medium  tracking-widest text-[10px]"
                          >
                            <Check size={18} className="mr-2" /> Reveal Contact
                          </Button>
                          <Button
                            onClick={() =>
                              handleContactResponse(request.id, "declined")
                            }
                            variant="outline"
                            className="flex-1 rounded-[1.25rem] border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 h-14 font-medium  tracking-widest text-[10px] transition-all"
                          >
                            <X size={18} className="mr-2" /> Decline
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </section>
        </div>
      </div>
    </UserLayout>
  );
};

export default ReceivedRequestsPage;





