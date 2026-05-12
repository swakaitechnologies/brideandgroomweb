import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchInterests, fetchContactRequests } from "@/store/interactionSlice";
import type { RootState, AppDispatch } from "@/store";
import UserLayout from "@/components/layout/UserLayout";
import {
  Send,
  Heart,
  Phone,
  Clock,
  MapPin,
  Briefcase,
  Search,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const cn = (...classes: any[]) => classes.filter(Boolean).join(" ");

const SentRequestsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { sentInterests, sentContactRequests, loading } = useSelector(
    (state: RootState) => state.interaction,
  );

  useEffect(() => {
    dispatch(fetchInterests("sent"));
    dispatch(fetchContactRequests("sent"));
  }, [dispatch]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-50 text-green-600 border-green-100";
      case "declined":
        return "bg-red-50 text-red-500 border-red-100";
      default:
        return "bg-amber-50 text-amber-600 border-amber-100";
    }
  };

  return (
    <UserLayout className="max-w-none pt-5">
      <div className="max-w-full pt-0 pb-16 px-4 sm:px-8 lg:px-12 mx-auto space-y-12">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-1">
            <h1 className="text-2xl font-medium text-foreground tracking-tight">
              Outbound <span className="text-primary italic">Requests</span>
            </h1>
            <p className="text-sm text-black font-medium max-w-2xl">
              Track interests and contact reveal requests you've sent.
              Communication is the key to meaningful connections.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Sent Interests Section */}
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-medium flex items-center gap-4 text-foreground  tracking-tight">
                <div className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-500 shadow-sm">
                  <Heart size={24} fill="currentColor" />
                </div>
                Sent Interests
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
            ) : sentInterests.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-20 rounded-[3rem] border border-border border-dashed text-center space-y-6 shadow-soft"
              >
                <div className="w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center mx-auto text-pink-200">
                  <Send size={48} />
                </div>
                <div className="space-y-2">
                  <p className="text-xl font-medium text-foreground capitalize">
                    The journey begins
                  </p>
                  <p className="text-black font-medium max-w-xs mx-auto text-sm">
                    You haven't sent any interests yet. Start exploring profiles
                    to find your perfect match!
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="grid gap-5">
                <AnimatePresence mode="popLayout">
                  {sentInterests.map((interest) => (
                    <motion.div
                      key={interest.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white p-6 rounded-[2.5rem] shadow-soft border border-border hover:shadow-elevated hover:border-pink-100 transition-all duration-300 group"
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
                                    : `https://api.dicebear.com/7.x/avataaars/svg?seed=${interest.profile?.firstName || interest.id}`
                                }
                                alt="User"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div
                              className={cn(
                                "absolute -bottom-2 -right-2 px-2 py-0.5 rounded-lg text-[8px] font-medium  border shadow-md",
                                getStatusStyle(interest.status),
                              )}
                            >
                              {interest.status}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-xl text-foreground  tracking-tighter leading-none group-hover:text-pink-600 transition-colors">
                                {interest.profile?.firstName}{" "}
                                {interest.profile?.lastName}
                              </h4>
                              {interest.profile?.isKycVerified && (
                                <ShieldCheck
                                  size={18}
                                  className="text-secondary fill-secondary/10"
                                />
                              )}
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-medium text-black  tracking-widest mt-1">
                                <span className="flex items-center gap-1">
                                  <MapPin size={10} /> {interest.profile?.city}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock size={10} />{" "}
                                  {formatDate(interest.createdAt)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <Link to={`/profile/${interest.receiverId}`}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-2xl h-12 w-12 hover:bg-pink-50 hover:text-pink-600 border border-transparent hover:border-pink-100"
                          >
                            <ExternalLink size={18} />
                          </Button>
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </section>

          {/* Sent Contact Requests Section */}
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-medium flex items-center gap-4 text-foreground  tracking-tight">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 shadow-sm">
                  <Phone size={24} fill="currentColor" />
                </div>
                Contact Requests
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
            ) : sentContactRequests.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-20 rounded-[3rem] border border-border border-dashed text-center space-y-6 shadow-soft"
              >
                <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto text-indigo-200">
                  <Search size={48} />
                </div>
                <div className="space-y-2">
                  <p className="text-xl font-medium text-foreground capitalize">
                    Privacy first
                  </p>
                  <p className="text-black font-medium max-w-xs mx-auto text-sm">
                    No contact requests sent. You can request for contact
                    details after your interest is accepted.
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="grid gap-5">
                <AnimatePresence mode="popLayout">
                  {sentContactRequests.map((request) => (
                    <motion.div
                      key={request.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white p-6 rounded-[2.5rem] shadow-soft border border-border hover:shadow-elevated hover:border-indigo-100 transition-all duration-300 group"
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
                                    : `https://api.dicebear.com/7.x/avataaars/svg?seed=${request.profile?.firstName || request.id}`
                                }
                                alt="User"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div
                              className={cn(
                                "absolute -bottom-2 -right-2 px-2 py-0.5 rounded-lg text-[8px] font-medium  border shadow-md",
                                getStatusStyle(request.status),
                              )}
                            >
                              {request.status}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-xl text-foreground  tracking-tighter leading-none group-hover:text-indigo-600 transition-colors">
                                {request.profile?.firstName}{" "}
                                {request.profile?.lastName}
                              </h4>
                              {request.profile?.isKycVerified && (
                                <ShieldCheck
                                  size={18}
                                  className="text-secondary fill-secondary/10"
                                />
                              )}
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-medium text-black  tracking-widest mt-1">
                                <span className="flex items-center gap-1 text-indigo-500/70">
                                  <Briefcase size={10} />{" "}
                                  {request.profile?.profession}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock size={10} />{" "}
                                  {formatDate(request.createdAt)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <Link to={`/profile/${request.receiverId}`}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-2xl h-12 w-12 hover:bg-indigo-50 hover:text-indigo-600 border border-transparent hover:border-indigo-100"
                          >
                            <ExternalLink size={18} />
                          </Button>
                        </Link>
                      </div>
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

export default SentRequestsPage;





