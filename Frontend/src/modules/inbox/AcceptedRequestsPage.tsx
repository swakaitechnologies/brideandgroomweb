import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchInterests, fetchContactRequests } from "@/store/interactionSlice";
import type { RootState, AppDispatch } from "@/store";
import UserLayout from "@/components/layout/UserLayout";
import {
  MessageSquare,
  Phone,
  Heart,
  Clock,
  MapPin,
  Briefcase,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

const AcceptedRequestsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuthStore();
  const interactionState = useSelector((state: RootState) => state.interaction);
  const { sentInterests,
    receivedInterests,
    sentContactRequests,
    receivedContactRequests,
    loading,
   } = interactionState || {} as any;

  useEffect(() => {
    dispatch(fetchInterests("sent"));
    dispatch(fetchInterests("received"));
    dispatch(fetchContactRequests("sent"));
    dispatch(fetchContactRequests("received"));
  }, [dispatch]);

  const acceptedInterests = [
    ...sentInterests.filter((i) => i.status === "accepted"),
    ...receivedInterests.filter((i) => i.status === "accepted"),
  ].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );

  const acceptedContacts = [
    ...sentContactRequests.filter((r) => r.status === "accepted"),
    ...receivedContactRequests.filter((r) => r.status === "accepted"),
  ].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getOtherUserId = (item: any) => {
    return item.senderId === user?.id ? item.receiverId : item.senderId;
  };

  return (
    <UserLayout className="max-w-none pt-5">
      <div className="max-w-full pt-0 pb-16 px-4 sm:px-8 lg:px-12 mx-auto space-y-12">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-1">
            <h1 className="text-2xl font-medium text-foreground tracking-tight">
              Successful{" "}
              <span className="text-primary italic">Connections</span>
            </h1>
            <p className="text-sm text-black font-medium max-w-2xl">
              Interests and contact requests that have been accepted. Build your
              future together.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Interests Section */}
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-medium flex items-center gap-4 text-foreground  tracking-tight">
                <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center text-green-600 shadow-sm">
                  <Heart size={24} fill="currentColor" />
                </div>
                Accepted Interests
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
            ) : acceptedInterests.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-20 rounded-[3rem] border border-border border-dashed text-center space-y-6 shadow-soft"
              >
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-200">
                  <Heart size={48} />
                </div>
                <div className="space-y-2">
                  <p className="text-xl font-medium text-foreground capitalize">
                    No connections yet
                  </p>
                  <p className="text-black font-medium max-w-xs mx-auto text-sm">
                    Keep exploring and responding to interests to see them here!
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="grid gap-5">
                <AnimatePresence mode="popLayout">
                  {acceptedInterests.map((interest) => (
                    <motion.div
                      key={interest.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-white p-6 rounded-[2.5rem] shadow-soft border border-border hover:shadow-elevated hover:border-green-200 transition-all duration-300 group"
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
                            <div className="absolute -bottom-2 -right-2 w-9 h-9 bg-green-500 rounded-xl border-4 border-white flex items-center justify-center text-white shadow-lg text-[8px] font-medium">
                              <Heart size={14} fill="currentColor" />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-xl text-foreground  tracking-tighter leading-none group-hover:text-green-600 transition-colors">
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
                                  <Briefcase size={10} />{" "}
                                  {interest.profile?.profession}
                                </span>
                                <span className="flex items-center gap-1 text-green-600">
                                  <Clock size={10} />{" "}
                                  {formatDate(interest.updatedAt)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Link
                            to={`/profile/${getOtherUserId(interest)}`}
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              className="rounded-2xl h-12 w-12 hover:bg-green-50 hover:text-green-600 border border-transparent hover:border-green-100"
                            >
                              <ExternalLink size={18} />
                            </Button>
                          </Link>
                          <Button
                            size="icon"
                            className="rounded-2xl bg-green-500 hover:bg-green-600 text-white h-12 w-12 shadow-lg shadow-green-100"
                          >
                            <MessageSquare size={20} />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </section>

          {/* Contacts Section */}
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-medium flex items-center gap-4 text-foreground  tracking-tight">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
                  <Phone size={24} fill="currentColor" />
                </div>
                Revealed Contacts
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
            ) : acceptedContacts.length === 0 ? (
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
                    No contacts revealed
                  </p>
                  <p className="text-black font-medium max-w-xs mx-auto text-sm">
                    Once a contact request is accepted, it will appear here for
                    your records.
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="grid gap-5">
                <AnimatePresence mode="popLayout">
                  {acceptedContacts.map((request) => (
                    <motion.div
                      key={request.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
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
                                    : `https://api.dicebear.com/7.x/avataaars/svg?seed=${request.profile?.firstName || request.id}`
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
                              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-medium tracking-widest mt-1 text-indigo-600">
                                <span className="flex items-center gap-1">
                                  <Phone size={10} /> Verified Contact Available
                                </span>
                                <span className="flex items-center gap-1 text-black">
                                  <Clock size={10} />{" "}
                                  {formatDate(request.updatedAt)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <Link
                          to={`/profile/${getOtherUserId(request)}`}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-2xl h-12 w-12 hover:bg-indigo-50 hover:text-indigo-600 border border-transparent hover:border-indigo-100"
                          >
                            <ChevronRight size={24} />
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

export default AcceptedRequestsPage;





