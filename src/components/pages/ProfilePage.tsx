import React from 'react';
import { User as UserIcon, Crown, Mail, Calendar, ShieldCheck, LogOut, Star, Clock, FileCheck, ArrowRight, CreditCard } from 'lucide-react';
import { UserProfile, CreditState, HistoryRecord } from '../../types/converter';
import { logoutUser } from '../../utils/storage';

interface ProfilePageProps {
  user: UserProfile | null;
  credits: CreditState;
  history: HistoryRecord[];
  onLogout: () => void;
  onOpenAuth: () => void;
  onOpenPricing: () => void;
  theme: 'dark' | 'light';
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  credits,
  history,
  onLogout,
  onOpenAuth,
  onOpenPricing,
  theme,
}) => {
  if (!user) {
    return (
      <div className="p-12 max-w-lg mx-auto text-center space-y-6 animate-fade-in">
        <div className="w-16 h-16 rounded-3xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
          <UserIcon className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black">Not Logged In</h2>
          <p className="text-xs text-slate-400">
            Sign in or create a free account to manage your profile, view conversion logs, and upgrade to PRO UNLIMITED.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={onOpenAuth}
            className="flex-1 py-3 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-lg shadow-blue-500/25 transition-all"
          >
            Sign In / Register
          </button>
          <button
            onClick={onOpenPricing}
            className="flex-1 py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs shadow-lg flex items-center justify-center gap-1.5 transition-transform hover:scale-105"
          >
            <Crown className="w-4 h-4 fill-slate-950" />
            <span>Explore PRO Plans</span>
          </button>
        </div>
      </div>
    );
  }

  const isPro = user.plan === 'PRO';

  return (
    <div className="p-8 md:p-12 max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* User Header Profile Card */}
      <div
        className={`rounded-3xl p-8 border relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl ${
          theme === 'dark'
            ? 'bg-[#1E293B] border-slate-700/80 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-3xl flex items-center justify-center shadow-xl shadow-blue-500/20 shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-black">{user.name}</h1>
              {isPro ? (
                <span className="px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 flex items-center gap-1 shadow-sm">
                  <Crown className="w-3.5 h-3.5 fill-slate-950" />
                  <span>PRO UNLIMITED</span>
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-500/10 text-slate-400 border border-slate-500/20">
                  FREE USER
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Mail className="w-4 h-4" />
              <span>{user.email}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {!isPro && (
            <button
              onClick={onOpenPricing}
              className="flex-1 md:flex-initial py-3 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-105"
            >
              <Crown className="w-4 h-4 fill-slate-950" />
              <span>Upgrade PRO Free</span>
            </button>
          )}

          <button
            onClick={onLogout}
            className="p-3 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 transition-colors"
            title="Logout Account"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Grid Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Credits Status */}
        <div className="p-6 rounded-3xl bg-slate-500/5 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
            <span>DAILY CREDITS</span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-3xl font-black">
            {isPro ? (
              <span className="text-amber-500">UNLIMITED</span>
            ) : (
              <span>{credits.remaining} / {credits.max}</span>
            )}
          </div>
          <p className="text-[11px] text-slate-400">
            {isPro ? 'No daily quota restrictions' : 'Resets automatically every day'}
          </p>
        </div>

        {/* Subscription Date */}
        <div className="p-6 rounded-3xl bg-slate-500/5 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
            <span>MEMBERSHIP DATE</span>
            <Calendar className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-lg font-extrabold truncate">
            {user.subscriptionDate || 'Active Today'}
          </div>
          <p className="text-[11px] text-slate-400">
            {user.subscriptionExpiry ? `Expires: ${user.subscriptionExpiry}` : 'Lifetime Account'}
          </p>
        </div>

        {/* Conversion Count */}
        <div className="p-6 rounded-3xl bg-slate-500/5 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
            <span>TOTAL CONVERSIONS</span>
            <FileCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-black">
            {history.length} <span className="text-xs text-slate-400 font-normal">files converted</span>
          </div>
          <p className="text-[11px] text-slate-400">100% Client-side conversion log</p>
        </div>
      </div>

      {/* Payment History Table (If available) */}
      {user.paymentHistory && user.paymentHistory.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-black flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-amber-500" />
            <span>Subscription & Billing History</span>
          </h3>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-xs">
            <div className="grid grid-cols-4 p-3 bg-slate-500/5 font-extrabold text-slate-400 uppercase tracking-wider">
              <div>Invoice</div>
              <div>Date</div>
              <div>Method</div>
              <div className="text-right">Amount</div>
            </div>

            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {user.paymentHistory.map((item) => (
                <div key={item.id} className="grid grid-cols-4 p-3.5 items-center font-medium">
                  <div className="font-mono text-blue-500 font-bold">{item.id}</div>
                  <div className="text-slate-400">{item.date}</div>
                  <div>{item.method}</div>
                  <div className="text-right font-extrabold text-emerald-500">{item.amount}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
