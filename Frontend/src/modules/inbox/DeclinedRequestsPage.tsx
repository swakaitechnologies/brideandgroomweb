import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchInterests, fetchContactRequests } from "@/store/interactionSlice";
import type { RootState, AppDispatch } from "@/store";
import UserLayout from "@/components/layout/UserLayout";
import {
  XCircle,
  Heart,
  Phone,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const DeclinedRequestsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
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

  // Consolidate declined items
  const declinedInterests = [
    ...sentInterests.filter((i) => i.status === "declined"),
    ...receivedInterests.filter((i) => i.status === "declined"),
  ].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );

  const declinedContacts = [
    ...sentContactRequests.filter((r) => r.status === "declined"),
    ...receivedContactRequests.filter((r) => r.status === "declined"),
  ].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  };

  return (
    <UserLayout className="max-w-none pt-5">
      <div className="max-w-full pt-0 pb-16 px-4 sm:px-8 lg:px-12 mx-auto space-y-12">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-1">
            <h1 className="text-2xl font-medium text-foreground tracking-tight">
              Declined{" "}
              <span className="text-black line-through italic">
                Requests
              </span>
            </h1>
            <p className="text-sm text-black font-medium max-w-2xl">
              Interests and requests that didn't move forward. Reflection often
              leads to better choices.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Declined Interests Section */}
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-medium flex items-center gap-4 text-foreground  tracking-tight">
                <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 shadow-sm">
                  <Heart
                    size={24}
                    className="grayscale group-hover:grayscale-0 transition-all"
                  />
                </div>
                Dropped Interests
              </h2>
            </div>

            {loading ? (
              <div className="grid gap-4">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-32 bg-white rounded-[2rem] border border-border animate-pulse"
                  />
                ))}
              </div>
            ) : declinedInterests.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-20 rounded-[3rem] border border-border border-dashed text-center space-y-6 shadow-soft"
              >
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
                  <Heart size={48} />
                </div>
                <div className="space-y-2">
                  <p className="text-xl font-medium text-foreground capitalize">
                    No closed chapters
                  </p>
                  <p className="text-black font-medium max-w-xs mx-auto text-sm">
                    All your interests are either pending or accepted. That's a
                    great sign!
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="grid gap-5">
                <AnimatePresence mode="popLayout">
                  {declinedInterests.map((interest) => (
                    <motion.div
                      key={interest.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white p-6 rounded-[2.5rem] shadow-soft border border-border flex items-center justify-between group grayscale hover:grayscale-0 transition-all duration-500"
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-black group-hover:bg-red-50 group-hover:text-red-400 transition-colors shrink-0">
                          <XCircle size={24} />
                        </div>
                        <div>
                          <h4 className="font-medium text-lg text-foreground  tracking-tighter leading-none mb-1 flex items-center gap-2">
                            {interest.profile?.firstName}{" "}
                            {interest.profile?.lastName}
                            {interest.profile?.isKycVerified && (
                              <ShieldCheck
                                size={14}
                                className="text-secondary fill-secondary/10"
                              />
                            )}
                          </h4>
                          <p className="text-[10px] font-medium text-black  tracking-widest flex items-center gap-1.5">
                            <Clock size={12} /> Declined on{" "}
                            {formatDate(interest.updatedAt)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full hover:bg-red-100 hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </section>

          {/* Declined Contact Requests Section */}
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-medium flex items-center gap-4 text-foreground  tracking-tight">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-black shadow-sm">
                  <Phone size={24} />
                </div>
                Missed Reveals
              </h2>
            </div>

            {loading ? (
              <div className="grid gap-4">
                {[1].map((i) => (
                  <div
                    key={i}
                    className="h-32 bg-white rounded-[2rem] border border-border animate-pulse"
                  />
                ))}
              </div>
            ) : declinedContacts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-20 rounded-[3rem] border border-border border-dashed text-center space-y-6 shadow-soft"
              >
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
                  <Phone size={48} />
                </div>
                <div className="space-y-2">
                  <p className="text-xl font-medium text-foreground capitalize">
                    Communication is open
                  </p>
                  <p className="text-black font-medium max-w-xs mx-auto text-sm">
                    No contact requests have been declined so far.
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="grid gap-5">
                <AnimatePresence mode="popLayout">
                  {declinedContacts.map((request) => (
                    <motion.div
                      key={request.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white p-6 rounded-[2.5rem] border border-border flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-black group-hover:bg-slate-100 transition-colors shrink-0">
                          <Phone size={24} />
                        </div>
                        <div>
                          <h4 className="font-medium text-lg text-black  tracking-tighter leading-none mb-1 flex items-center gap-2">
                            {request.profile?.firstName}{" "}
                            {request.profile?.lastName}
                            {request.profile?.isKycVerified && (
                              <ShieldCheck
                                size={14}
                                className="text-secondary fill-secondary/10"
                              />
                            )}
                          </h4>
                          <p className="text-[10px] font-medium text-black  tracking-widest flex items-center gap-1.5">
                            <Clock size={12} /> {formatDate(request.updatedAt)}
                          </p>
                        </div>
                      </div>
                      <Link to="/matches">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-[10px] font-medium  tracking-[0.2em] text-primary hover:bg-primary/5"
                        >
                          Find Others <ArrowRight size={14} className="ml-2" />
                        </Button>
                      </Link>
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

export default DeclinedRequestsPage;





