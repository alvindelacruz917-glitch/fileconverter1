import React from 'react';
import { X, AlertTriangle, Crown, LogIn, ArrowRight, Star } from 'lucide-react';

interface NoCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth: () => void;
  onOpenPricing: () => void;
  theme: 'dark' | 'light';
}

export const NoCreditsModal: React.FC<NoCreditsModalProps> = ({
  isOpen,
  onClose,
  onOpenAuth,
  onOpenPricing,
  theme,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in">
      <div
        className={`w-full max-w-md rounded-3xl p-7 border shadow-2xl relative overflow-hidden text-center space-y-6 ${
          theme === 'dark'
            ? 'bg-[#1E293B] border-slate-700 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-500/10 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning Icon */}
        <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-500 border border-amber-500/30">
            <Star className="w-3.5 h-3.5 fill-amber-500" />
            <span>DAILY FREE CREDITS EXHAUSTED</span>
          </div>
          <h2 className="text-2xl font-black">Daily Limit Reached</h2>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
            You have used all free credits for today (5/5). Daily credits reset at midnight. Upgrade to PRO UNLIMITED for only ₱120/mo ($2.15 USD) for continuous batch processing without daily limits.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <button
            onClick={() => {
              onClose();
              onOpenPricing();
            }}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs shadow-xl flex items-center justify-center gap-2 transition-transform hover:scale-105"
          >
            <Crown className="w-4 h-4 fill-slate-950" />
            <span>Upgrade PRO Unlimited Free</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenAuth();
            }}
            className="w-full py-3 px-6 rounded-2xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 font-extrabold text-xs text-slate-800 dark:text-slate-200 flex items-center justify-center gap-2 transition-colors"
          >
            <LogIn className="w-4 h-4" />
            <span>Login to Existing PRO Account</span>
          </button>
        </div>
      </div>
    </div>
  );
};
