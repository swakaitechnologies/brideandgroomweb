import { useNavigate } from "react-router-dom";
import UserLayout from "@/components/layout/UserLayout";
import {
  Shield,
  Eye,
  Camera,
  UserX,
  Lock,
  Info,
  Save,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store";
import {
  fetchPrivacySettings,
  updatePrivacySettings,
} from "@/store/privacySlice";
import type { PrivacySettings } from "@/store/privacySlice";
import { toast } from "sonner";
import api from "@/services/api";
import { useAuthStore } from "@/store/authStore";

const PrivacySettingsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: reduxData, loading } = useSelector(
    (state: RootState) => state.privacy,
  );

  const [activeTab, setActiveTab] = useState("visibility");
  const [formData, setFormData] = useState<PrivacySettings>({
    profileVisibility: "Everyone",
    photoVisibility: "All",
    photoLock: false,
    phoneVisibility: "Matches",
    emailVisibility: "Hidden",
    twoFactorEnabled: false,
    isDeactivated: false,
  });

  const [blockedUsers, setBlockedUsers] = useState<any[]>([]);
  const [loadingBlocked, setLoadingBlocked] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    dispatch(fetchPrivacySettings());
  }, [dispatch]);

  useEffect(() => {
    if (reduxData) {
      setFormData(reduxData);
    }
  }, [reduxData]);

  const fetchBlockedUsers = async () => {
    setLoadingBlocked(true);
    try {
      const response = await api.get("/block/list");
      setBlockedUsers(response.data.data);
    } catch (error: any) {
      toast.error("Failed to fetch blocked users");
    } finally {
      setLoadingBlocked(false);
    }
  };

  useEffect(() => {
    if (activeTab === "blocked") {
      fetchBlockedUsers();
    }
  }, [activeTab]);

  const handleUnblock = async (blockedId: string) => {
    try {
      await api.post("/block/unblock", { blockedId });
      toast.success("User unblocked successfully");
      fetchBlockedUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to unblock user");
    }
  };

  const handleSave = () => {
    dispatch(updatePrivacySettings(formData))
      .unwrap()
      .then(() => {
        toast.success("Privacy settings updated successfully!");
      })
      .catch((err) => {
        toast.error("Failed to update settings: " + err);
      });
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      toast.error("Please enter your password to confirm");
      return;
    }
    setIsDeleting(true);
    try {
      await api.delete("/profile", {
        data: { password: deletePassword },
      });
      toast.success("Account deleted successfully. We're sorry to see you go.");
      logout();
      navigate("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete account");
      setIsDeleting(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsChangingPassword(true);
    try {
      await api.post("/auth/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success("Password updated successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const updateField = (field: keyof PrivacySettings, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const tabs = [
    { id: "visibility", label: "Profile Visibility", icon: <Eye size={16} /> },
    { id: "media", label: "Photos & Media", icon: <Camera size={16} /> },
    { id: "blocked", label: "Blocked Profiles", icon: <UserX size={16} /> },
    { id: "security", label: "Security & Access", icon: <Lock size={16} /> },
  ];

  return (
    <UserLayout className="max-w-none pt-5">
      <div className="max-w-full pt-0 pb-8 px-4 sm:px-8 lg:px-12 mx-auto">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b pb-6">
          <div>
            <h1 className="text-2xl font-medium text-foreground mb-2 flex items-center gap-2">
              <Shield className="text-green-500" size={24} />
              Privacy Settings
            </h1>
            <p className="text-black">
              Control who can see your profile and how they interact with you.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              className="rounded-xl px-6 py-2 h-auto text-sm font-medium shadow-sm"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {loading ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Navigation Sidebar */}
          <aside className="w-full lg:w-72 lg:sticky lg:top-24 space-y-6">
            <div className="bg-white border border-border rounded-2xl p-2 space-y-1">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all group ${isActive
                        ? "bg-primary text-white shadow-md shadow-primary/10"
                        : "text-black hover:bg-muted hover:text-foreground"
                      }`}
                  >
                    <span
                      className={`transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-105"}`}
                    >
                      {tab.icon}
                    </span>
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 space-y-4 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl group-hover:bg-primary/10 transition-colors" />
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm">
                <Lock size={20} />
              </div>
              <div>
                <h3 className="text-base font-medium text-foreground mb-1">
                  Incognito Mode
                </h3>
                <p className="text-sm text-black leading-relaxed">
                  Upgrade to browse profiles without them knowing. Go 100%
                  private.
                </p>
              </div>
              <Button
                variant="outline"
                className="w-full rounded-xl text-xs font-medium h-10 border-primary/20 text-primary hover:bg-primary hover:text-white transition-all"
              >
                Upgrade Now
              </Button>
            </div>
          </aside>

          {/* Main Content Form Card */}
          <div className="flex-1 w-full space-y-8">
            <div className="bg-white border border-border rounded-2xl shadow-sm min-h-[400px] overflow-hidden">
              <div className="p-6 md:p-8 bg-muted/5 border-b border-border flex items-center gap-3">
                <span className="text-primary">
                  {tabs.find((t) => t.id === activeTab)?.icon}
                </span>
                <h2 className="text-lg font-medium text-foreground">
                  {tabs.find((t) => t.id === activeTab)?.label}
                </h2>
              </div>

              <div className="p-6 md:p-10">
                {/* Profile Visibility */}
                {activeTab === "visibility" && (
                  <div className="space-y-8 animate-fade-in text-left">
                    <div className="grid gap-6">
                      {[
                        {
                          id: "Everyone",
                          label: "Visible to Everyone",
                          desc: "Any user, even those not signed in, can find your profile",
                        },
                        {
                          id: "Members",
                          label: "Registered Members Only",
                          desc: "Only people with a verified account can see your full details",
                        },
                        {
                          id: "Interacted",
                          label: "Only People I Interact With",
                          desc: "Hide from search. Only people you send interests to can see you",
                        },
                      ].map((item) => (
                        <div
                          key={item.id}
                          onClick={() =>
                            updateField("profileVisibility", item.id)
                          }
                          className={`flex items-start justify-between p-6 rounded-2xl border transition-all cursor-pointer group shadow-sm ${formData.profileVisibility === item.id ? "bg-primary/5 border-primary" : "bg-white border-border hover:border-primary/20"}`}
                        >
                          <div className="space-y-1">
                            <h4
                              className={`font-medium transition-colors ${formData.profileVisibility === item.id ? "text-primary" : "text-foreground group-hover:text-primary"}`}
                            >
                              {item.label}
                            </h4>
                            <p className="text-[13px] text-black font-medium pr-8">
                              {item.desc}
                            </p>
                          </div>
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 shrink-0 ${formData.profileVisibility === item.id ? "border-primary" : "border-muted-foreground/30"}`}
                          >
                            {formData.profileVisibility === item.id && (
                              <div className="w-2.5 h-2.5 bg-primary rounded-full" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 p-6 bg-muted/20 rounded-2xl border border-border/60">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm border border-border">
                        <Info className="text-primary" size={18} />
                      </div>
                      <p className="text-sm text-foreground font-medium leading-relaxed">
                        Making your profile public increases interest rates by
                        400%. We use secure hashing to protect your most
                        sensitive data.
                      </p>
                    </div>
                  </div>
                )}

                {/* Photos & Media */}
                {activeTab === "media" && (
                  <div className="space-y-10 animate-fade-in text-left">
                    <div className="p-8 bg-muted/10 rounded-2xl border border-border flex flex-col md:flex-row items-center gap-8 shadow-sm">
                      <div className="w-28 h-28 rounded-2xl overflow-hidden relative group shrink-0 shadow-md">
                        <img
                          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop"
                          alt="demo"
                          className="w-full h-full object-cover blur-md"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <Lock className="text-white" size={28} />
                        </div>
                      </div>
                      <div className="flex-1 space-y-4 text-center md:text-left">
                        <div className="space-y-1">
                          <h3 className="text-lg font-medium text-foreground">
                            Password Protected Photos
                          </h3>
                          <p className="text-black text-sm font-medium">
                            Only show clear photos to members who have your
                            permission
                          </p>
                        </div>
                        <Button
                          onClick={() =>
                            updateField("photoLock", !formData.photoLock)
                          }
                          variant={formData.photoLock ? "default" : "outline"}
                          className="rounded-xl px-6 font-medium shadow-sm"
                        >
                          {formData.photoLock
                            ? "Disable Photo Lock"
                            : "Enable Photo Lock"}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-base font-medium text-foreground flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-primary rounded-full" />
                        Show my photos to:
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {[
                          { label: "All Members", value: "All" },
                          { label: "Verified Members Only", value: "Verified" },
                          {
                            label: "Only Selected Profiles",
                            value: "Selected",
                          },
                          { label: "Don't Show Anyone", value: "None" },
                        ].map((option) => (
                          <div
                            key={option.value}
                            onClick={() =>
                              updateField("photoVisibility", option.value)
                            }
                            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer shadow-sm ${formData.photoVisibility === option.value ? "border-primary bg-primary/5" : "border-border bg-white hover:border-primary/20"}`}
                          >
                            <p
                              className={`font-medium text-sm ${formData.photoVisibility === option.value ? "text-primary" : "text-foreground"}`}
                            >
                              {option.label}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Blocked Profiles */}
                {activeTab === "blocked" && (
                  <div className="space-y-8 animate-fade-in text-left">
                    <div className="grid gap-4">
                      {loadingBlocked ? (
                        <div className="p-12 text-center bg-muted/5 border border-dashed border-border rounded-2xl">
                          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                          <p className="text-xs font-medium text-black  tracking-widest">
                            Loading blocked profiles...
                          </p>
                        </div>
                      ) : blockedUsers.length > 0 ? (
                        blockedUsers.map((user) => (
                          <div
                            key={user.userId}
                            className="flex items-center justify-between p-5 bg-white rounded-2xl border border-border shadow-sm hover:border-primary/20 transition-all group"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-muted overflow-hidden flex-shrink-0 border border-border">
                                <img
                                  src={
                                    user.profile?.photos?.find(
                                      (p: any) => p.isMain,
                                    )?.url ||
                                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.userId}`
                                  }
                                  alt="blocked"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <h4 className="font-medium text-foreground">
                                  {user.profile?.firstName
                                    ? `${user.profile.firstName} ${user.profile.lastName || ""}`
                                    : `User ${user.userId.slice(0, 8)}`}
                                </h4>
                                <p className="text-[10px] text-black font-medium  tracking-widest">
                                  Blocked on{" "}
                                  {new Date(user.blockedAt).toLocaleDateString(
                                    [],
                                    {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    },
                                  )}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              onClick={() => handleUnblock(user.userId)}
                              className="rounded-xl px-5 border-border text-xs font-medium hover:text-red-500 hover:border-red-200 transition-all"
                            >
                              Unblock
                            </Button>
                          </div>
                        ))
                      ) : (
                        <div className="py-20 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-center space-y-4 bg-muted/5">
                          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-black shadow-sm border border-border">
                            <UserX size={32} className="text-primary" />
                          </div>
                          <div>
                            <p className="text-foreground font-medium text-lg">
                              No blocked members
                            </p>
                            <p className="text-xs text-black font-medium max-w-xs mx-auto">
                              Blocking prevents communication and profile
                              viewing from specific individuals.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Security & Access */}
                {activeTab === "security" && (
                  <div className="space-y-8 animate-fade-in text-left">
                    <div className="grid gap-6">
                      <div className="p-6 bg-white rounded-2xl border border-border shadow-sm space-y-4">
                        <h4 className="font-medium text-foreground">
                          Two-Factor Authentication
                        </h4>
                        <p className="text-[13px] text-black font-medium lg:max-w-2xl">
                          Protect your account by requiring an additional
                          verification code when you sign in from a new device.
                        </p>
                        <Button
                          variant={
                            formData.twoFactorEnabled ? "default" : "outline"
                          }
                          onClick={() =>
                            updateField(
                              "twoFactorEnabled",
                              !formData.twoFactorEnabled,
                            )
                          }
                          className="rounded-xl px-6 border-border font-medium transition-all h-10 text-sm"
                        >
                          {formData.twoFactorEnabled
                            ? "Disable 2FA"
                            : "Setup 2FA"}
                        </Button>
                      </div>

                      <div className="p-6 bg-white rounded-2xl border border-border shadow-sm space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                            <Lock size={16} />
                          </div>
                          <h4 className="font-medium text-foreground">
                            Update Password
                          </h4>
                        </div>

                        <form onSubmit={handleChangePassword} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-medium text-black  tracking-wider">Current Password</label>
                            <input
                              type="password"
                              required
                              className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-sm focus:border-primary focus:bg-white outline-none transition-all"
                              value={passwordData.currentPassword}
                              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-medium text-black  tracking-wider">New Password</label>
                            <input
                              type="password"
                              required
                              className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-sm focus:border-primary focus:bg-white outline-none transition-all"
                              value={passwordData.newPassword}
                              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-medium text-black  tracking-wider">Confirm New Password</label>
                            <div className="flex gap-3">
                              <input
                                type="password"
                                required
                                className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-sm focus:border-primary focus:bg-white outline-none transition-all"
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                              />
                              <Button
                                type="submit"
                                disabled={isChangingPassword}
                                className="shrink-0 rounded-xl px-6 font-medium shadow-sm transition-all"
                              >
                                {isChangingPassword ? "..." : "Update"}
                              </Button>
                            </div>
                          </div>
                        </form>
                      </div>

                      <div className="p-6 bg-white rounded-2xl border border-border shadow-sm space-y-4 border-l-4 border-l-yellow-500">
                        <div className="flex items-center justify-between gap-4">
                          <div className="space-y-1">
                            <h4 className="font-medium text-foreground">
                              Deactivate Account
                            </h4>
                            <p className="text-[13px] text-black font-medium">
                              Temporarily hide your profile from everyone. You
                              can return anytime.
                            </p>
                          </div>
                          <Button
                            onClick={() =>
                              updateField(
                                "isDeactivated",
                                !formData.isDeactivated,
                              )
                            }
                            className={`${formData.isDeactivated ? "bg-primary text-white" : "bg-white border border-border text-foreground hover:bg-muted"} rounded-xl px-6 font-medium h-10 text-sm transition-all`}
                          >
                            {formData.isDeactivated
                              ? "Reactivate"
                              : "Deactivate"}
                          </Button>
                        </div>
                      </div>

                      <div className="p-6 bg-white rounded-2xl border border-border shadow-sm border-l-4 border-l-red-500">
                        <div className="flex items-center justify-between gap-4">
                          <div className="space-y-1">
                            <h4 className="font-medium text-foreground italic flex items-center gap-2">
                              Delete Account Forever
                              <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded  font-medium not-italic tracking-wider">
                                Permanent
                              </span>
                            </h4>
                            <p className="text-[13px] text-black font-medium">
                              This action cannot be undone. All matches,
                              messages, and photos will be wiped.
                            </p>
                          </div>
                          <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shrink-0"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions Footer */}
            <div className="flex flex-col md:flex-row items-center justify-between p-8 bg-muted border border-border rounded-2xl text-foreground space-y-4 md:space-y-0 shadow-sm">
              <div className="space-y-1 text-center md:text-left">
                <h4 className="text-lg font-medium">All set?</h4>
                <p className="text-black text-sm font-medium">
                  Your privacy is our top priority. Update your settings
                  anytime.
                </p>
              </div>
              <Button
                onClick={handleSave}
                disabled={loading}
                className="bg-primary text-white hover:bg-primary-hover transition-all px-8 py-3 rounded-xl font-medium h-auto shadow-md"
              >
                {loading ? "Saving..." : "Save All Changes"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => !isDeleting && setShowDeleteConfirm(false)}
          />
          <div className="relative bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-red-100 animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mb-6 mx-auto">
              <Trash2 size={32} />
            </div>
            <h3 className="text-2xl font-medium text-foreground text-center mb-2">
              Delete Account?
            </h3>
            <p className="text-black text-center mb-8 font-medium">
              This action is{" "}
              <span className="text-red-600 font-medium ">
                permanent
              </span>{" "}
              and cannot be undone. You will lose all your matches, messages,
              and profile data forever.
            </p>

            <div className="space-y-4 mb-8 text-left">
              <div className="space-y-1">
                <label className="text-[10px] font-medium  tracking-widest text-black ml-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                className="flex-1 rounded-xl h-12 font-medium"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeletePassword("");
                }}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 rounded-xl h-12 font-medium bg-red-500 hover:bg-red-600 shadow-lg shadow-red-200"
                onClick={handleDeleteAccount}
                disabled={isDeleting || !deletePassword}
              >
                {isDeleting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Delete Permanently"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </UserLayout>
  );
};

export default PrivacySettingsPage;





