import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, LogIn, Sparkles, CheckCircle2, ShieldCheck, Crown } from 'lucide-react';
import { UserProfile } from '../../types/converter';
import { saveStoredUser, getRegisteredUsers, registerUserAccount } from '../../utils/storage';
import { signInWithGoogle, db, auth } from '../../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin: (user: UserProfile) => void;
  theme: 'dark' | 'light';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccessLogin,
  theme,
}) => {
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    try {
      setLoadingGoogle(true);
      setError('');
      const fbUser = await signInWithGoogle();
      const userEmail = fbUser.email || 'user@gmail.com';
      const isOwner = userEmail.toLowerCase().includes('alvindelacruz917@gmail.com');
      const userProfile: UserProfile = {
        id: fbUser.uid,
        name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Google User',
        email: userEmail,
        plan: isOwner ? 'PRO' : 'FREE',
        isAdmin: isOwner,
        subscriptionDate: new Date().toLocaleDateString(),
      };
      saveStoredUser(userProfile);
      onSuccessLogin(userProfile);
      onClose();
    } catch (err: any) {
      console.error('Google Auth Error:', err);
      const isDomainError =
        err?.code === 'auth/unauthorized-domain' ||
        err?.message?.includes('unauthorized domain') ||
        err?.message?.includes('domain-not-allowed') ||
        err?.message?.includes('unauthorized-domain');

      if (isDomainError) {
        setError(
          '⚠️ Ang custom domain na (filesconverter.site) ay kailangan munang idagdag sa "Authorized Domains" sa Firebase Console (Firebase -> Authentication -> Settings -> Authorized Domains). Samantala, gamitin ang 1-Click Quick Access (Free/PRO) o Email/Password login!'
        );
      } else {
        setError(err.message || 'Nabigo ang Google sign-in. Mangyaring subukan muli.');
      }
    } finally {
      setLoadingGoogle(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Mangyaring punan ang lahat ng kinakailangang fields.');
      return;
    }

    const normEmail = email.toLowerCase().trim();
    const normPass = password.trim();

    const isValidEmail = (emailStr: string) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
    };

    // --- SIGN UP LOGIC ---
    if (tab === 'signup') {
      if (!name || name.trim().length < 2) {
        setError('Mangyaring ilagay ang iyong pangalan (at least 2 letters).');
        return;
      }
      if (!isValidEmail(normEmail)) {
        setError('Mangyaring maglagay ng valid at totoong working email address! (Halimbawa: juan@gmail.com)');
        return;
      }
      if (normPass.length < 6) {
        setError('Ang password ay dapat hindi bababa sa 6 characters.');
        return;
      }

      // Check if account already exists
      const existing = getRegisteredUsers().find(u => u.email.toLowerCase() === normEmail);
      if (existing) {
        setError('May naitala nang account gamit ang email na ito! Mangyaring mag-Login na lamang.');
        return;
      }

      // Save user to registered users list
      const registeredAcc = registerUserAccount({
        name: name.trim(),
        email: normEmail,
        passwordHash: normPass,
      });

      // Also attempt to record in Firestore database if signed in via Firebase Auth
      if (auth.currentUser) {
        try {
          await setDoc(doc(db, 'users', auth.currentUser.uid), {
            uid: auth.currentUser.uid,
            name: name.trim(),
            email: normEmail,
            createdAt: new Date().toISOString(),
            plan: 'FREE'
          }, { merge: true });
        } catch (err) {
          console.warn('Firestore user save notice:', err);
        }
      }

      const isOwner = normEmail === 'alvindelacruz917@gmail.com';
      const newUser: UserProfile = {
        id: registeredAcc.id,
        name: name.trim(),
        email: normEmail,
        plan: isOwner ? 'PRO' : 'FREE',
        isAdmin: isOwner,
        subscriptionDate: new Date().toLocaleDateString(),
      };

      saveStoredUser(newUser);
      onSuccessLogin(newUser);
      onClose();
      return;
    }

    // --- LOGIN LOGIC ---
    // 1. Admin Login Verification
    const isAdminUser = normEmail === 'admin123' || normEmail === 'admin123@admin.com' || normEmail === 'admin123@universalconverter.com' || normEmail === 'admin';
    const isValidAdminPass = normPass === 'alvin123' || normPass.toLowerCase() === 'albin123' || normPass === 'admin123';

    if (isAdminUser) {
      if (isValidAdminPass) {
        const adminUser: UserProfile = {
          id: 'usr_admin_001',
          name: 'Alvin (Admin)',
          email: 'admin123@universalconverter.com',
          plan: 'PRO',
          isAdmin: true,
          subscriptionDate: new Date().toLocaleDateString(),
        };
        saveStoredUser(adminUser);
        onSuccessLogin(adminUser);
        onClose();
        return;
      } else {
        setError('Maling password para sa Admin account! (Subukan ang alvin123)');
        return;
      }
    }

    // 2. Regular Registered User Check
    const registeredList = getRegisteredUsers();
    const userAcc = registeredList.find(u => u.email.toLowerCase() === normEmail);

    if (!userAcc) {
      setError('Wala pang naitatalang account sa email na ito! Mangyaring mag-Register muna.');
      return;
    }

    if (userAcc.passwordHash !== normPass) {
      setError('Maling password! Mangyaring subukan muli.');
      return;
    }

    const isOwner = normEmail === 'alvindelacruz917@gmail.com';
    const loggedUser: UserProfile = {
      id: userAcc.id,
      name: userAcc.name,
      email: userAcc.email,
      plan: isOwner ? 'PRO' : 'FREE',
      isAdmin: isOwner,
      subscriptionDate: new Date().toLocaleDateString(),
    };

    saveStoredUser(loggedUser);
    onSuccessLogin(loggedUser);
    onClose();
  };

  const handleDemoLogin = (plan: 'FREE' | 'PRO') => {
    const demoUser: UserProfile = {
      id: `usr_demo_${plan.toLowerCase()}`,
      name: plan === 'PRO' ? 'Alvin (Pro VIP)' : 'Demo User',
      email: plan === 'PRO' ? 'alvindelacruz917@gmail.com' : 'user@example.com',
      plan: plan,
      subscriptionDate: plan === 'PRO' ? new Date().toLocaleDateString() : undefined,
      subscriptionExpiry: plan === 'PRO' ? new Date(Date.now() + 365*86400000).toLocaleDateString() : undefined,
      paymentMethod: plan === 'PRO' ? 'Credit Card' : undefined,
    };

    saveStoredUser(demoUser);
    onSuccessLogin(demoUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div
        className={`w-full max-w-md rounded-3xl p-5 sm:p-7 border shadow-2xl relative overflow-y-auto max-h-[92vh] ${
          theme === 'dark'
            ? 'bg-[#1E293B] border-slate-700 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-500/10 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-1.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black tracking-tight">
              {tab === 'login' ? 'Welcome Back' : 'Create Your Account'}
            </h2>
            <p className="text-xs text-slate-400">
              Universal Converter Pro Account System
            </p>
          </div>

          {/* Firebase Google Sign-In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loadingGoogle}
            className="w-full py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-100 font-extrabold text-xs shadow-sm flex items-center justify-center gap-3 transition-all hover:scale-[1.01]"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3h3.88c2.27-2.09 3.665-5.17 3.665-9.12z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.09z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.09c.95-2.85 3.6-4.96 6.72-4.96z"
              />
            </svg>
            <span>{loadingGoogle ? 'Connecting Google...' : 'Continue with Google'}</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 dark:border-slate-800 w-full"></div>
            <span className="bg-white dark:bg-[#1E293B] px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 absolute">
              or quick demo login
            </span>
          </div>

          {/* Quick Demo Login Triggers */}
          <div className="p-3 rounded-2xl bg-slate-500/5 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 text-center">
              Quick 1-Click Access
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('FREE')}
                className="py-2.5 px-3 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 font-bold text-xs text-slate-700 dark:text-slate-200 transition-colors"
              >
                Free User
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('PRO')}
                className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-extrabold text-xs shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5 transition-transform hover:scale-105"
              >
                <Crown className="w-3.5 h-3.5 fill-slate-950" />
                <span>PRO VIP</span>
              </button>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex rounded-xl bg-slate-500/10 p-1 border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => {
                setTab('login');
                setError('');
              }}
              className={`flex-1 py-2 text-xs font-extrabold rounded-lg transition-all ${
                tab === 'login'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setTab('signup');
                setError('');
              }}
              className={`flex-1 py-2 text-xs font-extrabold rounded-lg transition-all ${
                tab === 'signup'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Register
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold">
                {error}
              </div>
            )}

            {tab === 'signup' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alvin Dela Cruz"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-medium outline-none border ${
                      theme === 'dark'
                        ? 'bg-[#0F172A] border-slate-700 text-white focus:border-blue-500'
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-600'
                    }`}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400">Email or Username</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin123 or user@example.com"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-medium outline-none border ${
                    theme === 'dark'
                      ? 'bg-[#0F172A] border-slate-700 text-white focus:border-blue-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-600'
                  }`}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-medium outline-none border ${
                    theme === 'dark'
                      ? 'bg-[#0F172A] border-slate-700 text-white focus:border-blue-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-600'
                  }`}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all mt-2"
            >
              <LogIn className="w-4 h-4" />
              <span>{tab === 'login' ? 'Sign In to Account' : 'Create Free Account'}</span>
            </button>
          </form>

          {/* Guarantee */}
          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Secure local authentication • Developed by Alvin</span>
          </div>
        </div>
      </div>
    </div>
  );
};
