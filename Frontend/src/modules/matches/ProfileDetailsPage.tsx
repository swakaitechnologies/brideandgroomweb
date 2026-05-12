"use client";
import { Image } from "@/components/common/Image";
import { useNavigate, useParams } from "react-router-dom";

import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { fetchProfileById } from "@/store/profileSlice";
import { toggleShortlist, addToRecentlyViewed } from "@/store/matchesSlice";
import {
  sendInterest,
  sendContactRequest,
  fetchInterests,
  fetchContactRequests,
} from "@/store/interactionSlice";
import type { RootState, AppDispatch } from "@/store";
import UserLayout from "@/components/layout/UserLayout";
import FullProfileDetailedView from "@/components/profile/FullProfileDetailedView";
import { motion, AnimatePresence } from "framer-motion";
import { calculateAge, getCompatibilityScore } from "@/utils/matchUtils";

import {
  Heart,
  ShieldCheck,
  Smartphone,
  Mail,
  User,
  CheckCircle2,
  Flag,
  Upload,
  X,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import api from "@/services/api";
import { Button } from "@/components/ui/button";
import type { AxiosError } from "axios";


const ProfileDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { selectedProfile: profile, loading } = useSelector(
    (state: RootState) => state.profile,
  );
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [reportImage, setReportImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isReporting, setIsReporting] = useState(false);

  const handleReportSubmit = async () => {
    if (!reportReason) {
      toast.error("Please select a reason for reporting");
      return;
    }

    try {
      setIsReporting(true);
      const formData = new FormData();
      formData.append("reportedId", id || "");
      formData.append("reportedType", "user");
      formData.append("reason", reportReason);
      formData.append("description", reportDescription);
      if (reportImage) {
        formData.append("image", reportImage);
      }

      await api.post("/reports", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Report submitted successfully. We will review it.");
      setShowReportDialog(false);
      setReportReason("");
      setReportDescription("");
      setReportImage(null);
      setImagePreview(null);
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      toast.error(error.response?.data?.message || "Failed to submit report");
    } finally {
      setIsReporting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setReportImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchProfileById(id));
      dispatch(fetchInterests("sent"));
      dispatch(fetchInterests("received"));
      dispatch(fetchContactRequests("sent"));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (profile && id) {
      // Map ProfileData to MatchData for Recently Viewed
      const matchData = {
        id: id || "",
        name: `${profile.firstName || ""} ${profile.lastName || ""}`.trim(),
        age: calculateAge(profile.dob),
        height: profile.height || "",
        profession: profile.profession || "",
        location: `${profile.city || ""}, ${profile.state || ""}`.replace(
          /^, |, $/,
          "",
        ),
        religion: profile.religion || "",
        education: profile.highestDegree || "",
        image:
          profile.photos && profile.photos.length > 0
            ? profile.photos.find((p: { isMain: boolean; url: string }) => p.isMain)?.url ||
              profile.photos[0].url
            : "",
        compatibility: getCompatibilityScore(id || ""),
        online: profile.user?.isOnline ?? false,
        customId: profile.customId || "",
        photosLocked: profile.photosLocked,
        // Raw values for filtering
        rawReligion: profile.religion,
        rawMotherTongue: profile.motherTongue,
        rawProfession: profile.profession,
        rawState: profile.state,
        rawCity: profile.city,
        rawDiet: profile.diet,
        rawEducation: profile.highestDegree,
        rawIncome: profile.income,
        rawHeight: profile.height,
        maritalStatus: profile.maritalStatus || "Never Married",
        motherTongue: profile.motherTongue || "Marathi",
        bio: profile.bio,
        lastSeen: profile.user?.lastSeen ? new Date(profile.user.lastSeen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Recently",
        hasAstro: !!profile.zodiacSign || !!profile.horoscopeDob,
        zodiacSign: profile.zodiacSign,
        caste: profile.caste
      };
      dispatch(addToRecentlyViewed(matchData));
    }
  }, [profile, id, dispatch]);

  if (loading) {
    return (
      <UserLayout>
        <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-4">
          <div className="relative">
            <Loader2 className="w-16 h-16 text-primary animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Heart size={20} className="text-primary animate-pulse" />
            </div>
          </div>
          <p className="font-medium text-primary  tracking-[0.3em] text-xs">
            Finding matches...
          </p>
        </div>
      </UserLayout>
    );
  }

  if (!profile) {
    return (
      <UserLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
            <User size={48} className="text-black" />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-medium tracking-tighter">
              Profile not found
            </h2>
            <p className="text-black">
              The profile you are looking for might have been moved or deleted.
            </p>
          </div>
          <Button
            variant="hero"
            onClick={() => navigate(-1)}
            className="rounded-2xl px-12"
          >
            Go Back
          </Button>
        </div>
      </UserLayout>
    );
  }


  return (
    <UserLayout>
      <FullProfileDetailedView 
        profile={profile} 
        onReport={() => setShowReportDialog(true)}
      />

        {/* Report Dialog */}
        <AnimatePresence>
          {showReportDialog && (
            <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowReportDialog(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-border"
              >
                <div className="p-8 md:p-10 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center text-red-600">
                      <Flag size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-foreground">
                        Report User
                      </h3>
                      <p className="text-sm text-black">
                        Help us keep the community safe
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium  tracking-widest text-black">
                        Reason
                      </label>
                      <select
                        value={reportReason}
                        onChange={(e) => setReportReason(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none appearance-none"
                      >
                        <option value="">Select a reason</option>
                        <option value="Inappropriate Profile Picture">
                          Inappropriate Profile Picture
                        </option>
                        <option value="Fake Profile">Fake Profile</option>
                        <option value="Harassment or Abuse">
                          Harassment or Abuse
                        </option>
                        <option value="Spam or Scam">Spam or Scam</option>
                        <option value="Contact Information in Profile">
                          Contact Information in Profile
                        </option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-medium  tracking-widest text-black">
                        Proof (Optional)
                      </label>
                      {imagePreview ? (
                        <div className="relative w-full h-40 rounded-2xl overflow-hidden border border-slate-200">
                          <Image
                            src={imagePreview}
                            alt="Preview"
                            fill
                            className="object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setReportImage(null);
                              setImagePreview(null);
                            }}
                            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-sm hover:bg-black/70 transition-colors z-10"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center w-full h-32 bg-slate-50 border-2 border-dashed border-slate-200 rounded-4xl cursor-pointer hover:bg-slate-100/50 hover:border-primary/20 transition-all group">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload
                              size={24}
                              className="text-black group-hover:text-primary transition-colors mb-2"
                            />
                            <p className="text-xs font-medium text-black">
                              Click to upload screenshot
                            </p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </label>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-medium  tracking-widest text-black">
                        Additional Details / Message
                      </label>
                      <textarea
                        value={reportDescription}
                        onChange={(e) => setReportDescription(e.target.value)}
                        rows={3}
                        placeholder="Please describe the issue in detail..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowReportDialog(false)}
                      className="flex-1 rounded-[1.25rem] h-14 font-medium  tracking-widest text-xs"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="hero"
                      disabled={isReporting}
                      onClick={handleReportSubmit}
                      className="flex-1 rounded-[1.25rem] h-14 font-medium  tracking-widest text-xs bg-red-600 hover:bg-red-700 shadow-red-200"
                    >
                      {isReporting ? "Submitting..." : "Submit Report"}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
    </UserLayout>
  );
};

export default ProfileDetailsPage;
