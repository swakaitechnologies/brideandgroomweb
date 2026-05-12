"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Image } from "@/components/common/Image";
import {
  Heart,
  Quote,
  ArrowRight,
  Sparkles,
  Calendar,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/services/api";
import { motion } from "framer-motion";
import UserLayout from "@/components/layout/UserLayout";
import confetti from "canvas-confetti";

interface SuccessStory {
  id: string;
  coupleName: string;
  weddingDate: string;
  story: string;
  imageUrl: string;
  location: string;
  isFeatured: boolean;
}

interface SuccessStoriesPageProps {
  initialStories?: SuccessStory[];
}

const SuccessStoriesPage = ({ initialStories = [] }: SuccessStoriesPageProps) => {
  const navigate = useNavigate();
  const [stories, setStories] = useState<SuccessStory[]>(initialStories);
  const [loading, setLoading] = useState(initialStories.length === 0);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await api.get("/stories/approved");
        setStories(res.data || []);
      } catch (err) {
        console.error("Failed to fetch stories", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();

// ─── PREMIUM FIREWORK CELEBRATION ───
    const duration = 6 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { 
      startVelocity: 45, 
      spread: 360, 
      ticks: 150, 
      zIndex: 9999,
      colors: ["#E11D48", "#F43F5E", "#FB7185", "#FDA4AF", "#FDE6E9"] // Rose palette
    };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 100 * (timeLeft / duration);
      // Shoot from random mid-screen positions for true firework look
      confetti({ 
        ...defaults, 
        particleCount, 
        origin: { x: randomInRange(0.1, 0.9), y: randomInRange(0.2, 0.5) },
        gravity: 1.2,
        scalar: randomInRange(0.8, 1.4)
      });
    }, 450);

    return () => clearInterval(interval);
  }, []);

  return (
    <UserLayout className="py-0 max-w-none">
      <div className="bg-white min-h-screen text-slate-900 overflow-hidden">

        {/* ─── IMMERSIVE HERO SECTION ─── */}
        <section className="relative min-h-screen flex items-center justify-center pt-16 px-6">
          {/* Background Luxury Gradient */}
          <div className="absolute inset-0 bg-linear-to-br from-[#FFF5F7] via-white to-[#F9FAFB] -z-10" />
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-5">
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
              transition={{ duration: 10, repeat: Infinity }}
              className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-rose-200/30 rounded-full blur-[120px]"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.15, 0.05] }}
              transition={{ duration: 12, repeat: Infinity, delay: 2 }}
              className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-amber-100/40 rounded-full blur-[100px]"
            />
          </div>

          <div className="max-w-7xl mx-auto text-center space-y-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-3 bg-white px-6 py-2 rounded-full border border-rose-100 shadow-sm text-rose-600 font-bold text-[10px] uppercase tracking-[0.4em]">
                <Sparkles size={14} fill="currentColor" />
                CELEBRATING ETERNAL BONDS
              </div>
              <h1 className="text-7xl md:text-9xl font-medium tracking-tighter leading-[0.9]">
                Where Love Finds <br />
                <span className="text-rose-600 italic font-heading">Its Forever Home.</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-500 font-medium max-w-3xl mx-auto leading-relaxed">
                Step into our gallery of grace, where real souls found their divine counterparts.
                Explore the stories that inspire thousands to believe in destiny once again.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="flex justify-center gap-6"
            >
              <Button
                onClick={() => navigate("/register")}
                className="h-16 px-12 rounded-4xl bg-slate-900 hover:bg-rose-600 text-white text-lg font-bold shadow-2xl transition-all group"
              >
                Begin Your Story
                <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" />
              </Button>
              <Button
                variant="outline"
                onClick={() => window.scrollTo({ top: 1000, behavior: 'smooth' })}
                className="h-16 px-10 rounded-4xl border-slate-200 text-lg font-medium hover:bg-slate-50"
              >
                Read Testimonials
              </Button>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="pt-12 text-slate-300"
            >
              <div className="w-px h-24 bg-linear-to-b from-slate-200 to-transparent mx-auto" />
            </motion.div>
          </div>
        </section>

        {/* ─── FEATURED STORIES (LUXURY MAGAZINE STYLE) ─── */}
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto space-y-24">
            {stories.filter(s => s.isFeatured).map((story, i) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className={`flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}
              >
                <div className="flex-1 w-full relative">
                  <div className="absolute inset-0 bg-rose-50 rounded-[4rem] rotate-3 -z-10" />
                  <div className="relative aspect-4/5 rounded-[4rem] overflow-hidden shadow-2xl border-16 border-white bg-slate-50">
                    <Image
                      src={story.imageUrl}
                      alt={story.coupleName}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                      priority={i < 2}
                    />
                  </div>
                  <div className={`absolute -bottom-10 ${i % 2 === 0 ? '-right-10' : '-left-10'} bg-white p-8 rounded-[3rem] shadow-xl border border-slate-50 min-w-[240px]`}>
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar size={16} className="text-rose-500" />
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">United Forever</span>
                    </div>
                    <p className="text-2xl font-medium text-slate-900">
                      {new Date(story.weddingDate).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="flex-1 space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
                        <MapPin size={18} />
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em]">{story.location}</span>
                    </div>
                    <h2 className="text-6xl md:text-8xl font-medium tracking-tighter leading-none">
                      {story.coupleName}
                    </h2>
                  </div>
                  <Quote size={40} className="text-rose-100 fill-current" />
                  <p className="text-2xl md:text-3xl text-slate-600 font-medium leading-relaxed italic border-l-4 border-rose-100 pl-8">
                    "{story.story}"
                  </p>
                  <Button variant="ghost" className="p-0 h-auto font-bold text-xs uppercase tracking-[0.3em] hover:bg-transparent flex items-center gap-4 group">
                    Full Story Details
                    <div className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all">
                      <ArrowRight size={20} />
                    </div>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ─── GALLERY GRID ─── */}
        <section className="py-16 px-6 bg-slate-50/50">
          <div className="max-w-7xl mx-auto space-y-10">
            <div className="text-center space-y-6">
              <div className="inline-block px-6 py-2 rounded-full bg-white border border-slate-100 text-rose-500 text-[10px] font-bold uppercase tracking-[0.4em]">Our Eternal Archive</div>
              <h2 className="text-5xl md:text-6xl font-medium tracking-tighter">Inspiring New Beginnings</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {stories.filter(s => !s.isFeatured).map((story) => (
                <motion.div
                  key={story.id}
                  whileHover={{ y: -10 }}
                  className="bg-white p-6 rounded-[3rem] shadow-xl shadow-slate-200/40 border border-slate-100 group"
                >
                  <div className="aspect-square rounded-4xl overflow-hidden mb-8 relative bg-slate-50">
                    <Image
                      src={story.imageUrl}
                      alt={story.coupleName}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-[2s]"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-6 left-6 text-white translate-y-4 group-hover:translate-y-0 transition-all opacity-0 group-hover:opacity-100">
                      <p className="text-sm font-bold uppercase tracking-widest">{story.location}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-2xl font-medium tracking-tight">{story.coupleName}</h4>
                    <p className="text-slate-500 font-medium leading-relaxed italic line-clamp-3">"{story.story}"</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CLOSING CTA ─── */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto rounded-[4rem] bg-rose-600 p-12 md:p-16 text-center space-y-8 relative overflow-hidden">
            <Heart size={300} className="absolute -top-20 -right-20 text-white/10 -rotate-12" />
            <h2 className="text-5xl md:text-7xl font-medium text-white tracking-tighter leading-tight relative z-10">
              Your story is <br />
              <span className="italic">waiting to be written.</span>
            </h2>
            <div className="relative z-10">
              <Button
                onClick={() => navigate("/register")}
                className="h-18 px-14 rounded-4xl bg-white text-rose-600 text-xl font-bold shadow-2xl hover:bg-slate-900 hover:text-white transition-all"
              >
                Start Your Search Now
              </Button>
            </div>
          </div>
        </section>

      </div>
    </UserLayout>
  );
};

export default SuccessStoriesPage;
