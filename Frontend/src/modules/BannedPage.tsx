import { ShieldAlert, LogOut, Mail, MessageCircle } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";

const BannedPage = () => {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-[2rem] shadow-2xl border border-red-100 overflow-hidden animate-in fade-in zoom-in duration-500">
        <div className="bg-red-600 p-8 flex justify-center">
          <div className="bg-white/20 p-4 rounded-full backdrop-blur-md">
            <ShieldAlert className="w-16 h-16 text-white" />
          </div>
        </div>

        <div className="p-8 text-center">
          <h1 className="text-3xl font-medium text-black mb-2 tracking-tight">
            Account Suspended
          </h1>
          <p className="text-black mb-8 leading-relaxed">
            Dear{" "}
            <span className="font-medium text-black">{user?.firstName}</span>,
            your account has been suspended due to a violation of our community
            guidelines or terms of service.
          </p>

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left">
              <div className="bg-white p-2 rounded-lg shadow-sm">
                <Mail className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-xs font-medium text-black  tracking-wider">
                  Contact Support
                </p>
                <p className="text-sm font-medium text-black">
                  info@swakai.in
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left">
              <div className="bg-white p-2 rounded-lg shadow-sm">
                <MessageCircle className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs font-medium text-black  tracking-wider">
                  Appeal Status
                </p>
                <p className="text-sm font-medium text-black">
                  Under Review
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-slate-200"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>

          <p className="mt-6 text-xs text-black">
            If you believe this is a mistake, please contact our administrative
            team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BannedPage;





