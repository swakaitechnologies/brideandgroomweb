import { useState } from "react";
import UserLayout from "@/components/layout/UserLayout";
import { 
  Heart, 
  Plus, 
  Camera, 
  Calendar, 
  Send,
  Sparkles,
  Loader2,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import api from "@/services/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const StorySubmissionPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    coupleName: "",
    weddingDate: "",
    story: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("Please upload a photo of the happy couple");
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();
      data.append("coupleName", formData.coupleName);
      data.append("weddingDate", formData.weddingDate);
      data.append("story", formData.story);
      data.append("image", selectedFile);

      const res = await api.post("/stories/submit", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (res.status === 201) {
        setSuccess(true);
        toast.success("Story submitted for approval!");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to submit story");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <UserLayout>
        <div className="max-w-4xl mx-auto py-20 px-8 text-center">
            <motion.div 
               initial={{ scale: 0.5, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="w-32 h-32 bg-green-100 rounded-[2.5rem] flex items-center justify-center text-green-600 mx-auto mb-10"
            >
               <CheckCircle2 size={64} />
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-medium text-black mb-6">Thank You for Sharing!</h1>
            <p className="text-xl text-black font-medium mb-12">Your beautiful story has been submitted for review. Once approved, it will inspire thousands of others on our platform.</p>
            <Button onClick={() => navigate("/stories")} className="rounded-2xl h-14 px-10 font-medium  tracking-widest text-xs">
                Back to Stories
            </Button>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="max-w-5xl mx-auto py-12 px-8">
        <div className="flex flex-col md:flex-row gap-16 items-start">
           <div className="flex-1 space-y-8">
              <div className="flex items-center gap-3">
                 <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 shadow-sm border border-rose-100">
                    <Heart size={24} />
                 </div>
                 <h1 className="text-4xl font-medium text-black tracking-tight">Tell Your <span className="text-primary italic">Story</span></h1>
              </div>
              <p className="text-lg text-black font-medium leading-relaxed">
                 Did you find your better half on our platform? We'd love to celebrate your journey and help others believe in the magic of destiny.
              </p>

              <form onSubmit={handleSubmit} className="space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                       <label className="text-xs font-medium  tracking-widest text-black">Couple Names</label>
                       <input 
                          type="text" 
                          placeholder="e.g. Rahul & Sunita"
                          required
                          value={formData.coupleName}
                          onChange={(e) => setFormData({...formData, coupleName: e.target.value})}
                          className="w-full h-14 px-6 rounded-2xl border-2 border-slate-100 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none font-medium"
                       />
                    </div>
                    <div className="space-y-3">
                       <label className="text-xs font-medium  tracking-widest text-black">Wedding Date</label>
                       <div className="relative">
                          <input 
                             type="date" 
                             required
                             value={formData.weddingDate}
                             onChange={(e) => setFormData({...formData, weddingDate: e.target.value})}
                             className="w-full h-14 px-6 rounded-2xl border-2 border-slate-100 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none font-medium"
                          />
                          <Calendar className="absolute right-6 top-1/2 -translate-y-1/2 text-black pointer-events-none" size={20} />
                       </div>
                    </div>
                 </div>

                 <div className="space-y-3">
                    <label className="text-xs font-medium  tracking-widest text-black">Your Journey Together</label>
                    <textarea 
                       rows={6}
                       required
                       placeholder="Share the beautiful details of how you met and fell in love..."
                       value={formData.story}
                       onChange={(e) => setFormData({...formData, story: e.target.value})}
                       className="w-full p-6 rounded-3xl border-2 border-slate-100 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none font-medium resize-none"
                    />
                 </div>

                 <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full rounded-2xl h-16 bg-slate-900 hover:bg-slate-800 font-medium  tracking-[0.2em] text-xs shadow-xl shadow-slate-200"
                 >
                    {loading ? <Loader2 className="animate-spin" /> : <>Submit Successful Match <Send size={16} className="ml-2" /></>}
                 </Button>
              </form>
           </div>

           <div className="w-full md:w-[360px] space-y-8">
              <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-6">
                 <h3 className="text-xl font-medium text-black  tracking-tight flex items-center gap-2">
                    <Camera size={20} className="text-primary" /> Upload Photo
                 </h3>
                 <div 
                    onClick={() => document.getElementById('storyPic')?.click()}
                    className="aspect-[4/5] rounded-[2rem] border-4 border-dashed border-slate-200 bg-white flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-primary transition-all overflow-hidden relative group"
                 >
                    {previewUrl ? (
                       <img src={previewUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                       <>
                          <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-black">
                             <Plus size={32} />
                          </div>
                          <p className="text-[10px]  font-medium tracking-widest text-black">Add a lovely photo</p>
                       </>
                    )}
                    <input id="storyPic" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                 </div>
                 <p className="text-xs text-black font-medium text-center">We recommend a high-quality wedding or engagement photo.</p>
              </div>

              <div className="bg-gradient-to-br from-rose-50 to-amber-50 p-8 rounded-[2.5rem] border border-rose-100">
                 <Sparkles className="text-rose-500 mb-6" size={32} />
                 <h4 className="text-lg font-medium text-black mb-4 tracking-tight">The Joy of Sharing</h4>
                 <p className="text-sm text-black font-medium leading-relaxed">
                    Sharing your success story helps build a stronger community of trust. Plus, every featured story receives a special **Diamond Membership** extension as a gift!
                 </p>
              </div>
           </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default StorySubmissionPage;





