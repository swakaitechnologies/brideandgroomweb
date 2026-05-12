"use client";

import UserLayout from "@/components/layout/UserLayout";

import { useAuthStore } from "@/store/authStore";
import {
  Upload,
  Trash2,
  ShieldCheck,
  CheckCircle2,
  Plus,
  Loader2,
  ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import api from "@/services/api";
import { toast } from "sonner";
import { Image } from "@/components/common/Image";


interface Photo {
  id: string;
  url: string;
  isMain: boolean;
}

const PhotosPage = () => {
  const { user } = useAuthStore();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const res = await api.get("/photos");
      if (res.data.success) {
        setPhotos(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch photos", err);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const formData = new FormData();
    const files = Array.from(e.target.files);

    const oversized = files.some(file => file.size > 5 * 1024 * 1024);
    if (oversized) {
      toast.error("Some files exceed 5MB limit");
      return;
    }

    files.forEach((file) => {
      formData.append("photos", file);
    });

    setUploading(true);
    const loadingToast = toast.loading("Uploading...");

    try {
      const res = await api.post("/photos/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) {
        setPhotos((prev) => [...prev, ...res.data.data]);
        toast.success("Photos uploaded", { id: loadingToast });
        e.target.value = "";
      }
    } catch (err) {
      console.error("Upload failed", err);
      toast.error("Upload failed", { id: loadingToast });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this photo?")) return;
    try {
      const res = await api.delete(`/photos/${id}`);
      if (res.data.success) {
        setPhotos((prev) => prev.filter((p) => p.id !== id));
        toast.success("Photo removed");
      }
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Delete failed");
    }
  };

  const handleSetPrimary = async (id: string) => {
    try {
      const res = await api.put(`/photos/${id}/primary`);
      if (res.data.success) {
        setPhotos((prev) =>
          prev.map((p) => ({
            ...p,
            isMain: p.id === id,
          })),
        );
        toast.success("Main photo updated");
      }
    } catch (err) {
      console.error("Set primary failed", err);
      toast.error("Update failed");
    }
  };

  if (!user) return null;

  const rules = [
    "Clear, individual portrait photos works best",
    "Face should be clearly visible",
    "No group shots, children or landscape photos",
    "Max file size is 5MB per photo",
    "Supported formats: JPG, PNG",
  ];

  return (
    <UserLayout className="max-w-none pt-5">
      <div className="max-w-full pt-0 pb-8 px-4 sm:px-8 lg:px-12 mx-auto">
        {/* Simple Header */}
        <div className="mb-10 border-b pb-6">
          <h1 className="text-2xl font-medium text-foreground mb-2">Manage Photos</h1>
          <p className="text-black">Add and manage photos to your profile.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-10">

            {/* Simple Upload */}
            <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
              <label
                htmlFor="photo-upload"
                className={`
                  flex flex-col items-center justify-center p-12 border-2 border-dashed transition-colors cursor-pointer
                  ${uploading ? 'bg-muted' : 'border-muted-foreground/20 hover:bg-muted/30'}
                `}
              >
                <div className="mb-4 text-black">
                  {uploading ? <Loader2 size={32} className="animate-spin" /> : <Upload size={32} />}
                </div>
                <div className="text-center">
                  <p className="font-medium">{uploading ? "Uploading..." : "Click to upload photos"}</p>
                  <p className="text-sm text-black mt-1">or drag and drop here</p>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  id="photo-upload"
                  onChange={handleUpload}
                  disabled={uploading}
                />
              </label>
            </div>

            {/* Simple Gallery */}
            <div className="space-y-4">
              <h2 className="text-sm font-medium  tracking-wider text-black">Photos</h2>

              {photos.length === 0 ? (
                <div className="bg-muted/20 border-2 border-dashed rounded-xl p-12 text-center text-black">
                  No photos uploaded yet.
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {photos.map((photo) => (
                    <div key={photo.id} className="group aspect-3/4 border rounded-xl overflow-hidden bg-muted relative">
                      <Image
                        src={photo.url}
                        alt="Profile"
                        fill
                        className="object-cover"
                        unoptimized
                      />

                      {/* Simple Controls */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 gap-2">
                        {!photo.isMain && (
                          <Button
                            size="sm"
                            className="w-full h-8 text-[11px]"
                            onClick={() => handleSetPrimary(photo.id)}
                          >
                            Set Main
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          className="w-full h-8 text-[11px]"
                          onClick={() => handleDelete(photo.id)}
                        >
                          <Trash2 size={12} className="mr-1" />
                          Delete
                        </Button>
                      </div>

                      {photo.isMain && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 bg-primary text-white text-[10px] font-medium rounded shadow-sm">
                          Main Photo
                        </div>
                      )}
                    </div>
                  ))}

                  <label
                    htmlFor="photo-upload"
                    className="aspect-3/4 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/30 text-black transition-colors"
                  >
                    <Plus size={24} />
                    <span className="text-xs font-medium">Add Photo</span>
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Simple Sidebar */}
          <div className="space-y-6">
            <div className="bg-white border rounded-xl p-6 space-y-4 shadow-sm">
              <h3 className="font-medium flex items-center gap-2">
                <ShieldCheck size={18} className="text-primary" />
                Guidelines
              </h3>
              <ul className="space-y-3">
                {rules.map((rule, idx) => (
                  <li key={idx} className="text-sm text-black flex gap-3">
                    <span className="text-primary">•</span>
                    {rule}
                  </li>
                ))}
              </ul>
              <div className="pt-4 border-t text-xs text-black italic leading-relaxed">
                Matches are more likely when photos are clear and up-to-date.
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/10 rounded-xl p-6">
              <div className="flex items-center gap-3 text-primary mb-2">
                <CheckCircle2 size={18} />
                <span className="font-medium text-sm  tracking-wider">Note</span>
              </div>
              <p className="text-sm text-black">
                All uploaded photos are reviewed by our team to ensure safety and community standards.
              </p>
            </div>

            {/* Comparison Section */}
            <div className="bg-white border rounded-xl p-6 space-y-4 shadow-sm">
              <h3 className="font-medium text-sm flex items-center gap-2">
                <ImageIcon size={18} className="text-primary" />
                Visual Privacy
              </h3>
              <p className="text-xs text-black leading-relaxed">
                If you choose to hide your face in Privacy Settings, this is how your photos will appear:
              </p>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <div className="aspect-square rounded-lg overflow-hidden border relative">
                    <Image
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200"
                      alt="Normal View"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <p className="text-[10px] text-center font-medium text-black ">Normal</p>
                </div>
                <div className="space-y-2">
                  <div className="aspect-square rounded-lg overflow-hidden border relative">
                    <Image
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200"
                      alt="Blurred View"
                      fill
                      className="object-cover blur-sm brightness-90"
                      unoptimized
                    />
                  </div>
                  <p className="text-[10px] text-center font-medium text-black ">Blurred</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default PhotosPage;





