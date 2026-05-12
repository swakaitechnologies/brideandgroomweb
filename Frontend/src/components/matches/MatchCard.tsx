import { Image } from "@/components/common/Image";
import { Link } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import { toggleLike, addToRecentlyViewed } from "@/store/matchesSlice";
import { motion } from "framer-motion";
import { getCompatibilityScore } from "@/utils/matchUtils";
import {
  Sparkles,
  Lock,
  Heart,
  ShieldCheck,
  Users,
  Orbit,
  Clock,
  MapPin,
  User,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { sendInterest } from "@/store/interactionSlice";
import { toggleShortlist } from "@/store/matchesSlice";
import { toast } from "sonner";

export interface MatchData {
  id: string;
  name: string;
  age: number;
  height: string;
  profession: string;
  location: string;
  religion: string;
  education: string;
  image: string;
  compatibility: number;
  online: boolean;
  customId: string;
  photosLocked?: boolean;
  createdBy?: string;
  isKycVerified?: boolean;
  maritalStatus?: string;
  motherTongue?: string;
  bio?: string;
  lastSeen?: string;
  hasAstro?: boolean;
  zodiacSign?: string;
  caste?: string;

  // Raw filtering values
  rawReligion?: string;
  rawMotherTongue?: string;
  rawProfession?: string;
  rawState?: string;
  rawCity?: string;
  rawDiet?: string;
  rawEducation?: string;
  rawIncome?: string;
  rawHeight?: string;
  thumbnailUrl?: string;
}

interface MatchCardProps {
  match: MatchData;
  variant?: "default" | "minimal";
}

const MatchCard = ({ match, variant = "default" }: MatchCardProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const liked = useSelector((state: RootState) => state.matches.liked);
  const shortlisted = useSelector((state: RootState) => state.matches.shortlisted);
  const { sentInterests } = useSelector((state: RootState) => state.interaction);
  
  const isLiked = liked.some((m) => m.id === match.id);
  const isShortlisted = shortlisted.some((m) => m.id === match.id);
  const hasSentInterest = sentInterests.some((i) => i.receiverId === match.id);
  
  const imageSrc = match.image || '';

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleLike(match));
    if (!isLiked) toast.success(`Liked ${match.name}'s profile`);
  };

  const handleShortlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleShortlist(match));
    if (!isShortlisted) toast.success(`Added ${match.name} to shortlist`);
  };

  const handleSendInterest = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasSentInterest) return;
    
    try {
      await dispatch(sendInterest(match.id)).unwrap();
      toast.success(`Interest sent to ${match.name}`);
    } catch (error: any) {
      toast.error(error || "Failed to send interest");
    }
  };

  const handleClick = () => {
    dispatch(addToRecentlyViewed(match));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 hover:border-primary/20 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] transition-all duration-500 flex flex-col h-full"
    >
      <Link
        to={`/profile/${match.id}`}
        onClick={handleClick}
        className="flex flex-col h-full"
      >
        {/* Top: Image Section */}
        <div className="relative aspect-4/5 bg-slate-50 overflow-hidden">
          {imageSrc ? (
            <Image
              src={match.thumbnailUrl || imageSrc}
              alt={match.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
              <User className="w-12 h-12 text-slate-300" />
            </div>
          )}
          
          {/* Overlay Gradients */}
          <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 via-transparent to-transparent opacity-60" />
          
          {/* Quick Info Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {match.isKycVerified && (
              <div className="bg-white/90 backdrop-blur-md p-2 rounded-xl border border-white/50 shadow-xl text-green-600 flex items-center gap-1.5 animate-in fade-in zoom-in duration-500">
                <ShieldCheck size={14} className="fill-green-600/10" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Verified</span>
              </div>
            )}
            <div className="bg-slate-900/40 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/20 text-white flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${match.online ? 'bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]' : 'bg-slate-400'}`} />
              <span className="text-[10px] font-semibold tracking-wide">
                {match.online ? "Online" : match.lastSeen || "Offline"}
              </span>
            </div>
          </div>

          {/* Compatibility Score */}
          <div className="absolute top-4 right-4">
            <div className="bg-primary/90 backdrop-blur-md px-3 py-2 rounded-2xl flex flex-col items-center border border-white/20 shadow-2xl shadow-primary/20">
              <span className="text-[9px] font-bold text-white/80 uppercase tracking-widest leading-none mb-0.5">Match</span>
              <span className="text-sm font-black text-white leading-none">
                {getCompatibilityScore(match.id)}%
              </span>
            </div>
          </div>

          {match.photosLocked && (
            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] flex items-center justify-center p-8 transition-all group-hover:backdrop-blur-xs">
              <div className="text-center group-hover:scale-105 transition-transform">
                <div className="w-14 h-14 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-2xl border border-white/50">
                  <Lock className="text-slate-900" size={20} />
                </div>
                <p className="text-white text-[11px] font-bold uppercase tracking-[0.2em] shadow-sm">Locked Profile</p>
              </div>
            </div>
          )}

          {/* Action Buttons Shadow Overlay */}
          <div className="absolute bottom-4 right-4 flex gap-2">
             <Button
                onClick={handleShortlist}
                size="icon"
                className={`w-10 h-10 rounded-2xl transition-all shadow-xl backdrop-blur-md border ${
                  isShortlisted
                    ? "bg-amber-500 border-amber-400 text-white"
                    : "bg-white/80 border-white text-slate-900 hover:bg-white"
                }`}
              >
                <Star size={18} className={isShortlisted ? "fill-white" : "fill-transparent"} />
              </Button>
              <Button
                onClick={handleLike}
                size="icon"
                className={`w-10 h-10 rounded-2xl transition-all shadow-xl backdrop-blur-md border ${
                  isLiked
                    ? "bg-rose-500 border-rose-400 text-white"
                    : "bg-white/80 border-white text-slate-900 hover:bg-white"
                }`}
              >
                <Heart size={18} className={isLiked ? "fill-white" : "fill-transparent"} />
              </Button>
          </div>
        </div>

        {/* Bottom: Content Section */}
        <div className="flex-1 p-6 flex flex-col bg-white">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight transition-colors group-hover:text-primary">
              {match.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <MapPin size={12} className="text-primary/60" />
              <p className="text-slate-500 text-xs font-medium truncate tracking-tight">
                {match.location}
              </p>
            </div>
          </div>

          {/* Data Grid */}
          <div className="grid grid-cols-2 gap-3 mb-5 border-t border-slate-50 pt-4">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                <p className="text-slate-600 text-[11px] font-semibold tracking-tight truncate">
                  {match.age} Yrs, {match.height}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                <p className="text-slate-600 text-[11px] font-semibold tracking-tight truncate">
                  {match.religion}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                <p className="text-slate-600 text-[11px] font-semibold tracking-tight truncate">
                  {match.motherTongue}
                </p>
              </div>
            </div>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                <p className="text-slate-600 text-[11px] font-semibold tracking-tight truncate">
                   {match.maritalStatus || "Never Married"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                <p className="text-slate-600 text-[11px] font-semibold tracking-tight truncate">
                  {match.caste || "Not Specified"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                <p className="text-slate-600 text-[11px] font-semibold tracking-tight truncate">
                  {match.profession}
                </p>
              </div>
            </div>
          </div>

          {/* Bio Snippet */}
          <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-6 min-h-10">
            {match.bio || `I have completed my ${match.education}...`}
          </p>

          {/* Quick Actions Footer */}
          <div className="mt-auto pt-4 flex items-center justify-between gap-3 border-t border-slate-100">
            <div className="flex flex-col">
               <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Profile ID</span>
               <span className="text-[10px] font-black text-slate-900 tracking-tighter">{match.customId}</span>
            </div>
            
            <div className="flex items-center gap-2">
               <Button 
                onClick={handleSendInterest}
                disabled={hasSentInterest}
                className={`h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  hasSentInterest 
                    ? "bg-green-50 text-green-600 border-none pointer-events-none" 
                    : "bg-slate-900 text-white hover:bg-primary shadow-xl shadow-slate-900/10"
                }`}
              >
                {hasSentInterest ? "Interest Sent" : "Connect"}
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};


export default MatchCard;

