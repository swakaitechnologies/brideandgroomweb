import { Outlet } from "react-router-dom";
import Navbar from "../landing/Navbar";
import Footer from "../navigation/Footer";
import CookieConsent from "../navigation/CookieConsent";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>
      <Footer />
      <CookieConsent />
    </div>
  );
};

export default AuthLayout;





