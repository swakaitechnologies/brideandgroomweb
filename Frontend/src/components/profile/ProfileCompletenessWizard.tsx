import { useMemo } from "react";
import { 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  User,
  Image as ImageIcon,
  FileText,
  MapPin,
  Briefcase
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";


interface Step {
  id: string;
  label: string;
  description: string;
  path: string;
  icon: LucideIcon;
  isCompleted: boolean;
}

interface ProfileCompletenessWizardProps {
  profile: {
    bio?: string;
    photos?: { url: string }[];
    city?: string;
    state?: string;
    profession?: string;
    industry?: string;
    lookingFor?: string;
  } | null;
}

const ProfileCompletenessWizard = ({ profile }: ProfileCompletenessWizardProps) => {
  const steps: Step[] = useMemo(() => {
    if (!profile) return [];

    return [
      {
        id: "bio",
        label: "Beautiful Bio",
        description: "Write something about yourself to attract more matches.",
        path: "/profile/edit",
        icon: FileText,
        isCompleted: !!(profile.bio && profile.bio.length > 20)
      },
      {
        id: "photos",
        label: "Profile Photos",
        description: "Profiles with photos get 10x more attention.",
        path: "/profile/photos",
        icon: ImageIcon,
        isCompleted: !!(profile.photos && profile.photos.length > 0)
      },
      {
        id: "location",
        label: "Current Location",
        description: "Help matches find you in their city.",
        path: "/profile/edit",
        icon: MapPin,
        isCompleted: !!(profile.city && profile.state)
      },
      {
        id: "profession",
        label: "Career Details",
        description: "Add your profession and industry.",
        path: "/profile/edit",
        icon: Briefcase,
        isCompleted: !!(profile.profession && profile.industry)
      },
      {
        id: "preferences",
        label: "Partner Preferences",
        description: "Tell us what you're looking for in a partner.",
        path: "/profile/preferences",
        icon: User,
        isCompleted: !!profile.lookingFor
      }
    ];
  }, [profile]);

  const currentStepIndex = useMemo(() => {
    if (steps.length === 0) return -1;
    const firstIncomplete = steps.findIndex(s => !s.isCompleted);
    return firstIncomplete; // returns -1 if all are completed
  }, [steps]);


  if (currentStepIndex === -1 && steps.length > 0) {
    return (
       <div className="bg-linear-to-r from-green-50 to-emerald-50 p-8 rounded-4xl border border-green-100 flex items-center justify-between shadow-sm">

          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-green-500 flex items-center justify-center text-white shadow-lg shadow-green-200">
                <CheckCircle2 size={24} />
             </div>
             <div>
                <h3 className="text-xl font-medium text-black leading-none mb-1">Your Profile is Perfect!</h3>
                <p className="text-black text-xs font-medium  tracking-widest">You've completed all essential steps.</p>
             </div>
          </div>
          <Link to="/matches">
            <Button className="rounded-2xl h-12 px-6 bg-slate-900 hover:bg-slate-800 font-medium text-xs  tracking-widest gap-2">
                Browse Matches <ArrowRight size={16} />
            </Button>
          </Link>
       </div>
    );
  }

  const currentStep = steps[currentStepIndex];
  if (!currentStep) return null;

  const completionPercentage = Math.round((steps.filter(s => s.isCompleted).length / steps.length) * 100);

  return (
    <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-8 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-full blur-3xl opacity-50" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 shadow-sm">
               <currentStep.icon size={24} />
            </div>
            <div>
               <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-medium  tracking-widest text-rose-500 bg-rose-50 px-2 py-0.5 rounded-md">Next Step</span>
                  <h3 className="text-xl font-medium text-black leading-none">{currentStep.label}</h3>
               </div>
               <p className="text-black text-sm font-medium">{currentStep.description}</p>
            </div>
         </div>

         <div className="flex items-center gap-4 min-w-[200px]">
             <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                   <span className="text-[9px] font-medium  tracking-widest text-black">Profile Strength</span>
                   <span className="text-[10px] font-medium text-black">{completionPercentage}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                   <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${completionPercentage}%` }}
                    className="h-full bg-rose-500 rounded-full"
                   />
                </div>
             </div>
             <Link to={currentStep.path}>
                <Button className="rounded-2xl h-12 px-6 bg-rose-600 hover:bg-rose-700 font-medium  tracking-widest text-[10px] shadow-lg shadow-rose-200">
                    Fix Now
                </Button>
             </Link>
         </div>
      </div>

      <div className="grid grid-cols-5 gap-2 pt-2 border-t border-slate-50">
         {steps.map((step, i) => (
            <div key={step.id} className="flex flex-col items-center gap-2">
               <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${step.isCompleted ? 'bg-green-100 text-green-600' : i === currentStepIndex ? 'bg-rose-100 text-rose-600 border border-rose-200' : 'bg-slate-50 text-black'}`}>
                  {step.isCompleted ? <CheckCircle2 size={16} /> : <Circle size={14} />}
               </div>
               <span className={`text-[9px] font-medium  tracking-tight text-center ${step.isCompleted ? 'text-green-600' : i === currentStepIndex ? 'text-rose-600' : 'text-black'}`}>
                  {step.label.split(' ')[0]}
               </span>
            </div>
         ))}
      </div>
    </div>
  );
};

export default ProfileCompletenessWizard;





