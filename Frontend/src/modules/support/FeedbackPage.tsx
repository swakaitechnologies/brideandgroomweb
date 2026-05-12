import { useState, useEffect } from "react";
import UserLayout from "@/components/layout/UserLayout";
import {
  MessageSquare,
  Send,
  HelpCircle,
  Lightbulb,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Clock,
  History,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import api from "@/services/api";
import { format } from "date-fns";

const FeedbackPage = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<"submit" | "history">("submit");
  const [history, setHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "issue",
    subject: "",
    message: "",
  });

  const fetchHistory = async () => {
    try {
      setHistoryLoading(true);
      const response = await api.get("/feedback/my");
      setHistory(response.data);
    } catch (error) {
      console.error("Fetch history error:", error);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "history") {
      fetchHistory();
    }
  }, [activeTab]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject || !formData.message) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await api.post("/feedback", formData);
      setSubmitted(true);
      toast.success("Thank you for your feedback!");
      setFormData({ type: "issue", subject: "", message: "" });
      fetchHistory();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  };

  const types = [
    {
      id: "issue",
      label: "Report an Issue",
      icon: AlertCircle,
      color: "text-red-500",
      bg: "bg-red-50",
    },
    {
      id: "suggestion",
      label: "Suggestion",
      icon: Lightbulb,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
    {
      id: "other",
      label: "General Feedback",
      icon: HelpCircle,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-green-50 text-green-600 border-green-100";
      case "reviewed":
        return "bg-blue-50 text-blue-600 border-blue-100";
      default:
        return "bg-amber-50 text-amber-600 border-amber-100";
    }
  };

  return (
    <UserLayout className="max-w-none pt-5">
      <div className="max-w-full pt-0 pb-16 px-4 sm:px-8 lg:px-12 mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-100 pb-8">
          <div className="space-y-1">
            <h1 className="text-2xl font-medium text-foreground tracking-tight">
              Feedback & <span className="text-primary italic">Support</span>
            </h1>
            <p className="text-sm text-black font-medium max-w-2xl">
              Spotted a bug? Have a brilliant idea? We're all ears. Your input
              shapes the future of Bride&Groom.
            </p>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-2xl">
            <button
              onClick={() => {
                setActiveTab("submit");
                setSubmitted(false);
              }}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-medium  tracking-widest transition-all ${activeTab === "submit"
                ? "bg-white text-primary shadow-sm"
                : "text-black hover:text-foreground"
                }`}
            >
              <Send size={14} />
              Submit
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-medium  tracking-widest transition-all ${activeTab === "history"
                ? "bg-white text-primary shadow-sm"
                : "text-black hover:text-foreground"
                }`}
            >
              <History size={14} />
              History
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "submit" ? (
            <motion.div
              key="submit-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-7xl mx-auto w-full"
            >
              {submitted ? (
                <div className="max-w-xl mx-auto text-center space-y-8 bg-white p-12 rounded-[3.5rem] shadow-soft border border-border">
                  <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500">
                    <CheckCircle2 size={48} />
                  </div>
                  <div className="space-y-3">
                    <h2 className="text-3xl font-medium text-foreground  tracking-tight">
                      Feedback Received
                    </h2>
                    <p className="text-black font-medium leading-relaxed">
                      Your feedback helps us build a better experience for
                      everyone. Our team will review your submission shortly.
                    </p>
                  </div>
                  <Button
                    onClick={() => setSubmitted(false)}
                    className="rounded-2xl px-10 h-14 bg-primary hover:bg-primary/90 text-white font-medium  tracking-widest text-xs shadow-xl shadow-primary/20"
                  >
                    Send Another
                  </Button>
                </div>
              ) : (
                <div className="bg-white rounded-[3rem] p-8 md:p-14 shadow-soft border border-border relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-12 text-primary/5 pointer-events-none rotate-12">
                    <MessageSquare size={240} />
                  </div>

                  <form
                    onSubmit={handleSubmit}
                    className="relative z-10 grid lg:grid-cols-2 gap-16"
                  >
                    <div className="space-y-10">
                      <div className="space-y-6">
                        <label className="text-[10px] font-medium  tracking-[0.2em] text-black">
                          Select Category
                        </label>
                        <div className="grid gap-4">
                          {types.map((t) => (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() =>
                                setFormData({ ...formData, type: t.id })
                              }
                              className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left ${formData.type === t.id
                                ? "border-primary bg-primary/5 shadow-md"
                                : "border-slate-50 hover:border-slate-200 bg-slate-50/50"
                                }`}
                            >
                              <div
                                className={`w-12 h-12 rounded-xl ${t.bg} flex items-center justify-center ${t.color}`}
                              >
                                <t.icon size={24} />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-foreground text-sm">
                                  {t.label}
                                </h4>
                                <p className="text-[10px] font-medium text-black  tracking-widest">
                                  {t.id === "issue"
                                    ? "Bug reports & errors"
                                    : t.id === "suggestion"
                                      ? "New features & UX"
                                      : "General inquiries"}
                                </p>
                              </div>
                              {formData.type === t.id && (
                                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white">
                                  <CheckCircle2 size={12} />
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-10">
                      <div className="space-y-8">
                        <div className="space-y-3">
                          <label className="text-[10px] font-medium  tracking-[0.2em] text-black">
                            Subject Line
                          </label>
                          <input
                            type="text"
                            value={formData.subject}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                subject: e.target.value,
                              })
                            }
                            placeholder="E.G. Trouble uploading photos"
                            className="w-full h-14 bg-slate-50 border border-border rounded-xl px-6 font-medium text-black outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                          />
                        </div>

                        <div className="space-y-3">
                          <label className="text-[10px] font-medium  tracking-[0.2em] text-black">
                            Detailed Message
                          </label>
                          <textarea
                            value={formData.message}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                message: e.target.value,
                              })
                            }
                            rows={6}
                            placeholder="Tell us more about your experience..."
                            className="w-full bg-slate-50 border border-border rounded-2xl p-6 font-medium text-black outline-none focus:ring-4 focus:ring-primary/10 transition-all resize-none"
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 text-white font-medium  tracking-[0.2em] text-xs shadow-xl shadow-primary/20 group transition-all"
                      >
                        {loading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <div className="flex items-center justify-center gap-3">
                            Submit Feedback
                            <Send
                              size={18}
                              className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                            />
                          </div>
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="history-list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {historyLoading ? (
                <div className="py-20 flex flex-col items-center justify-center space-y-4">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  <p className="text-black font-medium  tracking-widest text-[10px]">
                    Loading your history...
                  </p>
                </div>
              ) : history.length === 0 ? (
                <div className="bg-white rounded-[3rem] p-20 border border-border text-center space-y-4">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-black mx-auto">
                    <History size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-black">
                      No feedback yet
                    </h3>
                    <p className="text-black max-w-xs mx-auto">
                      Your submitted feedback and their responses will appear
                      here.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid gap-6">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-[2.5rem] p-8 border border-border shadow-soft flex flex-col md:flex-row gap-8 items-start hover:shadow-md transition-all group"
                    >
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${item.type === "issue"
                          ? "bg-red-50 text-red-500"
                          : item.type === "suggestion"
                            ? "bg-amber-50 text-amber-500"
                            : "bg-blue-50 text-blue-500"
                          }`}
                      >
                        {item.type === "issue" ? (
                          <AlertCircle size={24} />
                        ) : item.type === "suggestion" ? (
                          <Lightbulb size={24} />
                        ) : (
                          <HelpCircle size={24} />
                        )}
                      </div>

                      <div className="flex-1 space-y-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-3 py-1 rounded-full text-[10px] font-medium  tracking-widest border ${getStatusStyle(item.status)}`}
                              >
                                {item.status}
                              </span>
                              <span className="text-[10px] font-medium text-black  tracking-widest flex items-center gap-1.5">
                                <Clock size={12} />
                                {format(
                                  new Date(item.createdAt),
                                  "MMM d, yyyy",
                                )}
                              </span>
                            </div>
                            <h3 className="text-lg font-medium text-foreground">
                              {item.subject}
                            </h3>
                          </div>
                          <ChevronRight
                            size={20}
                            className="text-slate-200 group-hover:text-primary group-hover:translate-x-1 transition-all"
                          />
                        </div>

                        <p className="text-sm font-medium text-black leading-relaxed bg-slate-50/50 p-4 rounded-2xl border border-slate-50">
                          {item.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </UserLayout>
  );
};

export default FeedbackPage;





