import { Image } from "@/components/common/Image";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";

const Navbar = () => {
  const { user } = useAuthStore();

  return (
    <div className="fixed top-2 right-2 md:top-4 md:right-6 z-50 left-2 md:left-auto">
      <div className="bg-white/95 backdrop-blur-md border border-primary/10 rounded-full flex items-center gap-2 md:gap-4 px-2 py-1 md:px-4 md:py-2 shadow-xl">
        {/* Logo Section */}
        <Link to="/" className="flex items-center group mr-auto">
          <div className="relative h-10 w-28 md:h-12 md:w-40">
            <Image 
              src="/Logo.png" 
              alt="Bride&Groom" 
              fill
              priority
              className="object-contain transition-transform group-hover:scale-105" 
            />
          </div>
        </Link>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-1 md:gap-3">
          {!user ? (
            <>
              <Link to="/login">
                <Button
                  variant="ghost"
                  className="text-black hover:text-primary hover:bg-primary/5 font-bold px-3 md:px-4 h-8 md:h-9 rounded-full transition-all duration-300 text-[10px] md:text-xs"
                >
                  LOGIN
                </Button>
              </Link>
              <Link to="/register">
                <Button
                  className="bg-primary hover:bg-primary/90 text-secondary rounded-full px-4 py-2 md:px-5 md:py-2.5 h-8 md:h-10 font-bold tracking-widest shadow-md hover:shadow-lg transition-all duration-500 active:scale-95 text-[10px] md:text-xs"
                >
                  JOIN FREE
                </Button>
              </Link>
            </>
          ) : (
            <Link to="/dashboard">
              <Button
                className="bg-primary hover:bg-primary/90 text-secondary rounded-full px-5 py-2 md:px-6 md:py-2.5 h-8 md:h-10 font-bold tracking-widest shadow-md hover:shadow-lg transition-all duration-500 active:scale-95 flex items-center gap-2 text-[10px] md:text-xs"
              >
                <LayoutDashboard size={14} className="hidden md:block" />
                DASHBOARD
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;

