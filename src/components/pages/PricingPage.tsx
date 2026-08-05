import React from 'react';
import { Crown, CheckCircle2, Zap, Infinity as InfinityIcon, ShieldCheck, Sparkles, Star, ArrowRight } from 'lucide-react';
import { UserProfile } from '../../types/converter';

interface PricingPageProps {
  user: UserProfile | null;
  onOpenPayment: () => void;
  theme: 'dark' | 'light';
}

export const PricingPage: React.FC<PricingPageProps> = ({
  user,
  onOpenPayment,
  theme,
}) => {
  const isPro = user?.plan === 'PRO';
  const [billingCycle, setBillingCycle] = React.useState<'monthly' | 'annual'>('monthly');

  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto space-y-10 animate-fade-in">
      {/* Title Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black bg-amber-500/10 text-amber-500 border border-amber-500/20">
          <Crown className="w-4 h-4 fill-amber-500" />
          <span>PRO SUBSCRIPTION & PRICING</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
          Affordable, Transparent Pricing
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed">
          Upgrade to Universal Converter Pro developed by Alvin. Convert unlimited files offline with zero file size restrictions.
        </p>

        {/* Monthly vs Annual Toggle */}
        <div className="inline-flex items-center p-1.5 rounded-2xl bg-slate-200/80 dark:bg-slate-800 border border-slate-300/50 dark:border-slate-700">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-5 py-2 rounded-xl text-xs font-extrabold transition-all ${
              billingCycle === 'monthly'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`px-5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
              billingCycle === 'annual'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>Annual Billing</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-amber-400 text-slate-950 uppercase">
              Save 16%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {/* FREE PLAN CARD */}
        <div
          className={`rounded-3xl p-8 border flex flex-col justify-between space-y-8 relative ${
            theme === 'dark'
              ? 'bg-[#1E293B] border-slate-700/80 text-white'
              : 'bg-white border-slate-200 text-slate-900 shadow-lg'
          }`}
        >
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
                STANDARD FREE PLAN
              </span>
              <div className="text-4xl font-black">
                ₱0 <span className="text-xs font-normal text-slate-400">($0 USD / forever)</span>
              </div>
              <p className="text-xs text-slate-400">
                Ideal for occasional basic conversions and lightweight document processing.
              </p>
            </div>

            <div className="space-y-3.5 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>5 free file conversions per day</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Standard PDF & Image tools</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>100% Client-side offline privacy</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-slate-600 shrink-0" />
                <span>Single file conversion mode</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-slate-600 shrink-0" />
                <span>Standard processing priority</span>
              </div>
            </div>
          </div>

          <button
            disabled={!isPro}
            className={`w-full py-3.5 px-6 rounded-2xl font-extrabold text-xs transition-all ${
              !isPro
                ? 'bg-slate-500/10 text-slate-400 cursor-default border border-slate-500/20'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300'
            }`}
          >
            {!isPro ? 'Current Basic Plan' : 'Downgrade to Free'}
          </button>
        </div>

        {/* PRO PLAN CARD (Highlighted) */}
        <div
          className={`rounded-3xl p-8 border-2 flex flex-col justify-between space-y-8 relative overflow-hidden shadow-2xl ${
            theme === 'dark'
              ? 'bg-gradient-to-b from-[#1E293B] via-[#0F172A] to-[#1E293B] border-amber-500/70 text-white'
              : 'bg-gradient-to-b from-amber-500/5 via-white to-orange-500/5 border-amber-500/90 text-slate-900'
          }`}
        >
          {/* Top Badge */}
          <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-orange-500 text-slate-950 font-black text-[10px] uppercase tracking-wider px-4 py-1.5 rounded-bl-2xl shadow-md">
            BEST VALUE • VIP PRO
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-500 fill-amber-500" />
                <span className="text-xs font-black uppercase tracking-widest text-amber-500">
                  PRO UNLIMITED PLAN
                </span>
              </div>

              {/* Price Display */}
              <div className="space-y-1">
                <div className="text-4xl font-black flex items-baseline gap-2">
                  <span>{billingCycle === 'monthly' ? '₱120' : '₱1,200'}</span>
                  <span className="text-xs font-semibold text-slate-400">
                    {billingCycle === 'monthly' ? '/ month' : '/ year'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-amber-500 dark:text-amber-400">
                  <span>
                    Approx. {billingCycle === 'monthly' ? '$2.15 USD / month' : '$21.50 USD / year'}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-500 font-extrabold text-[10px]">
                    PHP / USD
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-400">
                Designed for power users, office work, and high-resolution batch file processing.
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs font-medium">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="font-bold">UNLIMITED Conversions (No daily quota limits)</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                <span>All PDF, Image, Word & Excel tools unlocked</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Image to PDF Studio (Reorder, Rotations & Custom Margins)</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Priority multi-threaded browser GPU engine</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                <span>GCash, PayMaya, Card & PayPal Payment Options</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Direct developer VIP support from Alvin</span>
              </div>
            </div>
          </div>

          <button
            onClick={onOpenPayment}
            className={`w-full py-4 px-6 rounded-2xl font-black text-xs shadow-xl flex items-center justify-center gap-2 transition-transform hover:scale-105 ${
              isPro
                ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30 cursor-default'
                : 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-slate-950 shadow-amber-500/25'
            }`}
          >
            <Crown className="w-4 h-4 fill-current" />
            <span>
              {isPro
                ? 'PRO UNLIMITED ACTIVE'
                : `UPGRADE FOR ${billingCycle === 'monthly' ? '₱120/MO ($2.15 USD)' : '₱1,200/YR ($21.50 USD)'}`}
            </span>
            {!isPro && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Feature Grid Banner */}
      <div className="p-8 rounded-3xl bg-slate-500/5 border border-slate-200 dark:border-slate-800 space-y-6">
        <h3 className="text-center text-lg font-black tracking-tight">
          Why Upgrade to Universal Converter Pro?
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2 text-center">
            <InfinityIcon className="w-6 h-6 text-amber-500 mx-auto" />
            <div className="font-extrabold text-sm">No Daily Quotas</div>
            <p className="text-xs text-slate-400">Convert thousands of images or document files seamlessly.</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2 text-center">
            <ShieldCheck className="w-6 h-6 text-emerald-500 mx-auto" />
            <div className="font-extrabold text-sm">100% Private & Local</div>
            <p className="text-xs text-slate-400">Your sensitive files never touch any external server.</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2 text-center">
            <Zap className="w-6 h-6 text-blue-500 mx-auto" />
            <div className="font-extrabold text-sm">Fast Batch Engine</div>
            <p className="text-xs text-slate-400">Fast multi-file processing optimized for high resolution.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
