import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Navbar } from '../components/Navbar';
import {
  FiUser,
  FiMail,
  FiDollarSign,
  FiMessageSquare,
  FiSend,
  FiShield,
  FiClock,
  FiCheckCircle,
  FiExternalLink
} from 'react-icons/fi';

const leadSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  budgetRange: z.string().min(1, "Please select a budget range"),
  message: z.string().min(10, "Message should be at least 10 characters"),
});

type LeadFormData = z.infer<typeof leadSchema>;

const caseFiles = [
  { id: '001', client: 'Veloce Motors', result: '+240% scale velocity', duration: '4 wks', category: 'Automotive Tech' },
  { id: '002', client: 'Aether Cloud', result: '99.999% uptime architecture', duration: '6 wks', category: 'Infrastructure' },
  { id: '003', client: 'KINETIC OS', result: '4.8x enterprise retention', duration: '8 wks', category: 'SaaS Platform' },
];

function CaseIndex() {
  const [active, setActive] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setActive(i => (i + 1) % caseFiles.length);
        setFade(true);
      }, 300);
    }, 4500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col justify-between h-full py-4">
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 font-mono text-xs tracking-wider uppercase backdrop-blur-md">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping" />
          Elite Engineering Studio
        </div>

        {/* Main Section Heading */}
        <div className="space-y-2">
          <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500">
            Portfolio & Impact
          </h2>
          <h1 className="font-serif text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.05]">
            Architecting <br />
            <span className="bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 bg-clip-text text-transparent animate-pulse">
              digital legacy.
            </span>
          </h1>
        </div>

        <p className="max-w-md text-base leading-relaxed text-slate-600 dark:text-zinc-400 font-normal">
          We construct world-class software infrastructure and ultra-refined interfaces for category-defining companies. Zero bloat. Pure performance.
        </p>
      </div>

      <div className="mt-8">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-2xl shadow-slate-900/5 dark:border-zinc-800/80 dark:bg-zinc-900/40 backdrop-blur-2xl transition-all duration-500 hover:border-rose-500/40 group">

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-rose-600 dark:text-rose-400 uppercase tracking-widest font-bold">
                Case [{caseFiles[active].id}]
              </span>
              <span className="text-slate-300 dark:text-zinc-700">/</span>
              <span className="font-mono text-xs text-slate-400 dark:text-zinc-500">
                {caseFiles[active].category}
              </span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
              <FiClock className="w-3 h-3 animate-spin duration-[4000ms]" />
              <span>{caseFiles[active].duration}</span>
            </div>
          </div>

          <div className={`space-y-1 transition-opacity duration-300 ${fade ? 'opacity-100' : 'opacity-0'}`}>
            <p className="font-serif text-lg font-bold text-slate-900 dark:text-zinc-100">
              {caseFiles[active].client}
            </p>
            <p className="text-2xl font-black tracking-tight text-rose-600 dark:text-rose-400">
              {caseFiles[active].result}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [formData, setFormData] = useState<LeadFormData>({
    name: '',
    email: '',
    budgetRange: '',
    message: ''
  });
  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name as keyof LeadFormData]) {
      setErrors(prev => ({ ...prev, [e.target.name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      leadSchema.parse(formData);
      setErrors({});
      setIsSubmitting(true);

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${API_URL}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Submission failed');

      setIsSuccess(true);
      toast.success("Transmission received. We'll connect shortly.");
      setFormData({ name: '', email: '', budgetRange: '', message: '' });

      setTimeout(() => setIsSuccess(false), 5000);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: any = {};
        err.issues.forEach(e => {
          if (e.path[0]) fieldErrors[e.path[0]] = e.message;
        });
        setErrors(fieldErrors);
      } else {
        toast.error("Network error. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputBaseClasses =
    "w-full rounded-2xl border border-slate-200/80 bg-slate-50/50 px-4 py-4 pl-12 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition-all duration-300 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-rose-500/10 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:bg-zinc-900";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-rose-500 selection:text-white dark:bg-[#09090b] dark:text-zinc-100 transition-colors overflow-x-hidden relative flex flex-col justify-between">

      <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse duration-[8000ms]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse duration-[10000ms]" />

      <Navbar brand="Studio" />

      <main className="mx-auto max-w-7xl w-full flex-1 flex items-center relative z-10 py-12">
        <div className="grid w-full grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 px-6">

          <div className="lg:col-span-5 flex flex-col justify-center">
            <CaseIndex />
          </div>

          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="relative rounded-3xl border border-slate-200/80 bg-white/80 p-8 sm:p-12 shadow-2xl shadow-slate-900/10 dark:border-zinc-800 dark:bg-zinc-900/50 backdrop-blur-2xl">

              {/* Form Section Heading */}
              <div className="mb-8 space-y-1">
                <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400">
                  Client Intake Pipeline
                </h3>
                <h2 className="font-serif text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Start a project
                </h2>
                <p className="text-sm text-slate-500 dark:text-zinc-400">
                  Direct communication loop with our founding partners. No intermediaries.
                </p>
              </div>

              {isSuccess ? (
                <div className="py-16 text-center space-y-4 animate-in fade-in zoom-in duration-500">
                  <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                    <FiCheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight font-serif">Transmission Successful</h3>
                  <p className="text-sm text-slate-500 dark:text-zinc-400 max-w-sm mx-auto">
                    Your architecture brief has been dispatched. A partner will review and respond within 24 hours.
                  </p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="mt-4 px-6 py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-800 text-xs font-mono font-semibold tracking-wider uppercase hover:bg-slate-200 dark:hover:bg-zinc-700 transition-all"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div className="space-y-1.5 group">
                    <label htmlFor="name" className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-zinc-400 font-semibold">
                      Full Name
                    </label>
                    <div className="relative">
                      <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-zinc-500 pointer-events-none" />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className={inputBaseClasses}
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Sarah Connor"
                      />
                    </div>
                    {errors.name && <span className="font-mono text-xs text-rose-600 dark:text-rose-400 pl-2">{errors.name}</span>}
                  </div>

                  <div className="space-y-1.5 group">
                    <label htmlFor="email" className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-zinc-400 font-semibold">
                      Corporate Email
                    </label>
                    <div className="relative">
                      <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-zinc-500 pointer-events-none" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className={inputBaseClasses}
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="s.connor@cyberdyne.io"
                      />
                    </div>
                    {errors.email && <span className="font-mono text-xs text-rose-600 dark:text-rose-400 pl-2">{errors.email}</span>}
                  </div>

                  <div className="space-y-1.5 group">
                    <label htmlFor="budgetRange" className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-zinc-400 font-semibold">
                      Capital Allocation
                    </label>
                    <div className="relative">
                      <FiDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-zinc-500 pointer-events-none" />
                      <select
                        id="budgetRange"
                        name="budgetRange"
                        className={`${inputBaseClasses} appearance-none pr-10 cursor-pointer`}
                        value={formData.budgetRange}
                        onChange={handleChange}
                      >
                        <option value="" disabled>Select target investment tier</option>
                        <option value="< $5k">&lt; $5,000 (Consulting / Audit)</option>
                        <option value="$5k - $10k">$5,000 - $10,000 (Sprint Build)</option>
                        <option value="$10k - $25k">$10,000 - $25,000 (Full Architecture)</option>
                        <option value="> $25k">$25,000+ (Enterprise Retainer)</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">▼</div>
                    </div>
                    {errors.budgetRange && <span className="font-mono text-xs text-rose-600 dark:text-rose-400 pl-2">{errors.budgetRange}</span>}
                  </div>

                  <div className="space-y-1.5 group">
                    <label htmlFor="message" className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-zinc-400 font-semibold">
                      Project Brief & Scope
                    </label>
                    <div className="relative">
                      <FiMessageSquare className="absolute left-4 top-4 w-4 h-4 text-slate-400 dark:text-zinc-500 pointer-events-none" />
                      <textarea
                        id="message"
                        name="message"
                        className={`${inputBaseClasses} min-h-[120px] resize-y leading-relaxed pl-12 pt-4`}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Outline your tech stack, current bottlenecks, and target milestones..."
                        rows={4}
                      />
                    </div>
                    {errors.message && <span className="font-mono text-xs text-rose-600 dark:text-rose-400 pl-2">{errors.message}</span>}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full relative overflow-hidden flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 dark:from-zinc-100 dark:to-zinc-200 dark:text-zinc-900 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-slate-900/10 transition-all duration-300 hover:shadow-rose-500/20 hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 group mt-2"
                  >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-rose-500 to-orange-500 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <span className="relative z-10 flex items-center gap-2">
                      {isSubmitting ? (
                        <>
                          <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                          <span>Transmitting Brief...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Architecture Brief</span>
                          <FiSend className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </>
                      )}
                    </span>
                  </button>
                </form>
              )}

              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] text-slate-400 dark:text-zinc-500">
                <div className="flex items-center gap-1.5">
                  <FiShield className="w-3.5 h-3.5 text-emerald-500" />
                  <span>End-to-End Encrypted</span>
                </div>
                <div>Reviewed exclusively by Partners</div>
              </div>

            </div>
          </div>

        </div>
      </main>

      <footer className="w-full py-6 border-t border-slate-200/80 dark:border-zinc-800/80 text-center font-mono text-xs text-slate-500 dark:text-zinc-400 relative z-10 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-md">
        <span>Built for </span>
        <a
          href="https://digitalheroesco.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-rose-600 dark:text-rose-400 hover:underline inline-flex items-center gap-1"
        >
          <span>Digital Heroes Training Task</span>
          <FiExternalLink className="w-3 h-3" />
        </a>
      </footer>

    </div>
  );
}