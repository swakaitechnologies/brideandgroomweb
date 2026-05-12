import { Link } from "react-router-dom";
import { ArrowLeft, Construction } from "lucide-react";

export default function ComingSoon({ title }: { title: string }) {
  return (
    <div className="min-h-screen bg-[#0f0520] text-white flex flex-col items-center justify-center px-6 text-center">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-[20%] left-[-10%] w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 space-y-8 max-w-2xl">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/5 border border-white/10 mb-4">
          <Construction className="text-secondary w-10 h-10" />
        </div>
        
        <h1 className="text-4xl md:text-6xl font-heading font-medium tracking-tight">
          {title} <span className="text-secondary italic">Coming Soon</span>
        </h1>
        
        <p className="text-white/60 text-lg leading-relaxed max-w-lg mx-auto">
          We're currently building something amazing for our community. This part of the platform will be available shortly.
        </p>

        <div className="pt-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/15 border border-white/10 px-8 py-4 rounded-2xl font-semibold transition-all group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
