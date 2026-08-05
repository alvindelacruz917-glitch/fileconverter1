import React from 'react';
import { ShieldCheck, Zap, Heart, Code2, Globe, Github, Mail, MessageSquare, Sparkles, CheckCircle2, UserCheck, Terminal, Cpu } from 'lucide-react';

interface AboutPageProps {
  theme: 'dark' | 'light';
  onOpenFeedback: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ theme, onOpenFeedback }) => {
  return (
    <div className="p-8 md:p-12 max-w-5xl mx-auto space-y-12 animate-fade-in">
      {/* Title Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
          <Zap className="w-4 h-4 fill-current" />
          <span>Universal Converter Pro v2.5.0</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
          About & Developer Profile
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed">
          Commercial-grade offline file conversion software created for maximum speed, privacy, and simplicity.
        </p>
      </div>

      {/* DEVELOPER PROFILE SECTION (ALVIN) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-blue-500" />
            <span>DEVELOPER SECTION</span>
          </h2>
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
            Lead Architect
          </span>
        </div>

        {/* Developer Profile Card */}
        <div
          className={`rounded-3xl p-8 border relative overflow-hidden shadow-2xl ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#1E293B] border-slate-700/80 text-white'
              : 'bg-gradient-to-br from-white via-slate-50 to-blue-50/30 border-slate-200 text-slate-900 shadow-xl'
          }`}
        >
          {/* Subtle Glow Background */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            {/* Developer Avatar */}
            <div className="relative group shrink-0">
              <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white font-black text-4xl flex items-center justify-center shadow-2xl shadow-blue-500/30 border-2 border-white/20">
                A
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center border-2 border-[#0F172A] shadow-md" title="Verified Creator">
                <CheckCircle2 className="w-5 h-5 fill-current text-white" />
              </div>
            </div>

            {/* Developer Info */}
            <div className="space-y-4 text-center md:text-left flex-1">
              <div>
                <div className="text-xs font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                  DEVELOPED BY
                </div>
                <h3 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mt-0.5">
                  Alvin
                </h3>
                <p className="text-xs font-bold text-slate-400 mt-0.5">
                  Software Developer & Systems Architect
                </p>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                Creating modern productivity software and powerful file conversion tools. Focused on high-performance offline WebAssembly engines, zero-latency desktop workflows, and intuitive design.
              </p>

              {/* Developer Social Links */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                <a
                  href="https://alvindev.com"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-600 dark:text-blue-400 font-bold text-xs border border-blue-500/20 flex items-center gap-2 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span>Website</span>
                </a>

                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-slate-500/10 hover:bg-slate-500/20 text-slate-700 dark:text-slate-200 font-bold text-xs border border-slate-500/20 flex items-center gap-2 transition-colors"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </a>

                <a
                  href="mailto:alvindelacruz917@gmail.com"
                  className="px-4 py-2 rounded-xl bg-purple-600/10 hover:bg-purple-600/20 text-purple-600 dark:text-purple-400 font-bold text-xs border border-purple-500/20 flex items-center gap-2 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>alvindelacruz917@gmail.com</span>
                </a>

                <button
                  onClick={onOpenFeedback}
                  className="px-4 py-2 rounded-xl bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs border border-emerald-500/20 flex items-center gap-2 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send Direct Feedback</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE SPECIFICATIONS */}
      <section className="space-y-6">
        <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">
          SOFTWARE ARCHITECTURE & SPECS
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-2xl bg-slate-500/5 border border-slate-200 dark:border-slate-800 space-y-2">
            <ShieldCheck className="w-6 h-6 text-emerald-500" />
            <h4 className="font-extrabold text-sm">100% Offline Privacy</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Files are converted purely in browser memory using pdf-lib, canvas, and sheetjs JS engines.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-500/5 border border-slate-200 dark:border-slate-800 space-y-2">
            <Zap className="w-6 h-6 text-amber-500" />
            <h4 className="font-extrabold text-sm">Zero Latency Engine</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              No server upload delays, no internet network bottleneck, and instant file outputs.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-500/5 border border-slate-200 dark:border-slate-800 space-y-2">
            <Terminal className="w-6 h-6 text-blue-500" />
            <h4 className="font-extrabold text-sm">Python 3.13 & PySide6</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Commercial QT desktop runtime architecture with multi-platform desktop rendering.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-500/5 border border-slate-200 dark:border-slate-800 space-y-2">
            <Cpu className="w-6 h-6 text-purple-500" />
            <h4 className="font-extrabold text-sm">High DPI & Animations</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Fluid 60FPS CSS3 and Framer Motion layout transitions with adaptive dark mode styling.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
