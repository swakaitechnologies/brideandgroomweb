import React, { useState } from "react";
import {
  X,
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import api from "@/services/api";
import { motion, AnimatePresence } from "framer-motion";

interface KYCModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const KYCModal: React.FC<KYCModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [documentType, setDocumentType] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const documentOptions = [
    "Aadhar Card",
    "Pancard",
    "Driving License",
    "Passport",
    "Voter ID",
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/jpg",
      ];

      if (!allowedTypes.includes(selectedFile.type)) {
        toast.error("Invalid file type. Please upload a PDF or an Image.");
        return;
      }

      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB.");
        return;
      }

      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!documentType || !documentNumber || !file) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("documentType", documentType);
    formData.append("documentNumber", documentNumber);
    formData.append("document", file);

    try {
      const res = await api.post("/kyc/submit", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success("KYC submitted successfully!");
        onSuccess();
        onClose();
      }
    } catch (error: any) {
      console.error("KYC error:", error);
      toast.error(error.response?.data?.message || "Failed to submit KYC");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden relative"
        >
          {/* Header */}
          <div className="bg-slate-900 p-6 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/90 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
                <ShieldCheck size={28} className="text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-medium">Identity Verification</h3>
                <p className="text-xs text-white/90  tracking-widest font-medium">
                  Safe & Secure KYC Process
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-8 items-stretch mb-6">
              {/* Left Column - Document Type Selection */}
              <div className="space-y-4">
                <label className="text-xs font-medium text-black  tracking-wider ml-1">
                  Select Document Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {documentOptions.map((doc) => (
                    <button
                      key={doc}
                      type="button"
                      onClick={() => setDocumentType(doc)}
                      className={`px-4 py-3 rounded-xl border text-xs sm:text-sm font-medium transition-all text-left flex items-center justify-between ${documentType === doc
                        ? "bg-primary/5 border-primary text-primary shadow-sm"
                        : "bg-slate-50 border-slate-200 text-black hover:border-primary/40"
                        }`}
                    >
                      {doc}
                      {documentType === doc && <CheckCircle2 size={16} />}
                    </button>
                  ))}
                </div>

                <div className="space-y-2 !mt-6">
                  <label className="text-xs font-medium text-black  tracking-wider ml-1">
                    Document Number
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter ID number"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:bg-white focus:border-primary/40 outline-none transition-all placeholder:text-black"
                    value={documentNumber}
                    onChange={(e) => setDocumentNumber(e.target.value)}
                  />
                </div>
              </div>

              {/* Right Column - File Upload */}
              <div className="space-y-4 flex flex-col">
                <label className="text-xs font-medium text-black  tracking-wider ml-1">
                  Upload Document (PDF or Image)
                </label>
                <label
                  className={`flex-grow flex flex-col items-center justify-center w-full min-h-[140px] border-2 border-dashed rounded-2xl cursor-pointer transition-all ${file
                    ? "bg-green-50/30 border-green-200"
                    : "bg-slate-50 border-slate-200 hover:bg-slate-100/50"
                    }`}
                >
                  <div className="flex flex-col items-center justify-center p-4">
                    {file ? (
                      <>
                        <FileText className="w-8 h-8 mb-2 text-green-500" />
                        <p className="text-sm font-medium text-green-600 text-center truncate max-w-[200px]">
                          {file.name}
                        </p>
                        <p className="text-[10px] text-green-500 mt-1  font-medium tracking-tight">
                          Click to change file
                        </p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 mb-2 text-black" />
                        <p className="text-sm font-medium text-black tracking-tight text-center leading-tight">
                          Choose file or <br className="hidden sm:block" /> drag & drop
                        </p>
                        <p className="text-[10px] text-black mt-1  font-medium tracking-tight">
                          PDF, JPG or PNG (Max 5MB)
                        </p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,image/*"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex gap-3">
                <AlertCircle
                  size={18}
                  className="text-amber-500 shrink-0 mt-0.5"
                />
                <p className="text-xs text-amber-900 leading-relaxed font-medium">
                  Please ensure the document is clear and all details are visible.
                  Verification typically takes up to <strong>48 hours</strong>.
                </p>
              </div>

              <div className="flex gap-4 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 rounded-xl h-12 font-medium border-slate-200"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 rounded-xl h-12 font-medium shadow-lg shadow-primary/20"
                  disabled={loading || !documentType || !documentNumber || !file}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Submit Verified KYC"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default KYCModal;





